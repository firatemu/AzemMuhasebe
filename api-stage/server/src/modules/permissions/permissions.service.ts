import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/services/redis.service';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);
  private readonly CACHE_TTL_SECONDS = 900; // 15 minutes
  private readonly MODULE_ALIASES: Record<string, string[]> = {
    'check-bill': ['check-bill', 'checkBill', 'check'],
    checkBill: ['checkBill', 'check-bill', 'check'],
    check: ['check', 'check-bill', 'checkBill'],
    'unit-set': ['unit-set', 'unitSet'],
    unitSet: ['unitSet', 'unit-set'],
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly tenantResolver: TenantResolverService,
  ) {}

  /**
   * Checks if a user has a specific permission.
   * Caches the result in Redis.
   */
  async hasPermission(
    userId: string,
    permissionModule: string,
    permissionAction: string,
  ): Promise<boolean> {
    const permissionKeys = this.getPermissionKeys(
      permissionModule,
      permissionAction,
    );

    // 1. Check Cache
    const cachedPermsStr = await this.redis.getForTenant('user_perms', userId);
    if (cachedPermsStr) {
      const cachedPerms = JSON.parse(cachedPermsStr) as string[];
      if (cachedPerms.includes('ALL')) return true; // SuperAdmin bypass
      return permissionKeys.some((key) => cachedPerms.includes(key));
    }

    // 2. Fetch from DB if not in cache
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roleRelation: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user) return false;

    // 3. Process Permissions
    let permissions: string[] = [];

    // SuperAdmin / legacy ADMIN bypass + system manager role
    // TENANT_ADMIN also has full access within their tenant
    if (
      user.role === 'SUPER_ADMIN' ||
      user.role === 'ADMIN' ||
      user.role === 'TENANT_ADMIN' ||
      (user.roleRelation?.isSystemRole &&
        user.roleRelation?.name === 'Yönetici')
    ) {
      permissions = ['ALL'];
    } else if (user.roleRelation) {
      permissions = user.roleRelation.permissions.map(
        (rp) => `${rp.permission.module}.${rp.permission.action}`,
      );
    }

    // 4. Cache Results
    await this.redis.setForTenant(
      'user_perms',
      JSON.stringify(permissions),
      this.CACHE_TTL_SECONDS,
      userId,
    );

    // 5. Return Check Result
    if (permissions.includes('ALL')) return true;
    return permissionKeys.some((key) => permissions.includes(key));
  }

  private getPermissionKeys(
    permissionModule: string,
    permissionAction: string,
  ): string[] {
    const modules = this.MODULE_ALIASES[permissionModule] ?? [permissionModule];
    return modules.map((module) => `${module}.${permissionAction}`);
  }

  /**
   * Invalidates the permission cache for a specific user.
   */
  async invalidateUserCache(userId: string): Promise<void> {
    await this.redis.delForTenant('user_perms', userId);
    this.logger.log(`Permission cache invalidated for user ${userId}`);
  }

  /**
   * Invalidates cache for all users with a specific role.
   * Use this when updating a role's permissions.
   */
  async invalidateRoleCache(roleId: string): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: { roleId },
      select: { id: true },
    });

    for (const user of users) {
      await this.invalidateUserCache(user.id);
    }
    this.logger.log(
      `Permission cache invalidated for role ${roleId} (${users.length} users)`,
    );
  }
}
