import type { TenantSettings } from '@prisma/client';

/** Türkçe cari ekstre export metinleri */
export const TR_STATEMENT = {
    sheetName: 'Cari Hesap Ekstresi',
    title: 'CARİ HESAP EKSTRESİ',
    detailedTitle: 'DETAYLI CARİ HESAP EKSTRESİ',
    cariUnvan: 'Cari Ünvan',
    cariKodu: 'Cari Kodu',
    tarih: 'Tarih',
    vergiDairesiNo: 'Vergi Dairesi / Vergi No',
    toplamBorc: 'Toplam Borç',
    toplamAlacak: 'Toplam Alacak',
    netBakiye: 'Net Bakiye',
    bakiye: 'Bakiye',
    belgeNo: 'Belge No',
    aciklama: 'Açıklama',
    borc: 'Borç',
    alacak: 'Alacak',
    belgeTipi: 'Belge Tipi',
    sayfa: 'Sayfa',
    olusturmaNotu: 'Bu belge',
    tel: 'Tel',
    eposta: 'E-posta',
    web: 'Web',
    vergiDairesi: 'Vergi Dairesi',
    vergiNo: 'Vergi No',
    tcKimlik: 'T.C. Kimlik',
} as const;

export function formatBakiyeYonu(balance: number): string {
    if (balance === 0) return '-';
    return balance < 0 ? 'Borçlu' : 'Alacaklı';
}

export function formatParaTRY(amount: number): string {
    return `${Math.abs(amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;
}

export function buildFirmaAdresMetni(settings: TenantSettings | null): string {
    if (!settings) return '';
    const parts: string[] = [];
    const adres = [settings.address, settings.district, settings.city].filter(Boolean).join(' ');
    if (adres) parts.push(adres);
    const iletisim: string[] = [];
    if (settings.phone) iletisim.push(`${TR_STATEMENT.tel}: ${settings.phone}`);
    if (settings.email) iletisim.push(`${TR_STATEMENT.eposta}: ${settings.email}`);
    if (settings.website) iletisim.push(`${TR_STATEMENT.web}: ${settings.website}`);
    if (iletisim.length) parts.push(iletisim.join(' | '));
    const vergi: string[] = [];
    if (settings.taxOffice) vergi.push(`${TR_STATEMENT.vergiDairesi}: ${settings.taxOffice}`);
    if (settings.taxNumber) vergi.push(`${TR_STATEMENT.vergiNo}: ${settings.taxNumber}`);
    if (settings.tcNo) vergi.push(`${TR_STATEMENT.tcKimlik}: ${settings.tcNo}`);
    if (vergi.length) parts.push(vergi.join(' | '));
    return parts.join('\n');
}

export function buildTarihAraligiMetni(startDate?: string, endDate?: string): string {
    if (!startDate && !endDate) return '';
    const fmt = (d: string) => new Date(d).toLocaleDateString('tr-TR');
    if (startDate && endDate) return `Dönem: ${fmt(startDate)} – ${fmt(endDate)}`;
    if (startDate) return `Başlangıç: ${fmt(startDate)}`;
    return `Bitiş: ${fmt(endDate!)}`;
}
