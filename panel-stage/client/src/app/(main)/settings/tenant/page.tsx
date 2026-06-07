'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Chip,
    Alert,
    Stack,
    TextField,
    Divider,
    Avatar,
    IconButton,
    InputAdornment,
    useTheme,
    Skeleton,
} from '@mui/material';
import {
    Business as BusinessIcon,
    Save as SaveIcon,
    PhotoCamera,
    Refresh,
    VerifiedUser,
    LocationOn,
    Phone,
    Email,
    Language,
    AccessTime,
    AttachMoney,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { useSnackbar } from 'notistack';
import StandardPage from '@/components/common/StandardPage';
import { StandardCard } from '@/components/common';

interface TenantSettings {
    companyName?: string;
    companyType?: string;
    taxNumber?: string;
    taxOffice?: string;
    mersisNo?: string;
    firstName?: string;
    lastName?: string;
    tcNo?: string;
    phone?: string;
    email?: string;
    website?: string;
    country?: string;
    city?: string;
    district?: string;
    neighborhood?: string;
    postalCode?: string;
    address?: string;
    logoUrl?: string;
    timezone?: string;
    locale?: string;
    currency?: string;
}

const TIMEZONES = [
    { value: 'Europe/Istanbul', label: 'Europe/Istanbul (UTC+3)' },
    { value: 'Europe/London', label: 'Europe/London (UTC+0)' },
    { value: 'Europe/Berlin', label: 'Europe/Berlin (UTC+1)' },
    { value: 'America/New_York', label: 'America/New_York (UTC-5)' },
];

const LOCALES = [
    { value: 'tr-TR', label: 'Türkçe (TR)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'de-DE', label: 'Deutsch (DE)' },
];

const CURRENCIES = [
    { value: 'TRY', label: 'Türk Lirası (TRY)' },
    { value: 'USD', label: 'Amerikan Doları (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'İngiliz Sterlini (GBP)' },
];

export default function TenantSettingsPage() {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState<TenantSettings>({
        companyName: '',
        companyType: '',
        taxNumber: '',
        taxOffice: '',
        mersisNo: '',
        firstName: '',
        lastName: '',
        tcNo: '',
        phone: '',
        email: '',
        website: '',
        country: 'Türkiye',
        city: '',
        district: '',
        neighborhood: '',
        postalCode: '',
        address: '',
        logoUrl: '',
        timezone: 'Europe/Istanbul',
        locale: 'tr-TR',
        currency: 'TRY',
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const { data: settings, isLoading } = useQuery<TenantSettings>({
        queryKey: ['tenant-settings'],
        queryFn: async () => {
            const response = await axios.get('/tenants/settings');
            return response.data;
        },
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                companyName: settings.companyName || '',
                companyType: settings.companyType || '',
                taxNumber: settings.taxNumber || '',
                taxOffice: settings.taxOffice || '',
                mersisNo: settings.mersisNo || '',
                firstName: settings.firstName || '',
                lastName: settings.lastName || '',
                tcNo: settings.tcNo || '',
                phone: settings.phone || '',
                email: settings.email || '',
                website: settings.website || '',
                country: settings.country || 'Türkiye',
                city: settings.city || '',
                district: settings.district || '',
                neighborhood: settings.neighborhood || '',
                postalCode: settings.postalCode || '',
                address: settings.address || '',
                logoUrl: settings.logoUrl || '',
                timezone: settings.timezone || 'Europe/Istanbul',
                locale: settings.locale || 'tr-TR',
                currency: settings.currency || 'TRY',
            });
            if (settings.logoUrl) {
                setLogoPreview(settings.logoUrl);
            }
        }
    }, [settings]);

    const updateMutation = useMutation({
        mutationFn: (data: TenantSettings) => axios.put('/tenants/settings', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenant-settings'] });
            enqueueSnackbar('Ayarlar başarıyla kaydedildi', { variant: 'success' });
        },
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Kayıt sırasında hata oluştu', { variant: 'error' });
        },
    });

    const uploadLogoMutation = useMutation({
        mutationFn: (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            return axios.post('/tenants/settings/logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['tenant-settings'] });
            setFormData((prev) => ({ ...prev, logoUrl: response.data.logoUrl || response.data }));
            setLogoFile(null);
            enqueueSnackbar('Logo başarıyla yüklendi', { variant: 'success' });
        },
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Logo yüklenemedi', { variant: 'error' });
        },
    });

    const handleChange = (field: keyof TenantSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSelectChange = (field: keyof TenantSettings) => (event: any) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                enqueueSnackbar('Logo dosyası 2MB\'dan küçük olmalıdır', { variant: 'warning' });
                return;
            }
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = () => {
        updateMutation.mutate(formData);
    };

    const handleLogoUpload = () => {
        if (logoFile) {
            uploadLogoMutation.mutate(logoFile);
        }
    };

    if (isLoading) {
        return (
            <StandardPage title="Firma Ayarları" breadcrumbs={[{ label: 'Ayarlar', href: '/settings' }, { label: 'Firma Bilgileri' }]}>
                <Stack spacing={3}>
                    <Skeleton variant="rounded" height={200} sx={{ borderRadius: 4 }} />
                    <Skeleton variant="rounded" height={300} sx={{ borderRadius: 4 }} />
                </Stack>
            </StandardPage>
        );
    }

    return (
        <StandardPage
            title="Firma Ayarları"
            breadcrumbs={[
                { label: 'Ayarlar', href: '/settings' },
                { label: 'Firma Bilgileri' },
            ]}
            headerActions={
                <Stack direction="row" spacing={2}>
                    {logoFile && (
                        <Button
                            variant="outlined"
                            startIcon={<PhotoCamera />}
                            onClick={handleLogoUpload}
                            disabled={uploadLogoMutation.isPending}
                            sx={{ fontWeight: 700, borderRadius: 3 }}
                        >
                            {uploadLogoMutation.isPending ? 'Yükleniyor...' : 'Logoyu Yükle'}
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        startIcon={updateMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        sx={{ fontWeight: 800, borderRadius: 3, px: 4 }}
                    >
                        {updateMutation.isPending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </Button>
                </Stack>
            }
        >
            <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 800 }}>
                    Firma bilgilerinizi ve tercihlerinizi buradan güncelleyin. Bu bilgiler fatura ve belgelerde kullanılacaktır.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Left Column */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Stack spacing={4}>
                        {/* Logo Card */}
                        <StandardCard>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BusinessIcon color="primary" fontSize="small" />
                                Firma Logosu
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        src={logoPreview || undefined}
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            borderRadius: 3,
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            border: '2px dashed',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <BusinessIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                                    </Avatar>
                                    <IconButton
                                        component="label"
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                            '&:hover': { bgcolor: 'primary.dark' },
                                        }}
                                    >
                                        <PhotoCamera fontSize="small" />
                                        <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
                                    </IconButton>
                                </Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                                    PNG, JPG veya SVG. Max 2MB.
                                </Typography>
                                {logoFile && (
                                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                                        Yeni logo seçildi. Kaydet butonuna basın.
                                    </Alert>
                                )}
                            </Box>
                        </StandardCard>

                        {/* Quick Info */}
                        <StandardCard>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VerifiedUser color="primary" fontSize="small" />
                                Hızlı Bilgiler
                            </Typography>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Language sx={{ fontSize: 18, color: 'text.secondary' }} />
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Ülke:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{formData.country}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Saat Dilimi:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{TIMEZONES.find(t => t.value === formData.timezone)?.label}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AttachMoney sx={{ fontSize: 18, color: 'text.secondary' }} />
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Para Birimi:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{CURRENCIES.find(c => c.value === formData.currency)?.label}</Typography>
                                </Box>
                            </Stack>
                        </StandardCard>
                    </Stack>
                </Grid>

                {/* Right Column */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Stack spacing={4}>
                        {/* Company Info */}
                        <StandardCard>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 3 }}>
                                Firma Kimlik Bilgileri
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Firma Adı"
                                        fullWidth
                                        value={formData.companyName}
                                        onChange={handleChange('companyName')}
                                        placeholder="Örn: ABC Ticaret A.Ş."
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><BusinessIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Firma Türü"
                                        fullWidth
                                        value={formData.companyType}
                                        onChange={handleChange('companyType')}
                                        placeholder="Örn: Anonim Şirketi"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Vergi Numarası"
                                        fullWidth
                                        value={formData.taxNumber}
                                        onChange={handleChange('taxNumber')}
                                        placeholder="Örn: 1234567890"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Vergi Dairesi"
                                        fullWidth
                                        value={formData.taxOffice}
                                        onChange={handleChange('taxOffice')}
                                        placeholder="Örn: Kadıköy VD."
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="MERSİS No"
                                        fullWidth
                                        value={formData.mersisNo}
                                        onChange={handleChange('mersisNo')}
                                        placeholder="Örn: 1234567890123456"
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>

                        {/* Contact Info */}
                        <StandardCard>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 3 }}>
                                İletişim Bilgileri
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Yetkili Ad"
                                        fullWidth
                                        value={formData.firstName}
                                        onChange={handleChange('firstName')}
                                        placeholder="Örn: Ahmet"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Yetkili Soyad"
                                        fullWidth
                                        value={formData.lastName}
                                        onChange={handleChange('lastName')}
                                        placeholder="Örn: Yılmaz"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="TC Kimlik No"
                                        fullWidth
                                        value={formData.tcNo}
                                        onChange={handleChange('tcNo')}
                                        placeholder="Örn: 12345678901"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Telefon"
                                        fullWidth
                                        value={formData.phone}
                                        onChange={handleChange('phone')}
                                        placeholder="Örn: 0212 123 45 67"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><Phone sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="E-posta"
                                        fullWidth
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange('email')}
                                        placeholder="Örn: info@firm.com"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Web Sitesi"
                                        fullWidth
                                        value={formData.website}
                                        onChange={handleChange('website')}
                                        placeholder="Örn: https://firm.com"
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>

                        {/* Address Info */}
                        <StandardCard>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn color="primary" fontSize="small" />
                                Adres Bilgileri
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        label="Ülke"
                                        fullWidth
                                        value={formData.country}
                                        onChange={handleChange('country')}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        label="Şehir"
                                        fullWidth
                                        value={formData.city}
                                        onChange={handleChange('city')}
                                        placeholder="Örn: İstanbul"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        label="İlçe"
                                        fullWidth
                                        value={formData.district}
                                        onChange={handleChange('district')}
                                        placeholder="Örn: Kadıköy"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Mahalle"
                                        fullWidth
                                        value={formData.neighborhood}
                                        onChange={handleChange('neighborhood')}
                                        placeholder="Örn: Caferağa"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Posta Kodu"
                                        fullWidth
                                        value={formData.postalCode}
                                        onChange={handleChange('postalCode')}
                                        placeholder="Örn: 34710"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        label="Adres"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={formData.address}
                                        onChange={handleChange('address')}
                                        placeholder="Örn: Moda Cad. No: 123 D: 4"
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>

                        {/* Regional Settings */}
                        <StandardCard>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 3 }}>
                                Bölge ve Dil Ayarları
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        select
                                        label="Saat Dilimi"
                                        fullWidth
                                        value={formData.timezone}
                                        onChange={handleSelectChange('timezone')}
                                        SelectProps={{ native: true }}
                                    >
                                        {TIMEZONES.map((tz) => (
                                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        select
                                        label="Dil"
                                        fullWidth
                                        value={formData.locale}
                                        onChange={handleSelectChange('locale')}
                                        SelectProps={{ native: true }}
                                    >
                                        {LOCALES.map((loc) => (
                                            <option key={loc.value} value={loc.value}>{loc.label}</option>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        select
                                        label="Para Birimi"
                                        fullWidth
                                        value={formData.currency}
                                        onChange={handleSelectChange('currency')}
                                        SelectProps={{ native: true }}
                                    >
                                        {CURRENCIES.map((cur) => (
                                            <option key={cur.value} value={cur.value}>{cur.label}</option>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Stack>
                </Grid>
            </Grid>
        </StandardPage>
    );
}
