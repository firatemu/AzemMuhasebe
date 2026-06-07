import React from 'react';
import { Box, TextField, Button, Typography, IconButton, Paper, Checkbox, FormControlLabel, Grid, Divider } from '@mui/material';
import { Add, Delete, Person } from '@mui/icons-material';
import { CariFormData, CariYetkili } from './types';

interface CariIletisimFormProps {
    data: CariFormData;
    onChange: (field: string, value: any) => void;
}

export const CariIletisimForm: React.FC<CariIletisimFormProps> = ({ data, onChange }) => {
    const yetkililer = data.yetkililer || [];

    const handleAddKeykili = () => {
        const newYetkili: CariYetkili = {
            adSoyad: '',
            unvan: '',
            telefon: '',
            email: '',
            dahili: '',
            varsayilan: false,
            notlar: ''
        };
        onChange('yetkililer', [...yetkililer, newYetkili]);
    };

    const handleRemoveYetkili = (index: number) => {
        const newYetkililer = yetkililer.filter((_, i) => i !== index);
        onChange('yetkililer', newYetkililer);
    };

    const handleUpdateYetkili = (index: number, field: keyof CariYetkili, value: any) => {
        const newYetkililer = [...yetkililer];
        newYetkililer[index] = { ...newYetkililer[index], [field]: value };
        onChange('yetkililer', newYetkililer);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 0.5 }}>
            {/* 1. ANA İLETİŞİM BİLGİLERİ */}
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
                    <span style={{ fontSize: '1.2rem' }}>📞</span> Ana İletişim Bilgileri
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                    <TextField
                        fullWidth size="small"
                        label="Yetkili Kişi (Ana)"
                        className="form-control-textfield"
                        value={data.yetkili || ''}
                        onChange={(e) => onChange('yetkili', e.target.value)}
                        sx={{ bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                    />
                    <TextField
                        fullWidth size="small"
                        label="Telefon (Ana)"
                        className="form-control-textfield"
                        value={data.telefon || ''}
                        onChange={(e) => onChange('telefon', e.target.value)}
                        sx={{ bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                    />
                    <TextField
                        fullWidth size="small"
                        label="Email (Ana)"
                        className="form-control-textfield"
                        type="email"
                        value={data.email || ''}
                        onChange={(e) => onChange('email', e.target.value)}
                        sx={{ bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                    />
                    <TextField
                        fullWidth size="small"
                        label="Web Sitesi"
                        className="form-control-textfield"
                        value={data.webSite || ''}
                        onChange={(e) => onChange('webSite', e.target.value)}
                        sx={{ bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                    />
                    <TextField
                        fullWidth size="small"
                        label="Faks"
                        className="form-control-textfield"
                        value={data.faks || ''}
                        onChange={(e) => onChange('faks', e.target.value)}
                        sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' }, bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                    />
                </Box>
            </Paper>

            <Divider />

            {/* 2. EK YETKİLİLER */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="var(--primary)">Ek Yetkililer / Kontak Kişileri</Typography>
                <Button
                    startIcon={<Add />}
                    variant="contained"
                    size="small"
                    onClick={handleAddKeykili}
                    sx={{
                        borderRadius: 'var(--radius)',
                        textTransform: 'none',
                        bgcolor: 'var(--primary)',
                        '&:hover': { bgcolor: 'color-mix(in srgb, var(--primary) 80%, var(--background))' }
                    }}
                >
                    Yeni Kişi Ekle
                </Button>
            </Box>

            {yetkililer.length === 0 && (
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed', bgcolor: 'transparent', borderRadius: 'calc(var(--radius) * 1.5)' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Henüz ek yetkili veya kontak kişisi eklenmemiş.
                    </Typography>
                </Paper>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {yetkililer.map((yetkili, index) => (
                    <Paper key={index} variant="outlined" sx={{
                        p: 2.5,
                        position: 'relative',
                        borderRadius: 'calc(var(--radius) * 1.5)',
                        bgcolor: 'var(--card)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            bgcolor: 'color-mix(in srgb, var(--primary) 2%, transparent)',
                            border: '1px solid var(--primary)',
                            boxShadow: 'var(--shadow-md)',
                            transform: 'translateY(-2px)'
                        }
                    }}>
                        <Box sx={{ position: 'absolute', right: 12, top: 12 }}>
                            <IconButton size="small" color="error" onClick={() => handleRemoveYetkili(index)} sx={{ bgcolor: 'color-mix(in srgb, var(--destructive) 5%, transparent)', '&:hover': { bgcolor: 'color-mix(in srgb, var(--destructive) 15%, transparent)' } }}>
                                <Delete fontSize="small" />
                            </IconButton>
                        </Box>

                        <Typography variant="subtitle2" sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1, color: 'var(--muted-foreground)' }}>
                            <Person fontSize="small" /> Ek Kişi #{index + 1}
                        </Typography>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(6, 1fr)' }, gap: 2.5 }}>
                            <TextField
                                fullWidth size="small"
                                label="Ad Soyad"
                                value={yetkili.adSoyad || ''}
                                className="form-control-textfield"
                                onChange={(e) => handleUpdateYetkili(index, 'adSoyad', e.target.value)}
                                sx={{ gridColumn: { xs: 'span 1', sm: 'span 3' } }}
                            />
                            <TextField
                                fullWidth size="small"
                                label="Ünvan / Görev"
                                value={yetkili.unvan || ''}
                                className="form-control-textfield"
                                onChange={(e) => handleUpdateYetkili(index, 'unvan', e.target.value)}
                                sx={{ gridColumn: { xs: 'span 1', sm: 'span 3' } }}
                            />
                            <TextField
                                fullWidth size="small"
                                label="Telefon"
                                value={yetkili.telefon || ''}
                                className="form-control-textfield"
                                onChange={(e) => handleUpdateYetkili(index, 'telefon', e.target.value)}
                                sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
                            />
                            <TextField
                                fullWidth size="small"
                                label="Email"
                                value={yetkili.email || ''}
                                className="form-control-textfield"
                                onChange={(e) => handleUpdateYetkili(index, 'email', e.target.value)}
                                sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
                            />
                            <TextField
                                fullWidth size="small"
                                label="Notlar"
                                className="form-control-textfield"
                                value={yetkili.notlar || ''}
                                onChange={(e) => handleUpdateYetkili(index, 'notlar', e.target.value)}
                                sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
                            />
                            <Box sx={{ gridColumn: '1 / -1', mt: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={yetkili.varsayilan}
                                            onChange={(e) => handleUpdateYetkili(index, 'varsayilan', e.target.checked)}
                                        />
                                    }
                                    label={<Typography variant="body2">Varsayılan Kontak</Typography>}
                                />
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};
