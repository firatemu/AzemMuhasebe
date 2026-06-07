'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem,
    Autocomplete,
    CircularProgress,
    Box,
    Typography,
    Divider,
    FormControlLabel,
    Switch,
    Paper,
    IconButton,
    InputAdornment,
    Stack,
} from '@mui/material';
import { Close, Inventory2Outlined, PaidOutlined, EventOutlined, TuneOutlined, NotesOutlined } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { PriceType, PriceCardStatus, ICreatePriceCardRequest } from '@/types/priceCard';
import { priceCardApi } from '@/services/api/priceCardApi';
import axios from '@/lib/axios';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/formatters';

const ModalSection = ({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) => (
    <Box
        sx={{
            p: 2,
            borderRadius: 'var(--radius)',
            bgcolor: 'var(--card)',
            border: '1px solid var(--border)',
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center' }}>
                {icon}
            </Box>
            <Typography
                variant="caption"
                sx={{
                    color: 'var(--muted-foreground)',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                }}
            >
                {title}
            </Typography>
        </Box>
        {children}
    </Box>
);

interface Props {
    open: boolean;
    cardId?: string | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddEditPriceCardModal({ open, cardId, onClose, onSuccess }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [productLoading, setProductLoading] = useState(false);

    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ICreatePriceCardRequest>({
        defaultValues: {
            productId: '',
            salePrice: 0,
            vatRate: 20,
            currency: 'TRY',
            effectiveFrom: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
            effectiveTo: null,
            priceType: PriceType.SALE,
            status: PriceCardStatus.ACTIVE,
            minQuantity: 1,
            notes: '',
            priceIncludesVat: false,
        }
    });

    const watchPriceType = watch('priceType');
    const watchProductId = watch('productId');
    const watchSalePrice = Number(watch('salePrice') || 0);
    const watchVatRate = Number(watch('vatRate') || 20);
    const watchPriceIncludesVat = watch('priceIncludesVat');

    const calculatedPriceWithoutVat = useMemo(() => {
        if (!watchSalePrice) return 0;
        if (!watchVatRate) return watchSalePrice;
        if (!watchPriceIncludesVat) return watchSalePrice;
        return watchSalePrice / (1 + watchVatRate / 100);
    }, [watchSalePrice, watchVatRate, watchPriceIncludesVat]);

    const calculatedVatAmount = useMemo(() => {
        if (!watchVatRate) return 0;
        return (calculatedPriceWithoutVat * watchVatRate) / 100;
    }, [calculatedPriceWithoutVat, watchVatRate]);

    const trTryFormatter = useMemo(
        () =>
            new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
        []
    );

    const formatTry = (value: number) => {
        if (!Number.isFinite(value)) return trTryFormatter.format(0);
        return trTryFormatter.format(value);
    };

    const formattedNet = useMemo(() => formatTry(calculatedPriceWithoutVat), [calculatedPriceWithoutVat]);
    const formattedVat = useMemo(() => formatTry(calculatedVatAmount), [calculatedVatAmount]);
    const formattedTotal = useMemo(() => formatTry(calculatedPriceWithoutVat + calculatedVatAmount), [calculatedPriceWithoutVat, calculatedVatAmount]);


    const searchProducts = async (query: string = '') => {
        // Authentication kontrolü
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.warn('AddEditPriceCardModal: Authentication token bulunamadı, atlanıyor');
                setProducts([]);
                setProductLoading(false);
                return;
            }
        }

        setProductLoading(true);
        try {
            const response = await axios.get('/products', { params: { search: query, limit: 10 } });
            setProducts(response.data?.data || []);
        } catch (error) {
            console.error('Ürün arama hatası:', error);
        } finally {
            setProductLoading(false);
        }
    };

    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const debouncedSearch = (value: string) => {
        if (timer) clearTimeout(timer);
        const newTimer = setTimeout(() => {
            if (value.length >= 2 || value === '') searchProducts(value);
        }, 500);
        setTimer(newTimer);
    };


    useEffect(() => {
        if (cardId && open) {
            const fetchDetail = async () => {
                setLoading(true);
                try {
                    const data = await priceCardApi.getById(cardId);
                    reset({
                        productId: data.productId,
                        salePrice: Number(data.salePrice),
                        vatRate: Number(data.vatRate),
                        currency: data.currency,
                        effectiveFrom: format(new Date(data.effectiveFrom), "yyyy-MM-dd'T'HH:mm"),
                        effectiveTo: data.effectiveTo ? format(new Date(data.effectiveTo), "yyyy-MM-dd'T'HH:mm") : null,
                        priceType: data.priceType,
                        status: data.status,
                        minQuantity: Number(data.minQuantity),
                        notes: data.notes || '',
                        priceIncludesVat: false,
                    });
                    if (data.product) setProducts([data.product]);
                } catch (error) {
                    enqueueSnackbar('Detay getirilirken hata oluştu', { variant: 'error' });
                } finally {
                    setLoading(false);
                }
            };
            fetchDetail();
        } else if (open) {
            reset({
                productId: '', salePrice: 0, vatRate: 20, currency: 'TRY',
                effectiveFrom: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
                priceType: PriceType.SALE, status: PriceCardStatus.ACTIVE, minQuantity: 1,
                priceIncludesVat: false,
            });
            searchProducts('');
        }
    }, [cardId, open, reset, enqueueSnackbar]);

    const onSubmit = async (data: ICreatePriceCardRequest) => {
        setLoading(true);
        try {
            const payload = { ...data, salePrice: calculatedPriceWithoutVat };
            if (cardId) await priceCardApi.update(cardId, payload);
            else await priceCardApi.create(payload);
            enqueueSnackbar(cardId ? 'Fiyat kartı güncellendi' : 'Fiyat kartı oluşturuldu', { variant: 'success' });
            // Kaydetme başarılıysa modalı kapat
            onClose();
            onSuccess();
        } catch (error: any) {
            enqueueSnackbar('Hata: ' + error.message, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const miniInputSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            bgcolor: 'var(--card)',
            '& fieldset': { borderColor: 'var(--border)' },
            '&:hover fieldset': { borderColor: 'color-mix(in srgb, var(--border) 70%, var(--foreground))' },
        },
    };

    return (
        <Dialog
            open={open}
            // Sadece X iconu ile kapanmalı:
            // - Backdrop'a tıklayınca kapanmasın
            // - ESC ile kapanmasın
            onClose={(_, reason) => {
                if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
                onClose();
            }}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 'var(--radius)', bgcolor: 'var(--background)', maxHeight: '90dvh' } }}
        >
            {/* Minimal header (no visual noise) */}
            <Box
                sx={{
                    px: 2,
                    py: 1.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border)',
                    bgcolor: 'var(--card)',
                }}
            >
                <Box>
                    <Typography variant="subtitle1" fontWeight={900} sx={{ lineHeight: 1.2 }}>
                        {cardId ? 'Fiyat Kartını Düzenle' : 'Yeni Fiyat Kartı Tanımla'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                        Ürün bazlı fiyatlandırma ve geçerlilik aralığı
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: 'var(--muted-foreground)' }}>
                    <Close fontSize="small" />
                </IconButton>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Single scroll region (if unavoidable) */}
                <DialogContent sx={{ p: 2, overflowY: 'auto' }}>
                    <Grid container spacing={2}>
                        {/* Sol Sütun */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={2}>
                                {/* Ürün Seçimi */}
                                <ModalSection title="Ürün" icon={<Inventory2Outlined fontSize="small" />}>
                                    <Controller
                                        name="productId"
                                        control={control}
                                        rules={{ required: 'Ürün seçimi zorunludur' }}
                                        render={({ field }) => (
                                            <Autocomplete
                                                options={products}
                                                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                                                loading={productLoading}
                                                value={products.find(p => p.id === field.value) || null}
                                                onInputChange={(_, val, reason) => reason === 'input' && debouncedSearch(val)}
                                                onChange={(_, newVal) => {
                                                    field.onChange(newVal ? newVal.id : '');
                                                }}
                                                renderInput={(p) => (
                                                    <TextField
                                                        {...p}
                                                        size="small"
                                                        placeholder="Kod, isim veya barkod ile ara..."
                                                        error={!!errors.productId}
                                                        sx={miniInputSx}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </ModalSection>

                                {/* Fiyat Bilgileri */}
                                <ModalSection title="Fiyat" icon={<PaidOutlined fontSize="small" />}>
                                    <Stack spacing={1.25}>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            <Controller name="priceType" control={control} render={({ field }) => (
                                                <TextField {...field} select size="small" label="Tip" sx={{ ...miniInputSx, flex: 1, minWidth: 180 }}>
                                                    <MenuItem value={PriceType.SALE}>Satış</MenuItem>
                                                    <MenuItem value={PriceType.CAMPAIGN}>Kampanya</MenuItem>
                                                </TextField>
                                            )} />
                                            <Controller name="currency" control={control} render={({ field }) => (
                                                <TextField {...field} select size="small" label="Döviz" sx={{ ...miniInputSx, width: 110 }}>
                                                    <MenuItem value="TRY">TRY</MenuItem>
                                                    <MenuItem value="USD">USD</MenuItem>
                                                    <MenuItem value="EUR">EUR</MenuItem>
                                                </TextField>
                                            )} />
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                            <Controller
                                                name="vatRate"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        type="number"
                                                        size="small"
                                                        label="KDV %"
                                                        sx={{ ...miniInputSx, width: 110 }}
                                                        inputProps={{ min: 0, step: 1 }}
                                                        onChange={(e) => {
                                                            const next = e.target.value === '' ? 0 : Number(e.target.value);
                                                            field.onChange(Number.isFinite(next) ? next : 0);
                                                        }}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="salePrice"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        type="text"
                                                        size="small"
                                                        label="Birim Tutar"
                                                        sx={{ ...miniInputSx, flex: 1 }}
                                                        inputProps={{ inputMode: 'decimal', pattern: '[0-9]*([.,][0-9]*)?' }}
                                                        value={typeof field.value === 'number' ? String(field.value) : (field.value ?? '')}
                                                        onChange={(e) => {
                                                            // MUI "number" input bazı tarayıcılarda caret/odak davranışını bozabiliyor.
                                                            // Bu yüzden string tutup virgülü noktaya çeviriyoruz.
                                                            const raw = e.target.value;
                                                            const normalized = raw.replace(',', '.');
                                                            field.onChange(normalized);
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <Controller name="priceIncludesVat" control={control} render={({ field: f }) => (
                                                                        <FormControlLabel
                                                                            control={<Switch {...f} checked={f.value} size="small" />}
                                                                            label="Dahil"
                                                                            labelPlacement="start"
                                                                            sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
                                                                        />
                                                                    )} />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Box>
                                    </Stack>
                                </ModalSection>
                            </Stack>
                        </Grid>

                        {/* Sağ Sütun */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={2}>
                                {/* Geçerlilik Tarihi */}
                                <ModalSection title="Geçerlilik" icon={<EventOutlined fontSize="small" />}>
                                    <Stack spacing={1}>
                                        <Controller name="effectiveFrom" control={control} render={({ field }) => (
                                            <TextField {...field} size="small" type="datetime-local" label="Başlangıç" InputLabelProps={{ shrink: true }} sx={miniInputSx} value={field.value || ''} />
                                        )} />
                                        <Controller name="effectiveTo" control={control} render={({ field }) => (
                                            <TextField {...field} size="small" type="datetime-local" label="Bitiş" InputLabelProps={{ shrink: true }} sx={miniInputSx} value={field.value || ''} />
                                        )} />
                                    </Stack>
                                </ModalSection>

                                {/* Diğer Bilgiler */}
                                <ModalSection title="Ayarlar" icon={<TuneOutlined fontSize="small" />}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Controller name="status" control={control} render={({ field }) => (
                                            <TextField {...field} select size="small" label="Durum" sx={{ ...miniInputSx, flex: 1 }}>
                                                <MenuItem value={PriceCardStatus.ACTIVE}>Aktif</MenuItem>
                                                <MenuItem value={PriceCardStatus.PASSIVE}>Pasif</MenuItem>
                                            </TextField>
                                        )} />
                                        <Controller name="minQuantity" control={control} render={({ field }) => (
                                            <TextField {...field} type="number" size="small" label="Min. Miktar" sx={{ ...miniInputSx, width: '120px' }} />
                                        )} />
                                    </Box>
                                </ModalSection>

                                {/* Özet (her zaman görünür; hızlı input için mount/unmount yapmıyoruz) */}
                                <Box
                                    sx={{
                                        p: 1.5,
                                        bgcolor: 'var(--muted)',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--border)',
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        textAlign: 'center',
                                        flexWrap: 'wrap',
                                        gap: 1,
                                    }}
                                >
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Net
                                        </Typography>
                                        <Typography variant="body2" fontWeight={700} color="success.main">
                                            {formattedNet}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            KDV
                                        </Typography>
                                        <Typography variant="body2" fontWeight={700} color="warning.main">
                                            {formattedVat}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ px: 1, bgcolor: 'color-mix(in srgb, var(--border) 55%, transparent)', borderRadius: 1 }}>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Toplam
                                        </Typography>
                                        <Typography variant="body2" fontWeight={800}>
                                            {formattedTotal}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Notlar */}
                                <ModalSection title="Notlar" icon={<NotesOutlined fontSize="small" />}>
                                    <Controller name="notes" control={control} render={({ field }) => (
                                        <TextField {...field} size="small" multiline rows={2} placeholder="Not ekleyin..." sx={miniInputSx} />
                                    )} />
                                </ModalSection>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 2, bgcolor: 'var(--card)', borderTop: '1px solid var(--border)' }}>
                    <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 600 }}>Vazgeç</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            px: 5, py: 1.2, borderRadius: '10px', fontWeight: 700,
                            bgcolor: 'var(--primary)',
                            color: 'var(--primary-foreground)',
                            '&:hover': { bgcolor: 'var(--primary-hover)' },
                            textTransform: 'none',
                            boxShadow: 'none'
                        }}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : (cardId ? 'Değişiklikleri Kaydet' : 'Fiyatı Tanımla')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}