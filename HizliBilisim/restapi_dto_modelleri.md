# Hızlı Teknoloji RestApi DTO Modelleri

Bu dokümanda yalnızca `RestApi` uç noktaları tarafından doğrudan veya dolaylı olarak kullanılan **Request (İstek) ve Response (Yanıt) DTO Modelleri** listelenmektedir.


## Model: `CancelDocumentInput`
*(Tam namespace: `HizliWebApp.Models.EArsiv.CancelDocumentInput`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| DocumentUuid | string |
| CancelReason | string |
| CancelDate | string |
| CancelMail | string |
| FaturaNo | string |
| AliciAdi | string |
| Year | integer |

---

## Model: `ObjectDocumentInput`
*(Tam namespace: `HizliWebApp.Models.EArsiv.ObjectDocumentInput`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| DocumentUuid | string |
| ObjectionReason | string |
| ObjectionDate | string |
| ObjectionType | string |
| ObjectionDocumentNo | string |
| Year | integer |

---

## Model: `Aciklamalar`
*(Tam namespace: `HizliWebApp.Models.ECheck.Aciklamalar`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Aciklama | string |

---

## Model: `Adisyon`
*(Tam namespace: `HizliWebApp.Models.ECheck.Adisyon`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| adisyonBaslik | `HizliWebApp.Models.ECheck.AdisyonBaslik` |
| aliciBilgileri | `HizliWebApp.Models.ECheck.AliciBilgileri` |
| aliciTanitici | Array of `HizliWebApp.Models.ECheck.Tanitici` |
| saticiTanitici | Array of `HizliWebApp.Models.ECheck.Tanitici` |
| adisyonKalem | Array of `HizliWebApp.Models.ECheck.AdisyonKalemleri` |
| aciklamalar | Array of `HizliWebApp.Models.ECheck.Aciklamalar` |
| indirimArtirim | Array of `HizliWebApp.Models.ECheck.IndirimArtirim` |
| toplamVergiler | Array of `HizliWebApp.Models.ECheck.Vergi` |

---

## Model: `AdisyonBaslik`
*(Tam namespace: `HizliWebApp.Models.ECheck.AdisyonBaslik`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| SubeKodu | integer |
| OnEk | string |
| UpdateDocument | boolean |
| AdisyonRef | string |
| AliciRef | string |
| ErpRef | string |
| Tckn | string |
| Alici_Adi | string |
| Gonderim_Sekli | string |
| ETTN | string |
| Adisyon_No | string |
| Adisyon_Tarihi | string |
| Adisyon_Zamani | string |
| Senaryo | string |
| Adisyon_Tipi | string |
| XSLT_Adi | string |
| Siparis_No | string |
| Siparis_Tarih | string |
| Teslim_Tarih | string |
| Para_Birimi | string |
| Doviz_Kuru | number |
| MalHizmetTutari | number |
| ToplamIskonto | number |
| VergiHaricTutar | number |
| VergiDahilTutar | number |
| ToplamMasraf | number |
| OdenecekTutar | number |
| Masa_No | string |
| Sistem_Kullanici | string |

---

## Model: `AdisyonKalemleri`
*(Tam namespace: `HizliWebApp.Models.ECheck.AdisyonKalemleri`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| KalemRef | string |
| SiraNo | integer |
| Satici_Mal_Kodu | string |
| Alici_Mal_Kodu | string |
| Mal_Adi | string |
| Mal_Aciklamasi | string |
| Satir_Notu | string |
| Miktar | number |
| Birim | string |
| ManuelAdisyonBirim | string |
| Birim_Fiyat | number |
| Tutari | number |
| kalemTanitici | Array of `HizliWebApp.Models.ECheck.Tanitici` |
| kalemVergiler | Array of `HizliWebApp.Models.ECheck.Vergi` |
| indirimArtirimlar | Array of `HizliWebApp.Models.ECheck.IndirimArtirim` |

---

## Model: `AliciBilgileri`
*(Tam namespace: `HizliWebApp.Models.ECheck.AliciBilgileri`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AliciRef | string |
| Tckn | string |
| Unvani | string |
| Kisi_Adi | string |
| Kisi_Soyadi | string |
| Vergi_Dairesi | string |
| Adres_No | string |
| Ulke_Kodu | string |
| Ulke_Adi | string |
| Il | string |
| Ilce | string |
| Internet_Sitesi | string |
| E_Posta | string |
| Telefon | string |
| Faks | string |
| Posta_Kodu | string |
| Semt | string |
| Cadde | string |
| Bina | string |
| Bina_No | string |
| Daire_No | string |
| ManuelCityAndSubdivision | boolean |

---

## Model: `IndirimArtirim`
*(Tam namespace: `HizliWebApp.Models.ECheck.IndirimArtirim`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| IndirimArtirimTur | boolean |
| Aciklama | string |
| Matrah | number |
| Oran | number |
| Tutar | number |

---

## Model: `Tanitici`
*(Tam namespace: `HizliWebApp.Models.ECheck.Tanitici`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| TaniticiKod | string |
| TaniticiDeger | string |

---

## Model: `Vergi`
*(Tam namespace: `HizliWebApp.Models.ECheck.Vergi`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| VergiKodu | string |
| VergiAciklama | string |
| Matrah | number |
| Oran | number |
| Tutar | number |
| IstisnaKodu | string |
| IstisnaAciklama | string |

---

## Model: `TaniticiModel`
*(Tam namespace: `HizliWebApp.Models.HbtMusteri.TaniticiModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Id | integer |
| TaniticiId | integer |
| TaniticiKod | string |
| TaniticiDeger | string |

---

## Model: `etiketler`
*(Tam namespace: `HizliWebApp.Models.HbtMusteri.etiketler`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| referansId | integer |
| etiket | string |
| etiketTuru | string |
| DurumAciklamasi | string |
| IslemDurumu | string |
| IslemTuru | string |
| kurumTuru | string |
| hizmetTuru | string |

---

## Model: `hizmet`
*(Tam namespace: `HizliWebApp.Models.HbtMusteri.hizmet`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| etiketListesi | Array of `HizliWebApp.Models.HbtMusteri.etiketler` |
| hizmetTuru | string |
| referansId | integer |
| iptalTarihi | string |
| fiyat | number |
| aciklama | string |
| isCancelable | boolean |

---

## Model: `kredi`
*(Tam namespace: `HizliWebApp.Models.HbtMusteri.kredi`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| birimTuru | string |
| islemTuru | string |
| krediTuru | `HizliWebApp.Models.HbtMusteri.krediTuru` |

---

## Model: `krediTuru`
*(Tam namespace: `HizliWebApp.Models.HbtMusteri.krediTuru`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| birimMiktari | integer |
| faturaNo | string |
| fiyat | number |
| odemeTuru | string |
| taksitSayisi | integer |

---

## Model: `musteri`
*(Tam namespace: `HizliWebApp.Models.HbtMusteri.musteri`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| krediListesi | Array of `HizliWebApp.Models.HbtMusteri.kredi` |
| kullaniciAdi | string |
| kurumTuru | string |
| musteriAdi | string |
| sehir | string |
| sorumluAd | string |
| sorumluCepTel | string |
| sorumluEPosta | string |
| sorumluSoyad | string |
| sorumluTckn | string |
| ad | string |
| soyad | string |
| sozlesmeListesi | Array of `HizliWebApp.Models.HbtMusteri.sozlesme` |
| subeListesi | Array of `HizliWebApp.Models.HbtMusteri.sube` |
| ticaretOdasi | string |
| ticaretSicilNo | string |
| unvan | string |
| vergiDairesi | string |
| vknTckn | string |
| bayiVknTckn | string |
| kaydedenAd | string |
| kaydedenSoyad | string |
| kaydedenTel | string |
| musteriTemsilcisi | string |
| kurumsalEposta | string |
| vergiDairesiIl | string |
| kepAdresi | string |
| mersisNo | string |
| AktifPasif | boolean |
| BayiMi | boolean |
| BayiOdemeYuzde | number |
| FirmaId | integer |
| referansId | integer |
| KullaniciMailGonder | boolean |
| etiketListesi | Array of `HizliWebApp.Models.HbtMusteri.etiketler` |
| Aciklama | string |
| openBankUserGsm | string |
| openBankSecretKey | string |

---

## Model: `musteriOutput`
*(Tam namespace: `HizliWebApp.Models.HbtMusteri.musteriOutput`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| hata | boolean |
| hataMesaji | Array of string |
| musteri | `HizliWebApp.Models.HbtMusteri.musteri` |
| referansId | integer |
| IlId | integer |
| IlceId | integer |

---

## Model: `sozlesme`
*(Tam namespace: `HizliWebApp.Models.HbtMusteri.sozlesme`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| referansId | integer |
| hizmetListesi | Array of `HizliWebApp.Models.HbtMusteri.hizmet` |
| sozlesmeBaslangicTarihi | string |
| sozlesmeBitisTarihi | string |
| tarifeTuru | string |
| imzaTarihi | string |
| imzaDurum | integer |
| otomatikYenilenme | boolean |
| FesihTarihi | string |
| FesihNedeni | string |

---

## Model: `sube`
*(Tam namespace: `HizliWebApp.Models.HbtMusteri.sube`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| binaAdi | string |
| binaNo | string |
| caddeAdi | string |
| eposta | string |
| fax | string |
| ilceAdi | string |
| kapiNo | string |
| postaKodu | string |
| sehirAdi | string |
| subeAdi | string |
| telefon | string |
| webSitesi | string |
| ulke | string |
| efaturaGbEtiket | string |
| efaturaPkEtiket | string |
| eirsaliyeGbEtiket | string |
| eirsaliyePkEtiket | string |
| taniticiList | Array of `HizliWebApp.Models.HbtMusteri.TaniticiModel` |
| subeKisaAdi | string |
| ResmiSube | boolean |
| MerkezMi | boolean |
| FirmaId | integer |
| referansId | integer |
| subeKodu | integer |

---

## Model: `AdditionalDocumentReference`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.AdditionalDocumentReference`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| ID | string |
| IssueDate | string |
| DocumentType | string |
| DocumentTypeCode | string |
| DocumentDescription | string |

---

## Model: `AllowanceCharge`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.AllowanceCharge`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| ChargeIndicator | boolean |
| AllowanceChargeReason | string |
| BaseAmount | number |
| MultiplierFactorNumeric | number |
| Amount | number |

---

## Model: `BillingReference`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.BillingReference`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| ID | string |
| IssueDate | string |
| DocumentTypeCode | string |

---

## Model: `BuyerCustomerParty`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.BuyerCustomerParty`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| IdentificationID | string |
| PartyName | string |
| CountryName | string |
| CountryCode | string |
| CityName | string |
| CitySubdivisionName | string |
| FirstName | string |
| FamilyName | string |
| NationalityID | string |
| AccountID | string |
| CurrencyCode | string |
| PaymentNote | string |
| BranchName | string |
| BankName | string |
| PasaportNo | string |
| PasaportDate | string |

---

## Model: `ContractDocumentReference`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.ContractDocumentReference`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| ID | string |
| IssueDate | string |

---

## Model: `Customer`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.Customer`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| IdentificationID | string |
| customerIdentificationsOther | Array of `HizliWebApp.Models.InvoiceModels.Customer_Identification` |
| PartyName | string |
| TaxSchemeName | string |
| StreetName | string |
| BuildingName | string |
| BuildingNumber | string |
| Room | string |
| CitySubdivisionName | string |
| CityName | string |
| CountryName | string |
| Telephone | string |
| Telefax | string |
| PostalZone | string |
| ElectronicMail | string |
| WebsiteURI | string |
| Person_FirstName | string |
| Person_FamilyName | string |
| ManuelCityAndSubdivision | boolean |

---

## Model: `CustomerAgentParty`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.CustomerAgentParty`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| customerAgentParty | `HizliWebApp.Models.InvoiceModels.Customer` |

---

## Model: `Customer_Identification`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.Customer_Identification`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| SchemeID | string |
| Value | string |

---

## Model: `Despatchs`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.Despatchs`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| DespatchDocumentID | string |
| DespatchDocumentIssueDate | string |
| ReferenceDespatchToInvoiceUUID | string |

---

## Model: `DocumentReference`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.DocumentReference`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| ID | string |
| IssueDate | string |

---

## Model: `ExportLine`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.ExportLine`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| PartName | string |
| StreetName | string |
| CitySubdivisionName | string |
| CityName | string |
| Country | string |
| DeliveryTermsID | string |
| DeliveryTermsSpecialTerms | string |
| RequiredCustomsID | string |
| ActualPackageID | string |
| ActualPackageQuantity | number |
| ActualPackagePackagingTypeCode | string |
| ActualPackagePackagingTypeName | string |
| TransportModeCode | string |
| ShipmentTransportDetail | string |
| GrossWeightMeasure | number |
| NetWeightMeasure | number |
| InsuranceValueAmount | number |
| DeclaredForCarriageValueAmount | number |
| DibSatirKod | string |

---

## Model: `InvoiceHeader`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.InvoiceHeader`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| SignedByUser | boolean |
| LocalReferenceId | string |
| SubeKodu | integer |
| Prefix | string |
| SourceUrn | string |
| DestinationUrn | string |
| UpdateDocument | boolean |
| UUID | string |
| Invoice_ID | string |
| ProfileID | string |
| InvoiceTypeCode | string |
| IssueDate | string |
| IssueTime | string |
| DocumentCurrencyCode | string |
| CalculationRate | number |
| XSLT_Adi | string |
| XSLT_Doc | string |
| LineExtensionAmount | number |
| AllowanceTotalAmount | number |
| TaxInclusiveAmount | number |
| ChargeTotalAmount | number |
| PayableRoundingAmount | number |
| PayableAmount | number |
| Note | string |
| Notes | Array of `HizliWebApp.Models.InvoiceModels.NoteModel` |
| OrderReferenceId | string |
| OrderReferenceDate | string |
| EArchiveSendType | string |
| IsInternetSale | boolean |
| IsInternet_PaymentMeansCode | string |
| IsInternet_PaymentDueDate | string |
| IsInternet_InstructionNote | string |
| IsInternet_WebsiteURI | string |
| IsInternet_Delivery_TcknVkn | string |
| IsInternet_Delivery_PartyName | string |
| IsInternet_Delivery_FirstName | string |
| IsInternet_Delivery_FamilyName | string |
| IsInternet_ActualDespatchDate | string |
| Sgk_AccountingCost | string |
| Sgk_Period_StartDate | string |
| Sgk_Period_EndDate | string |
| Sgk_Mukellef_Kodu | string |
| Sgk_Mukellef_Adi | string |
| Sgk_DosyaNo | string |
| Taxes | Array of `HizliWebApp.Models.InvoiceModels.LineTax` |
| Kdv_Statu | boolean |
| Manuel_Total | boolean |
| IsCashRegister | boolean |

---

## Model: `InvoiceLine`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.InvoiceLine`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| ID | integer |
| Item_Name | string |
| Item_ID_Seller | string |
| Item_ID_Buyer | string |
| LineNote | string |
| Item_Description | string |
| Item_Classification | string |
| Manufacturers_ItemIdentification | string |
| Item_Brand | string |
| Item_Model | string |
| itemInstances | Array of `HizliWebApp.Models.InvoiceModels.ItemInstance` |
| Quantity_Amount | number |
| Quantity_Unit_User | string |
| Price_Amount | number |
| Allowance_Reason | string |
| Allowance_Percent | number |
| Allowance_Amount | number |
| lineAllowanceCharges | Array of `HizliWebApp.Models.InvoiceModels.AllowanceCharge` |
| Price_Total | number |
| LineCurrencyCode | string |
| lineTaxes | Array of `HizliWebApp.Models.InvoiceModels.LineTax` |
| exportLine | `HizliWebApp.Models.InvoiceModels.ExportLine` |
| itemIdentifications | Array of `HizliWebApp.Models.InvoiceModels.ItemIdentification` |
| despatchLineReferences | Array of `HizliWebApp.Models.InvoiceModels.DocumentReference` |
| orderLineReferences | Array of `HizliWebApp.Models.InvoiceModels.OrderReference` |

---

## Model: `InvoiceModel`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.InvoiceModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| invoiceheader | `HizliWebApp.Models.InvoiceModels.InvoiceHeader` |
| customer | `HizliWebApp.Models.InvoiceModels.Customer` |
| customerAgent | `HizliWebApp.Models.InvoiceModels.CustomerAgentParty` |
| supplier | `HizliWebApp.Models.InvoiceModels.Supplier` |
| supplierAgent | `HizliWebApp.Models.InvoiceModels.SupplierAgentParty` |
| buyerCustomer | `HizliWebApp.Models.InvoiceModels.BuyerCustomerParty` |
| taxRepresentative | `HizliWebApp.Models.InvoiceModels.TaxRepresentativeParty` |
| invoicePeriods | `HizliWebApp.Models.InvoiceModels.InvoicePeriod` |
| despatchs | Array of `HizliWebApp.Models.InvoiceModels.Despatchs` |
| paymentMeans | Array of `HizliWebApp.Models.InvoiceModels.PaymentMeans` |
| invoiceLines | Array of `HizliWebApp.Models.InvoiceModels.InvoiceLine` |
| additionalDocumentReferences | Array of `HizliWebApp.Models.InvoiceModels.AdditionalDocumentReference` |
| billingReferences | Array of `HizliWebApp.Models.InvoiceModels.BillingReference` |
| allowanceCharges | Array of `HizliWebApp.Models.InvoiceModels.AllowanceCharge` |
| contractDocumentReference | Array of `HizliWebApp.Models.InvoiceModels.ContractDocumentReference` |

---

## Model: `InvoicePeriod`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.InvoicePeriod`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| StartDate | string |
| StartTime | string |
| EndDate | string |
| EndTime | string |

---

## Model: `ItemIdentification`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.ItemIdentification`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| schemeID | string |
| Value | string |

---

## Model: `ItemInstance`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.ItemInstance`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| SerialID | string |
| ProductTraceID | string |

---

## Model: `LineTax`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.LineTax`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Tax_Code | string |
| Tax_Name | string |
| Tax_Base | number |
| Tax_Perc | number |
| Tax_Amnt | number |
| Tax_Exem_Code | string |
| Tax_Exem | string |
| CalculationSequenceNumeric | number |

---

## Model: `NoteModel`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.NoteModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Note | string |

---

## Model: `OrderReference`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.OrderReference`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| ID | string |
| IssueDate | string |

---

## Model: `PaymentMeans`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.PaymentMeans`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| PaymentMeansCode | string |
| PaymentDueDate | string |
| InstructionNote | string |
| PaymentChannelCode | string |
| PayeeFinancialAccount | string |
| PayeeFinancialCurrencyCode | string |

---

## Model: `Supplier`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.Supplier`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| supplierParty | `HizliWebApp.Models.InvoiceModels.Customer` |

---

## Model: `SupplierAgentParty`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.SupplierAgentParty`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| supplierAgentParty | `HizliWebApp.Models.InvoiceModels.Customer` |

---

## Model: `TaxRepresentativeParty`
*(Tam namespace: `HizliWebApp.Models.InvoiceModels.TaxRepresentativeParty`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| VKN | string |
| Etiket | string |
| CitySubdivisionName | string |
| CityName | string |
| CountryName | string |

---

## Model: `Aciklamalar`
*(Tam namespace: `HizliWebApp.Models.IrsaliyeModel.Aciklamalar`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Aciklama | string |

---

## Model: `AliciBilgileri`
*(Tam namespace: `HizliWebApp.Models.IrsaliyeModel.AliciBilgileri`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AliciTanitici | Array of `HizliWebApp.Models.IrsaliyeModel.Tanitici` |
| VKN_TCKN | string |
| Unvani | string |
| Kisi_Adi | string |
| Kisi_Soyadi | string |
| Vergi_Dairesi | string |
| Adres_No | string |
| Ulke_Kodu | string |
| Ulke_Adi | string |
| Il | string |
| Ilce | string |
| Internet_Sitesi | string |
| E_Posta | string |
| Telefon | string |
| Faks | string |
| Posta_Kodu | string |
| Semt | string |
| Cadde | string |
| Bina | string |
| Bina_No | string |
| Daire_No | string |
| Teslimat_Adres_No | string |
| Teslimat_Ulke_Kodu | string |
| Teslimat_Ulke_Adi | string |
| Teslimat_Il | string |
| Teslimat_Ilce | string |
| Teslimat_Semt | string |
| Teslimat_Cadde | string |
| Teslimat_Posta_Kodu | string |
| Teslimat_Bina | string |
| Teslimat_Bina_No | string |
| Teslimat_Daire_No | string |
| ManuelCityAndSubdivision | boolean |

---

## Model: `DorsePlaka`
*(Tam namespace: `HizliWebApp.Models.IrsaliyeModel.DorsePlaka`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Plaka | string |

---

## Model: `FirmaBigisi`
*(Tam namespace: `HizliWebApp.Models.IrsaliyeModel.FirmaBigisi`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Tanitici | Array of `HizliWebApp.Models.IrsaliyeModel.Tanitici` |
| VKN_TCKN | string |
| Unvani | string |
| Kisi_Adi | string |
| Kisi_Soyadi | string |
| Vergi_Dairesi | string |
| Adres_No | string |
| Ulke_Kodu | string |
| Ulke_Adi | string |
| Il | string |
| Ilce | string |
| Internet_Sitesi | string |
| E_Posta | string |
| Telefon | string |
| Faks | string |
| Posta_Kodu | string |
| Semt | string |
| Cadde | string |
| Bina | string |
| Bina_No | string |
| Daire_No | string |

---

## Model: `Irsaliye`
*(Tam namespace: `HizliWebApp.Models.IrsaliyeModel.Irsaliye`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| IrsaliyeBaslik | `HizliWebApp.Models.IrsaliyeModel.IrsaliyeBaslik` |
| SaticiBilgileri | `HizliWebApp.Models.IrsaliyeModel.FirmaBigisi` |
| SaticiSubeBilgileri | `HizliWebApp.Models.IrsaliyeModel.FirmaBigisi` |
| AliciBilgileri | `HizliWebApp.Models.IrsaliyeModel.AliciBilgileri` |
| AliciSubeBilgileri | `HizliWebApp.Models.IrsaliyeModel.FirmaBigisi` |
| IrsaliyeKalem | Array of `HizliWebApp.Models.IrsaliyeModel.IrsaliyeKalemleri` |
| SoforBilgileri | Array of `HizliWebApp.Models.IrsaliyeModel.SoforBilgileri` |
| DorsePlaka | Array of `HizliWebApp.Models.IrsaliyeModel.DorsePlaka` |
| Aciklamalar | Array of `HizliWebApp.Models.IrsaliyeModel.Aciklamalar` |
| AsilAliciBilgileri | `HizliWebApp.Models.IrsaliyeModel.AliciBilgileri` |
| AsilSaticiBilgileri | `HizliWebApp.Models.IrsaliyeModel.AliciBilgileri` |
| IslemleriBaslatanBilgileri | `HizliWebApp.Models.IrsaliyeModel.AliciBilgileri` |
| AliciTanitici | Array of `HizliWebApp.Models.IrsaliyeModel.Tanitici` |
| SaticiTanitici | Array of `HizliWebApp.Models.IrsaliyeModel.Tanitici` |
| AliciSubeTanitici | Array of `HizliWebApp.Models.IrsaliyeModel.Tanitici` |

---

## Model: `IrsaliyeBaslik`
*(Tam namespace: `HizliWebApp.Models.IrsaliyeModel.IrsaliyeBaslik`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| LocalReferenceId | string |
| ETTN | string |
| Irsaliye_No | string |
| Irsaliye_Tarihi | string |
| Irsaliye_Zamani | string |
| Senaryo | string |
| Irsaliye_Tipi | string |
| Para_Birimi | string |
| Doviz_Kuru | number |
| Tasiyici_Vkn | string |
| Tasiyici_Unvan | string |
| Tasiyici_Adi | string |
| Tasiyici_Soyadi | string |
| Plaka | string |
| Toplam_Tutar | number |
| XSLT_Adi | string |
| Siparis_No | string |
| Siparis_Tarih | string |
| Sevk_Tarihi | string |
| Sevk_Zamani | string |
| Prefix | string |
| SubeKodu | integer |
| SourceUrn | string |
| DestinationUrn | string |
| UpdateDocument | boolean |

---

## Model: `IrsaliyeKalemleri`
*(Tam namespace: `HizliWebApp.Models.IrsaliyeModel.IrsaliyeKalemleri`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| SiraNo | integer |
| Satici_Mal_Kodu | string |
| Alici_Mal_Kodu | string |
| Uretici_Barkodu | string |
| Mal_Adi | string |
| Mal_Markasi | string |
| Mal_Modeli | string |
| Mal_Aciklamasi | string |
| Mal_Sinifi | string |
| Satir_Notu | string |
| Miktar | number |
| Sonra_Gonderilecek_Miktar | number |
| Birim | string |
| Birim_Fiyat | number |
| Mal_Tutari | number |
| Para_Birimi | string |
| itemIdentifications | Array of `HizliWebApp.Models.IrsaliyeModel.ItemIdentification` |

---

## Model: `ItemIdentification`
*(Tam namespace: `HizliWebApp.Models.IrsaliyeModel.ItemIdentification`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| schemeID | string |
| Value | string |

---

## Model: `SoforBilgileri`
*(Tam namespace: `HizliWebApp.Models.IrsaliyeModel.SoforBilgileri`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Ad | string |
| Soyad | string |
| TCKN | string |

---

## Model: `Tanitici`
*(Tam namespace: `HizliWebApp.Models.IrsaliyeModel.Tanitici`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| TaniticiKod | string |
| TaniticiDeger | string |

---

## Model: `Aciklamalar`
*(Tam namespace: `HizliWebApp.Models.IrsaliyeYanitModel.Aciklamalar`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Aciklama | string |

---

## Model: `IrsaliyeYanitKalemler`
*(Tam namespace: `HizliWebApp.Models.IrsaliyeYanitModel.IrsaliyeYanitKalemler`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| SiraNo | integer |
| Mal_Kodu | string |
| Mal_Adi | string |
| Birim | string |
| Teslim_Alinan_Miktar | number |
| Kabul_Edilmeyen_Miktar | number |
| Eksik_Miktar | number |
| Fazla_Miktar | number |
| Gecikme_Sikayeti | string |
| Satir_Notu | string |

---

## Model: `IrsaliyeYaniti`
*(Tam namespace: `HizliWebApp.Models.IrsaliyeYanitModel.IrsaliyeYaniti`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| SubeKodu | integer |
| Irsaliye_YanitVerilen_Ettn | string |
| Irsaliye_Yanit_Zamani | string |
| Irsaliye_Yanit_OnEk | string |
| Irsaliye_Yanit_No | string |
| Irsaliye_Yanit_Ettn | string |
| DestinationIdentifier | string |
| DestinationUrn | string |
| SourceUrn | string |
| UpdateDocument | boolean |
| aciklamalar | Array of `HizliWebApp.Models.IrsaliyeYanitModel.Aciklamalar` |
| irsaliyeYanitKalemler | Array of `HizliWebApp.Models.IrsaliyeYanitModel.IrsaliyeYanitKalemler` |

---

## Model: `Aciklamalar`
*(Tam namespace: `HizliWebApp.Models.MustahsilModel.Aciklamalar`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Aciklama | string |

---

## Model: `AliciBilgileri`
*(Tam namespace: `HizliWebApp.Models.MustahsilModel.AliciBilgileri`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AliciRef | string |
| Tckn | string |
| Unvani | string |
| Kisi_Adi | string |
| Kisi_Soyadi | string |
| Vergi_Dairesi | string |
| Adres_No | string |
| Ulke_Kodu | string |
| Ulke_Adi | string |
| Il | string |
| Ilce | string |
| Internet_Sitesi | string |
| E_Posta | string |
| Telefon | string |
| Faks | string |
| Posta_Kodu | string |
| Semt | string |
| Cadde | string |
| Bina | string |
| Bina_No | string |
| Daire_No | string |
| ManuelCityAndSubdivision | boolean |

---

## Model: `IndirimArtirim`
*(Tam namespace: `HizliWebApp.Models.MustahsilModel.IndirimArtirim`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| IndirimArtirimTur | boolean |
| Aciklama | string |
| Matrah | number |
| Oran | number |
| Tutar | number |

---

## Model: `Mustahsil`
*(Tam namespace: `HizliWebApp.Models.MustahsilModel.Mustahsil`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| mustahsilBaslik | `HizliWebApp.Models.MustahsilModel.MustahsilBaslik` |
| aliciBilgileri | `HizliWebApp.Models.MustahsilModel.AliciBilgileri` |
| aliciTanitici | Array of `HizliWebApp.Models.MustahsilModel.Tanitici` |
| saticiTanitici | Array of `HizliWebApp.Models.MustahsilModel.Tanitici` |
| mustahsilKalem | Array of `HizliWebApp.Models.MustahsilModel.MustahsilKalemleri` |
| aciklamalar | Array of `HizliWebApp.Models.MustahsilModel.Aciklamalar` |
| indirimArtirim | Array of `HizliWebApp.Models.MustahsilModel.IndirimArtirim` |
| toplamVergiler | Array of `HizliWebApp.Models.MustahsilModel.Vergi` |

---

## Model: `MustahsilBaslik`
*(Tam namespace: `HizliWebApp.Models.MustahsilModel.MustahsilBaslik`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| SubeKodu | integer |
| OnEk | string |
| UpdateDocument | boolean |
| MustahsilRef | string |
| AliciRef | string |
| ErpRef | string |
| Tckn | string |
| Alici_Adi | string |
| Gonderim_Sekli | string |
| ETTN | string |
| Mustahsil_No | string |
| Mustahsil_Tarihi | string |
| Mustahsil_Zamani | string |
| Senaryo | string |
| Mustahsil_Tipi | string |
| XSLT_Adi | string |
| Siparis_No | string |
| Siparis_Tarih | string |
| Teslim_Tarih | string |
| Para_Birimi | string |
| Doviz_Kuru | number |
| MalHizmetTutari | number |
| ToplamIskonto | number |
| VergiHaricTutar | number |
| VergiDahilTutar | number |
| ToplamMasraf | number |
| OdenecekTutar | number |
| Manuel_Toplam | boolean |

---

## Model: `MustahsilKalemleri`
*(Tam namespace: `HizliWebApp.Models.MustahsilModel.MustahsilKalemleri`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| KalemRef | string |
| SiraNo | integer |
| Satici_Mal_Kodu | string |
| Alici_Mal_Kodu | string |
| Mal_Adi | string |
| Mal_Aciklamasi | string |
| Satir_Notu | string |
| Miktar | number |
| Birim | string |
| ManuelMustahsilBirim | string |
| Birim_Fiyat | number |
| Tutari | number |
| kalemTanitici | Array of `HizliWebApp.Models.MustahsilModel.Tanitici` |
| kalemVergiler | Array of `HizliWebApp.Models.MustahsilModel.Vergi` |
| indirimArtirimlar | Array of `HizliWebApp.Models.MustahsilModel.IndirimArtirim` |

---

## Model: `Tanitici`
*(Tam namespace: `HizliWebApp.Models.MustahsilModel.Tanitici`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| TaniticiKod | string |
| TaniticiDeger | string |

---

## Model: `Vergi`
*(Tam namespace: `HizliWebApp.Models.MustahsilModel.Vergi`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| VergiKodu | string |
| VergiAciklama | string |
| Matrah | number |
| Oran | number |
| Tutar | number |
| IstisnaKodu | string |
| IstisnaAciklama | string |

---

## Model: `ResponseMessage`
*(Tam namespace: `HizliWebApp.Models.ResponseMessage`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| IsSucceeded | boolean |
| MessageCode | string |
| Message | string |
| ErrorStackTrace | string |

---

## Model: `ResponseMessageJSON`
*(Tam namespace: `HizliWebApp.Models.ResponseMessageJSON`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| IsSucceeded | boolean |
| MessageCode | string |
| Message | string |
| JsonFile | object |

---

## Model: `Aciklamalar`
*(Tam namespace: `HizliWebApp.Models.SmmModel.Aciklamalar`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Aciklama | string |

---

## Model: `AliciBilgileri`
*(Tam namespace: `HizliWebApp.Models.SmmModel.AliciBilgileri`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AliciRef | string |
| VKN_TCKN | string |
| FirmaAdi | string |
| KisiAdi | string |
| KisiSoyadi | string |
| Vergi_Dairesi | string |
| Adres_No | string |
| Ulke_Kodu | string |
| Ulke_Adi | string |
| Il | string |
| Ilce | string |
| Internet_Sitesi | string |
| E_Posta | string |
| Telefon | string |
| Faks | string |
| Posta_Kodu | string |
| Semt | string |
| Cadde | string |
| Bina | string |
| Bina_No | string |
| Daire_No | string |
| ManuelCityAndSubdivision | boolean |

---

## Model: `Esmm`
*(Tam namespace: `HizliWebApp.Models.SmmModel.Esmm`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| baslik | `HizliWebApp.Models.SmmModel.EsmmBaslik` |
| alici | `HizliWebApp.Models.SmmModel.AliciBilgileri` |
| kalemler | Array of `HizliWebApp.Models.SmmModel.EsmmKalemleri` |
| okcBilgileri | Array of `HizliWebApp.Models.SmmModel.OKCBilgileri` |
| vergiler | Array of `HizliWebApp.Models.SmmModel.Vergi` |
| aciklamalar | Array of `HizliWebApp.Models.SmmModel.Aciklamalar` |
| SatıcıFirmaVknTckn | string |

---

## Model: `EsmmBaslik`
*(Tam namespace: `HizliWebApp.Models.SmmModel.EsmmBaslik`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| SubeKodu | integer |
| AliciRef | string |
| MakbuzRef | string |
| ErpRef | string |
| ETTN | string |
| MakbuzNo | string |
| GonderimSekli | string |
| XSLT_Adi | string |
| DuzenlemeTarihi | string |
| DuzenlemeSaati | string |
| ParaBirimi | string |
| Kur | number |
| ToplamTutar | number |
| OdenecekTutar | number |
| Gonderildi | boolean |
| OnEk | string |
| UpdateDocument | boolean |
| Manuel_Toplam | boolean |

---

## Model: `EsmmKalemleri`
*(Tam namespace: `HizliWebApp.Models.SmmModel.EsmmKalemleri`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| KalemRef | string |
| SiraNo | integer |
| Satici_Mal_Kodu | string |
| Alici_Mal_Kodu | string |
| Mal_Adi | string |
| Mal_Aciklamasi | string |
| Satir_Notu | string |
| BrutTutari | number |
| NetUcret | number |
| NetTahsilat | number |
| KalemVergiler | Array of `HizliWebApp.Models.SmmModel.Vergi` |

---

## Model: `OKCBilgileri`
*(Tam namespace: `HizliWebApp.Models.SmmModel.OKCBilgileri`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| ID | integer |
| OKCFis_No | string |
| OKCFis_Tarihi | string |
| OKCFis_Saati | string |
| OKCFis_Tipi | string |
| OKCFis_ZRaporNo | string |
| OKCFis_SeriNo | string |

---

## Model: `Vergi`
*(Tam namespace: `HizliWebApp.Models.SmmModel.Vergi`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| VergiMatrahi | number |
| VergiOrani | number |
| VergiTutari | number |
| VergiKodu | string |
| VergiAciklama | string |
| VergiIstisnaKodu | string |
| VergiIstisnaSebebi | string |

---

## Model: `AdresBilgileri`
*(Tam namespace: `HizliWebApp.Models.Turmob.AdresBilgileri`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| adresTipi | string |
| adresTipiAciklamasi | string |
| mahalleSemt | string |
| koy | string |
| caddeSokak | string |
| disKapiNo | string |
| icKapiNo | string |
| beldeBucak | string |
| ilceAdi | string |
| ilAdi | string |
| ilKodu | string |
| ilceKodu | string |

---

## Model: `Durum`
*(Tam namespace: `HizliWebApp.Models.Turmob.Durum`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| durumKodu | string |
| durumKodAciklamasi | string |
| hataDetayBilgisi | string |
| sonuc | boolean |

---

## Model: `MukellefBilgisi`
*(Tam namespace: `HizliWebApp.Models.Turmob.MukellefBilgisi`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| vknTckn | string |
| meslekMensubuKey | string |

---

## Model: `MukellefModel`
*(Tam namespace: `HizliWebApp.Models.Turmob.MukellefModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| durum | `HizliWebApp.Models.Turmob.Durum` |
| vkn | string |
| tckn | string |
| ad | string |
| soyad | string |
| babaAdi | string |
| vergiDairesiAdi | string |
| vergiDairesiKodu | string |
| sirketinTuru | string |
| faalTerkDurumu | string |
| nACEFaaliyetKoduveTanimi | Array of `HizliWebApp.Models.Turmob.NACEFaaliyetKoduveTanimi` |
| adresBilgileri | Array of `HizliWebApp.Models.Turmob.AdresBilgileri` |
| iseBaslamaTarihi | string |
| isiBirakmaTarihi | string |
| kimlikUnvani | string |
| unvan | string |
| kurulusTarihi | string |
| tamDarMukellefiyet | string |
| kimlikPotansiyel | string |
| dogumYeri | string |

---

## Model: `MukellefOutput`
*(Tam namespace: `HizliWebApp.Models.Turmob.MukellefOutput`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| mukellef | `HizliWebApp.Models.Turmob.MukellefModel` |
| IsSucceeded | boolean |
| MessageCode | string |
| Message | string |
| ErrorStackTrace | string |

---

## Model: `NACEFaaliyetKoduveTanimi`
*(Tam namespace: `HizliWebApp.Models.Turmob.NACEFaaliyetKoduveTanimi`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| faaliyetAdi | string |
| faaliyetKodu | string |
| sira | string |

---

## Model: `Alias`
*(Tam namespace: `HizliWebApp.Services.Alias`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Name | Array of string |
| CreationTime | string |
| DeletionTime | string |

---

## Model: `ApplicationReponseDocumentInfo`
*(Tam namespace: `HizliWebApp.Services.ApplicationReponseDocumentInfo`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| DocumentUUID | string |
| DocumentId | string |
| DocumentDate | string |

---

## Model: `ArchiveReportDocument`
*(Tam namespace: `HizliWebApp.Services.ArchiveReportDocument`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| ReportId | integer |
| ReportNo | string |
| ReportTermNo | string |
| TermPartNo | integer |
| StartDate | string |
| CreatedDate | string |
| Status | integer |
| StatusExp | string |

---

## Model: `BankInfos`
*(Tam namespace: `HizliWebApp.Services.BankInfos`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Name | string |
| Currency | string |
| Swift | string |
| Iban | string |
| AccountNumber | string |
| BranchName | string |
| BranchCode | string |

---

## Model: `BayiAlt`
*(Tam namespace: `HizliWebApp.Services.BayiAlt`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| BayiVkn | string |
| bayiCreditTotal | integer |
| bayiCreditStatus | integer |
| bayiCreditRemainder | integer |
| bayiCaseTotal | number |
| bayiCaseStatus | number |
| bayiCaseRemainder | number |
| bayiMemoryTotal | number |
| bayiMemoryStatus | number |
| bayiMemoryRemainder | number |

---

## Model: `Cari`
*(Tam namespace: `HizliWebApp.Services.Cari`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| MusteriId | integer |
| MusteriKodu | string |
| FirmaId | integer |
| VergiDairesi | string |
| UlkeAdi | string |
| IlAdi | string |
| IlceAdi | string |
| VergiNoTCKimlikNo | string |
| FirmaAdi | string |
| Adi | string |
| Soyadi | string |
| MahalleSemt | string |
| CaddeSokak | string |
| PostaKodu | string |
| Telefon | string |
| Fax | string |
| EMail | string |
| WebSite | string |
| AktifPasif | boolean |
| BinaAdi | string |
| KapiNo | string |
| SubeParentId | integer |

---

## Model: `CariOut`
*(Tam namespace: `HizliWebApp.Services.CariOut`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Cari | `HizliWebApp.Services.Cari` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `CariResponse`
*(Tam namespace: `HizliWebApp.Services.CariResponse`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Cari | Array of `HizliWebApp.Services.Cari` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `CodeList`
*(Tam namespace: `HizliWebApp.Services.CodeList`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Codes | Array of `HizliWebApp.Services.CodeModel` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `CodeModel`
*(Tam namespace: `HizliWebApp.Services.CodeModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Code | string |
| Explanation | string |
| Percent | number |

---

## Model: `ControlDocument`
*(Tam namespace: `HizliWebApp.Services.ControlDocument`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| DocumentXml | string |

---

## Model: `ConvertDespachsToInvoiceOut`
*(Tam namespace: `HizliWebApp.Services.ConvertDespachsToInvoiceOut`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| InvoiceXml | string |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `CreditInfo`
*(Tam namespace: `HizliWebApp.Services.CreditInfo`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| totalCredit | number |
| remainCredit | number |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `CustomerGibUserEnvelopeModel`
*(Tam namespace: `HizliWebApp.Services.CustomerGibUserEnvelopeModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| record_id | string |
| role_code | string |
| work_scope_code | string |
| gib_result | string |
| gib_result_explanation | string |
| envelope_type | string |
| service_name | string |
| creation_date_time | string |
| envelope_uuid | string |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `DashboardOutput`
*(Tam namespace: `HizliWebApp.Services.DashboardOutput`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| inboxCount | integer |
| outboxCount | integer |
| archiveCount | integer |
| despatchInboxCount | integer |
| despatchOutboxCount | integer |
| mVoucherCount | integer |
| sVoucherCount | integer |
| checkCount | integer |
| exchangeCount | integer |
| ledgerCount | number |
| creditTotal | integer |
| creditStatus | integer |
| creditRemainder | integer |
| miadToplam | integer |
| memoryTotal | number |
| memoryStatus | number |
| memoryRemainder | number |
| caseTotal | number |
| caseStatus | number |
| caseRemainder | number |
| transferTotal | number |
| transferStatus | number |
| transferRemainder | number |
| edefterPaketTotal | number |
| edefterPaketStatus | number |
| edefterPaketRemainder | number |
| ebelgePaketTotal | number |
| ebelgePaketStatus | number |
| ebelgePaketRemainder | number |
| tarifeTuruList | Array of `HizliWebApp.Services.TarifeTuru` |
| bayiList | Array of `HizliWebApp.Services.BayiAlt` |
| kampanyaStatus | boolean |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `DataTableArchiveReportResponse`
*(Tam namespace: `HizliWebApp.Services.DataTableArchiveReportResponse`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| data | Array of `HizliWebApp.Services.ArchiveReportDocument` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `Document`
*(Tam namespace: `HizliWebApp.Services.Document`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| ReportNo | string |
| UUID | string |
| EnvelopeUUID | string |
| AppType | integer |
| IsArchive | boolean |
| IsRead | boolean |
| IsAccount | boolean |
| IsTransferred | boolean |
| IsPrinted | boolean |
| DocumentId | string |
| DocumentTypeCode | string |
| ProfileId | string |
| DocumentCurrencyCode | string |
| TargetTitle | string |
| TargetIdentifier | string |
| TargetAlias | string |
| SourceAlias | string |
| IsInternetSale | boolean |
| SendType | string |
| TaxTotal | number |
| PayableAmount | number |
| LocalReferenceId | string |
| Status | integer |
| StatusExp | string |
| EnvelopeStatus | integer |
| EnvelopeExp | string |
| Messsage | string |
| IssueDate | string |
| CreatedDate | string |
| CancelDate | string |
| CancelOption | boolean |
| SubeKodu | integer |
| KdvStr | string |
| EMailDate | string |
| HasEMail | boolean |
| PrefixAndYear | string |
| AppResGibResult | integer |
| AppResGibResultExp | string |
| AppResEnvUUID | string |
| IsInvoiced | boolean |
| IsPaid | boolean |

---

## Model: `DocumentContent`
*(Tam namespace: `HizliWebApp.Services.DocumentContent`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| DocumentFile | string |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `DocumentList`
*(Tam namespace: `HizliWebApp.Services.DocumentList`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| documents | Array of `HizliWebApp.Services.Document` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `DocumentUserXml`
*(Tam namespace: `HizliWebApp.Services.DocumentUserXml`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| DocumentType | string |
| AliasList | Array of `HizliWebApp.Services.Alias` |

---

## Model: `EntResponseUser`
*(Tam namespace: `HizliWebApp.Services.EntResponseUser`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| kalanKontor | string |
| musteriBilgileri | `HizliWebApp.Services.MusteriBilgileri` |
| sonucVerisi | `HizliWebApp.Services.KrediSonucu` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `GetDocumentListGUIDModel`
*(Tam namespace: `HizliWebApp.Services.GetDocumentListGUIDModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| GUIDList | Array of string |

---

## Model: `GibUser`
*(Tam namespace: `HizliWebApp.Services.GibUser`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Identifier | string |
| Alias | string |
| Title | string |
| Type | string |
| FirstCreationTime | string |
| AliasCreationTime | string |

---

## Model: `GibUserAliasCreation`
*(Tam namespace: `HizliWebApp.Services.GibUserAliasCreation`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Identifier | string |
| Alias | string |
| Title | string |
| Type | string |
| FirstCreationTime | string |
| AliasCreationTime | string |
| DeletionTime | string |

---

## Model: `GibUserList`
*(Tam namespace: `HizliWebApp.Services.GibUserList`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| gibUserLists | Array of `HizliWebApp.Services.GibUser` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `GibUserListAliasCreation`
*(Tam namespace: `HizliWebApp.Services.GibUserListAliasCreation`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| gibUserList | Array of `HizliWebApp.Services.UserXml` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `GibUserListAliasCreationList`
*(Tam namespace: `HizliWebApp.Services.GibUserListAliasCreationList`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| gibUserLists | Array of `HizliWebApp.Services.GibUserAliasCreation` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `GibUserListUserXml`
*(Tam namespace: `HizliWebApp.Services.GibUserListUserXml`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| gibUser | `HizliWebApp.Services.UserXml` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `InputCheckModel`
*(Tam namespace: `HizliWebApp.Services.InputCheckModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| DestinationIdentifier | string |
| EMail | string |
| Adisyon | `HizliWebApp.Models.ECheck.Adisyon` |
| LocalId | string |
| UpdateDocument | boolean |
| IsDraft | boolean |
| IsDraftSend | boolean |
| IsPreview | boolean |

---

## Model: `InputCreditNoteModel`
*(Tam namespace: `HizliWebApp.Services.InputCreditNoteModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| DestinationIdentifier | string |
| EMail | string |
| Mustahsil | `HizliWebApp.Models.MustahsilModel.Mustahsil` |
| LocalId | string |
| UpdateDocument | boolean |
| IsDraft | boolean |
| IsDraftSend | boolean |
| IsPreview | boolean |

---

## Model: `InputDespatchAdviceModel`
*(Tam namespace: `HizliWebApp.Services.InputDespatchAdviceModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| SourceUrn | string |
| DestinationIdentifier | string |
| DestinationUrn | string |
| irsaliye | `HizliWebApp.Models.IrsaliyeModel.Irsaliye` |
| LocalId | string |
| UpdateDocument | boolean |
| IsDraft | boolean |
| IsDraftSend | boolean |
| IsPreview | boolean |

---

## Model: `InputDocument`
*(Tam namespace: `HizliWebApp.Services.InputDocument`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| SourceUrn | string |
| DestinationIdentifier | string |
| DestinationUrn | string |
| XmlContent | string |
| DocumentUUID | string |
| DocumentId | string |
| DocumentDate | string |
| LocalId | string |
| ESmmNote | string |
| UpdateDocument | boolean |
| IsDraft | boolean |
| IsDraftSend | boolean |
| XsltCode | string |
| BrachCode | integer |

---

## Model: `InputInvoiceModel`
*(Tam namespace: `HizliWebApp.Services.InputInvoiceModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| SourceUrn | string |
| DestinationIdentifier | string |
| DestinationUrn | string |
| InvoiceModel | `HizliWebApp.Models.InvoiceModels.InvoiceModel` |
| LocalId | string |
| UpdateDocument | boolean |
| IsDraft | boolean |
| IsDraftSend | boolean |
| IsPreview | boolean |
| IsXml | boolean |

---

## Model: `InputReceiptAdviceModel`
*(Tam namespace: `HizliWebApp.Services.InputReceiptAdviceModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| SourceUrn | string |
| DestinationIdentifier | string |
| DestinationUrn | string |
| irsaliyeYaniti | `HizliWebApp.Models.IrsaliyeYanitModel.IrsaliyeYaniti` |
| LocalId | string |
| UpdateDocument | boolean |
| IsDraft | boolean |
| IsDraftSend | boolean |
| IsPreview | boolean |

---

## Model: `InputReceiptModel`
*(Tam namespace: `HizliWebApp.Services.InputReceiptModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| DestinationIdentifier | string |
| EMail | string |
| Smm | `HizliWebApp.Models.SmmModel.Esmm` |
| LocalId | string |
| UpdateDocument | boolean |
| IsDraft | boolean |
| IsDraftSend | boolean |
| IsPreview | boolean |

---

## Model: `InvoiceIdAndDateModel`
*(Tam namespace: `HizliWebApp.Services.InvoiceIdAndDateModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| InvoiceId | string |
| InvoiceDate | string |
| NextDocumentId | string |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `KontorYukleModel`
*(Tam namespace: `HizliWebApp.Services.KontorYukleModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| vkn_tckn | string |
| birimTuru | string |
| krediTuru | `HizliWebApp.Services.KrediTuru` |
| islemTuru | string |

---

## Model: `KrediRapor`
*(Tam namespace: `HizliWebApp.Services.KrediRapor`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| KontorId | integer |
| VknTckn | string |
| BirimTuru | string |
| IslemTuru | string |
| OdemeTuru | string |
| BirimMiktari | number |
| Fiyat | number |
| SatinAlmaTarihi | string |
| TaksitSayisi | integer |
| KullanimBaslangicTarihi | string |
| KullanimBitisTarihi | string |
| Aciklama | string |

---

## Model: `KrediRaporOutput`
*(Tam namespace: `HizliWebApp.Services.KrediRaporOutput`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| krediRaporList | Array of `HizliWebApp.Services.KrediRapor` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `KrediSonucu`
*(Tam namespace: `HizliWebApp.Services.KrediSonucu`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| toplamFaturaAdedi | integer |
| toplamAlanBoyutu | number |
| harcananGelenFaturaMiktari | integer |
| harcananGidenFaturaMiktari | integer |
| harcananEArsivFaturaMiktari | integer |
| harcananAlanMiktari | number |

---

## Model: `KrediTuru`
*(Tam namespace: `HizliWebApp.Services.KrediTuru`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| odemeTuru | string |
| taksitSayisi | integer |
| birimMiktari | integer |
| baslangicTarihi | string |
| sonKullanimTarihi | string |
| faturaNo | string |
| birimFiyat | number |
| aciklama | string |

---

## Model: `LoginInput`
*(Tam namespace: `HizliWebApp.Services.LoginInput`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| apiKey | string |
| username | string |
| password | string |

---

## Model: `LoginOut`
*(Tam namespace: `HizliWebApp.Services.LoginOut`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| username | string |
| password | string |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `LoginOutput`
*(Tam namespace: `HizliWebApp.Services.LoginOutput`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| VknTckn | string |
| MusteriAdi | string |
| Unvan | string |
| Adi | string |
| Soyadi | string |
| eFaturaGb | string |
| eIrsaliyeGb | string |
| ServiceUsername | string |
| ServicePassword | string |
| Telefon | string |
| Email | string |
| Fax | string |
| WebSitesi | string |
| VergiDairesi | string |
| Il | string |
| Ilce | string |
| Adres | string |
| AktifPasif | boolean |
| FirmaId | integer |
| MerkezFirmaId | integer |
| CustomerId | integer |
| SubeKodu | integer |
| Token | string |
| KullaniciId | integer |
| BayiParentId | integer |
| OtherPrm | string |
| AuthorizationIds | Array of integer |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `LoginUtil`
*(Tam namespace: `HizliWebApp.Services.LoginUtil`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| secretKey | string |
| username | string |
| password | string |

---

## Model: `MailSend`
*(Tam namespace: `HizliWebApp.Services.MailSend`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| Ettn | string |

---

## Model: `MailSendInput`
*(Tam namespace: `HizliWebApp.Services.MailSendInput`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| MailSendList | Array of `HizliWebApp.Services.MailSend` |

---

## Model: `MailSendOut`
*(Tam namespace: `HizliWebApp.Services.MailSendOut`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| mailSend | `HizliWebApp.Services.MailSend` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `MailSendOutput`
*(Tam namespace: `HizliWebApp.Services.MailSendOutput`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| MailSendOutList | Array of `HizliWebApp.Services.MailSendOut` |

---

## Model: `MusteriAktifPasifModel`
*(Tam namespace: `HizliWebApp.Services.MusteriAktifPasifModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| VknTckn | string |
| Mesaj | string |
| AktifPasif | boolean |

---

## Model: `MusteriBilgileri`
*(Tam namespace: `HizliWebApp.Services.MusteriBilgileri`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| VergiNoTCKimlikNo | string |
| FirmaAdi | string |
| Adi | string |
| Soyadi | string |

---

## Model: `OutputCheckModel`
*(Tam namespace: `HizliWebApp.Services.OutputCheckModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| HtmlContent | string |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `OutputCreditNoteModel`
*(Tam namespace: `HizliWebApp.Services.OutputCreditNoteModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| HtmlContent | string |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `OutputDespatchAdviceModel`
*(Tam namespace: `HizliWebApp.Services.OutputDespatchAdviceModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| HtmlContent | string |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `OutputInvoiceModel`
*(Tam namespace: `HizliWebApp.Services.OutputInvoiceModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| HtmlContent | string |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `OutputReceiptAdviceModel`
*(Tam namespace: `HizliWebApp.Services.OutputReceiptAdviceModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| HtmlContent | string |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `OutputReceiptModel`
*(Tam namespace: `HizliWebApp.Services.OutputReceiptModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| HtmlContent | string |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `Prefix`
*(Tam namespace: `HizliWebApp.Services.Prefix`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| OnEk | string |
| Yil | integer |
| Sayi | integer |
| NumaraId | integer |
| FirmaId | integer |
| NumaraTurId | integer |
| FirmaDonemId | integer |
| KullaniciId | integer |
| AktifPasif | boolean |
| KullaniciAktif | boolean |

---

## Model: `PrefixCodeResponse`
*(Tam namespace: `HizliWebApp.Services.PrefixCodeResponse`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Prefix | Array of string |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `PrefixOut`
*(Tam namespace: `HizliWebApp.Services.PrefixOut`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| prefix | `HizliWebApp.Services.Prefix` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `ReSendMailInput`
*(Tam namespace: `HizliWebApp.Services.ReSendMailInput`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| Uuid | string |
| EMailAdres | string |
| XmlGonder | boolean |
| PdfGonder | boolean |
| Year | integer |

---

## Model: `ResponseMessage`
*(Tam namespace: `HizliWebApp.Services.ResponseMessage`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| IsSucceeded | boolean |
| Message | string |

---

## Model: `SendApplicationResponse`
*(Tam namespace: `HizliWebApp.Services.SendApplicationResponse`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| ResponseCode | string |
| ResponseDescription | string |
| SourceUrn | string |
| DestinationUrn | string |
| Documents | Array of `HizliWebApp.Services.ApplicationReponseDocumentInfo` |

---

## Model: `SendLucaInput`
*(Tam namespace: `HizliWebApp.Services.SendLucaInput`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| UUIDList | Array of string |
| AppType | integer |
| IssueDateStr | string |
| LucaNo | string |

---

## Model: `Stock`
*(Tam namespace: `HizliWebApp.Services.Stock`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| StockId | integer |
| ItemIdSeller | string |
| ItemIdBuyer | string |
| Description | string |
| QuantityUnitCode | string |
| RequiredCustomsID | string |
| QuantityAmount | number |
| CurrencyCode | string |
| TaxPercent | number |
| Note | string |
| TaxExemCode | string |
| stockTaxes | Array of `HizliWebApp.Services.StockTaxes` |

---

## Model: `StockOut`
*(Tam namespace: `HizliWebApp.Services.StockOut`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| stock | `HizliWebApp.Services.Stock` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `StockResponse`
*(Tam namespace: `HizliWebApp.Services.StockResponse`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Stock | Array of `HizliWebApp.Services.Stock` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `StockTaxes`
*(Tam namespace: `HizliWebApp.Services.StockTaxes`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| StockId | integer |
| TaxCode | string |
| TaxPercent | number |
| TaxAmount | number |
| TaxExemCode | string |

---

## Model: `TakenFromEntegratorModel`
*(Tam namespace: `HizliWebApp.Services.TakenFromEntegratorModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| AppType | integer |
| GUIDList | Array of string |

---

## Model: `TarifeTuru`
*(Tam namespace: `HizliWebApp.Services.TarifeTuru`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| TarifeTuruId | integer |
| Aciklama | string |

---

## Model: `UpdateUserWsModel`
*(Tam namespace: `HizliWebApp.Services.UpdateUserWsModel`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| VergiNoTCKimlikNo | string |
| WS_KullaniciAdi | string |
| WS_Sifre | string |

---

## Model: `UploadDocumentTransferInput`
*(Tam namespace: `HizliWebApp.Services.UploadDocumentTransferInput`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Tip | string |
| ZipContent | string |
| AppType | integer |

---

## Model: `UserXml`
*(Tam namespace: `HizliWebApp.Services.UserXml`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| _id | object |
| Identifier | string |
| Title | string |
| Type | string |
| FirstCreationTime | string |
| AccountType | string |
| DocumentList | Array of `HizliWebApp.Services.DocumentUserXml` |

---

## Model: `Xslt`
*(Tam namespace: `HizliWebApp.Services.Xslt`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| ServiceType | string |
| XsltCode | string |
| XsltTemplate | `HizliWebApp.Services.XsltTemplate` |
| XsltManuelContent | string |
| IsPreview | boolean |

---

## Model: `XsltContentOut`
*(Tam namespace: `HizliWebApp.Services.XsltContentOut`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| ServiceType | string |
| XsltCode | string |
| XsltTemplate | `HizliWebApp.Services.XsltTemplate` |
| XsltManuelContent | string |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `XsltList`
*(Tam namespace: `HizliWebApp.Services.XsltList`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| ServiceType | string |
| XsltCode | string |

---

## Model: `XsltListOut`
*(Tam namespace: `HizliWebApp.Services.XsltListOut`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| xsltList | Array of `HizliWebApp.Services.XsltList` |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `XsltNote`
*(Tam namespace: `HizliWebApp.Services.XsltNote`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| Note | string |

---

## Model: `XsltOut`
*(Tam namespace: `HizliWebApp.Services.XsltOut`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| HtmlContent | string |
| IsSucceeded | boolean |
| Message | string |

---

## Model: `XsltTemplate`
*(Tam namespace: `HizliWebApp.Services.XsltTemplate`)*

| Özellik (Property) | Veri Tipi |
|---|---|
| ThemeColor | string |
| LogoImage | string |
| LogoWidth | integer |
| LogoHeight | integer |
| KaseImzaImage | string |
| KaseImzaHeight | integer |
| KaseImzaWidth | integer |
| Notes | Array of `HizliWebApp.Services.XsltNote` |
| BankInfos | Array of `HizliWebApp.Services.BankInfos` |

---
