import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Alert, Divider, Paper } from '@mui/material';
import { CariFormData } from './types';

interface CariGenelFormProps {
    data: CariFormData;
    onChange: (field: string, value: any) => void;
    satisElemanlari: any[];
    loadingSalespersons: boolean;
}

export const CariGenelForm: React.FC<CariGenelFormProps> = ({
    data,
    onChange,
    satisElemanlari,
    loadingSalespersons
}) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 0.5 }}>
            {/* 1. TEMEL KİMLİK BİLGİLERİ */}
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
                    <span style={{ fontSize: '1.2rem' }}>🆔</span> Temel Kimlik Bilgileri
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2.5 }}>
                    <TextField
                        fullWidth
                        autoFocus
                        label="Cari Kodu *"
                        className="form-control-textfield"
                        value={data.cariKodu}
                        onChange={(e) => onChange('cariKodu', e.target.value)}
                        placeholder="Otomatik üretilecek"
                        size="small"
                        helperText={data.cariKodu ? "Önerilen kod" : "Boş bırakılırsa otomatik üretilecek"}
                        sx={{
                            '& .MuiInputBase-root': {
                                bgcolor: 'var(--background)',
                                fontWeight: 600,
                                color: 'var(--primary)',
                            }
                        }}
                    />
                    <FormControl fullWidth size="small" className="form-control-select">
                        <InputLabel>Cari Tipi</InputLabel>
                        <Select
                            value={data.tip}
                            label="Cari Tipi"
                            onChange={(e) => onChange('tip', e.target.value)}
                            sx={{ bgcolor: 'var(--background)' }}
                        >
                            <MenuItem value="MUSTERI">👤 Müşteri</MenuItem>
                            <MenuItem value="TEDARIKCI">🏢 Tedarikçi</MenuItem>
                            <MenuItem value="HER_IKISI">🔄 Her İkisi</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small" className="form-control-select">
                        <InputLabel>Durum</InputLabel>
                        <Select
                            value={data.aktif ? 'true' : 'false'}
                            label="Durum"
                            onChange={(e) => onChange('aktif', e.target.value === 'true')}
                        >
                            <MenuItem value="true">✅ Aktif</MenuItem>
                            <MenuItem value="false">❌ Pasif</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <TextField
                    fullWidth
                    label="Cari Ünvanı / İşletme Adı *"
                    className="form-control-textfield"
                    value={data.unvan || ''}
                    onChange={(e) => onChange('unvan', e.target.value)}
                    required
                    size="small"
                    sx={{ mt: 2.5 }}
                    helperText={data.sirketTipi === 'SAHIS' ? 'Şahıs şirketi için isim soyisim veya işletme adı' : 'Resmi şirket ünvanı'}
                />

                <FormControl fullWidth size="small" className="form-control-select" sx={{ mt: 2.5 }}>
                    <InputLabel>Sorumlu Satış Elemanı</InputLabel>
                    <Select
                        value={data.satisElemaniId || ''}
                        label="Sorumlu Satış Elemanı"
                        onChange={(e) => onChange('satisElemaniId', e.target.value)}
                        disabled={loadingSalespersons}
                    >
                        <MenuItem value=""><em>Seçiniz</em></MenuItem>
                        {satisElemanlari.map((se: any) => (
                            <MenuItem key={se.id} value={se.id}>{se.fullName || se.adSoyad || se.username}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>

            {/* 1. YASAL / TİCARİ BİLGİLER */}
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
                    <span style={{ fontSize: '1.2rem' }}>🏢</span> Yasal / Ticari Bilgiler
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <FormControl fullWidth size="small" className="form-control-select">
                        <InputLabel>Şirket Tipi</InputLabel>
                        <Select
                            value={data.sirketTipi}
                            label="Şirket Tipi"
                            onChange={(e) => onChange('sirketTipi', e.target.value)}
                            sx={{ bgcolor: 'var(--background)' }}
                        >
                            <MenuItem value="KURUMSAL">🏢 Kurumsal (Ltd, A.Ş)</MenuItem>
                            <MenuItem value="SAHIS">👤 Şahıs Şirketi / Bireysel</MenuItem>
                        </Select>
                    </FormControl>

                    {data.sirketTipi === 'KURUMSAL' ? (
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                            <TextField
                                fullWidth
                                label="Vergi No"
                                size="small"
                                className="form-control-textfield"
                                value={data.vergiNo || ''}
                                onChange={(e) => onChange('vergiNo', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                inputProps={{ maxLength: 10 }}
                                sx={{ bgcolor: 'var(--background)' }}
                            />
                            <TextField
                                fullWidth
                                label="Vergi Dairesi"
                                size="small"
                                className="form-control-textfield"
                                value={data.vergiDairesi || ''}
                                onChange={(e) => onChange('vergiDairesi', e.target.value)}
                                sx={{ bgcolor: 'var(--background)' }}
                            />
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Alert severity="info" sx={{
                                borderRadius: 2,
                                border: '1px solid color-mix(in srgb, var(--info) 20%, transparent)',
                                bgcolor: 'color-mix(in srgb, var(--info) 10%, transparent)'
                            }}>
                                Şahıs işletmeleri için TC Kimlik No zorunludur.
                            </Alert>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                                <TextField
                                    fullWidth
                                    label="TC Kimlik No"
                                    size="small"
                                    className="form-control-textfield"
                                    value={data.tcKimlikNo || ''}
                                    onChange={(e) => onChange('tcKimlikNo', e.target.value.replace(/\D/g, '').slice(0, 11))}
                                    inputProps={{ maxLength: 11 }}
                                    sx={{ bgcolor: 'var(--background)' }}
                                />
                                <TextField
                                    fullWidth
                                    label="Ad Soyad"
                                    size="small"
                                    className="form-control-textfield"
                                    value={data.isimSoyisim || ''}
                                    onChange={(e) => onChange('isimSoyisim', e.target.value)}
                                    sx={{ bgcolor: 'var(--background)' }}
                                />
                            </Box>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};
