Status	StatusExp
0	Taslak
1	Test
2	Belge Gönderim İptal 
3	Kuyrukta
4	İşleniyor
5	Hata
6	GIB'e İletildi
7	Kabul Edildi
8	Cevap Bekliyor
9	Reddedildi
10	İade
11	e-Arşiv İptal
12	Otomatik Onaylandı
13	Cevap İşleniyor
14	Transfer Belge
15	Cevap Verildi
16	Cevap Verilmedi
17	Cevap Başarılı
18	İtiraz Edildi


----------------------------------------------------------
EnvelopeStatus	EnvelopeExp
0	TASLAK
1000	ZARF KUYRUGA EKLENDI
1100	ZARF ISLENIYOR
1110	ZIP DOSYASI DEGIL
1111	ZARF ID UZUNLUGU GECERSIZ
1120	ZARF ARSIVDEN_KOPYALANAMADI
1130	ZIP ACILAMADI
1131	ZIP BIR DOSYA ICERMELI
1132	XML DOSYASI DEGIL
1133	ZARF ID VE XML DOSYASININ ADI AYNI OLMALI
1140	DOKUMAN AYRISTIRILAMADI
1141	ZARF ID YOK
1142	ZARF ID VE ZIP DOSYASI ADI AYNI OLMALI
1143	GECERSIZ VERSIYON
1150	SCHEMATRON KONTROL SONUCU HATALI
1160	XML SEMA KONTROLUNDEN GECEMEDI
1161	IMZA SAHIBI TCKN VKN ALINAMADI
1162	IMZA KAYDEDILEMEDI
1163	GONDERILEN ZARF SISTEMDE DAHA ONCE KAYITLI OLAN BIR FATURAYI ICERMEKTEDIR.
1164	GONDERILEN ZARF SISTEMDE DAHA ONCE KAYITLI OLAN BIR BELGEYİ ICERMEKTEDIR.
1170	YETKI KONTROL EDILEMEDI
1171	GONDERICI BIRIM YETKISI YOK
1172	POSTA KUTUSU YETKISI YOK
1175	IMZA YETKISI KONTROL EDILEMEDI
1176	IMZA SAHIBI YETKISIZ
1177	GEÇERSİZ İMZA
1180	ADRES KONTROL EDILEMEDI
1181	ADRES BULUNAMADI
1182	KULLANICI EKLENEMEDİ
1183	KULLANICI SİLENEMEDİ
1190	SISTEM YANITI HAZIRLANAMADI
1195	SISTEM HATASI
1200	ZARF BASARIYLA ISLENDI
1210	DOKUMAN BULUNAN ADRESE GONDERILEMEDI
1215	DOKUMAN GONDERIMI BASARISIZ. TERKAR GONDERME SONLANDI
1220	HEDEFTEN SISTEM YANITI GELMEDI
1230	HEDEFTEN SISTEM YANITI BASARISIZ GELDI
1235	FATURA IPTAL'E KONU EDILDI
1300	BASARIYLA TAMAMLANDI
2000	ÖZET DEĞERLER EŞİT DEĞİL
2001	ZARF ID SİSTEMDE MEVCUT DEĞİL
2002	ZARF ARŞİVE EKLENEMEDİ
2003	ZARF KUYRUĞA EKLENEMEDİ
2004	ZARF ID BULUNAMADI 
2005	SİSTEM HATASI
2006	GEÇERSİZ ZARF ADI
10000   Kuyruğa Eklendi
11111	DOKUMAN HATALI
14000	DOKUMAN IMZALANDI


----------------------------------------------------------
ProfileId	ProfileExp
1	TEMELFATURA
2	TICARIFATURA
3	EARSIVFATURA
4	IHRACAT
5	YOLCUBERABERFATURA
6	TEMELIRSALIYE
7	SERBESTMESLEKMAKBUZ
8	MUSTAHSILMAKBUZ

----------------------------------------------------------
SendTypeId	SendTypeExp
1	KAGIT
2	ELEKTRONIK

----------------------------------------------------------
InvoiceTypeCodeId	InvoiceTypeCodeExp
1	SATIS
2	IADE
3	ISTISNA
4	OZELMATRAH
5	TEVKIFAT
6	IHRACKAYITLI
7	SGK
8	SEVK
9	SERBESTMESLEKMAKBUZ
10	MUSTAHSILMAKBUZ


----------------------------------------------------------
DocumentCurrencyCode	DocumentCurrencyCodeExp
TRY	Türk Lirası
USD	Dolar
EUR	Euro
GBP	İngiliz Sterlini
CHF	İsviçre Frangı
CAD	Kanada Doları
DKK	Danimarka Kronu
SEK	İsveç Kronu
NOK	Norveç Kronu
JPY	Japon Yeni
AED	BAE Dirhemi
AUD	Avusturalya Doları
RUB	Rus Rublesi
KWD	Kuveyt Dinarı
ZAR	Güney Afrika Parası
BHD	Bahreyn Dinarı
LYD	Libya Dinarı
SAR	Suudi Arabistan Riyali
IQD	Irak Dinarı
ILS	Yeni İsrail Şekeli
IRR	İran Riyali
INR	Hindistan Rupisi
MXN	Meksika Pezosu
HUF	Forint
NZD	Yeni Zelanda Doları
BRL	Brazilya Real
IDR	Rupiah
PLN	Polanya Zlotisi
BGN	Bulgar Levası
CNY	Yuan
ARS	Arjantin Pezosu
ALL	Arnavutluk Lek
AZN	Azerbaycan Manatı
BYR	Belarus Rublesi
CLP	Şili Pezosu
COP	Kolombiya Pesosu
CRC	Kosta Rika Kolonu
DZD	Cezayir Dinarı
EGP	Mısır Lirası
HKD	Hong Kong Doları
HRK	Hırvat Kunası
ISK	İzlanda Kronu
JOD	Ürdün Dinarı
KRW	Won
KZT	Kazakistan Tenge
LBP	Lübnan Lirası
LKR	Sri Lanka Rupisi
LTL	Litvanya Litası
LVL	Letonya Lati
MAD	Fas Dirhemi
MDL	Moldovan Leu
MKD	Makedonya Denar
MYR	Malezya Ringiti
OMR	Umman Riyali
PEN	Nuevo Sol
PHP	Filipinler Pezosu
PKR	Pakistan Rupisi
QAR	Katar Riyali
RSD	Sırp Dinarı
SGD	Singapur Doları
SYP	Suriye Lirası
THB	Taylant Baht
TWD	Yeni Tayvan Doları
UAH	Hryvnia
UYU	Uruguay Pesosu

----------------------------------------------------------
BirimKodu	Aciklama
AKQ	ATV BİRİM FİYATI
AYR	ALTIN AYARI
B32	KG-METRE KARE
BAS	BAS
C62	ADET
CCT	TON BAŞINA TAŞIMA KAPASİTESİ
PR	ADET-ÇİFT
D30	BRÜT KALORİ DEĞERİ
D40	BİN LİTRE
GFI	FISSILE İZOTOP GRAMI
GMS	GÜMÜŞ
GRM	GRAM
GT	GROSS TON
H62	YÜZ ADET
K20	KİLOGRAM POTASYUM OKSİT
K58	KURUTULMUŞ NET AĞIRLIKLI KİLOGRAMI
K62	KİLOGRAM-ADET
KFO	DİFOSFOR PENTAOKSİT KİLOGRAMI
KGM	KİLOGRAM
KH6	KİLOGRAM-BAŞ
KHO	HİDROJEN PEROKSİT KİLOGRAMI
KMA	METİL AMİNLERİN KİLOGRAMI
KNI	AZOTUN KİLOGRAMI
KOH	KİLOGRAM POTASYUM HİDROKSİT
KPH	KG POTASYUM OKSİD
KPR	KİLOGRAM-ÇİFT
KSD	KURU ÜRÜN KİLOGRAMI %90 
KSH	SODYUM HİDROKSİT KİLOGRAMI
KUR	URANYUM KİLOGRAMI
KWH	KİLOWATT SAAT
KWT	KİLOWATT
LPA	SAF ALKOL LİTRESİ
LTR	LİTRE
MTK	METRE KARE
MTQ	METRE KÜP
MTR	METRE
NCL	HÜCRE ADEDİ
NCR	KARAT
OMV	OTV MAKTU VERGİ
OTB	OTV BİRİM FİYATI
R9	BİN METRE KÜP
T3	BİN ADET
TWH	BİN KİLOWATT SAAT
DRL	RULO
26	TON
SA	ÇUVAL
C68	PUNNET
4H	P.CASES 
5H	C.BOXES
BFT	W.CASES
EC	P.BAG
BX	KUTU
BO	ŞİŞE
SL	PALET
SET	TAKIM
PA	PAKET
CT	KARTON
J57	VARİL
JOU	VARDİYA   
MON	AY
HUR	SAAT      
D62	SANİYE    
ANN	YIL
DAY	GÜN
CL	BOBİN
E27	DOZ
EA	EA
PK	KOLİ
ST	TBK
MGM	MW
KF	KİLO PAKET
DR	BİDON
1J	TON MİLE
HAR	HEKTAR
LR	TABAKA
BJ	KOVA
DPC	DÜZİNE PARÇA
DPR	DÜZİNE ÇİFT
KTM	KİLOMETRE
MIN	DAKİKA
MAW	MEGAWATT
MWH	MEGAWATT SAAT
TL	TL
WEE	HAFTA
CMQ	CM3
MMT	MM
TC	KAMYON
CH	KONTEYNIR
BG	POŞET
ACR	DÖNÜM
TNE	TON
CR	SANDIK
NIU	ADET
TN	TENEKE
PG	PLAKA
MLT	MİLİLİTRE
GLL	GALON
G26	STER
CMK	SANTİMETRE KARE


----------------------------------------------------------
OdemeKodu	Aciklama
1	Ödeme Tipi Muhtelif
10	Nakit
20	Çek
23	Banka Çeki
42	Eft/Havale
48	Kredi Kartı/Banka Kartı
ZZZ	Diğer


----------------------------------------------------------
OdemeKanalKodu	Aciklama
1	Posta
2	 Hava Yolu ile Posta
3	Telgraf
4	Teleks
5	SWIFT
6	Diğer İletişim Ağları
7	Tanımlı Olmayan Ağlar
8	Fedwire
9	Bankada Elle
10	Taahhütlü Hava Yolu ile Posta
11	Taahhütlü Posta
12	Kurye
13	Özel Kurye
14	Uluslararası Para Transferi
15	Ulusal Para Transferi
ZZZ	Karşılıklı Olarak Belirlenen Yol


----------------------------------------------------------
Firma Tanıtıcıları
Kod
VKN
TCKN
TICARETSICILNO
MERSISNO
ABONENO
MUSTERINO
BAYINO
HIZMETNO
TESISATNO
DISTRIBUTORNO
TAPDKNO
SAYACNO
URETICINO
CIFTCINO
IMALATCINO
DOSYANO
HASTANO
SUBENO


----------------------------------------------------------
IhracKayitli 
Kodu	Adi
703	4760 s. ÖTV Kanununun 8/2 Md. Kapsamındaki İhraç Kayıtlı Satış
702	DİİB ve Geçici Kabul Rejimi Kapsamındaki Satışlar
701	3065 s. KDV Kanununun 11/1-c md. Kapsamındaki İhraç Kayıtlı Satış


----------------------------------------------------------
İstisna 
Kodu	Adi
101	ÖTV-İhracat İstisnası
102	ÖTV-Diplomatik İstisna
103	ÖTV-Askeri Amaçlı İstisna
104	ÖTV-Petrol Arama Faaliyetlerinde Bulunanlara Yapılan Teslimler
105	ÖTV-Uluslararası Anlaşmadan Doğan İstisna
106	ÖTV-Diğer İstisnalar
107	ÖTV-7/a Maddesi Kapsamında Yapılan Teslimler
108	ÖTV-Geçici 5. Madde Kapsamında Yapılan Teslimler
151	ÖTV- İstisna Olmayan Diğer
201	17/1 Kültür ve eğitim amacı taşıyan işlemler
202	17/2-a Sağlık, çevre ve sosyal yardım amaçlı işlemler
204	17/2-c Yabancı diplomatik organ ve hayır kurumlarının bağışlarıyla ilgili mal ve hizmet alışları
205	17/2-d Taşınmaz kültür varlıklarına ilişkin teslimler ve mimarlık hizmetleri
206	17/2-e Mesleki kuruluşların işlemleri
207	17/3 Askeri fabrika
208	17/4-c Birleşme, devir, dönüşüm ve bölünme işlemleri
209	17/4-e Banka ve sigorta muameleleri vergisi kapsamına giren işlemler
211	17/4-h Zirai amaçlı veya köy tüzel kişiliklerince yapılan içme suyu teslimleri
212	17/4-ı Serbest bölgelerde verilen hizmetler
213	17/4-j Boru hattı ile yapılan petrol ve gaz taşımacılığı
214	17/4-k Sanayi bölgelerindeki arsa ve işyeri teslimleri ile konut yapı kooperatiflerinin üyelerine konut teslimleri
215	17/4-l Varlık yönetim şirketlerinin işlemleri
216	17/4-m Tasarruf mevduatı sigorta fonunun işlemleri
217	17/4-n Basın-Yayın ve Enformasyon Genel Müdürlüğüne verilen haber hizmetleri
218	17/4-0 Gümrük antrepoları, geçici depolama yerleri, gümrüklü sahalar ve vergisiz satış yapılan mağazalarla ilgili hizmetler
219	17/4-p Hazine ve Arsa Ofisi Genel Müdürlüğünün işlemleri
221	Geçici 15 Konut yapı kooperatifleri, belediyeler ve sosyal güvenlik kuruluşlarına verilen inşaat taahhüt hizmeti
223	Geçici 20/1 Teknoloji geliştirme bölgelerinde yapılan işlemler
225	Geçici 23 Milli Eğitim Bakanlığına yapılan bilgisayar bağışları ile ilgili teslimler
226	17/2-b Özel Okulları, Üniversite ve Yüksekokullar Tarafından Verilen Bedelsiz Eğitim Ve Öğretim Hizmetleri
227	17/2-b Kanunların Gösterdiği Gerek Üzerine Bedelsiz Olarak Yapılan Teslim ve Hizmetler
228	17/2-b Kanunun (17/1) Maddesinde Sayılan Kurum ve Kuruluşlara Bedelsiz Olarak Yapılan Teslimler
229	17/2-b Gıda Bankacılığı Faaliyetinde Bulunan Dernek ve Vakıflara Bağışlanan Gıda, Temizlik, Giyecek ve Yakacak Maddeleri
230	17/4-g Külçe Altın, Külçe Gümüş Ve Kiymetli Taşlarin Teslimi
231	17/4-g Metal Plastik, Lastik, Kauçuk, Kağit, Cam Hurda Ve Atıkların Teslimi
232	17/4-g Döviz, Para, Damga Pulu, Değerli Kağıtlar, Hisse Senedi ve Tahvil Teslimleri
234	17/4-ş Konut Finansmanı Amacıyla Teminat Gösterilen ve İpotek Konulan Konutların Teslimi
235	16/1-c Transit ve Gümrük Antrepo Rejimleri İle Geçici Depolama ve Serbest Bölge Hükümlerinin Uygulandığiı Malların Teslimi
236	19/2 Usulüne Göre Yürürlüğe Girmiş Uluslararası Anlaşmalar Kapsamındaki İstisnalar (İade Hakkı Tanınmayan)
237	17/4-t 5300 Sayılı Kanuna Göre Düzenlenen Ürün Senetlerinin İhtisas/Ticaret Borsaları Aracılığıyla İlk Teslimlerinden Sonraki Teslim
238	17/4-u Varlıkların Varlık Kiralama Şirketlerine Devri İle Bu Varlıkların Varlık Kiralama Şirketlerince Kiralanması ve Devralınan Kuruma Devri
239	17/4-y Taşınmazların Finansal Kiralama Şirketlerine Devri, Finansal Kiralama Şirketi Tarafından Devredene Kiralanması ve Devri
240	17/4-z Patentli Veya Faydalı Model Belgeli Buluşa İlişkin Gayri Maddi Hakların Kiralanması, Devri ve Satış
250	Diğerleri
301	11/1-a Mal ihracatı
302	11/1-a Hizmet ihracatı
303	11/1-a Roaming hizmetleri
304	13/a Deniz hava ve demiryolu taşıma araçlarının teslimi ile inşa, tadil, bakım ve onarımları
305	13/b Deniz ve hava taşıma araçları için liman ve hava meydanlarında yapılan hizmetler
306	13/c Petrol aramaları
307	13/c Kıymetli madenlerin arama, zenginleştirme ve rafinaj faaliyetleri
308	13/d Teşvikli yatırım mallarının teslimi
309	13/e Liman ve hava meydanlarının inşası, yenilenmesi ve genişletilmesi
310	13/f Ulusal güvenlik amaçlı teslim ve hizmetler
311	14 Uluslararası taşımacılık
312	15/a Diplomatik organ ve misyonlara yapılan teslim ve hizmetler
313	15/b Uluslararası kuruluşlara yapılan teslim ve hizmetler
314	19/2 Usulüne Göre Yürürlüğe Girmiş Uluslar Arası Anlaşmalar Kapsamındaki İstisnalar
315	14/3 İhraç Konusu Eşyayı Taşıyan Kamyon, Çekici ve Yarı Romorklara Yapılan Motorin Teslimleri
316	 11/1-a Serbest Bölgelerdeki Müşteriler İçin Yapılan Fason Hizmetler
317	17/4-s Engellilerin Eğitimleri, Meslekleri ve Günlük Yaşamlarına İlişkin Araç-Gereç ve Bilgisayar Programları
318	Geçici 29 Yap-İşlet-Devret modeli projeler, kiralama karş. yapt. sağlık tesis.projeler, kiralama karş. yapt. eğitim öğretim tesis. tes. hiz.
319	13/g Başbakanlık Merkez Teşkilatına Yapılan Araç Teslimleri
320	Geçici 16 (6111 sayılı K.) İSMEP Kapsamında İstanbul İl Özel İdaresi'ne Bağlı Olarak Faaliyet Gösteren İstanbul Proje Koordinasyon Birimi'ne Yapılacak Teslim ve Hizmetler
321	Geçici 26 BM, NATO(temsilcilikleri, bağlı program, fon, özel ihtisas), OECD resmi kullanımları için yapılacak mal tes. hiz. ifaları
322	11/1-a Türkiye'de İkamet Etmeyenlere Özel Fatura ile Yapılan Teslimler (Bavul Ticareti)
323	13/ğ 5300 Sayılı Kanuna Göre Düzenlenen Ürün Senetlerinin İhtisas/Ticaret Borsaları Aracılığıyla İlk Teslimi
350	Diğerleri
351	KDV - İstisna Olmayan Diğer
326	13/ı Gıda, Tarım ve Hayvancılık Bakanlığı Tarafından Tescil Edilmiş Gübrelerin Teslimi
324	13/h Türkiye Kızılay Derneğine Yapılan Teslim ve Hizmetler ile Türkiye Kızılay Derneğinin Teslim ve Hizmetleri 325 13/ı Yem Teslimleri
327	13/ı Gıda, Tarım ve Hayvancılık Bakanlığı Tarafından Tescil Edilmiş Gübrelerin İçeriğinde Bulunan Hammaddelerin Gübre Üreticilerine Teslimi
220	17/4-r İki Tam Yıl Süreyle Sahip Olunan Taşınmaz ve İştirak Hisseleri Satışları
325	13/ı Yem Teslimleri
241	TürkAkım Gaz Boru Hattı Projesine İlişkin Anlaşmanın (9/b) Maddesinde Yer Alan Hizmetler
328	13/i Konut veya İşyeri Teslimleri
330	KDV 13/j md. Organize Sanayi Bölgeleri ile Küçük Sanayi Sitelerinin İnşasına İlişkin Teslim ve Hizmetler
331	KDV 13/m md. Ar-Ge, Yenilik ve Tasarım Faaliyetlerinde Kullanılmak Üzere Yapılan Yeni Makina ve Teçhizat Teslimlerinde İstisna
332	KDV Geçici 39. Md. İmalat Sanayiinde Kullanılmak Üzere Yapılan Yeni Makina ve Teçhizat Teslimlerinde İstisna
242	KDV 17/4-ö md. Gümrük Antrepoları, Geçici Depolama Yerleri ile Gümrüklü Sahalarda, İthalat ve İhracat İşlemlerine konu mallar ile transit rejim kapsamında işlem gören mallar için verilen ardiye, depolama ve terminal hizmetleri
333	KDV 13/k md. Kapsamında Genel ve Özel Bütçeli Kamu İdarelerine, İl Özel İdarelerine, Belediyelere ve Köylere bağışlanan Tesislerin İnşasına İlişkin İstisna
334	KDV 13/l md. Kapsamında Yabancılara Verilen Sağlık Hizmetlerinde İstisna
335	KDV 13/n Basılı Kitap ve Süreli Yayınların Teslimleri
336	Geçici 40 UEFA Müsabakaları Kapsamında Yapılacak Teslim ve Hizmetler 




----------------------------------------------------------
Özel Matrah
Kodu	Adi
801	Milli piyango, spor-toto ve benzeri Devletçe organize edilen organizasyonlar
802	At yarışları ve diğer müşterek bahis ve talih oyunları
803	Profesyonel sanatçıların yer aldığı gösteriler ve konserler ile profesyonel  sporcuların  katıldığı  sportif  faaliyetler,  maçlar ve yarışlar ve yarışmalar
804	Gümrük depolarında ve müzayede salonlarında yapılan satışlar
805	Altından mamül veya altın ihtiva eden ziynet eşyaları ile sikke altınların teslim ve ithali
806	Tütün mamülleri ve bazı alkollü içkiler
807	Gazete, dergi ve benzeri periyodik yayınlar
808	Külçe gümüş ve gümüşten mamül eşya teslimleri
809	Belediyeler tarafından yapılan şehiriçi yolcu taşımacılığında kullanılan biletlerin ve kartların bayiler tarafından satışı
810	Telefon kartı ve jeton satışları
811	Türkiye Şoförler ve Otomobilciler Federasyonu tarafından araç plakaları ile sürücü kurslarında kullanılan bir kısım evrakın basımı
812	İkinci el motorlu kara taşıtı veya taşınmaz ticaretiyle iştigal eden mükelleflerce, KDV mükellefi olmayanlardan (mükellef olanlardan istisna kapsamında yapılan alımlar dâhil) alınarak vasfında esaslı değişiklik yapılmaksızın ikinci el motorlu kara taşıtı veya taşınmaz teslimi




----------------------------------------------------------
Tevkifat
Kodu	Adi
601	(4/10) YAPIM İŞLERİ İLE BU İŞLERLE BİRLİKTE İFA EDİLEN MÜHENDİSLİKMİMARLIK VE ETÜT-PROJE HİZMETLERİ *GT 117-Bölüm (3.2.1)+
602	(9/10) ETÜT, PLAN-PROJE,  DANIŞMANLIK,  DENETİM   VE BENZERİ HİZMETLER *GT 117-Bölüm (3.2.2)
603	(7/10)MAKİNE, TEÇHİZAT, DEMİRBAŞ VE TAŞITLARA AİT TADİL, BAKIM VE ONARIM HİZMETLERİ *GT 117-Bölüm (3.2.3)+ 
604	(5/10) YEMEK SERVİS HİZMETİ *GT 117-Bölüm (3.2.4)
605	(5/10) ORGANİZASYON HİZMETİ *GT 117-Bölüm (3.2.4)
606	(9/10) İŞGÜCÜ TEMİN HİZMETLERİ *GT 117-Bölüm (3.2.5)
607	(9/10) ÖZEL GÜVENLİK HİZMETİ *GT 117-Bölüm (3.2.5)
608	(9/10) YAPI DENETİM HİZMETLERİ *GT 117-Bölüm (3.2.6)
609	(7/10)FASON OLARAK YAPTIRILAN TEKSTİL VE KONFEKSİYON İŞLERİ, ÇANTA VE AYAKKABI DİKİM İŞLERİ VE BU İŞLERE ARACILIK HİZMETLERİ *GT 117-Bölüm (3.2.7)+ 
610	(9/10) TURİSTİK MAĞAZALARA VERİLEN MÜŞTERİ BULMA/GÖTÜRME HİZMETLERİ *GT 117-Bölüm (3.2.8)
611	(9/10)SPOR KULÜPLERİNİN YAYIN, REKLÂM VE İSİM HAKKI GELİRLERİNE KONU İŞLEMLERİ *GT 117-Bölüm (3.2.9)+ 
612	(9/10) TEMİZLİK HİZMETİ *GT 117-Bölüm (3.2.10)
613	(9/10) ÇEVRE VE BAHÇE BAKIM HİZMETLERİ *GT 117- Bölüm (3.2.10)
614	(5/10) SERVİS TAŞIMACILIĞI HİZMETİ *GT 117-Bölüm (3.2.11)
615	(7/10) HER TÜRLÜ BASKI VE BASIM HİZMETLERİ *GT 117- Bölüm (3.2.12)
616	(5/10) 5018 SAYILI KANUNA EKLİ CETVELLERDEKİ İDARE, KURUM VE KURUŞLARA YAPILAN DİĞER HİZMETLER *GT 117-Bölüm (3.2.13)+ 
617	(7/10) HURDA METALDEN ELDE EDİLEN KÜLÇE TESLİMLERİ *GT 117-Bölüm (3.3.1)
618	(7/10) HURDA METALDEN ELDE EDİLENLER DIŞINDAKİ BAKIR, ÇİNKO VE ALÜMİNYUM KÜLÇE TESLİMLERİ *GT 117-Bölüm (3.3.1)+ 
619	(5/10) BAKIR, ÇİNKO VE ALÜMİNYUM ÜRÜNLERİNİN TESLİMİ *GT 117-Bölüm (3.3.2)
620	(7/10) İSTİSNADAN VAZGEÇENLERİN HURDA VE ATIK TESLİMİ *GT 117-Bölüm (3.3.3)
621	(9/10) METAL, PLASTİK, LASTİK, KAUÇUK, KÂĞIT VE CAM HURDA VE ATIKLARDAN ELDE EDİLEN HAMMADDE TESLİMİ *GT 117-Bölüm (3.3.4)] 
622	(9/10) PAMUK, TİFTİK, YÜN VE YAPAĞI İLE HAM POST VE DERİ TESLİMLERİ *GT 117-Bölüm (3.3.5)
623	(5/10) AĞAÇ VE ORMAN ÜRÜNLERİ TESLİMİ *GT 117- Bölüm (3.3.6)
624	(2/10) YÜK TAŞIMACILIĞI HİZMETİ [KDVGUT-(I/C-2.1.3.2.11)] 
625	(3/10) YÜK TAŞIMACILIĞI HİZMETİ [KDVGUT-(I/C-2.1.3.2.11)]
626	(2/10) DİĞER TESLİMLER [KDVGUT-(I/C-2.1.3.3.7.)] 
627 (5/10) DEMİR-ÇELİK ÜRÜNLERİNİN TESLİMİ [KDVGUT-(I/C-2.1.3.3.8)]”
801 (10/10)	Yapım İşleri ile Bu İşlerle Birlikte İfa Edilen Mühendislik-Mimarlık ve Etüt-Proje Hizmetleri[KDVGUT-(I/C-2.1.3.2.1)]
802	(10/10) Etüt, Plan-Proje, Danışmanlık, Denetim ve Benzeri Hizmetler[KDVGUT-(I/C-2.1.3.2.2)]
803	(10/10) Makine, Teçhizat, Demirbaş ve Taşıtlara Ait Tadil, Bakım ve Onarım Hizmetleri[KDVGUT- (I/C-2.1.3.2.3)]
804	(10/10) Yemek Servis Hizmeti[KDVGUT-(I/C-2.1.3.2.4)]
805	(10/10) Organizasyon Hizmeti[KDVGUT-(I/C-2.1.3.2.4)]
806	(10/10) İşgücü Temin Hizmetleri[KDVGUT-(I/C-2.1.3.2.5)]
807	(10/10) Özel Güvenlik Hizmeti[KDVGUT-(I/C-2.1.3.2.5)]
808	(10/10) Yapı Denetim Hizmetleri[KDVGUT-(I/C-2.1.3.2.6)]
809	(10/10) Fason Olarak Yaptırılan Tekstil ve Konfeksiyon İşleri, Çanta ve Ayakkabı Dikim İşleri ve Bu İşlere Aracılık Hizmetleri[KDVGUT-(I/C-2.1.3.2.7)]
810	(10/10) Turistik Mağazalara Verilen Müşteri Bulma/ Götürme Hizmetleri[KDVGUT-(I/C-2.1.3.2.8)]
811	(10/10) Spor Kulüplerinin Yayın, Reklâm ve İsim Hakkı Gelirlerine Konu İşlemleri[KDVGUT-(I/C-2.1.3.2.9)]
812	(10/10) Temizlik Hizmeti[KDVGUT-(I/C-2.1.3.2.10)]
813	(10/10) Çevre ve Bahçe Bakım Hizmetleri[KDVGUT-(I/C-2.1.3.2.10)]
814	(10/10) Servis Taşımacılığı Hizmeti[KDVGUT-(I/C-2.1.3.2.11)]
815	(10/10) Her Türlü Baskı ve Basım Hizmetleri[KDVGUT-(I/C-2.1.3.2.12)]
816	(10/10) Hurda Metalden Elde Edilen Külçe Teslimleri[KDVGUT-(I/C-2.1.3.3.1)]
817	(10/10) Hurda Metalden Elde Edilenler Dışındaki Bakır, Çinko, Demir Çelik, Alüminyum ve Kurşun Külçe Teslimi [KDVGUT-(I/C-2.1.3.3.1)]
818	(10/10) Bakır, Çinko, Alüminyum ve Kurşun Ürünlerinin Teslimi[KDVGUT-(I/C-2.1.3.3.2)]
819	(10/10) İstisnadan Vazgeçenlerin Hurda ve Atık Teslimi[KDVGUT-(I/C-2.1.3.3.3)]
820	(10/10) Metal, Plastik, Lastik, Kauçuk, Kâğıt ve Cam Hurda ve Atıklardan Elde Edilen Hammadde Teslimi[KDVGUT-(I/C-2.1.3.3.4)]
821	(10/10) Pamuk, Tiftik, Yün ve Yapağı İle Ham Post ve Deri Teslimleri[KDVGUT-(I/C-2.1.3.3.5)]
822	(10/10) Ağaç ve Orman Ürünleri Teslimi[KDVGUT-(I/C-2.1.3.3.6)]
823	(10/10) Yük Taşımacılığı Hizmeti [KDVGUT-(I/C-2.1.3.2.11)]
824	(10/10) Ticari Reklam Hizmetleri [KDVGUT-(I/C-2.1.3.2.15)]


----------------------------------------------------------
İhracat eşya kap cinsi

Code	Name
1A	Drum, steel
1B	Drum, aluminium
1D	Drum, plywood
1F	Container, flexible
1G	Drum, fibre
1W	Drum, wooden
2C	Barrel, wooden
3A	Jerrican, steel
3H	Jerrican, plastic
43	Bag, super bulk
44	Bag, polybag
4A	Box, steel
4B	Box, aluminium
4C	Box, natural wood
4D	Box, plywood
4F	Box, reconstituted wood
4G	Box, fibreboard
4H	Box, plastic
5H	Bag, woven plastic
5L	Bag, textile 
5M	Bag, paper 
6H	Composite packaging, plastic receptacle
6P	Composite packaging, glass receptacle
7A	Case, car
7B	Case, wooden
8A	Pallet, wooden
8B	Crate, wooden
8C	Bundle, wooden
AA	Intermediate bulk container, rigid plastic
AB	Receptacle, fibre 
AC	Receptacle, paper 
AD	Receptacle, wooden 
AE	Aerosol
AF	Pallet, modular, collars 80cms * 60cms 
AG	Pallet, shrinkwrapped 
AH	Pallet, 100cms * 110cms 
AI	Clamshell
AJ	Cone
AL	Ball
AM	Ampoule, non-protected 
AP	Ampoule, protected 
AT	Atomizer 
AV	Capsule
B4	Belt
BA	Barrel 
BB	Bobbin 
BC	Bottlecrate / bottlerack 
BD	Board
BE	Bundle 
BF	Balloon, non-protected 
BG	Bag
BH	Bunch
BI	Bin
BJ	Bucket 
BK	Basket 
BL	Bale, compressed 
BM	Basin
BN	Bale, non-compressed 
BO	Bottle, non-protected, cylindrical 
BP	Balloon, protected 
BQ	Bottle, protected cylindrical
BR	Bar
BS	Bottle, non-protected, bulbous 
BT	Bolt 
BU	Butt 
BV	Bottle, protected bulbous
BW	Box, for liquids
BX	Box
BY	Board, in bundle/bunch/truss 
BZ	Bars, in bundle/bunch/truss
CA	Can, rectangular 
CB	Crate, beer
CC	Churn
CD	Can, with handle and spout 
CE	Creel
CF	Coffer 
CG	Cage 
CH	Chest
CI	Canister 
CJ	Coffin 
CK	Cask 
CL	Coil 
CM	Card
CN	Container, not otherwise specified as transport equipment
CO	Carboy, non-protected
CP	Carboy, protected
CQ	Cartridge
CR	Crate
CS	Case 
CT	Carton 
CU	Cup
CV	Cover
CW	Cage, roll 
CX	Can, cylindrical 
CY	Cylinder 
CZ	Canvas 
DA	Crate, multiple layer, plastic 
DB	Crate, multiple layer, wooden
DC	Crate, multiple layer, cardboard 
DG	Cage, Commonwealth Handling Equipment Pool  (CHEP)
DH	Box, Commonwealth Handling Equipment Pool (CHEP), Eurobox
DI	Drum, iron 
DJ	Demijohn, non-protected
DK	Crate, bulk, cardboard 
DL	Crate, bulk, plastic 
DM	Crate, bulk, wooden
DN	Dispenser
DP	Demijohn, protected
DR	Drum 
DS	Tray, one layer no cover, plastic
DT	Tray, one layer no cover, wooden 
DU	Tray, one layer no cover, polystyrene
DV	Tray, one layer no cover, cardboard
DW	Tray, two layers no cover, plastic tray
DX	Tray, two layers no cover, wooden
DY	Tray, two layers no cover, cardboard 
EC	Bag, plastic 
ED	Case, with pallet base 
EE	Case, with pallet base, wooden 
EF	Case, with pallet base, cardboard
EG	Case, with pallet base, plastic
EH	Case, with pallet base, metal
EI	Case, isothermic 
EN	Envelope 
FB	Flexibag
FC	Crate, fruit 
FD	Crate, framed
FE	Flexitank
FI	Firkin 
FL	Flask
FO	Footlocker 
FP	Filmpack 
FR	Frame
FT	Foodtainer
FW	Cart, flatbed
FX	Bag, flexible container
GB	Bottle, gas
GI	Girder 
GL	Container, gallon
GR	Receptacle, glass 
GU	Tray, containing horizontally stacked flat items
GY	Bag, gunny
GZ	Girders, in bundle/bunch/truss 
HA	Basket, with handle, plastic 
HB	Basket, with handle, wooden
HC	Basket, with handle, cardboard 
HG	Hogshead 
HN	Hanger
HR	Hamper 
IA	Package, display, wooden 
IB	Package, display, cardboard
IC	Package, display, plastic
ID	Package, display, metal
IE	Package, show
IF	Package, flow 
IG	Package, paper wrapped
IH	Drum, plastic
IK	Package, cardboard, with bottle grip-holes 
IL	Tray, rigid, lidded stackable (CEN TS 14482:2002)
IN	Ingot
IZ	Ingots, in bundle/bunch/truss
JB	Bag, jumbo
JC	Jerrican, rectangular
JG	Jug
JR	Jar
JT	Jutebag
JY	Jerrican, cylindrical
KG	Keg
KI	Kit
LE	Luggage
LG	Log
LT	Lot
LU	Lug
LV	Liftvan
LZ	Logs, in bundle/bunch/truss
MA	Crate, metal
MB	Bag, multiply
MC	Crate, milk
ME	Container, metal
MR	Receptacle, metal 
MS	Sack, multi-wall 
MT	Mat
MW	Receptacle, plastic wrapped 
MX	Matchbox 
NA	Not available
NE	Unpacked or unpackaged 
NF	Unpacked or unpackaged, single unit
NG	Unpacked or unpackaged, multiple units
NS	Nest 
NT	Net
NU	Net, tube, plastic 
NV	Net, tube, textile 
OA	Pallet, CHEP 40 cm x 60 cm
OB	Pallet, CHEP 80 cm x 120 cm
OC	Pallet, CHEP 100 cm x 120 cm
OD	Pallet, AS 4068-1993
OE	Pallet, ISO T11
OF	Platform, unspecified weight or dimension
OK	Block
OT	Octabin
OU	Container, outer
P2	Pan
PA	Packet 
PB	Pallet, box Combined open-ended box and pallet
PC	Parcel 
PD	Pallet, modular, collars 80cms * 100cms 
PE	Pallet, modular, collars 80cms * 120cms 
PF	Pen 
PG	Plate
PH	Pitcher
PI	Pipe 
PJ	Punnet
PK	Package
PL	Pail 
PN	Plank
PO	Pouch
PP	Piece
PR	Receptacle, plastic 
PT	Pot
PU	Tray 
PV	Pipes, in bundle/bunch/truss 
PX	Pallet 
PY	Plates, in bundle/bunch/truss
PZ	Planks, in bundle/bunch/truss
QA	Drum, steel, non-removable head
QB	Drum, steel, removable head
QC	Drum, aluminium, non-removable head
QD	Drum, aluminium, removable head
QF	Drum, plastic, non-removable head
QG	Drum, plastic, removable head
QH	Barrel, wooden, bung type
QJ	Barrel, wooden, removable head 
QK	Jerrican, steel, non-removable head
QL	Jerrican, steel, removable head
QM	Jerrican, plastic, non-removable head
QN	Jerrican, plastic, removable head
QP	Box, wooden, natural wood, ordinary
QQ	Box, wooden, natural wood, with sift proof walls
QR	Box, plastic, expanded 
QS	Box, plastic, solid
RD	Rod
RG	Ring 
RJ	Rack, clothing hanger
RK	Rack 
RL	Reel 
RO	Roll 
RT	Rednet 
RZ	Rods, in bundle/bunch/truss
SA	Sack 
SB	Slab
SC	Crate, shallow 
SD	Spindle
SE	Sea-chest
SH	Sachet 
SI	Skid 
SK	Case, skeleton 
SL	Slipsheet 
SM	Sheetmetal 
SO	Spool 
SP	Sheet, plastic wrapping
SS	Case, steel
ST	Sheet
SU	Suitcase 
SV	Envelope, steel
SW	Shrinkwrapped  
SX	Set
SY	Sleeve
SZ	Sheets, in bundle/bunch/truss
T1	Tablet
TB	Tub
TC	Tea-chest
TD	Tube, collapsible
TE	Tyre
TG	Tank container, generic
TI	Tierce
TK	Tank, rectangular
TL	Tub, with lid
TN	Tin
TO	Tun
TR	Trunk
TS	Truss
TT	Bag, tote
TU	Tube 
TV	Tube, with nozzle 
TW	Pallet, triwall
TY	Tank, cylindrical
TZ	Tubes, in bundle/bunch/truss 
UC	Uncaged 
UN	Unit
VA	Vat
VG	Bulk, gas (at 1031 mbar and 15°C)
VI	Vial 
VK	Vanpack 
VL	Bulk, liquid 
VO	Bulk, solid, large particles (?nodules?) 
VP	Vacuum-packed
VQ	Bulk, liquefied gas (at abnormal temperature/pressure) 
VN	Vehicle
VR	Bulk, solid, granular particles (?grains?) 
VS	Bulk, scrap metal
VY	Bulk, solid, fine particles (?powders?)
WA	Intermediate bulk container
WB	Wickerbottle 
WC	Intermediate bulk container, steel 
WD	Intermediate bulk container, aluminium 
WF	Intermediate bulk container, metal 
WG	Intermediate bulk container, steel, pressurised > 10 kpa
WH	Intermediate bulk container, aluminium, pressurised > 10 kpa
WJ	Intermediate bulk container, metal, pressure 10 kpa 
WK	Intermediate bulk container, steel, liquid 
WL	Intermediate bulk container, aluminium, liquid 
WM	Intermediate bulk container, metal, liquid 
WN	Intermediate bulk container, woven plastic, without coat/liner 
WP	Intermediate bulk container, woven plastic, coated 
WQ	Intermediate bulk container, woven plastic, with liner 
WR	Intermediate bulk container, woven plastic, coated and liner 
WS	Intermediate bulk container, plastic film
WT	Intermediate bulk container, textile with out coat/liner 
WU	Intermediate bulk container, natural wood, with inner liner
WV	Intermediate bulk container, textile, coated 
WW	Intermediate bulk container, textile, with liner 
WX	Intermediate bulk container, textile, coated and liner 
WY	Intermediate bulk container, plywood, with inner liner 
WZ	Intermediate bulk container, reconstituted wood, with inner liner
XA	Bag, woven plastic, without inner coat/liner 
XB	Bag, woven plastic, sift proof 
XC	Bag, woven plastic, water resistant
XD	Bag, plastics film 
XF	Bag, textile, without inner coat/liner 
XG	Bag, textile, sift proof 
XH	Bag, textile, water resistant
XJ	Bag, paper, multi-wall 
XK	Bag, paper, multi-wall, water resistant
YA	Composite packaging, plastic receptacle in steel drum
YB	Composite packaging, plastic receptacle in steel crate box
YC	Composite packaging, plastic receptacle in aluminium drum
YD	Composite packaging, plastic receptacle in aluminium crate
YF	Composite packaging, plastic receptacle in wooden box
YG	Composite packaging, plastic receptacle in plywood drum
YH	Composite packaging, plastic receptacle in plywood box 
YJ	Composite packaging, plastic receptacle in fibre drum
YK	Composite packaging, plastic receptacle in fibreboard box
YL	Composite packaging, plastic receptacle in plastic drum
YM	Composite packaging, plastic receptacle in solid plastic box
YN	Composite packaging, glass receptacle in steel drum
YP	Composite packaging, glass receptacle in steel crate box
YQ	Composite packaging, glass receptacle in aluminium drum
YR	Composite packaging, glass receptacle in aluminium crate
YS	Composite packaging, glass receptacle in wooden box
YT	Composite packaging, glass receptacle in plywood drum
YV	Composite packaging, glass receptacle in wickerwork hamper
YW	Composite packaging, glass receptacle in fibre drum
YX	Composite packaging, glass receptacle in fibreboard box 
YY	Composite packaging, glass receptacle in expandable plastic pack
YZ	Composite packaging, glass receptacle in solid plastic pack
ZA	Intermediate bulk container, paper, multi-wall 
ZB	Bag, large 
ZC	Intermediate bulk container, paper, multi-wall, water resistant
ZD	Intermediate bulk container, rigid plastic, with structural equipment, solids
ZF	Intermediate bulk container, rigid plastic, freestanding, solids
ZG	Intermediate bulk container, rigid plastic, with structural equipment, pressurised
ZH	Intermediate bulk container, rigid plastic, freestanding, pressurised
ZJ	Intermediate bulk container, rigid plastic, with structural equipment, liquids 
ZK	Intermediate bulk container, rigid plastic, freestanding, liquids
ZL	Intermediate bulk container, composite, rigid plastic, solids
ZM	Intermediate bulk container, composite, flexible plastic, solids
ZN	Intermediate bulk container, composite, rigid plastic, pressurised 
ZP	Intermediate bulk container, composite, flexible plastic, pressurised
ZQ	Intermediate bulk container, composite, rigid plastic, liquids
ZR	Intermediate bulk container, composite, flexible plastic, liquids 
ZS	Intermediate bulk container, composite
ZT	Intermediate bulk container, fibreboard
ZU	Intermediate bulk container, flexible
ZV	Intermediate bulk container, metal, other than steel
ZW	Intermediate bulk container, natural wood
ZX	Intermediate bulk container, plywood
ZY	Intermediate bulk container, reconstituted wood
ZZ	Mutually defined 


-----------------------------------------------------------------------
ihracat Esya Gonderim Sekli
Aciklama	Code
Taşıma Modu Belirtilmedi	0
Deniz Taşımacılığı	1
Demiryolu Taşımacılığı	2
Karayolu Taşımacılığı	3
Hava Taşımacılığı	4
E-Posta	5
Birden  Çok Taşımacılık	6
Sabit Nakliye	7
İç Su Taşımacılığı	8
Taşıma Modu Uygun Değil	9



----------------------------------------------------------------------
ihracat teslim şartı
Aciklama    Detay
CFR         Masraflar ve Navlun / Cost and Freight
CIF         Masraflar, Sigorta ve Navlun / Cost,İnsurance And Freight
CIP         Taşıma ve Sigorta Ödenmiş Olarak / Carriage and Insured Paid To
CPT         Taşıma Ödenmiş Olarak / Carriage Paid To
DAF         Sınırda Teslim / Delivered At Frontier
DDP         Gümrük Vergileri Ödenmiş Olarak / Delivered Duty Paid
DDU         Gümrük Resmi Ödenmemiş Olarak Teslim / Delivered Duty Unpaid
DEQ         Rıhtımda Teslim (Gümrük Vergi ve Harçları Ödenmiş Olarak )/Delivered Ex Quay 
DES         Gemide Teslim / Delivered Ex Ship 
EXW         İşyerinde Teslim / Ex Works 
FAS         Gemi Doğrultusunda Masrafsız / Free Alongside Ship ( FAS) 
FCA         Taşıyıcıya Masrafsız / Free Carrier
FOB         Gemide Masrafsız / Free On Board 
DAP         Belirlenen Yerde Teslim / Delivered At Place
DPU         Belirlenmiş Yerde Boşaltılmış Olarak Teslim/ Delivered at Place Unloaded