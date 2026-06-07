import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { buildTenantWhereClause } from '../../common/utils/staging.util';
import { CreateCodeTemplateDto } from './dto/create-code-template.dto';
import { UpdateCodeTemplateDto } from './dto/update-code-template.dto';
import { ModuleType } from './code-template.enums';

const DEFAULT_TEMPLATES: Partial<Record<ModuleType, { name: string; prefix: string; digitCount: number }>> = {
  [ModuleType.WAREHOUSE]: { name: 'Depo Kodu', prefix: 'D', digitCount: 3 },
  [ModuleType.CASHBOX]: { name: 'Kasa Kodu', prefix: 'K', digitCount: 3 },
  [ModuleType.PERSONNEL]: { name: 'Personel Kodu', prefix: 'P', digitCount: 4 },
  [ModuleType.PRODUCT]: { name: 'Ürün Kodu', prefix: 'ST', digitCount: 4 },
  [ModuleType.CUSTOMER]: { name: 'Cari Kodu', prefix: 'C', digitCount: 4 },
  [ModuleType.INVOICE_SALES]: { name: 'Satış Faturası No', prefix: 'SF', digitCount: 5 },
  [ModuleType.INVOICE_PURCHASE]: { name: 'Alış Faturası No', prefix: 'AF', digitCount: 5 },
  [ModuleType.ORDER_SALES]: { name: 'Satış Siparişi No', prefix: 'SS', digitCount: 5 },
  [ModuleType.ORDER_PURCHASE]: { name: 'Satın Alma Siparişi No', prefix: 'SA', digitCount: 5 },
  [ModuleType.INVENTORY_COUNT]: { name: 'Sayım No', prefix: 'SY', digitCount: 5 },
  [ModuleType.QUOTE]: { name: 'Teklif No', prefix: 'TK', digitCount: 5 },
  [ModuleType.DELIVERY_NOTE_SALES]: { name: 'Satış İrsaliyesi No', prefix: 'Sİ', digitCount: 5 },
  [ModuleType.DELIVERY_NOTE_PURCHASE]: { name: 'Alış İrsaliyesi No', prefix: 'Aİ', digitCount: 5 },
  [ModuleType.TECHNICIAN]: { name: 'Teknisyen Kodu', prefix: 'T', digitCount: 3 },
  [ModuleType.WORK_ORDER]: { name: 'İş Emri No', prefix: 'IE', digitCount: 5 },
  [ModuleType.SERVICE_INVOICE]: { name: 'Servis Faturası No', prefix: 'SF', digitCount: 5 },
  [ModuleType.POS_CONSOLE]: { name: 'POS İşlem No', prefix: 'POS', digitCount: 5 },
  [ModuleType.CHECK_BILL_JOURNAL]: { name: 'Bordro Numaralandırma', prefix: 'BRD', digitCount: 6 },
  [ModuleType.CHECK_BILL_DOCUMENT]: { name: 'Çek/Senet No', prefix: 'EVR', digitCount: 6 },
  [ModuleType.COLLECTION_RECEIPT]: { name: 'Tahsilat Makbuzu No', prefix: 'THS', digitCount: 6 },
  [ModuleType.PAYMENT_RECEIPT]: { name: 'Ödeme Makbuzu No', prefix: 'ODE', digitCount: 6 },
  [ModuleType.CROSS_PAYMENT]: { name: 'Çapraz Ödeme No', prefix: 'COP', digitCount: 6 },
};

@Injectable()
export class CodeTemplateService {
  constructor(
    private prisma: PrismaService,
    private tenantResolver: TenantResolverService,
  ) { }

  async create(createDto: CreateCodeTemplateDto) {
    const tenantId = await this.tenantResolver.resolveForCreate();

    // Check if template already exists for this module and tenant
    const existing = await (this.prisma.codeTemplate as any).findFirst({
      where: {
        module: createDto.module,
        tenantId
      } as any,
    });

    if (existing) {
      throw new ConflictException(
        `Bu modül için zaten bir şablon mevcut: ${createDto.module}`,
      );
    }

    return (this.prisma.codeTemplate as any).create({
      data: {
        tenantId,
        module: createDto.module,
        name: createDto.name,
        prefix: createDto.prefix,
        digitCount: createDto.digitCount,
        currentValue: createDto.currentValue || 0,
        includeYear: createDto.includeYear !== undefined ? createDto.includeYear : false,
        isActive: createDto.isActive !== undefined ? createDto.isActive : true,
      } as any,
    });
  }

  async findAll() {
    const tenantId = await this.tenantResolver.resolveForQuery();
    return (this.prisma.codeTemplate as any).findMany({
      where: { tenantId } as any,
      orderBy: { module: 'asc' },
    });
  }

  async findOne(id: string) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const template = await (this.prisma.codeTemplate as any).findFirst({
      where: { id, tenantId } as any,
    });

    if (!template) {
      throw new NotFoundException(`Template not found: id`);
    }

    return template;
  }

  async findByModule(module: ModuleType) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const template = await (this.prisma.codeTemplate as any).findFirst({
      where: { module, tenantId } as any,
    });

    if (!template) {
      throw new NotFoundException(`Template not found for this module: module`);
    }

    return template;
  }

  async update(id: string, updateDto: UpdateCodeTemplateDto) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const existing = await this.findOne(id);

    return (this.prisma.codeTemplate as any).update({
      where: { id: existing.id, tenantId } as any,
      data: {
        name: updateDto.name,
        prefix: updateDto.prefix,
        digitCount: updateDto.digitCount,
        currentValue: updateDto.currentValue,
        includeYear: updateDto.includeYear,
        isActive: updateDto.isActive,
      } as any,
    });
  }

  async remove(id: string) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const existing = await this.findOne(id);

    return (this.prisma.codeTemplate as any).delete({
      where: { id: existing.id, tenantId } as any,
    });
  }

  /**
   * Modül tipine göre veritabanında kodun kullanılıp kullanılmadığını kontrol eder.
   */
  private async isCodeUsed(module: ModuleType, code: string, tenantId: string | null): Promise<boolean> {
    const mapping: Partial<Record<ModuleType, { model: string; field: string }>> = {
      [ModuleType.INVOICE_SALES]: { model: 'invoice', field: 'invoiceNo' },
      [ModuleType.INVOICE_PURCHASE]: { model: 'invoice', field: 'invoiceNo' },
      [ModuleType.SERVICE_INVOICE]: { model: 'invoice', field: 'invoiceNo' },
      [ModuleType.ORDER_SALES]: { model: 'salesOrder', field: 'orderNo' },
      [ModuleType.ORDER_PURCHASE]: { model: 'purchaseOrder', field: 'orderNo' },
      [ModuleType.DELIVERY_NOTE_SALES]: { model: 'salesDeliveryNote', field: 'deliveryNoteNo' },
      [ModuleType.DELIVERY_NOTE_PURCHASE]: { model: 'purchaseDeliveryNote', field: 'deliveryNoteNo' },
      [ModuleType.PRODUCT]: { model: 'product', field: 'code' },
      [ModuleType.CUSTOMER]: { model: 'account', field: 'code' },
      [ModuleType.WAREHOUSE]: { model: 'warehouse', field: 'code' },
      [ModuleType.CASHBOX]: { model: 'cashbox', field: 'code' },
      [ModuleType.PERSONNEL]: { model: 'employee', field: 'code' },
      [ModuleType.WORK_ORDER]: { model: 'workOrder', field: 'workOrderNo' },
      [ModuleType.QUOTE]: { model: 'quote', field: 'quoteNo' },
      [ModuleType.CHECK_BILL_JOURNAL]: { model: 'checkBillJournal', field: 'journalNo' },
      [ModuleType.CHECK_BILL_DOCUMENT]: { model: 'checkBill', field: 'checkNo' },
      [ModuleType.COLLECTION_RECEIPT]: { model: 'collection', field: 'documentNo' },
      [ModuleType.PAYMENT_RECEIPT]: { model: 'collection', field: 'documentNo' },
      [ModuleType.CROSS_PAYMENT]: { model: 'collection', field: 'documentNo' },
    };

    const config = mapping[module];
    if (!config) return false;

    try {
      const model = this.prisma[config.model] as any;
      if (!model) return false;

      const count = await model.count({
        where: {
          [config.field]: code,
          ...buildTenantWhereClause(tenantId || undefined),
        },
      });

      return count > 0;
    } catch (error) {
      console.error(`[CodeTemplateService] isCodeUsed error for ${module}:`, error);
      return false;
    }
  }

  async getNextCode(module: ModuleType): Promise<string> {
    const tenantId = await this.tenantResolver.resolveForQuery();
    try {
      let template = await (this.prisma.codeTemplate as any).findFirst({
        where: { module, tenantId } as any,
      });

      if (!template) {
        const defaults = DEFAULT_TEMPLATES[module];
        if (defaults) {
          template = await (this.prisma.codeTemplate as any).create({
            data: {
              tenantId,
              module,
              name: defaults.name,
              prefix: defaults.prefix,
              digitCount: defaults.digitCount,
              currentValue: 0,
              includeYear: false,
              isActive: true,
            } as any,
          });
        } else {
          throw new NotFoundException(
            `Bu modül için şablon tanımlanmamış: ${module}`,
          );
        }
      }

      if (!template.isActive) {
        throw new BadRequestException(
          `Bu modül için şablon aktif değil: ${module}`,
        );
      }

      let nextCode = '';
      let nextNumber: number;
      let isUsed = true;
      let attempts = 0;

      // Kullanılmayan bir kod bulana kadar döngü (max 100 deneme)
      while (isUsed && attempts < 100) {
        attempts++;
        nextNumber = template.currentValue + 1;
        const paddedNumber = String(nextNumber).padStart(template.digitCount, '0');

        if (template.includeYear) {
          const currentYear = new Date().getFullYear();
          nextCode = `${template.prefix}${currentYear}${paddedNumber}`;
        } else {
          nextCode = `${template.prefix}${paddedNumber}`;
        }

        // Kontrol et
        isUsed = await this.isCodeUsed(module, nextCode, tenantId);

        if (isUsed) {
          // Eğer kod kullanılmışsa sayacı hemen güncelle ve bir sonrakini dene
          template = await (this.prisma.codeTemplate as any).update({
            where: { id: template.id } as any,
            data: { currentValue: nextNumber },
          });
          console.warn(`⚠️ [CodeTemplateService] ${nextCode} kullanımda, sayaç ${nextNumber} değerine atlandı.`);
        }
      }

      // Sayacı resmi olarak güncelle
      const updated = await (this.prisma.codeTemplate as any).update({
        where: { id: template.id } as any,
        data: { currentValue: template.currentValue + 1 },
      });

      const finalNumber = updated.currentValue;
      const paddedFinal = String(finalNumber).padStart(template.digitCount, '0');

      let finalCode: string;
      if (template.includeYear) {
        const currentYear = new Date().getFullYear();
        finalCode = `${template.prefix}${currentYear}${paddedFinal}`;
      } else {
        finalCode = `${template.prefix}${paddedFinal}`;
      }

      return finalCode;
    } catch (error: any) {
      console.error('❌ [CodeTemplate Service] getNextCode hatası:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error?.message || `Kod üretilirken hata oluştu: ${module}`
      );
    }
  }

  async getPreviewCode(module: ModuleType): Promise<string> {
    const tenantId = await this.tenantResolver.resolveForQuery();
    try {
      let template = await (this.prisma.codeTemplate as any).findFirst({
        where: { module, tenantId } as any,
      });

      if (!template) {
        const defaults = DEFAULT_TEMPLATES[module];
        if (defaults) {
          template = await (this.prisma.codeTemplate as any).create({
            data: {
              tenantId,
              module,
              name: defaults.name,
              prefix: defaults.prefix,
              digitCount: defaults.digitCount,
              currentValue: 0,
              includeYear: false,
              isActive: true,
            } as any,
          });
        } else {
          throw new NotFoundException(
            `Bu modül için şablon tanımlanmamış: ${module}`,
          );
        }
      }

      let nextCode = '';
      let nextNumber: number;
      let isUsed = true;
      let attempts = 0;
      let currentValForPreview = template.currentValue;

      // Önizleme için de kullanılmayan bir kod bulana kadar bak
      while (isUsed && attempts < 100) {
        attempts++;
        nextNumber = currentValForPreview + 1;
        const paddedNumber = String(nextNumber).padStart(template.digitCount, '0');

        if (template.includeYear) {
          const currentYear = new Date().getFullYear();
          nextCode = `${template.prefix}${currentYear}${paddedNumber}`;
        } else {
          nextCode = `${template.prefix}${paddedNumber}`;
        }

        isUsed = await this.isCodeUsed(module, nextCode, tenantId);

        if (isUsed) {
          currentValForPreview = nextNumber;
        }
      }

      return nextCode;
    } catch (error: any) {
      console.error('❌ [CodeTemplate Service] getPreviewCode hatası:', error);
      throw error;
    }
  }

  async resetCounter(module: ModuleType, newValue?: number) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const template = await (this.prisma.codeTemplate as any).findFirst({
      where: { module, tenantId } as any,
    });

    if (!template) {
      throw new NotFoundException(`Template not found for module: ${module}`);
    }

    const next =
      newValue !== undefined && Number.isFinite(newValue)
        ? Math.max(0, Math.floor(newValue))
        : 0;

    return (this.prisma.codeTemplate as any).update({
      where: { id: template.id } as any,
      data: { currentValue: next },
    });
  }

  /**
   * Bir kodun kaydedilmesi durumunda son değeri günceller.
   * Eğer girilen kodun sonundaki sayı, mevcut sayaçtan büyükse sayacı günceller.
   */
  async saveLastCode(module: ModuleType, code: string): Promise<void> {
    const tenantId = await this.tenantResolver.resolveForQuery();
    try {
      const template = await (this.prisma.codeTemplate as any).findFirst({
        where: { module, tenantId } as any,
      });

      if (!template || !code) return;

      // Prefix + Year (opsiyonel) sonrasındaki sayı kısmını al
      const lastNumberStr = template.includeYear
        ? code.substring(template.prefix.length + 4)
        : code.substring(template.prefix.length);

      const lastNumber = parseInt(lastNumberStr, 10);

      if (isNaN(lastNumber)) {
        return;
      }

      // Sadece daha büyük bir numara gelirse güncelle
      if (lastNumber > template.currentValue) {
        await (this.prisma.codeTemplate as any).update({
          where: { id: template.id } as any,
          data: { currentValue: lastNumber },
        });
        console.log(`✅ [CodeTemplate Service] Sayaç güncellendi: ${module} -> ${lastNumber}`);
      }
    } catch (error) {
      console.error('❌ [CodeTemplate Service] saveLastCode hatası:', error);
    }
  }
}
