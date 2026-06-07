import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { BankAccountType, BankMovementType, BankMovementSubType, LoanType, LoanStatus, CreditPlanStatus } from '@prisma/client';
import { CreateBankDto, UpdateBankDto } from './dto/create-bank.dto';
import { BankAccountCreateDto, BankAccountUpdateDto } from './dto/create-account.dto';
import { CreateBankMovementDto, CreatePosMovementDto } from './dto/create-movement.dto';
import { CreateLoanUsageDto } from './dto/create-loan.dto';
import { PayCreditInstallmentDto, PaymentType } from './dto/pay-credit-installment.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { buildTenantWhereClause } from '../../common/utils/staging.util';

@Injectable()
export class BankService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tenantResolver: TenantResolverService
    ) { }

    // ============ BANK CRUD ============

    async create(createBankDto: CreateBankDto) {
        const tenantId = await this.tenantResolver.resolveForCreate();
        return this.prisma.bank.create({
            data: {
                ...createBankDto,
                tenantId,
            },
            include: {
                accounts: true,
            },
        });
    }

    async findAll() {
        const tenantId = await this.tenantResolver.resolveForQuery();
        return this.prisma.bank.findMany({
            where: { tenantId },
            include: {
                accounts: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        balance: true,
                        accountNo: true,
                        iban: true,
                    }
                },
                _count: {
                    select: { accounts: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const bank = await this.prisma.bank.findFirst({
            where: { id, tenantId },
            include: {
                accounts: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        loans: {
                            include: {
                                plans: true
                            }
                        }
                    }
                },
            },
        });

        if (!bank) {
            throw new NotFoundException(`Bank with ID ${id} not found`);
        }

        return bank;
    }

    async update(id: string, updateBankDto: UpdateBankDto) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        await this.findOne(id);
        return this.prisma.bank.update({
            where: { id, tenantId },
            data: updateBankDto,
        });
    }

    async remove(id: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const bank = await this.findOne(id);
        const accountIds = bank.accounts.map(h => h.id);

        if (accountIds.length > 0) {
            const [hareketCount, havaleCount, tahsilatCount, salaryCount, loanCount] = await Promise.all([
                this.prisma.bankAccountMovement.count({ where: { bankAccountId: { in: accountIds }, tenantId: tenantId ?? undefined } }),
                this.prisma.bankTransfer.count({ where: { bankAccountId: { in: accountIds }, tenantId: tenantId ?? undefined } }),
                this.prisma.collection.count({ where: { bankAccountId: { in: accountIds }, tenantId: tenantId ?? undefined } }),
                this.prisma.salaryPaymentDetail.count({ where: { bankAccountId: { in: accountIds }, tenantId: tenantId ?? undefined } }),
                this.prisma.bankLoan.count({ where: { bankAccountId: { in: accountIds }, tenantId: tenantId ?? undefined } }),
            ]);

            if (hareketCount > 0 || havaleCount > 0 || tahsilatCount > 0 || salaryCount > 0 || loanCount > 0) {
                throw new BadRequestException('Bank üzerinde işlem görmüş hesaplar bulunduğu için silinemez. Pasife alabilirsiniz.');
            }
        }

        return this.prisma.bank.delete({ where: { id, tenantId } });
    }

    // ============ HESAP İŞLEMLERİ ============

    async createAccount(bankId: string, createHesapDto: BankAccountCreateDto) {
        await this.findOne(bankId);

        return this.prisma.bankAccount.create({
            data: {
                bankId,
                code: createHesapDto.code || `ACC-${Date.now()}`,
                name: createHesapDto.name,
                accountNo: createHesapDto.accountNo,
                iban: createHesapDto.iban,
                type: createHesapDto.type,
                commissionRate: createHesapDto.commissionRate,
                creditLimit: createHesapDto.creditLimit,
                cardLimit: createHesapDto.cardLimit,
                statementDay: createHesapDto.statementDay,
                paymentDueDay: createHesapDto.paymentDueDay,
                terminalNo: createHesapDto.terminalNo,
                isActive: createHesapDto.isActive ?? true,
            },
        });
    }

    async findAccount(accountId: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const hesap = await this.prisma.bankAccount.findUnique({
            where: { id: accountId },
            include: {
                bank: true,
            },
        });

        if (!hesap || hesap.bank.tenantId !== tenantId) {
            throw new NotFoundException('Bank account not found');
        }

        return hesap;
    }

    async updateAccount(accountId: string, updateHesapDto: BankAccountUpdateDto) {
        await this.findAccount(accountId);

        return this.prisma.bankAccount.update({
            where: { id: accountId },
            data: {
                name: updateHesapDto.name,
                accountNo: updateHesapDto.accountNo,
                iban: updateHesapDto.iban,
                isActive: updateHesapDto.isActive,
                commissionRate: updateHesapDto.commissionRate,
                creditLimit: updateHesapDto.creditLimit,
                cardLimit: updateHesapDto.cardLimit,
                statementDay: updateHesapDto.statementDay,
                paymentDueDay: updateHesapDto.paymentDueDay,
                terminalNo: updateHesapDto.terminalNo,
            },
        });
    }

    async removeAccount(accountId: string) {
        const hesap = await this.findAccount(accountId);

        const [hareketCount, havaleCount, tahsilatCount, salaryCount, loanCount] = await Promise.all([
            this.prisma.bankAccountMovement.count({ where: { bankAccountId: accountId, ...buildTenantWhereClause(hesap.bank.tenantId || undefined) } }),
            this.prisma.bankTransfer.count({ where: { bankAccountId: accountId, ...buildTenantWhereClause(hesap.bank.tenantId || undefined) } }),
            this.prisma.collection.count({ where: { bankAccountId: accountId, ...buildTenantWhereClause(hesap.bank.tenantId || undefined) } }),
            this.prisma.salaryPaymentDetail.count({ where: { bankAccountId: accountId, ...buildTenantWhereClause(hesap.bank.tenantId || undefined) } }),
            this.prisma.bankLoan.count({ where: { bankAccountId: accountId, ...buildTenantWhereClause(hesap.bank.tenantId || undefined) } }),
        ]);

        if (hareketCount > 0 || havaleCount > 0 || tahsilatCount > 0 || salaryCount > 0 || loanCount > 0) {
            return this.prisma.bankAccount.update({
                where: { id: accountId },
                data: { isActive: false },
            });
        }

        return this.prisma.bankAccount.delete({ where: { id: accountId } });
    }

    // ============ MOVEMENT OPERATIONS ============

    async createMovement(accountId: string, dto: CreateBankMovementDto) {
        const hesap = await this.findAccount(accountId);

        const currentBalance = new Decimal(hesap.balance.toString());
        const amount = new Decimal(dto.amount);
        const yeniBakiye = dto.movementType === BankMovementType.INCOMING
            ? currentBalance.add(amount)
            : currentBalance.sub(amount);

        return this.prisma.$transaction(async (tx) => {
            const hareket = await tx.bankAccountMovement.create({
                data: {
                    bankAccountId: accountId,
                    movementType: dto.movementType,
                    movementSubType: dto.movementSubType,
                    amount: amount,
                    balance: yeniBakiye,
                    notes: dto.notes,
                    referenceNo: dto.referenceNo,
                    date: dto.date ? new Date(dto.date) : new Date(),
                },
            });

            await tx.bankAccount.update({
                where: { id: accountId },
                data: { balance: yeniBakiye },
            });

            return hareket;
        });
    }

    async createPosMovement(accountId: string, dto: CreatePosMovementDto) {
        const hesap = await this.findAccount(accountId);

        if (hesap.type !== BankAccountType.POS) {
            throw new BadRequestException('Sadece POS hesapları için POS hareketi oluşturulabilir');
        }

        const currentBalance = new Decimal(hesap.balance.toString());
        const amount = new Decimal(dto.amount);
        const komisyonOrani = new Decimal(hesap.commissionRate?.toString() || '0');
        const komisyonTutar = amount.mul(komisyonOrani).div(100);
        const netTutar = amount.sub(komisyonTutar);
        const yeniBakiye = currentBalance.add(netTutar);

        return this.prisma.$transaction(async (tx) => {
            const hareket = await tx.bankAccountMovement.create({
                data: {
                    bankAccountId: accountId,
                    movementType: BankMovementType.INCOMING,
                    movementSubType: BankMovementSubType.POS_COLLECTION,
                    amount: amount,
                    commissionRate: komisyonOrani,
                    commissionAmount: komisyonTutar,
                    netAmount: netTutar,
                    balance: yeniBakiye,
                    notes: dto.notes || `POS Collection - Komisyon: %${komisyonOrani}`,
                    referenceNo: dto.referenceNo,
                    date: dto.date ? new Date(dto.date) : new Date(),
                },
            });

            await tx.bankAccount.update({
                where: { id: accountId },
                data: { balance: yeniBakiye },
            });

            return hareket;
        });
    }

    async getMovements(accountId: string, options?: { startDate?: Date; endDate?: Date; limit?: number }) {
        await this.findAccount(accountId);

        const where: any = { bankAccountId: accountId };
        if (options?.startDate || options?.endDate) {
            where.date = {};
            if (options.startDate) where.date.gte = options.startDate;
            if (options.endDate) where.date.lte = options.endDate;
        }

        return this.prisma.bankAccountMovement.findMany({
            where,
            orderBy: { date: 'desc' },
            take: options?.limit || 50,
        });
    }

    // ============ LOAN OPERATIONS ============

    async useLoan(accountId: string, dto: CreateLoanUsageDto) {
        const hesap = await this.findAccount(accountId);

        if (hesap.type !== BankAccountType.LOAN) {
            throw new BadRequestException('Sadece KREDİ hesapları için loan kullanımı oluşturulabilir');
        }

        const amount = new Decimal(dto.amount);
        const installmentCount = dto.installmentCount;
        const startDate = new Date(dto.startDate);
        const firstInstallmentDate = new Date(dto.firstInstallmentDate);

        const installmentAmount = new Decimal(dto.installmentAmount);
        const totalRepayment = installmentAmount.mul(installmentCount);
        const totalInterest = totalRepayment.sub(amount);

        const frequency = dto.paymentFrequency || 1;
        const plans: any[] = [];
        for (let i = 0; i < installmentCount; i++) {
            const dueDate = new Date(firstInstallmentDate);
            dueDate.setMonth(dueDate.getMonth() + (i * frequency));

            plans.push({
                installmentNo: i + 1,
                dueDate: dueDate,
                amount: installmentAmount,
                status: CreditPlanStatus.PENDING
            });
        }

        return this.prisma.$transaction(async (tx) => {
            const tenantId = hesap.bank.tenantId;

            const loan = await tx.bankLoan.create({
                data: {
                    bankAccountId: accountId,
                    amount: amount,
                    totalRepayment: totalRepayment,
                    totalInterest: totalInterest,
                    installmentCount: installmentCount,
                    startDate: startDate,
                    notes: dto.notes,
                    loanType: dto.loanType,
                    annualInterestRate: new Decimal(dto.annualInterestRate),
                    paymentFrequency: dto.paymentFrequency || 1,
                    status: LoanStatus.ACTIVE,
                    tenantId: tenantId,
                    plans: {
                        create: plans.map(plan => ({
                            ...plan,
                            tenantId: tenantId
                        }))
                    }
                }
            });

            const yeniBakiye = new Decimal(hesap.balance.toString()).add(amount);
            await tx.bankAccountMovement.create({
                data: {
                    bankAccountId: accountId,
                    movementType: BankMovementType.INCOMING,
                    movementSubType: BankMovementSubType.LOAN_USAGE,
                    amount: amount,
                    balance: yeniBakiye,
                    notes: `Loan Kullanımı - ${dto.loanType} - %${dto.annualInterestRate} Faiz`,
                    date: startDate,
                }
            });

            await tx.bankAccount.update({
                where: { id: accountId },
                data: { balance: yeniBakiye }
            });

            return loan;
        });
    }

    async payInstallment(planId: string, dto: PayCreditInstallmentDto) {
        return this.prisma.$transaction(async (tx) => {
            const plan = await tx.bankLoanPlan.findUnique({
                where: { id: planId },
                include: { loan: { include: { bankAccount: true } } }
            });

            if (!plan) throw new NotFoundException('Installment plan not found');

            const paymentDate = dto.paymentDate ? new Date(dto.paymentDate) : new Date();
            const amount = new Decimal(dto.amount);
            const newPaidAmount = new Decimal(plan.paidAmount.toString()).add(amount);
            const isFullyPaid = newPaidAmount.gte(plan.amount);

            await tx.bankLoanPlan.update({
                where: { id: planId },
                data: {
                    paidAmount: newPaidAmount,
                    status: isFullyPaid ? CreditPlanStatus.PAID : CreditPlanStatus.PARTIALLY_PAID
                }
            });

            const currentBalance = new Decimal(plan.loan.bankAccount.balance.toString());
            const yeniBakiye = currentBalance.sub(amount);

            await tx.bankAccountMovement.create({
                data: {
                    bankAccountId: plan.loan.bankAccountId,
                    movementType: BankMovementType.OUTGOING,
                    movementSubType: BankMovementSubType.LOAN_INSTALLMENT_PAYMENT,
                    amount: amount,
                    balance: yeniBakiye,
                    notes: dto.notes || `Loan Installment Ödemesi - Installment #${plan.installmentNo}`,
                    date: paymentDate,
                }
            });

            await tx.bankAccount.update({
                where: { id: plan.loan.bankAccountId },
                data: { balance: yeniBakiye }
            });

            return { success: true };
        });
    }

    async getBanksSummary() {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const banks = await this.prisma.bank.findMany({
            where: { tenantId, isActive: true },
            include: {
                accounts: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        name: true,
                        accountNo: true,
                        iban: true,
                        type: true,
                        balance: true,
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        return {
            bankalar: banks.map(bank => ({
                id: bank.id,
                ad: bank.name,
                hesaplar: bank.accounts.map(acc => ({
                    id: acc.id,
                    hesapAdi: acc.name,
                    hesapNo: acc.accountNo,
                    iban: acc.iban,
                    hesapTipi: acc.type,
                    balance: acc.balance,
                }))
            }))
        };
    }


    async findAllAccounts() {
        const tenantId = await this.tenantResolver.resolveForQuery();
        return this.prisma.bankAccount.findMany({
            where: {
                bank: { tenantId }
            },
            include: { bank: true }
        });
    }

    async getAllLoans() {
        const tenantId = await this.tenantResolver.resolveForQuery();
        return this.prisma.bankLoan.findMany({
            where: {
                bankAccount: { bank: { tenantId } }
            },
            include: {
                bankAccount: { include: { bank: true } },
                plans: true
            }
        });
    }

    async getLoans(accountId: string) {
        return this.prisma.bankLoan.findMany({
            where: { bankAccountId: accountId },
            include: { plans: true }
        });
    }

    async getLoanDetail(loanId: string) {
        return this.prisma.bankLoan.findUnique({
            where: { id: loanId },
            include: { plans: true, bankAccount: { include: { bank: true } } }
        });
    }

    async getUpcomingInstallments(startDate: Date, endDate: Date) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        return this.prisma.bankLoanPlan.findMany({
            where: {
                dueDate: { gte: startDate, lte: endDate },
                status: { not: CreditPlanStatus.PAID },
                loan: { bankAccount: { bank: { tenantId } } }
            },
            include: { loan: { include: { bankAccount: { include: { bank: true } } } } }
        });
    }

    async getUpcomingCreditCardDates(startDate: Date, endDate: Date) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        return this.prisma.companyCreditCard.findMany({
            where: {
                paymentDueDate: { gte: startDate, lte: endDate },
                isActive: true,
                cashbox: { tenantId }
            },
            include: {
                cashbox: true
            }
        });
    }

    async addLoanPlan(loanId: string, dto: { amount: number; dueDate: Date }) {
        return this.prisma.bankLoanPlan.create({
            data: {
                loanId,
                amount: new Decimal(dto.amount),
                dueDate: dto.dueDate,
                installmentNo: 99, // Dummy for added plan
                status: CreditPlanStatus.PENDING
            }
        });
    }

    async updateLoanPlan(id: string, dto: { amount?: number; dueDate?: Date }) {
        return this.prisma.bankLoanPlan.update({
            where: { id },
            data: {
                amount: dto.amount ? new Decimal(dto.amount) : undefined,
                dueDate: dto.dueDate
            }
        });
    }

    async deleteLoanPlan(id: string) {
        return this.prisma.bankLoanPlan.delete({ where: { id } });
    }
}
