'use client';

import React, { useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, TextField, IconButton, Select, MenuItem, FormControl, InputLabel,
    Autocomplete, Popover, Chip, Checkbox, useTheme, useMediaQuery, InputAdornment
} from '@mui/material';
import { Delete, ToggleOn, ToggleOff, Search } from '@mui/icons-material';
import axios from '@/lib/axios';

// Number input spinner gizleme stili
const numberInputSx = {
    '& input[type=number]': { MozAppearance: 'textfield' },
    '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
    '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
};

export interface Product {
    id: string;
    stokKodu: string;
    stokAdi: string;
    miktar?: number;
    barkod?: string;
    birim?: string;
    kdvOrani?: number;
    satisFiyati?: number;
    alisFiyati?: number;
    unitRef?: {
        unitSet?: {
            units: Array<{
                id: string;
                name: string;
                multiplier: number;
                divisor: number;
            }>;
        };
    };
}

export interface DocumentItem {
    id?: string;
    stokId: string;
    stok?: Product;
    miktar: number;
    birimFiyat: number;
    kdvOrani: number;
    iskontoOran: number;
    iskontoTutar: number;
    cokluIskonto?: boolean;
    iskontoFormula?: string;
    tevkifatKodu?: string;
    tevkifatOrani?: number;
    otvOrani?: number;
    kdvIstisnaNedeni?: string;
    birim?: string;
    isSpecialPrice?: boolean;
    aciklama?: string;
    otvTutar?: number;
}

interface DocumentItemTableProps {
    kalemler: DocumentItem[];
    onChange: (newKalemler: DocumentItem[]) => void;
    stoklar: Product[];
    cariId?: string;
    hideOtvTevkifat?: boolean;
    onSnackbar?: (message: string, severity: 'success' | 'error' | 'info') => void;
    disabled?: boolean;
}

interface MobileItemCardProps {
    kalem: DocumentItem;
    index: number;
    stoklar: Product[];
    handleKalemChange: (index: number, field: keyof DocumentItem, value: any) => void;
    handleRemoveKalem: (index: number) => void;
    disabled?: boolean;
    handleToggleRow: (index: number) => void;
    selectedRows: number[];
    autocompleteOpenStates: Record<number, boolean>;
    setAutocompleteOpenStates: any;
    checkSpecialPrice: (index: number, stokId: string) => Promise<void> | void;
    formatCurrency: (amount: number) => string;
    calculateKalemTotals: (kalem: DocumentItem) => any;
    setCalculatorRowIndex: any;
    setCalculatorExpression: any;
    setCalculatorAnchor: any;
}

const MobileItemCard = ({
    kalem, index, stoklar, handleKalemChange, handleRemoveKalem, handleToggleRow, selectedRows,
    autocompleteOpenStates, setAutocompleteOpenStates, checkSpecialPrice, formatCurrency,
    calculateKalemTotals, setCalculatorRowIndex, setCalculatorExpression, setCalculatorAnchor,
    disabled = false
}: MobileItemCardProps) => {
    const currentStok = stoklar.find(s => s.id === kalem.stokId);
    const availableUnits = currentStok?.unitRef?.unitSet?.units || [];

    return (
        <Paper
            variant="outlined"
            sx={{ p: 1.5, mb: 1.5, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', position: 'relative', bgcolor: 'var(--card)' }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, pb: 1, borderBottom: '1px solid var(--border)' }}>
                <Typography variant="caption" color="var(--muted-foreground)">Satır Toplamı:</Typography>
                <Typography variant="subtitle1" fontWeight="700" color="var(--primary)">{formatCurrency(calculateKalemTotals(kalem).finalAmount)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Autocomplete
                        disabled={disabled}
                        size="small"
                        open={autocompleteOpenStates[index] || false}
                        onOpen={() => setAutocompleteOpenStates((prev: Record<number, boolean>) => ({ ...prev, [index]: true }))}
                        onClose={() => setAutocompleteOpenStates((prev: Record<number, boolean>) => ({ ...prev, [index]: false }))}
                        slotProps={{ popper: { sx: { '& .MuiAutocomplete-paper': { minWidth: 'min(560px, 92vw)' }, '& .MuiAutocomplete-listbox': { minWidth: 'min(560px, 92vw)' } } } }}
                        value={stoklar.find(s => s.id === kalem.stokId) || null}
                        onChange={(_: any, newValue: any) => {
                            handleKalemChange(index, 'stokId', newValue?.id || '');
                            if (newValue?.id) checkSpecialPrice(index, newValue.id);
                            setAutocompleteOpenStates((prev: Record<number, boolean>) => ({ ...prev, [index]: false }));
                        }}
                        options={stoklar}
                        getOptionLabel={(option: any) => `${option.stokKodu} - ${option.stokAdi}`}
                        filterOptions={(options: any[], params: any) => {
                            const { inputValue } = params;
                            if (!inputValue) return options;
                            const lowerInput = inputValue.toLowerCase();
                            return options.filter((option: any) =>
                                option.stokKodu.toLowerCase().includes(lowerInput) ||
                                option.stokAdi.toLowerCase().includes(lowerInput) ||
                                (option.barkod && option.barkod.toLowerCase().includes(lowerInput))
                            );
                        }}
                        renderOption={(props: any, option: any) => {
                            const { key, ...otherProps } = props;
                            let stockColor = 'var(--success)';
                            if (option.miktar !== undefined) {
                                if (option.miktar <= 0) stockColor = 'var(--destructive)';
                                else if (option.miktar < 10) stockColor = 'var(--warning)';
                            }
                            return (
                                <Box component="li" key={key} {...otherProps}>
                                    <Box sx={{ width: '100%' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" fontWeight="600">{option.stokAdi}</Typography>
                                            {option.miktar !== undefined && (
                                                <Chip label={`Stok: ${option.miktar}`} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: `color-mix(in srgb, ${stockColor} 10%, transparent)`, color: stockColor, border: `1px solid ${stockColor}` }} />
                                            )}
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                            <Typography variant="caption" color="text.secondary">Kod: {option.stokKodu}</Typography>
                                            {option.barkod && <Typography variant="caption" color="text.secondary">| Barkod: {option.barkod}</Typography>}
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        }}
                        renderInput={(params: any) => (
                          <TextField
                            {...params}
                            label="Stok / Hizmet"
                            placeholder="Kod veya ad ile ara"
                          />
                        )}
                        isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flexShrink: 0 }}>
                    <Checkbox disabled={disabled} checked={selectedRows.includes(index)} onChange={() => handleToggleRow(index)} size="small" sx={{ ml: 0.5, mt: 0.5 }} />
                    <IconButton disabled={disabled} size="small" color="error" onClick={() => handleRemoveKalem(index)} sx={{ ml: 0.5 }}>
                        <Delete fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
                <TextField disabled={disabled} label="Miktar" type="number" size="small" value={kalem.miktar} onChange={(e: any) => handleKalemChange(index, 'miktar', e.target.value)} inputProps={{ min: 1, style: { height: 44 } }} sx={numberInputSx} />
                <Box sx={{ position: 'relative' }}>
                    <TextField disabled={disabled} label="Birim Fiyat" type="number" size="small" value={kalem.birimFiyat} onChange={(e: any) => handleKalemChange(index, 'birimFiyat', e.target.value)} onKeyDown={(e: any) => { if (['+', '-', '*', '/'].includes(e.key)) { e.preventDefault(); setCalculatorRowIndex(index); setCalculatorExpression(kalem.birimFiyat?.toString() || '0'); setCalculatorAnchor(e.currentTarget); } }} inputProps={{ min: 0, step: 0.01, style: { height: 44 } }} sx={numberInputSx} />
                    <IconButton disabled={disabled} size="small" onClick={(e: any) => { setCalculatorRowIndex(index); setCalculatorExpression(kalem.birimFiyat?.toString() || '0'); setCalculatorAnchor(e.currentTarget); }} sx={{ position: 'absolute', right: 4, top: 4, width: 36, height: 36, bgcolor: 'var(--muted)', '&:hover': { bgcolor: 'var(--primary)' } }}>🧮</IconButton>
                    {kalem.isSpecialPrice && (
                        <Chip label="Özel Fiyat" size="small" color="warning" sx={{ position: 'absolute', top: -12, right: -10, height: 16, fontSize: '0.6rem', fontWeight: 700, zIndex: 1 }} />
                    )}
                </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
                <TextField disabled={disabled} label="KDV %" type="number" size="small" value={kalem.kdvOrani || 0} onChange={(e: any) => handleKalemChange(index, 'kdvOrani', e.target.value)} inputProps={{ style: { height: 44 } }} sx={numberInputSx} />
                <FormControl fullWidth size="small">
                    <InputLabel>Birim</InputLabel>
                    <Select disabled={disabled} value={kalem.birim || ''} onChange={(e: any) => handleKalemChange(index, 'birim', e.target.value)} label="Birim">
                        {availableUnits.length > 0 ? (
                            availableUnits.map((u: any) => (<MenuItem key={u.id} value={u.name}>{u.name}</MenuItem>))
                        ) : (
                            <MenuItem value={kalem.birim || 'ADET'}>{kalem.birim || 'ADET'}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, p: 1, bgcolor: 'var(--muted)', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">Çoklu İskonto</Typography>
                <IconButton disabled={disabled} size="small" onClick={() => handleKalemChange(index, 'cokluIskonto', !kalem.cokluIskonto)} sx={{ color: kalem.cokluIskonto ? 'var(--primary)' : 'var(--muted-foreground)' }}>
                    {kalem.cokluIskonto ? <ToggleOn /> : <ToggleOff />}
                </IconButton>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                {kalem.cokluIskonto ? (
                    <TextField disabled={disabled} label="İskonto Oranı (10+5)" size="small" value={kalem.iskontoFormula || ''} onChange={(e: any) => /^[\d+]*$/.test(e.target.value) && handleKalemChange(index, 'iskontoFormula', e.target.value)} helperText={kalem.iskontoOran > 0 ? `Eff: %${kalem.iskontoOran.toFixed(2)}` : ''} inputProps={{ style: { height: 44 } }} />
                ) : (
                    <TextField disabled={disabled} label="İskonto Oranı %" type="number" size="small" value={kalem.iskontoOran || 0} onChange={(e: any) => handleKalemChange(index, 'iskontoOran', e.target.value)} inputProps={{ style: { height: 44 } }} sx={numberInputSx} />
                )}
                <TextField label="İskonto Tutarı" type="number" size="small" value={kalem.iskontoTutar || 0} onChange={(e: any) => handleKalemChange(index, 'iskontoTutar', e.target.value)} disabled={disabled || kalem.cokluIskonto} inputProps={{ style: { height: 44 } }} sx={numberInputSx} />
            </Box>
        </Paper>
    );
};

export default function DocumentItemTable({
    kalemler,
    onChange,
    stoklar,
    cariId,
    hideOtvTevkifat = true,
    onSnackbar,
    disabled = false
}: DocumentItemTableProps) {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [autocompleteOpenStates, setAutocompleteOpenStates] = useState<Record<number, boolean>>({});
    const [calculatorAnchor, setCalculatorAnchor] = useState<HTMLElement | null>(null);
    const [calculatorRowIndex, setCalculatorRowIndex] = useState<number | null>(null);
    const [calculatorExpression, setCalculatorExpression] = useState('');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(amount);
    };

    const calculateKalemTotals = (kalem: DocumentItem) => {
        const araToplam = kalem.miktar * kalem.birimFiyat;
        const netTutar = araToplam - kalem.iskontoTutar;
        const otvOrani = kalem.otvOrani || 0;
        const kalemOtv = (netTutar * otvOrani) / 100;
        const kdvMatrahi = netTutar + kalemOtv;
        const kdv = (kdvMatrahi * kalem.kdvOrani) / 100;
        const tevkifatOrani = kalem.tevkifatOrani || 0;
        const kalemTevkifat = kdv * tevkifatOrani;

        return {
            araToplam,
            netTutar,
            kalemOtv,
            kdvMatrahi,
            kdv,
            kalemTevkifat,
            finalAmount: netTutar + kalemOtv + kdv - kalemTevkifat
        };
    };

    const calculateMultiDiscount = (baseAmount: number, formula: string) => {
        const discounts = formula.split('+').map(d => parseFloat(d.trim())).filter(d => !isNaN(d) && d > 0);
        if (discounts.length === 0) return { finalAmount: baseAmount, totalDiscount: 0, effectiveRate: 0 };
        let currentAmount = baseAmount;
        let totalDiscount = 0;
        for (const discount of discounts) {
            const discountAmount = (currentAmount * discount) / 100;
            currentAmount -= discountAmount;
            totalDiscount += discountAmount;
        }
        const effectiveRate = baseAmount > 0 ? (totalDiscount / baseAmount) * 100 : 0;
        return { finalAmount: currentAmount, totalDiscount, effectiveRate };
    };

    const handleKalemChange = (index: number, field: keyof DocumentItem, value: any) => {
        const newKalemler = [...kalemler];
        const kalem = { ...newKalemler[index] };

        if (field === 'stokId') {
            const stok = stoklar.find(s => s.id === value);
            if (stok) {
                kalem.stokId = value;
                kalem.birimFiyat = stok.satisFiyati || stok.alisFiyati || 0;
                kalem.kdvOrani = stok.kdvOrani || 20;
                kalem.birim = stok.birim || 'ADET';
            }
        } else if (field === 'cokluIskonto') {
            kalem.cokluIskonto = value;
            if (!value) {
                kalem.iskontoFormula = '';
                const araToplam = kalem.miktar * kalem.birimFiyat;
                kalem.iskontoTutar = (araToplam * kalem.iskontoOran) / 100;
            } else {
                if (kalem.iskontoOran > 0) kalem.iskontoFormula = kalem.iskontoOran.toString();
            }
        } else if (field === 'iskontoFormula') {
            kalem.iskontoFormula = value;
            const araToplam = kalem.miktar * kalem.birimFiyat;
            const result = calculateMultiDiscount(araToplam, value);
            kalem.iskontoTutar = result.totalDiscount;
            kalem.iskontoOran = result.effectiveRate;
        } else if (field === 'iskontoOran') {
            if (kalem.cokluIskonto) {
                kalem.iskontoFormula = value;
                const araToplam = kalem.miktar * kalem.birimFiyat;
                const result = calculateMultiDiscount(araToplam, value);
                kalem.iskontoTutar = result.totalDiscount;
                kalem.iskontoOran = result.effectiveRate;
            } else {
                kalem.iskontoOran = parseFloat(value) || 0;
                const araToplam = kalem.miktar * kalem.birimFiyat;
                kalem.iskontoTutar = (araToplam * kalem.iskontoOran) / 100;
            }
        } else if (field === 'iskontoTutar') {
            if (!kalem.cokluIskonto) {
                kalem.iskontoTutar = parseFloat(value) || 0;
                const araToplam = kalem.miktar * kalem.birimFiyat;
                kalem.iskontoOran = araToplam > 0 ? (kalem.iskontoTutar / araToplam) * 100 : 0;
            }
        } else if (field === 'miktar' || field === 'birimFiyat' || field === 'otvOrani' || field === 'tevkifatOrani' || field === 'kdvOrani') {
            (kalem as any)[field] = parseFloat(value) || 0;
            const araToplam = kalem.miktar * kalem.birimFiyat;
            if (kalem.cokluIskonto && kalem.iskontoFormula) {
                const result = calculateMultiDiscount(araToplam, kalem.iskontoFormula);
                kalem.iskontoTutar = result.totalDiscount;
                kalem.iskontoOran = result.effectiveRate;
            } else {
                kalem.iskontoTutar = (araToplam * kalem.iskontoOran) / 100;
            }
        } else {
            (kalem as any)[field] = value;
        }

        newKalemler[index] = kalem;
        onChange(newKalemler);
    };

    const checkSpecialPrice = async (index: number, stokId: string) => {
        if (!cariId || !stokId) return;
        try {
            const response = await axios.get(`/price-lists/product/${stokId}`, {
                params: { accountId: cariId }
            });
            if (response.data) {
                const newKalemler = [...kalemler];
                const kalem = { ...newKalemler[index] };
                kalem.birimFiyat = Number(response.data.price || response.data.fiyat || 0);
                kalem.isSpecialPrice = true;
                const discountRate = response.data.discountRate !== undefined ? response.data.discountRate : response.data.indirimOrani;
                if (discountRate > 0) {
                    kalem.iskontoOran = Number(discountRate);
                    const araToplam = kalem.miktar * kalem.birimFiyat;
                    kalem.iskontoTutar = (araToplam * kalem.iskontoOran) / 100;
                }
                newKalemler[index] = kalem;
                onChange(newKalemler);
            }
        } catch (error: any) {
            console.error('Özel fiyat kontrolü hatası:', error);
        }
    };

    const handleAddKalem = () => {
        if (disabled) return;
        onChange([...kalemler, {
            stokId: '',
            miktar: 1,
            birimFiyat: 0,
            kdvOrani: 20,
            iskontoOran: 0,
            iskontoTutar: 0,
            cokluIskonto: false,
            birim: 'ADET',
        }]);
    };

    const handleRemoveKalem = (index: number) => {
        if (disabled) return;
        onChange(kalemler.filter((_, i: number) => i !== index));
        setSelectedRows((prev: number[]) => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
    };

    const handleToggleRow = (index: number) => {
        setSelectedRows((prev: number[]) =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const handleToggleAll = (_: any, checked: boolean) => {
        if (checked) {
            setSelectedRows(kalemler.map((_, i) => i));
        } else {
            setSelectedRows([]);
        }
    };

    const handleBulkDelete = () => {
        if (disabled) return;
        const newKalemler = kalemler.filter((_, i: number) => !selectedRows.includes(i));
        onChange(newKalemler);
        setSelectedRows([]);
        if (onSnackbar) onSnackbar('Seçilen kalemler silindi', 'info');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Fatura Kalemleri</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {selectedRows.length > 0 && (
                        <Button variant="outlined" color="error" size="small" startIcon={<Delete />} onClick={handleBulkDelete} disabled={disabled}>
                            Seçilenleri Sil ({selectedRows.length})
                        </Button>
                    )}
                    <Button variant="contained" onClick={handleAddKalem} sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', boxShadow: 'var(--shadow-md)' }} disabled={disabled}>
                        + Satır Ekle
                    </Button>
                </Box>
            </Box>

            {isMobile ? (
                <Box>
                    {kalemler.length === 0 ? (
                        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                            <Typography variant="body2" color="var(--muted-foreground)">Henüz kalem eklenmedi.</Typography>
                        </Paper>
                    ) : (
                        kalemler.map((kalem, index) => (
                            <MobileItemCard
                                key={`mobile-${index}`}
                                disabled={disabled}
                                kalem={kalem}
                                index={index}
                                stoklar={stoklar}
                                handleKalemChange={handleKalemChange}
                                handleRemoveKalem={handleRemoveKalem}
                                handleToggleRow={handleToggleRow}
                                selectedRows={selectedRows}
                                autocompleteOpenStates={autocompleteOpenStates}
                                setAutocompleteOpenStates={setAutocompleteOpenStates}
                                checkSpecialPrice={checkSpecialPrice}
                                formatCurrency={formatCurrency}
                                calculateKalemTotals={calculateKalemTotals}
                                setCalculatorRowIndex={setCalculatorRowIndex}
                                setCalculatorExpression={setCalculatorExpression}
                                setCalculatorAnchor={setCalculatorAnchor}
                            />
                        ))
                    )}
                </Box>
            ) : (
                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400, borderRadius: 'var(--radius)', borderColor: 'var(--border)', bgcolor: 'var(--card)', overflowX: 'auto' }}>
                    <Table stickyHeader size="small" sx={{ minWidth: 1300, tableLayout: 'auto' }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'var(--muted)' }}>
                                <TableCell padding="checkbox" sx={{ width: 50 }}>
                                    <Checkbox disabled={disabled} indeterminate={selectedRows.length > 0 && selectedRows.length < kalemler.length} checked={kalemler.length > 0 && selectedRows.length === kalemler.length} onChange={handleToggleAll} size="small" />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'var(--muted-foreground)', minWidth: 405 }}>Stok Adı / Ürün</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'var(--foreground) !important', minWidth: 120, width: 120 }}>Miktar</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'var(--foreground) !important', minWidth: 120 }}>Birim</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'var(--foreground) !important', minWidth: 170, width: 170 }}>Birim Fiyat</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'var(--foreground) !important', minWidth: 100, width: 100 }}>KDV %</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'var(--foreground) !important', minWidth: 60 }} title="Çoklu İskonto">Ç.İ.</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'var(--foreground) !important', minWidth: 100, width: 100 }}>İsk. Oran %</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'var(--foreground) !important', minWidth: 130, width: 130, px: 0.75 }}>İsk. Tutar</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: 'var(--foreground) !important', minWidth: 110, width: 110, px: 0.75 }}>Toplam</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {kalemler.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>Henüz kalem eklenmedi.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                kalemler.map((kalem, index) => (
                                    <TableRow key={index} hover selected={selectedRows.includes(index)} sx={{ bgcolor: 'var(--background)', '&:hover': { bgcolor: 'var(--muted) !important' }, borderBottom: '1px solid var(--border)' }}>
                                        <TableCell padding="checkbox">
                                            <Checkbox disabled={disabled} checked={selectedRows.includes(index)} onChange={() => handleToggleRow(index)} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            <Autocomplete
                                                disabled={disabled}
                                                size="small"
                                                open={autocompleteOpenStates[index] || false}
                                                onOpen={() => setAutocompleteOpenStates((prev: Record<number, boolean>) => ({ ...prev, [index]: true }))}
                                                onClose={() => setAutocompleteOpenStates((prev: Record<number, boolean>) => ({ ...prev, [index]: false }))}
                                                slotProps={{ popper: { sx: { '& .MuiAutocomplete-paper': { minWidth: 'min(560px, 92vw)' }, '& .MuiAutocomplete-listbox': { minWidth: 'min(560px, 92vw)' } } } }}
                                                value={stoklar.find(s => s.id === kalem.stokId) || null}
                                                onChange={(_: any, newValue: any) => {
                                                    handleKalemChange(index, 'stokId', newValue?.id || '');
                                                    if (newValue?.id) checkSpecialPrice(index, newValue.id);
                                                    setAutocompleteOpenStates((prev: Record<number, boolean>) => ({ ...prev, [index]: false }));
                                                }}
                                                options={stoklar}
                                                getOptionLabel={(option: any) => `${option.stokKodu} - ${option.stokAdi}`}
                                                filterOptions={(options: any[], params: { inputValue: string }) => {
                                                    const { inputValue } = params;
                                                    if (!inputValue) return options;
                                                    const lowerInput = inputValue.toLowerCase();
                                                    return options.filter((option: any) =>
                                                        option.stokKodu.toLowerCase().includes(lowerInput) ||
                                                        option.stokAdi.toLowerCase().includes(lowerInput) ||
                                                        (option.barkod && option.barkod.toLowerCase().includes(lowerInput))
                                                    );
                                                }}
                                                renderOption={(props: any, option: any) => {
                                                    const { key, ...otherProps } = props;
                                                    let stockColor = 'var(--success)';
                                                    if (option.miktar !== undefined) {
                                                        if (option.miktar <= 0) stockColor = 'var(--destructive)';
                                                        else if (option.miktar < 10) stockColor = 'var(--warning)';
                                                    }
                                                    return (
                                                        <Box component="li" key={key} {...otherProps}>
                                                            <Box sx={{ width: '100%' }}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <Typography variant="body2" fontWeight="600">{option.stokAdi}</Typography>
                                                                    {option.miktar !== undefined && (
                                                                        <Chip label={`Stok: ${option.miktar}`} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: `color-mix(in srgb, ${stockColor} 10%, transparent)`, color: stockColor, border: `1px solid ${stockColor}` }} />
                                                                    )}
                                                                </Box>
                                                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                                    <Typography variant="caption" color="text.secondary">Kod: {option.stokKodu}</Typography>
                                                                    {option.barkod && <Typography variant="caption" color="text.secondary">| Barkod: {option.barkod}</Typography>}
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    );
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        className="form-control-textfield"
                                                        placeholder="Stok kodu, adı veya barkod ile ara..."
                                                        onKeyDown={(e: any) => {
                                                            if (e.key === 'Enter' && !autocompleteOpenStates[index]) {
                                                                e.preventDefault();
                                                                handleAddKalem();
                                                            }
                                                        }}
                                                    />
                                                )}
                                                noOptionsText="Stok bulunamadı"
                                                isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 120, width: 120 }}>
                                            <TextField disabled={disabled} fullWidth type="number" size="small" className="form-control-textfield" value={kalem.miktar} onChange={(e: any) => handleKalemChange(index, 'miktar', e.target.value)} onKeyDown={(e: any) => { if (e.key === 'Enter') { e.preventDefault(); handleAddKalem(); } }} inputProps={{ min: 1, step: 1 }} sx={numberInputSx} />
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 120 }}>
                                            <TextField disabled={disabled} fullWidth select size="small" className="form-control-textfield" value={kalem.birim || ''} onChange={(e: any) => handleKalemChange(index, 'birim', e.target.value)} placeholder="Birim">
                                                {(stoklar.find(s => s.id === kalem.stokId)?.unitRef?.unitSet?.units || []).map((u: any) => (
                                                    <MenuItem key={u.id} value={u.name}>{u.name}</MenuItem>
                                                ))}
                                                {!stoklar.find(s => s.id === kalem.stokId)?.unitRef?.unitSet?.units && kalem.birim && (
                                                    <MenuItem value={kalem.birim}>{kalem.birim}</MenuItem>
                                                )}
                                            </TextField>
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 170, width: 170 }}>
                                            <Box sx={{ position: 'relative' }}>
                                                <TextField disabled={disabled} fullWidth type="number" size="small" className="form-control-textfield" value={kalem.birimFiyat} onChange={(e: any) => handleKalemChange(index, 'birimFiyat', e.target.value)} onKeyDown={(e: any) => { if (e.key === 'Enter') { e.preventDefault(); handleAddKalem(); } else if (['+', '-', '*', '/'].includes(e.key)) { e.preventDefault(); setCalculatorRowIndex(index); setCalculatorExpression(kalem.birimFiyat?.toString() || '0'); setCalculatorAnchor(e.currentTarget); } }} inputProps={{ min: 0, step: 0.01 }} sx={numberInputSx} />
                                                <IconButton disabled={disabled} size="small" onClick={(e: any) => { setCalculatorRowIndex(index); setCalculatorExpression(kalem.birimFiyat?.toString() || '0'); setCalculatorAnchor(e.currentTarget); }} sx={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', padding: 0.5, bgcolor: 'var(--muted)', '&:hover': { bgcolor: 'var(--primary)' } }}>🧮</IconButton>
                                                {kalem.isSpecialPrice && (
                                                    <Chip label="Özel Fiyat" size="small" color="warning" sx={{ position: 'absolute', top: -12, right: -10, height: 16, fontSize: '0.6rem', fontWeight: 700, zIndex: 1 }} />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 100, width: 100 }}>
                                            <TextField disabled={disabled} fullWidth type="number" size="small" className="form-control-textfield" value={kalem.kdvOrani || 0} onChange={(e: any) => handleKalemChange(index, 'kdvOrani', e.target.value)} onKeyDown={(e: any) => { if (e.key === 'Enter') { e.preventDefault(); handleAddKalem(); } }} inputProps={{ min: 0, max: 100, step: 1 }} sx={numberInputSx} />
                                        </TableCell>
                                        <TableCell align="center" sx={{ minWidth: 60 }}>
                                            <IconButton disabled={disabled} size="small" onClick={() => handleKalemChange(index, 'cokluIskonto', !kalem.cokluIskonto)} title={kalem.cokluIskonto ? 'Çoklu İskonto: Açık (10+5 formatı)' : 'Çoklu İskonto: Kapalı (Tek oran)'} sx={{ color: kalem.cokluIskonto ? 'var(--chart-2)' : 'var(--muted-foreground)', '&:hover': { bgcolor: kalem.cokluIskonto ? 'color-mix(in srgb, var(--chart-2) 10%, transparent)' : 'var(--muted)', } }}>
                                                {kalem.cokluIskonto ? <ToggleOn fontSize="small" /> : <ToggleOff fontSize="small" />}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 80, width: 80 }}>
                                            {kalem.cokluIskonto ? (
                                                <TextField disabled={disabled} fullWidth size="small" className="form-control-textfield" value={kalem.iskontoFormula || ''} onChange={(e: any) => handleKalemChange(index, 'iskontoFormula', e.target.value)} placeholder="10+5" />
                                            ) : (
                                                <TextField disabled={disabled} fullWidth type="number" size="small" className="form-control-textfield" value={kalem.iskontoOran || 0} onChange={(e: any) => handleKalemChange(index, 'iskontoOran', e.target.value)} inputProps={{ min: 0, max: 100, step: 0.01 }} sx={numberInputSx} />
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 130, width: 130, px: 0.75 }}>
                                            <TextField disabled={disabled} fullWidth type="number" size="small" className="form-control-textfield" value={kalem.iskontoTutar || 0} onChange={(e: any) => handleKalemChange(index, 'iskontoTutar', e.target.value)} inputProps={{ min: 0, step: 0.01 }} sx={numberInputSx} />
                                        </TableCell>
                                        <TableCell align="right" sx={{ minWidth: 110, width: 110, px: 0.75 }}><strong>{formatCurrency(calculateKalemTotals(kalem).finalAmount)}</strong></TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Calculator Popover */}
                    <Popover
                        open={calculatorAnchor !== null && calculatorRowIndex !== null}
                        anchorEl={calculatorAnchor}
                        onClose={() => { setCalculatorAnchor(null); setCalculatorRowIndex(null); setCalculatorExpression(''); }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        <Box sx={{ p: 2, minWidth: 280 }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Hesap Makinesi</Typography>
                            <TextField fullWidth size="small" value={calculatorExpression} onChange={(e: any) => setCalculatorExpression(e.target.value)} onKeyDown={(e: any) => { if (e.key === 'Enter') { e.preventDefault(); try { const result = Function('"use strict"; return (' + calculatorExpression + ')')(); if (typeof result === 'number' && !isNaN(result) && calculatorRowIndex !== null) { handleKalemChange(calculatorRowIndex, 'birimFiyat', result.toString()); setCalculatorAnchor(null); setCalculatorExpression(''); } } catch (error) { console.error('Invalid expression:', error); } } else if (e.key === 'Escape') { setCalculatorAnchor(null); setCalculatorExpression(''); } }} placeholder="Örn: 100+20 veya 50*1.18" autoFocus sx={{ mb: 2 }} />
                            <Typography variant="caption" color="text.secondary">Operatörler: + - * / | Enter: Hesapla | Esc: İptal</Typography>
                        </Box>
                    </Popover>

                </TableContainer>
            )}
        </Box>
    );
}
