import React from 'react';
import { Box, TextField, Button, Typography, IconButton, Paper, Grid, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Add, Delete, AccountBalance } from '@mui/icons-material';
import { CariFormData, CariBanka } from './types';

interface CariBankaFormProps {
    data: CariFormData;
    onChange: (field: string, value: any) => void;
}

export const CariBankaForm: React.FC<CariBankaFormProps> = ({ data, onChange }) => {
    const bankalar = data.tedarikciBankalar || [];

    const handleAddBanka = () => {
        const newBanka: CariBanka = {
            bankaAdi: '',
            subeAdi: '',
            subeKodu: '',
            hesapNo: '',
            iban: '',
            paraBirimi: 'TRY',
            aciklama: ''
        };
        onChange('tedarikciBankalar', [...bankalar, newBanka]);
    };

    const handleRemoveBanka = (index: number) => {
        const newBankalar = bankalar.filter((_, i) => i !== index);
        onChange('tedarikciBankalar', newBankalar);
    };

    const handleUpdateBanka = (index: number, field: keyof CariBanka, value: any) => {
        const newBankalar = [...bankalar];
        newBankalar[index] = { ...newBankalar[index], [field]: value };
        onChange('tedarikciBankalar', newBankalar);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 0.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="var(--primary)">Cari Banka Hesapları</Typography>
                <Button
                    startIcon={<Add />}
                    variant="contained"
                    size="small"
                    onClick={handleAddBanka}
                    sx={{
                        borderRadius: 'var(--radius)',
                        textTransform: 'none',
                        bgcolor: 'var(--primary)',
                        '&:hover': { bgcolor: 'color-mix(in srgb, var(--primary) 80%, var(--background))' }
                    }}
                >
                    Yeni Banka Ekle
                </Button>
            </Box>

            {bankalar.length === 0 && (
                <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderStyle: 'dashed', bgcolor: 'transparent', borderRadius: 'calc(var(--radius) * 1.5)' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <AccountBalance sx={{ fontSize: 48, opacity: 0.2 }} />
                        Henüz banka hesabı eklenmemiş.
                    </Typography>
                </Paper>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {bankalar.map((banka, index) => (
                    <Paper
                        key={index}
                        variant="outlined"
                        sx={{
                            p: 2.5,
                            position: 'relative',
                            borderRadius: 'calc(var(--radius) * 1.5)',
                            bgcolor: 'var(--card)',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-sm)',
                            '&:hover': {
                                bgcolor: 'color-mix(in srgb, var(--primary) 2%, transparent)',
                                border: '1px solid var(--primary)',
                                boxShadow: 'var(--shadow-md)',
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Box sx={{ position: 'absolute', right: 12, top: 12 }}>
                            <IconButton size="small" color="error" onClick={() => handleRemoveBanka(index)} sx={{ bgcolor: 'color-mix(in srgb, var(--destructive) 5%, transparent)', '&:hover': { bgcolor: 'color-mix(in srgb, var(--destructive) 15%, transparent)' } }}>
                                <Delete fontSize="small" />
                            </IconButton>
                        </Box>

                        <Typography variant="subtitle2" sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1, color: 'var(--primary)', fontWeight: 600 }}>
                            <AccountBalance fontSize="small" /> Banka Hesabı #{index + 1}
                        </Typography>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
                            <TextField
                                fullWidth size="small"
                                label="Banka Adı"
                                value={banka.bankaAdi || ''}
                                className="form-control-textfield"
                                onChange={(e) => handleUpdateBanka(index, 'bankaAdi', e.target.value)}
                                sx={{ bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                            />
                            <TextField
                                fullWidth size="small"
                                label="IBAN"
                                value={banka.iban || ''}
                                className="form-control-textfield"
                                onChange={(e) => handleUpdateBanka(index, 'iban', e.target.value.toUpperCase())}
                                placeholder="TR00 0000 0000..."
                                sx={{ bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                            />
                            <FormControl fullWidth size="small" className="form-control-select">
                                <InputLabel>Para Birimi</InputLabel>
                                <Select
                                    value={banka.paraBirimi || 'TRY'}
                                    label="Para Birimi"
                                    onChange={(e) => handleUpdateBanka(index, 'paraBirimi', e.target.value)}
                                    sx={{ bgcolor: 'var(--background)' }}
                                >
                                    <MenuItem value="TRY">TRY - Türk Lirası</MenuItem>
                                    <MenuItem value="USD">USD - Amerikan Doları</MenuItem>
                                    <MenuItem value="EUR">EUR - Euro</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth size="small"
                                label="Şube Adı / Kodu"
                                value={banka.subeAdi || ''}
                                className="form-control-textfield"
                                onChange={(e) => handleUpdateBanka(index, 'subeAdi', e.target.value)}
                                sx={{ bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                            />
                            <TextField
                                fullWidth size="small"
                                label="Hesap No"
                                value={banka.hesapNo || ''}
                                className="form-control-textfield"
                                onChange={(e) => handleUpdateBanka(index, 'hesapNo', e.target.value)}
                                sx={{ bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                            />
                            <TextField
                                fullWidth size="small"
                                label="Açıklama"
                                value={banka.aciklama || ''}
                                className="form-control-textfield"
                                onChange={(e) => handleUpdateBanka(index, 'aciklama', e.target.value)}
                                sx={{ bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                            />
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};
