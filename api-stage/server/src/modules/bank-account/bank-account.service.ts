import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { TenantContextService } from '../../common/services/tenant-context.service';
import { BankAccountType } from '@prisma/client';

@Injectable()
export class BankAccountService {
  constructor(private prisma: PrismaService,
    private tenantContext: TenantContextService, private readonly tenantResolver: TenantResolverService) { }

  async create(createDto: CreateBankAccountDto) {
    return this.prisma.bankAccount.create({
      data: {
        bankId: createDto.bankId,
        code: createDto.code || `ACC-${Date.now()}`,
        name: createDto.name,
        accountNo: createDto.accountNo,
        iban: createDto.iban,
        type: createDto.type,
        isActive: createDto.isActive ?? true,
      },
    });
  }

  async findAll(bankId?: string, type?: string) {
    const tenantId = this.tenantContext.getTenantId();

    const hesaplar = await this.prisma.bankAccount.findMany({
      where: {
        bank: {
          tenantId: tenantId,
        },
        bankId: bankId,
        type: type as BankAccountType,
        isActive: true,
      },
      include: {
        bank: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map to include bankName and a displayName that falls back to accountNo if name is empty
    return hesaplar.map((hesap) => ({
      ...hesap,
      bankName: hesap.bank?.name || '',
      // Use name or accountNo as displayName, prefer name if available
      displayName: hesap.name || hesap.accountNo || `Hesap ${hesap.code}`,
    }));
  }

  async findOne(id: string) {
    const tenantId = this.tenantContext.getTenantId();
    const hesap = await this.prisma.bankAccount.findFirst({
      where: {
        id,
        bank: {
          tenantId: tenantId,
        },
      },
      include: {
        bank: true,
      },
    });

    if (!hesap) {
      throw new NotFoundException('Bank account not found');
    }

    return hesap;
  }

  async update(id: string, updateDto: UpdateBankAccountDto) {
    await this.findOne(id);

    return this.prisma.bankAccount.update({
      where: { id },
      data: {
        name: updateDto.name,
        accountNo: updateDto.accountNo,
        iban: updateDto.iban,
        isActive: updateDto.isActive,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.bankAccount.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
