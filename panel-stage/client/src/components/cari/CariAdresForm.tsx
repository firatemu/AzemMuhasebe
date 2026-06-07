import React from 'react';
import { Box, TextField, Button, Typography, IconButton, Paper, FormControl, InputLabel, Select, MenuItem, Grid, Checkbox, FormControlLabel, Divider } from '@mui/material';
import { Add, Delete, LocationOn } from '@mui/icons-material';
import { CariFormData, CariAdres } from './types';
import { cities } from '@/lib/cities';

interface CariAdresFormProps {
    data: CariFormData;
    onChange: (field: string, value: any) => void;
    onCityChange: (city: string) => void;
    availableDistricts: string[];
}

export const CariAdresForm: React.FC<CariAdresFormProps> = ({ data, onChange, onCityChange, availableDistricts }) => {
    const ekAdresler = data.ekAdresler || [];

    const handleAddAdres = () => {
        const newAdres: CariAdres = {
            baslik: '',
            tip: 'SEVK',
            adres: '',
            il: 'İstanbul',
            ilce: 'Merkez',
            postaKodu: '',
            varsayilan: false
        };
        onChange('ekAdresler', [...ekAdresler, newAdres]);
    };

    const handleRemoveAdres = (index: number) => {
        const newAdresler = ekAdresler.filter((_, i) => i !== index);
        onChange('ekAdresler', newAdresler);
    };

    const handleUpdateAdres = (index: number, field: keyof CariAdres, value: any) => {
        const newAdresler = [...ekAdresler];
        newAdresler[index] = { ...newAdresler[index], [field]: value };
        onChange('ekAdresler', newAdresler);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 0.5 }}>
            {/* 1. MERKEZ ADRES BİLGİLERİ */}
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
                    <span style={{ fontSize: '1.2rem' }}>📍</span> Merkez Adres Bilgileri
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                    <FormControl fullWidth size="small" className="form-control-select">
                        <InputLabel>İl</InputLabel>
                        <Select
                            value={data.il || 'İstanbul'}
                            label="İl"
                            onChange={(e) => onCityChange(e.target.value)}
                            sx={{ bgcolor: 'var(--background)' }}
                        >
                            {cities.map(city => (
                                <MenuItem key={city} value={city}>{city}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small" className="form-control-select">
                        <InputLabel>İlçe</InputLabel>
                        <Select
                            value={data.ilce || ''}
                            label="İlçe"
                            onChange={(e) => onChange('ilce', e.target.value)}
                            sx={{ bgcolor: 'var(--background)' }}
                        >
                            {availableDistricts.map(district => (
                                <MenuItem key={district} value={district}>{district}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Adres Detayı"
                        multiline rows={2}
                        value={data.adres || ''}
                        className="form-control-textfield"
                        onChange={(e) => onChange('adres', e.target.value)}
                        sx={{ gridColumn: '1 / -1', bgcolor: 'var(--background)', borderRadius: 'var(--radius)' }}
                    />
                </Box>
            </Paper>

            <Divider />

            {/* 2. EK ADRESLER (SEVK/FATURA) */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="var(--primary)" sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&::before': {
                        content: '""',
                        width: '4px',
                        height: '20px',
                        bgcolor: 'var(--primary)',
                        borderRadius: '2px',
                        mr: 1
                    }
                }}>
                    Ek Adresler (Şube / Sevk)
                </Typography>
                <Button
                    startIcon={<Add />}
                    variant="contained"
                    size="small"
                    onClick={handleAddAdres}
                    sx={{
                        borderRadius: 'var(--radius)',
                        textTransform: 'none',
                        bgcolor: 'var(--primary)',
                        '&:hover': { bgcolor: 'color-mix(in srgb, var(--primary) 80%, var(--background))' }
                    }}
                >
                    Yeni Adres Ekle
                </Button>
            </Box>

            {ekAdresler.length === 0 && (
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed', bgcolor: 'transparent', borderRadius: 'calc(var(--radius) * 1.5)' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Henüz ek sevk veya şube adresi eklenmemiş.
                    </Typography>
                </Paper>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {ekAdresler.map((adres, index) => (
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
                            <IconButton size="small" color="error" onClick={() => handleRemoveAdres(index)} sx={{ bgcolor: 'color-mix(in srgb, var(--destructive) 5%, transparent)', '&:hover': { bgcolor: 'color-mix(in srgb, var(--destructive) 15%, transparent)' } }}>
                                <Delete fontSize="small" />
                            </IconButton>
                        </Box>

                        <Typography variant="subtitle2" sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1, color: 'var(--muted-foreground)' }}>
                            <LocationOn fontSize="small" /> Şube/Ek Adres #{index + 1}
                        </Typography>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 2.5 }}>
                            <FormControl fullWidth size="small" className="form-control-select">
                                <InputLabel>Adres Tipi</InputLabel>
                                <Select
                                    value={adres.tip}
                                    label="Adres Tipi"
                                    onChange={(e) => handleUpdateAdres(index, 'tip', e.target.value)}
                                >
                                    <MenuItem value="FATURA">📑 Fatura Adresi</MenuItem>
                                    <MenuItem value="SEVK">🚚 Sevk Adresi</MenuItem>
                                    <MenuItem value="DIGER">🏷️ Diğer</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth size="small"
                                label="İl"
                                value={adres.il || ''}
                                className="form-control-textfield"
                                onChange={(e) => handleUpdateAdres(index, 'il', e.target.value)}
                            />
                            <TextField
                                fullWidth size="small"
                                label="İlçe"
                                value={adres.ilce || ''}
                                className="form-control-textfield"
                                onChange={(e) => handleUpdateAdres(index, 'ilce', e.target.value)}
                            />
                            <TextField
                                fullWidth size="small"
                                label="Posta Kodu"
                                value={adres.postaKodu || ''}
                                className="form-control-textfield"
                                onChange={(e) => handleUpdateAdres(index, 'postaKodu', e.target.value)}
                            />
                            <TextField
                                fullWidth size="small"
                                label="Tam Adres"
                                multiline rows={2}
                                value={adres.adres || ''}
                                className="form-control-textfield"
                                onChange={(e) => handleUpdateAdres(index, 'adres', e.target.value)}
                                sx={{ gridColumn: '1 / -1' }}
                            />
                            <Box sx={{ gridColumn: '1 / -1', mt: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={adres.varsayilan}
                                            onChange={(e) => handleUpdateAdres(index, 'varsayilan', e.target.checked)}
                                        />
                                    }
                                    label={<Typography variant="body2">Varsayılan Adres Olarak İşaretle</Typography>}
                                />
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};
