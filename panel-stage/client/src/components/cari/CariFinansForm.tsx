import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Paper, Checkbox, FormControlLabel } from '@mui/material';
import { CariFormData } from './types';

interface CariFinansFormProps {
    data: CariFormData;
    onChange: (field: string, value: any) => void;
}

export const CariFinansForm: React.FC<CariFinansFormProps> = ({ data, onChange }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 0.5 }}>
            {/* 1. RİSK VE LİMİT YÖNETİMİ */}
            <Paper variant="outlined" sx={{
                p: 2.5,
                borderRadius: 'var(--radius)',
                bgcolor: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 'var(--shadow-md)',
                    borderColor: 'var(--ring)'
                }
            }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{
                    mb: 2.5,
                    color: 'var(--foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    pb: 1.5,
                    borderBottom: '2px solid var(--border)',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        width: '4px',
                        height: '24px',
                        bgcolor: 'var(--primary)',
                        borderRadius: '2px',
                        mr: 1
                    }
                }}>
                    <span style={{ fontSize: '1.2rem' }}>⚠️</span> Risk ve Limit Yönetimi
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                    <FormControl fullWidth size="small" className="form-control-select">
                        <InputLabel>Risk Durumu</InputLabel>
                        <Select
                            value={data.riskDurumu || 'NORMAL'}
                            label="Risk Durumu"
                            onChange={(e) => onChange('riskDurumu', e.target.value)}
                            sx={{ bgcolor: 'var(--background)' }}
                        >
                            <MenuItem value="NORMAL">✅ Normal (Sorunsuz)</MenuItem>
                            <MenuItem value="RISKLI">⚠️ Riskli (Dikkat Edilmeli)</MenuItem>
                            <MenuItem value="BLOKELI">⛔ Blokeli (İşlem Yapılamaz)</MenuItem>
                            <MenuItem value="TAKIPTE">⚖️ Hukuki Takipte</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth size="small"
                        label="Risk Limiti (TL)"
                        type="number"
                        className="form-control-textfield"
                        value={data.riskLimiti || 0}
                        onChange={(e) => onChange('riskLimiti', Number(e.target.value))}
                        sx={{ bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={data.riskDurdurma || false}
                                onChange={(e) => onChange('riskDurdurma', e.target.checked)}
                            />
                        }
                        label={<Typography variant="body2" fontWeight="medium">Risk Aşımında İşlem Durdur</Typography>}
                    />
                </Box>
            </Paper>

            {/* 2. ÖDEME KOŞULLARI */}
            <Paper variant="outlined" sx={{
                p: 2.5,
                borderRadius: 'var(--radius)',
                bgcolor: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 'var(--shadow-md)',
                    borderColor: 'var(--ring)'
                }
            }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{
                    mb: 2.5,
                    color: 'var(--foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    pb: 1.5,
                    borderBottom: '2px solid var(--border)',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        width: '4px',
                        height: '24px',
                        bgcolor: 'var(--primary)',
                        borderRadius: '2px',
                        mr: 1
                    }
                }}>
                    <span style={{ fontSize: '1.2rem' }}>💳</span> Ödeme Koşulları
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                    <TextField
                        fullWidth size="small"
                        label="Vade Gün"
                        type="number"
                        className="form-control-textfield"
                        value={data.vadeGun || 0}
                        onChange={(e) => onChange('vadeGun', Number(e.target.value))}
                        sx={{ bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                        helperText="Faturalar için otomatik vade hesaplaması"
                    />
                    <TextField
                        fullWidth size="small"
                        label="Fiyat Grubu"
                        className="form-control-textfield"
                        value={data.fiyatGrubu || ''}
                        placeholder="Örn: Toptan, Perakende"
                        onChange={(e) => onChange('fiyatGrubu', e.target.value)}
                        sx={{ bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                    />
                </Box>
            </Paper>

            {/* 3. ÖDEME NOTLARI */}
            <TextField
                fullWidth
                label="Banka Notları / Ödeme Açıklamaları"
                className="form-control-textfield"
                multiline
                rows={3}
                size="small"
                value={data.bankaBilgileri || ''}
                onChange={(e) => onChange('bankaBilgileri', e.target.value)}
                sx={{ bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                placeholder="Örn: X Bankası hesabımıza ödeme yapılacaktır..."
                helperText="Bu notlar fatura altı açıklamalarında veya ödeme planlarında referans olarak kullanılabilir."
            />
        </Box>
    );
};
