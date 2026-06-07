import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { buildTenantWhereClause } from '../../common/utils/staging.util';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private readonly tenantResolver: TenantResolverService) { }

  async findAll(search?: string, limit: number = 100, page: number = 1, role?: string) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const skip = (page - 1) * limit;

    const where: any = {
      ...buildTenantWhereClause(tenantId ?? undefined),
    };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          username: true,
          fullName: true,
          role: true,
          isActive: true,
          createdAt: true,
          tenant: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const user = await this.prisma.user.findFirst({
      where: { id, ...buildTenantWhereClause(tenantId ?? undefined) },
      include: {
        tenant: {
          include: {
            subscription: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async remove(id: string) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const user = await this.prisma.user.findFirst({
      where: { id, ...buildTenantWhereClause(tenantId ?? undefined) },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Kullanıcıyı sil
    // Not: Prisma cascade ayarlarına göre ilgili kayıtlar otomatik silinir
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async suspend(id: string) {
    // Kullanıcıyı kontrol et
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Kullanıcının aktif statusunu tersine çevir
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        isActive: !user.isActive,
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    return updatedUser;
  }

  async updateRole(userId: string, newRole: string) {
    // Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Update role
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        role: newRole as any,
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    return updatedUser;
  }

  async getStats() {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const whereClause = { ...buildTenantWhereClause(tenantId ?? undefined) };

    // Get total counts
    const [totalUsers, activeUsers, inactiveUsers] = await Promise.all([
      this.prisma.user.count({ where: whereClause }),
      this.prisma.user.count({ where: { ...whereClause, isActive: true } }),
      this.prisma.user.count({ where: { ...whereClause, isActive: false } }),
    ]);

    // Get counts by role
    const roleStats = await this.prisma.user.groupBy({
      by: ['role'],
      where: whereClause,
      _count: {
        id: true,
      },
    });

    const byRole = roleStats.reduce((acc, stat) => {
      acc[stat.role] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      byRole,
    };
  }
}

