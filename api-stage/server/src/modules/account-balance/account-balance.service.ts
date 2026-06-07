import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { buildTenantWhereClause } from '../../common/utils/staging.util';
import { Prisma } from '@prisma/client';

/**
 * Cari hesap yürüyen bakiye hesaplama servisi
 * Bu servis cari hareketlerini (AccountMovement) baz alarak bakiyeleri hesaplar
 */
@Injectable()
export class AccountBalanceService {
  constructor(
    private prisma: PrismaService,
    private readonly tenantResolver: TenantResolverService,
  ) {}

  /**
   * Belirli bir cari hesabının yürüyen bakiyesini hesaplar
   * @param accountId - Cari hesap ID'si
   * @param prisma - Transaction client (opsiyonel, transaction içinde kullanılıyorsa)
   * @returns Güncellenen bakiye ve hareket sayısı
   */
  async recalculateAccountBalance(accountId: string, prisma?: any) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const tx = prisma || this.prisma;

    // Hareketleri tarih ve oluşturulma zamanına göre sırala
    const movements = await tx.accountMovement.findMany({
      where: {
        accountId,
        deletedAt: null,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
      orderBy: [
        { date: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    if (movements.length === 0) {
      // Hareket yoksa bakiyeyi sıfırla
      await tx.account.updateMany({
        where: {
          id: accountId,
          ...buildTenantWhereClause(tenantId ?? undefined),
        },
        data: { balance: 0 },
      });
      return { balance: 0, movementsCount: 0 };
    }

    // Yürüyen bakiye hesapla
    let runningBalance = 0;
    const movementUpdates = movements.map((movement) => {
      const amount = Number(movement.amount);
      
      if (movement.type === 'DEBIT') {
        runningBalance += amount; // Borç (alacağımız var)
      } else {
        runningBalance -= amount; // Alacak (borçumuz var)
      }

      return {
        where: { id: movement.id },
        data: { balance: runningBalance },
      };
    });

    // Tüm hareketlerin balance alanını güncelle
    for (const update of movementUpdates) {
      await tx.accountMovement.update(update);
    }

    // Cari kartının ana bakiye alanını güncelle
    await tx.account.updateMany({
      where: {
        id: accountId,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
      data: { balance: runningBalance },
    });

    return { balance: runningBalance, movementsCount: movements.length };
  }

  /**
   * Tüm cari hesaplarının yürüyen bakiyesini hesaplar
   * @param prisma - Transaction client (opsiyonel)
   * @returns Hesaplanan cari sayısı
   */
  async recalculateAllBalances(prisma?: any) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const tx = prisma || this.prisma;

    const accounts = await tx.account.findMany({
      where: {
        deletedAt: null,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
      select: { id: true },
    });

    let processedCount = 0;
    for (const account of accounts) {
      await this.recalculateAccountBalance(account.id, tx);
      processedCount++;
    }

    return { processedCount, totalAccounts: accounts.length };
  }

  /**
   * Birden fazla cari hesabının yürüyen bakiyesini hesaplar
   * @param accountIds - Cari hesap ID'leri
   * @param prisma - Transaction client (opsiyonel)
   * @returns Hesaplanan cari sayısı
   */
  async recalculateMultipleBalances(accountIds: string[], prisma?: any) {
    const tx = prisma || this.prisma;

    let processedCount = 0;
    for (const accountId of accountIds) {
      await this.recalculateAccountBalance(accountId, tx);
      processedCount++;
    }

    return { processedCount, totalAccounts: accountIds.length };
  }
}