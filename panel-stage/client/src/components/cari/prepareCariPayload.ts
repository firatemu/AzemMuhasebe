import type { CariFormData } from './types';

export function prepareCariPayload(data: CariFormData) {
  if (!data.unvan?.trim()) {
    return null;
  }

  const typeMap: Record<string, string> = { MUSTERI: 'CUSTOMER', TEDARIKCI: 'SUPPLIER', HER_IKISI: 'BOTH' };
  const companyTypeMap: Record<string, string> = { KURUMSAL: 'CORPORATE', SAHIS: 'INDIVIDUAL' };
  const riskMap: Record<string, string> = {
    NORMAL: 'NORMAL',
    RISKLI: 'RISKY',
    BLOKELI: 'BLACK_LIST',
    TAKIPTE: 'IN_COLLECTION',
  };

  const dataToSend: Record<string, unknown> = {
    code: data.cariKodu?.trim() || undefined,
    title: data.unvan.trim(),
    type: typeMap[data.tip || 'MUSTERI'] || 'CUSTOMER',
    companyType: companyTypeMap[data.sirketTipi || 'KURUMSAL'] || 'CORPORATE',
    taxNumber: data.vergiNo || undefined,
    taxOffice: data.vergiDairesi || undefined,
    nationalId: data.tcKimlikNo || undefined,
    fullName: data.isimSoyisim || undefined,
    isActive: data.aktif ?? true,
    salesAgentId: data.satisElemaniId || undefined,
    contactName: data.yetkili || undefined,
    phone: data.telefon || undefined,
    email: data.email || undefined,
    website: data.webSite || undefined,
    fax: data.faks || undefined,
    country: data.ulke || 'Türkiye',
    city: data.il || undefined,
    district: data.ilce || undefined,
    address: data.adres || undefined,
    creditLimit: Number(data.riskLimiti) || 0,
    creditStatus: riskMap[data.riskDurumu || 'NORMAL'] || 'NORMAL',
    blockOnRisk: Boolean(data.riskDurdurma),
    collateralAmount: Number(data.teminatTutar) || 0,
    dueDays: Number(data.vadeGun) || 0,
    currency: data.paraBirimi || 'TRY',
    bankInfo: data.bankaBilgileri || undefined,
    sector: data.sektor || undefined,
    customCode1: data.ozelKod1 || undefined,
    customCode2: data.ozelKod2 || undefined,
    efaturaPostaKutusu: data.efaturaPostaKutusu || undefined,
    efaturaGondericiBirim: data.efaturaGondericiBirim || undefined,
  };

  if (data.sirketTipi !== 'SAHIS') {
    dataToSend.nationalId = undefined;
    dataToSend.fullName = undefined;
  } else {
    dataToSend.taxNumber = undefined;
    dataToSend.taxOffice = undefined;
  }

  if (!dataToSend.code || !(dataToSend.code as string).trim()) {
    dataToSend.code = undefined;
  } else {
    dataToSend.code = (dataToSend.code as string).trim();
  }

  const nullableFields = [
    'phone', 'email', 'contactName', 'taxNumber', 'taxOffice', 'nationalId', 'fullName',
    'address', 'website', 'fax', 'sector', 'customCode1', 'customCode2', 'bankInfo',
    'salesAgentId', 'efaturaPostaKutusu', 'efaturaGondericiBirim',
  ];
  nullableFields.forEach((field) => {
    if (dataToSend[field] !== undefined && (dataToSend[field] === '' || dataToSend[field] === null)) {
      dataToSend[field] = undefined;
    }
  });

  if (data.yetkililer?.length) {
    dataToSend.contacts = data.yetkililer.map((y) => ({
      fullName: y.adSoyad,
      title: y.unvan,
      phone: y.telefon,
      email: y.email,
      extension: y.dahili,
      isDefault: y.varsayilan,
      notes: y.notlar,
    }));
  }

  if (data.ekAdresler?.length) {
    const addressTypeMap: Record<string, string> = { FATURA: 'INVOICE', SEVK: 'DELIVERY', DIGER: 'OTHER' };
    dataToSend.addresses = data.ekAdresler.map((a) => ({
      type: addressTypeMap[a.tip] || 'OTHER',
      address: a.adres,
      city: a.il,
      district: a.ilce,
      postalCode: a.postaKodu,
      isDefault: Boolean(a.varsayilan),
    }));
  }

  if (data.tedarikciBankalar?.length) {
    dataToSend.banks = data.tedarikciBankalar.map((b) => ({
      bankName: b.bankaAdi,
      branchName: b.subeAdi,
      branchCode: b.subeKodu,
      accountNumber: b.hesapNo,
      iban: b.iban,
      currency: b.paraBirimi || 'TRY',
      notes: b.aciklama,
    }));
  }

  return dataToSend;
}
