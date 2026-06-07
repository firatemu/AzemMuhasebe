import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Button,
    IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from '@/lib/axios';
import { getDistricts } from '@/lib/cities';
import CariForm from '../CariForm';
import { CariFormData, initialCariFormData } from './types';

interface EditCariDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
    cari: any;
}

export default function EditCariDialog({ open, onClose, onSuccess, showSnackbar, cari }: EditCariDialogProps) {
    const [formData, setFormData] = useState<CariFormData>(initialCariFormData);
    const [selectedCity, setSelectedCity] = useState('İstanbul');
    const [satisElemanlari, setSatisElemanlari] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Memoize districts to prevent unnecessary re-renders
    const availableDistricts = useMemo(() => getDistricts(selectedCity), [selectedCity]);

    // Fetch sales representatives once on mount
    useEffect(() => {
        const fetchSatisElemanlari = async () => {
            try {
                const response = await axios.get('/sales-agent');
                setSatisElemanlari(response.data || []);
            } catch (error) {
                console.error('Satış elemanları yüklenirken hata:', error);
            }
        };
        fetchSatisElemanlari();
    }, []);

    // Populate form with cari data when cari changes
    useEffect(() => {
        if (cari && open) {
            const typeMap: any = { 'CUSTOMER': 'MUSTERI', 'SUPPLIER': 'TEDARIKCI', 'BOTH': 'HER_IKISI' };
            const companyTypeMap: any = { 'CORPORATE': 'KURUMSAL', 'INDIVIDUAL': 'SAHIS' };
            const riskMap: any = { 'NORMAL': 'NORMAL', 'RISKY': 'RISKLI', 'BLACK_LIST': 'BLOKELI', 'IN_COLLECTION': 'TAKIPTE' };
            const addressTypeMap: any = { 'INVOICE': 'FATURA', 'DELIVERY': 'SEVK', 'OTHER': 'DIGER' };

            // Map contacts
            const yetkililer = cari.contacts?.map((c: any) => ({
                adSoyad: c.fullName || '',
                unvan: c.title || '',
                telefon: c.phone || '',
                email: c.email || '',
                dahili: c.extension || '',
                varsayilan: c.isDefault || false,
                notlar: c.notes || '',
            })) || [];

            // Map addresses
            const ekAdresler = cari.addresses?.map((a: any) => ({
                baslik: a.type || '',
                tip: addressTypeMap[a.type] || 'DIGER',
                adres: a.address || '',
                il: a.city || '',
                ilce: a.district || '',
                postaKodu: a.postalCode || '',
                varsayilan: a.isDefault || false,
            })) || [];

            // Map banks
            const tedarikciBankalar = cari.banks?.map((b: any) => ({
                bankaAdi: b.bankName || '',
                subeAdi: b.branchName || '',
                subeKodu: b.branchCode || '',
                hesapNo: b.accountNumber || '',
                iban: b.iban || '',
                paraBirimi: b.currency || 'TRY',
                aciklama: b.notes || '',
            })) || [];

            setFormData({
                cariKodu: cari.code || cari.cariKodu || '',
                unvan: cari.title || cari.unvan || '',
                tip: typeMap[cari.type] || 'MUSTERI',
                sirketTipi: companyTypeMap[cari.companyType] || 'KURUMSAL',
                vergiNo: cari.taxNumber || cari.vergiNo || '',
                vergiDairesi: cari.taxOffice || cari.vergiDairesi || '',
                tcKimlikNo: cari.nationalId || cari.tcKimlikNo || '',
                isimSoyisim: cari.fullName || cari.isimSoyisim || '',
                aktif: cari.isActive !== undefined ? cari.isActive : (cari.aktif !== undefined ? cari.aktif : true),
                satisElemaniId: cari.salesAgentId || '',
                yetkili: cari.contactName || cari.yetkili || '',
                telefon: cari.phone || cari.telefon || '',
                email: cari.email || '',
                webSite: cari.website || cari.webSite || '',
                faks: cari.fax || cari.faks || '',
                ulke: cari.country || cari.ulke || 'Türkiye',
                il: cari.city || cari.il || '',
                ilce: cari.district || cari.ilce || '',
                adres: cari.address || cari.adres || '',
                riskLimiti: cari.creditLimit || cari.riskLimiti || 0,
                riskDurumu: riskMap[cari.creditStatus] || 'NORMAL',
                riskDurdurma: cari.blockOnRisk || false,
                teminatTutar: cari.collateralAmount || cari.teminatTutar || 0,
                vadeSuresi: cari.dueDays?.toString() || cari.vadeGun?.toString() || '30',
                vadeGun: cari.dueDays || cari.vadeGun || 30,
                paraBirimi: cari.currency || cari.paraBirimi || 'TRY',
                fiyatGrubu: cari.priceGroup || cari.fiyatGrubu || '',
                bankaBilgileri: cari.bankInfo || cari.bankaBilgileri || '',
                sektor: cari.sector || cari.sektor || '',
                ozelKod1: cari.customCode1 || cari.ozelKod1 || '',
                ozelKod2: cari.customCode2 || cari.ozelKod2 || '',
                efaturaPostaKutusu: cari.efaturaPostaKutusu || '',
                efaturaGondericiBirim: cari.efaturaGondericiBirim || '',
                yetkililer,
                ekAdresler,
                tedarikciBankalar,
            });

            setSelectedCity(cari.city || cari.il || 'İstanbul');
        }
    }, [cari, open]);

    const handleCityChange = useCallback((city: string) => {
        setSelectedCity(city);
        const districts = getDistricts(city);
        setFormData(prev => ({ ...prev, il: city, ilce: districts[0] || 'Merkez' }));
    }, []);

    const handleFormChange = useCallback((field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const prepareDataToSend = (data: CariFormData) => {
        if (!data.unvan || !data.unvan.trim()) {
            console.error('Validation error: unvan is missing');
            return null;
        }

        const typeMap: any = { MUSTERI: 'CUSTOMER', TEDARIKCI: 'SUPPLIER', HER_IKISI: 'BOTH' };
        const companyTypeMap: any = { KURUMSAL: 'CORPORATE', SAHIS: 'INDIVIDUAL' };
        const riskMap: any = { NORMAL: 'NORMAL', RISKLI: 'RISKY', BLOKELI: 'BLACK_LIST', TAKIPTE: 'IN_COLLECTION' };

        const dataToSend: any = {
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

        // Şahıs şirketi değilse TC ve isim-soyisim temizle
        if (data.sirketTipi !== 'SAHIS') {
            dataToSend.nationalId = undefined;
            dataToSend.fullName = undefined;
        } else {
            dataToSend.taxNumber = undefined;
            dataToSend.taxOffice = undefined;
        }

        // Boş alanları temizle
        const nullableFields = ['phone', 'email', 'contactName', 'taxNumber', 'taxOffice', 'nationalId', 'fullName', 'address', 'website', 'fax', 'sector', 'customCode1', 'customCode2', 'bankInfo', 'salesAgentId', 'efaturaPostaKutusu', 'efaturaGondericiBirim'];
        nullableFields.forEach(field => {
            if (dataToSend[field] !== undefined && (dataToSend[field] === '' || dataToSend[field] === null)) {
                dataToSend[field] = undefined;
            }
        });

        // İlişkili tabloları temizle ve map'le
        if (data.yetkililer) {
            dataToSend.contacts = data.yetkililer.map((y: any) => ({
                fullName: y.adSoyad,
                title: y.unvan,
                phone: y.telefon,
                email: y.email,
                extension: y.dahili,
                isDefault: y.varsayilan,
                notes: y.notlar,
            }));
        }

        if (data.ekAdresler) {
            const addressTypeMap: any = { FATURA: 'INVOICE', SEVK: 'DELIVERY', DIGER: 'OTHER' };
            dataToSend.addresses = data.ekAdresler.map((a: any) => ({
                type: addressTypeMap[a.tip] || 'OTHER',
                address: a.adres,
                city: a.il,
                district: a.ilce,
                postalCode: a.postaKodu,
                isDefault: Boolean(a.varsayilan),
            }));
        }

        if (data.tedarikciBankalar) {
            dataToSend.banks = data.tedarikciBankalar.map((b: any) => ({
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
    };

    const handleUpdate = async () => {
        try {
            if (!formData.unvan || !formData.unvan.trim()) {
                showSnackbar('Ünvan boş olamaz', 'error');
                return;
            }

            setLoading(true);
            const dataToSend = prepareDataToSend(formData);

            await axios.patch(`/account/${cari.id}`, dataToSend);
            showSnackbar('Cari başarıyla güncellendi', 'success');
            onSuccess();
            onClose();
        } catch (error: any) {
            showSnackbar(error.response?.data?.message || 'Cari güncellenemedi', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '90dvh',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border)',
                    bgcolor: 'var(--card)',
                    backgroundImage: 'none',
                },
            }}
        >
            <DialogTitle component="div" sx={{
                bgcolor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 600,
                fontSize: '1.25rem',
                p: '20px 24px',
                borderBottom: 'none',
                borderTopLeftRadius: 'var(--radius-xl)',
                borderTopRightRadius: 'var(--radius-xl)',
            }}>
                Cari Hesabı Düzenle
                <IconButton size="small" onClick={onClose} sx={{ color: 'var(--primary-foreground)' }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent
                sx={{
                    bgcolor: 'var(--background)',
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'hidden',
                    px: 0,
                    py: 0,
                    display: 'flex',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        overflowY: 'auto',
                        maxHeight: 'calc(90dvh - 140px)',
                        px: { xs: 1.5, sm: 3 },
                        py: 2,
                    }}
                >
                    <CariForm
                        data={formData}
                        onChange={handleFormChange}
                        onCityChange={handleCityChange}
                        availableDistricts={availableDistricts}
                        satisElemanlari={satisElemanlari}
                    />
                </Box>
            </DialogContent>
            <DialogActions
                sx={{
                    p: 2,
                    bgcolor: 'var(--muted)',
                    borderTop: '1px solid var(--border)',
                    borderBottomLeftRadius: 'var(--radius-xl)',
                    borderBottomRightRadius: 'var(--radius-xl)',
                }}
            >
                <Button
                    onClick={onClose}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'var(--muted-foreground)',
                        '&:hover': {
                            bgcolor: 'var(--muted)',
                        },
                    }}
                >
                    İptal
                </Button>
                <Button
                    variant="contained"
                    onClick={handleUpdate}
                    disabled={loading}
                    sx={{
                        bgcolor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        borderRadius: 'var(--radius)',
                        '&:hover': {
                            bgcolor: 'color-mix(in srgb, var(--primary) 90%, var(--background))',
                        },
                    }}
                >
                    {loading ? 'Güncelleniyor...' : 'Güncelle'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
