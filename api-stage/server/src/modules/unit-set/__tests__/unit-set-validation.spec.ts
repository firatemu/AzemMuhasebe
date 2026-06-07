import { UnitSetService } from '../unit-set.service';
import { BadRequestException } from '@nestjs/common';

describe('UnitSetService', () => {
  let service: UnitSetService;
  let mockPrisma: any;
  let mockTenantResolver: any;

  beforeEach(() => {
    mockPrisma = {
      unitSet: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      unit: { deleteMany: jest.fn() },
      $transaction: jest.fn().mockImplementation((cb) => cb(mockPrisma)),
    };

    mockTenantResolver = {
      resolveForQuery: jest.fn().mockResolvedValue('tenant-1'),
      resolveForCreate: jest.fn().mockResolvedValue('tenant-1'),
    };

    service = new UnitSetService(
      mockPrisma as any,
      mockTenantResolver as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should reject when more than one base unit is defined', async () => {
      const multipleBaseUnitsDto = {
        name: 'Test Set',
        units: [
          { name: 'Adet', code: 'ADET', isBaseUnit: true },
          { name: 'Paket', code: 'PKT', isBaseUnit: true },
        ],
      };

      mockPrisma.$transaction.mockImplementation(async (cb) => cb(mockPrisma));

      await expect(service.create(multipleBaseUnitsDto as any)).rejects.toThrow(BadRequestException);
    });

    it('should reject when zero base units are defined (with multiple units provided)', async () => {
      const noBaseUnitDto = {
        name: 'Test Set',
        units: [
          { name: 'Adet', code: 'ADET', isBaseUnit: false },
          { name: 'Paket', code: 'PKT', isBaseUnit: false },
        ],
      };

      mockPrisma.$transaction.mockImplementation(async (cb) => cb(mockPrisma));

      await expect(service.create(noBaseUnitDto as any)).rejects.toThrow(BadRequestException);
    });

    it('should accept valid GIB code on single base unit', async () => {
      const validDto = {
        name: 'Weight Set',
        units: [
          { name: 'Kilogram', code: 'KG', isBaseUnit: true },
          { name: 'Gram', code: 'GR', conversionRate: 0.001, isBaseUnit: false },
        ],
      };

      mockPrisma.$transaction.mockImplementation(async (cb) => cb(mockPrisma));
      mockPrisma.unitSet.create.mockResolvedValue({
        id: 'set-1',
        name: 'Weight Set',
        isSystem: false,
        tenantId: 'tenant-1',
        units: [
          { id: 'unit-1', name: 'Kilogram', code: 'KG', isBaseUnit: true, conversionRate: 1 },
          { id: 'unit-2', name: 'Gram', code: 'GR', isBaseUnit: false, conversionRate: 0.001 },
        ],
      });

      const result = await service.create(validDto as any);

      expect(result).toBeDefined();
      expect(result.name).toBe('Weight Set');
      expect(mockPrisma.unitSet.create).toHaveBeenCalled();
    });

    it('should accept a single base unit (only one unit defined)', async () => {
      const singleUnitDto = {
        name: 'Single Unit Set',
        units: [{ name: 'Adet', code: 'ADET', isBaseUnit: true }],
      };

      mockPrisma.$transaction.mockImplementation(async (cb) => cb(mockPrisma));
      mockPrisma.unitSet.create.mockResolvedValue({
        id: 'set-1',
        name: 'Single Unit Set',
        isSystem: false,
        tenantId: 'tenant-1',
        units: [{ id: 'unit-1', name: 'Adet', code: 'ADET', isBaseUnit: true }],
      });

      const result = await service.create(singleUnitDto as any);

      expect(result).toBeDefined();
      expect(mockPrisma.unitSet.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should reject multiple base units on update', async () => {
      const mockUnitSet = {
        id: 'set-1',
        tenantId: 'tenant-1',
        isSystem: false,
        units: [{ id: 'unit-1', name: 'Adet', isBaseUnit: true, products: [] }],
      };

      mockPrisma.unitSet.findUnique.mockResolvedValue(mockUnitSet);
      mockPrisma.$transaction.mockImplementation(async (cb) => cb(mockPrisma));

      await expect(
        service.update('set-1', {
          units: [
            { name: 'Adet', code: 'ADET', isBaseUnit: true },
            { name: 'Paket', code: 'PKT', isBaseUnit: true },
          ],
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject zero base units on update when units are provided', async () => {
      const mockUnitSet = {
        id: 'set-1',
        tenantId: 'tenant-1',
        isSystem: false,
        units: [{ id: 'unit-1', name: 'Adet', isBaseUnit: true, products: [] }],
      };

      mockPrisma.unitSet.findUnique.mockResolvedValue(mockUnitSet);
      mockPrisma.$transaction.mockImplementation(async (cb) => cb(mockPrisma));

      await expect(
        service.update('set-1', {
          units: [
            { name: 'Adet', code: 'ADET', isBaseUnit: false },
            { name: 'Paket', code: 'PKT', isBaseUnit: false },
          ],
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});