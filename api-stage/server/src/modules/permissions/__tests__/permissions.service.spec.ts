import { PermissionsService } from '../permissions.service';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let mockPrisma: any;
  let mockRedis: any;
  let mockTenantResolver: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    };

    mockRedis = {
      getForTenant: jest.fn(),
      setForTenant: jest.fn().mockResolvedValue(true),
      delForTenant: jest.fn().mockResolvedValue(true),
    };

    mockTenantResolver = {};

    service = new PermissionsService(
      mockPrisma as any,
      mockRedis as any,
      mockTenantResolver as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('accepts legacy check permission keys from cache for standardized check-bill requests', async () => {
    mockRedis.getForTenant.mockResolvedValue(JSON.stringify(['check.create']));

    await expect(
      service.hasPermission('user-1', 'check-bill', 'create'),
    ).resolves.toBe(true);

    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('accepts standardized check-bill permission keys for legacy check requests', async () => {
    mockRedis.getForTenant.mockResolvedValue(
      JSON.stringify(['check-bill.delete']),
    );

    await expect(
      service.hasPermission('user-1', 'check', 'delete'),
    ).resolves.toBe(true);
  });

  it('accepts unitSet and unit-set aliases after DB permission lookup', async () => {
    mockRedis.getForTenant.mockResolvedValue(null);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      role: 'USER',
      roleRelation: {
        isSystemRole: false,
        name: 'Depo Kullanıcısı',
        permissions: [
          {
            permission: {
              module: 'unit-set',
              action: 'update',
            },
          },
        ],
      },
    });

    await expect(
      service.hasPermission('user-1', 'unitSet', 'update'),
    ).resolves.toBe(true);

    expect(mockRedis.setForTenant).toHaveBeenCalledWith(
      'user_perms',
      JSON.stringify(['unit-set.update']),
      900,
      'user-1',
    );
  });

  it('denies unrelated permissions', async () => {
    mockRedis.getForTenant.mockResolvedValue(JSON.stringify(['bank.view']));

    await expect(
      service.hasPermission('user-1', 'warehouse', 'delete'),
    ).resolves.toBe(false);
  });
});
