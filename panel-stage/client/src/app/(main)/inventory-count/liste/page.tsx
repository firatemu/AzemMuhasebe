'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  alpha,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Delete as DeleteIcon,
  TableChart as ExcelIcon,
  PictureAsPdf as PdfIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Event as DateIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';

interface Sayim {
  id: string;
  sayimNo: string;
  sayimTipi: 'URUN_BAZLI' | 'RAF_BAZLI';
  tarih: string;
  durum: 'TASLAK' | 'TAMAMLANDI' | 'ONAYLANDI' | 'IPTAL';
  _count: {
    kalemler: number;
  };
  createdByUser?: {
    fullName: string;
  };
}

interface SayimDetay extends Sayim {
  kalemler: Array<{
    stok: {
      stokKodu: string;
      stokAdi: string;
    };
    location?: {
      code: string;
    };
    sistemMiktari: number;
    sayilanMiktar: number;
    farkMiktari: number;
  }>;
}

const durumConfig: Record<string, { label: string; color: any }> = {
  TASLAK: { label: 'TASLAK', color: 'default' },
  TAMAMLANDI: { label: 'TAMAMLANDI', color: 'warning' },
  ONAYLANDI: { label: 'ONAYLANDI', color: 'success' },
  IPTAL: { label: 'İPTAL', color: 'error' },
};

export default function SayimListePage() {
  const theme = useTheme();
  const [sayimlar, setSayimlar] = useState<Sayim[]>([]);
  const [selectedSayim, setSelectedSayim] = useState<SayimDetay | null>(null);
  const [detayDialog, setDetayDialog] = useState(false);
  const [onayDialog, setOnayDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

  useEffect(() => { fetchSayimlar(); }, []);

  const fetchSayimlar = async () => {
    try {
      const response = await axios.get('/inventory-count');
      setSayimlar(response.data || []);
    } catch (error: any) {
      showSnackbar('Sayımlar yüklenirken hata oluştu', 'error');
    }
  };

  const fetchSayimDetay = async (id: string) => {
    try {
      const response = await axios.get(`/inventory-count/${id}`);
      setSelectedSayim(response.data);
      setDetayDialog(true);
    } catch (error: any) {
      showSnackbar('Detay yüklenirken hata oluştu', 'error');
    }
  };

  const handleTamamla = async (id: string) => {
    if (!confirm('Bu sayımı tamamlamak istediğinizden emin misiniz?')) return;
    try {
      setLoading(true);
      await axios.put(`/inventory-count/${id}/complete`);
      showSnackbar('Sayım tamamlandı! Onay için beklenebilir.', 'success');
      fetchSayimlar();
    } catch (error: any) {
      showSnackbar('İşlem başarısız', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOnayla = async () => {
    if (!selectedSayim) return;
    try {
      setLoading(true);
      await axios.put(`/inventory-count/${selectedSayim.id}/approve`);
      showSnackbar('Sayım onaylandı ve stoklar güncellendi!', 'success');
      setOnayDialog(false);
      setDetayDialog(false);
      fetchSayimlar();
    } catch (error: any) {
      showSnackbar('Onaylama işlemi başarısız', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu sayımı silmek istediğinizden emin misiniz?')) return;
    try {
      await axios.delete(`/inventory-count/${id}`);
      showSnackbar('Sayım silindi', 'success');
      fetchSayimlar();
    } catch (error: any) {
      showSnackbar('Silme işlemi başarısız', 'error');
    }
  };

  const handleExport = async (type: 'excel' | 'pdf', id: string, sayimNo: string) => {
    try {
      const response = await axios.get(`/inventory-count/${id}/export/${type}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Sayim_${sayimNo}.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url);
      showSnackbar(`${type.toUpperCase()} dosyası indirildi`, 'success');
    } catch (error: any) {
      showSnackbar('Dosya indirme hatası', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <StandardPage
      title="Sayım Arşivi & Fark Raporları"
      breadcrumbs={[{ label: 'Sayım Yönetimi', href: '/inventory-count' }, { label: 'Sayım Listesi' }]}
    >
      <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', letterSpacing: 1, py: 2 }}>SAYIM NO</TableCell>
                <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', letterSpacing: 1 }}>SAYIM TÜRÜ</TableCell>
                <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', letterSpacing: 1 }}>TARİH</TableCell>
                <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', letterSpacing: 1 }}>OPERATÖR</TableCell>
                <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', letterSpacing: 1 }}>DURUM</TableCell>
                <TableCell align="right" sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', letterSpacing: 1 }}>AKSİYONLAR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sayimlar.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                    <Stack spacing={2} alignItems="center" sx={{ opacity: 0.5 }}>
                      <InventoryIcon sx={{ fontSize: 64, color: 'divider' }} />
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>Henüz kayıtlı bir sayım bulunmuyor.</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                sayimlar.map((sayim: Sayim) => (
                  <TableRow key={sayim.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell>
                      <Stack spacing={0.25}>
                        <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'monospace' }}>{sayim.sayimNo}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>{sayim._count.kalemler} Kalem Kayıt</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={sayim.sayimTipi === 'URUN_BAZLI' ? 'TOPLU SAYIM' : 'ADRESLİ SAYIM'}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 900, borderRadius: 1.5, fontSize: '0.65rem', color: sayim.sayimTipi === 'URUN_BAZLI' ? 'primary.main' : 'secondary.main', borderColor: sayim.sayimTipi === 'URUN_BAZLI' ? 'primary.main' : 'secondary.main' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DateIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{new Date(sayim.tarih).toLocaleDateString('tr-TR')}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{sayim.createdByUser?.fullName || '-'}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={durumConfig[sayim.durum].label}
                        color={durumConfig[sayim.durum].color === 'default' ? undefined : durumConfig[sayim.durum].color}
                        size="small"
                        sx={{ fontWeight: 900, borderRadius: 1.5, fontSize: '0.65rem' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Detayları İncele">
                          <IconButton size="small" onClick={() => fetchSayimDetay(sayim.id)} sx={{ border: '1px solid', borderColor: 'divider' }}>
                            <ViewIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        {sayim.durum === 'TASLAK' && (
                          <>
                            <Tooltip title="Sayımı Tamamla">
                              <IconButton size="small" color="primary" onClick={() => handleTamamla(sayim.id)} sx={{ border: '1px solid', borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                <CheckIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Sayımı Sil">
                              <IconButton size="small" color="error" onClick={() => handleDelete(sayim.id)} sx={{ border: '1px solid', borderColor: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                                <DeleteIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {sayim.durum === 'TAMAMLANDI' && (
                          <Tooltip title="Onayla & Stok Güncelle">
                            <IconButton size="small" color="success" onClick={() => { fetchSayimDetay(sayim.id); setTimeout(() => setOnayDialog(true), 300); }} sx={{ border: '1px solid', borderColor: 'success.main', bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                              <CheckIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Detay Dialog */}
      <Dialog open={detayDialog} onClose={() => setDetayDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 5 } }}>
        {selectedSayim && (
          <>
            <DialogTitle sx={{ p: 4, pb: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: -0.5 }}>{selectedSayim.sayimNo} No'lu Sayım Detayı</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip label={durumConfig[selectedSayim.durum].label} color={durumConfig[selectedSayim.durum].color === 'default' ? undefined : durumConfig[selectedSayim.durum].color} size="small" sx={{ fontWeight: 900, borderRadius: 1.5 }} />
                    <Chip label={selectedSayim.sayimTipi === 'URUN_BAZLI' ? 'Ürün Bazlı' : 'Raf Bazlı'} size="small" variant="outlined" sx={{ fontWeight: 800, borderRadius: 1.5 }} />
                  </Stack>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" size="small" startIcon={<ExcelIcon />} onClick={() => handleExport('excel', selectedSayim.id, selectedSayim.sayimNo)} sx={{ borderRadius: 2.5, fontWeight: 800 }}>EXCEL</Button>
                  <Button variant="outlined" size="small" startIcon={<PdfIcon />} onClick={() => handleExport('pdf', selectedSayim.id, selectedSayim.sayimNo)} sx={{ borderRadius: 2.5, fontWeight: 800 }}>PDF</Button>
                </Stack>
              </Stack>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <TableContainer sx={{ maxHeight: 500 }}>
                <Table size="medium" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {selectedSayim.sayimTipi === 'RAF_BAZLI' && <TableCell sx={{ fontWeight: 900, bgcolor: 'background.paper', fontSize: '0.7rem', color: 'text.secondary' }}>ADRES / RAF</TableCell>}
                      <TableCell sx={{ fontWeight: 900, bgcolor: 'background.paper', fontSize: '0.7rem', color: 'text.secondary' }}>ÜRÜN TANIMI</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 900, bgcolor: 'background.paper', fontSize: '0.7rem', color: 'text.secondary' }}>SİSTEM</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 900, bgcolor: 'background.paper', fontSize: '0.7rem', color: 'text.secondary' }}>SAYILAN</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 900, bgcolor: 'background.paper', fontSize: '0.7rem', color: 'text.secondary' }}>FARK</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedSayim.kalemler.map((kalem: any, index: number) => (
                      <TableRow key={index} hover sx={{ '&:last-child td': { border: 0 } }}>
                        {selectedSayim.sayimTipi === 'RAF_BAZLI' && (
                          <TableCell>
                            <Chip label={kalem.location?.code} size="small" variant="contained" sx={{ fontWeight: 900, borderRadius: 1.5, bgcolor: 'action.hover', color: 'text.primary' }} />
                          </TableCell>
                        )}
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>{kalem.stok.stokAdi}</Typography>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.disabled', fontWeight: 700 }}>{kalem.stok.stokKodu}</Typography>
                        </TableCell>
                        <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{kalem.sistemMiktari}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'monospace' }}>{kalem.sayilanMiktar}</Typography></TableCell>
                        <TableCell align="right">
                          <Chip
                            label={kalem.farkMiktari > 0 ? `+${kalem.farkMiktari}` : kalem.farkMiktari}
                            color={kalem.farkMiktari > 0 ? 'success' : kalem.farkMiktari < 0 ? 'error' : 'default'}
                            size="small"
                            sx={{ fontWeight: 900, borderRadius: 1.5, minWidth: 50, fontFamily: 'monospace', fontSize: '0.75rem' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ p: 4 }}>
                {selectedSayim.durum === 'TASLAK' && (
                  <Alert severity="info" variant="outlined" icon={<InfoIcon />} sx={{ borderRadius: 4, bgcolor: alpha(theme.palette.info.main, 0.02), border: '1.5px solid', borderColor: alpha(theme.palette.info.main, 0.1) }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>BİLGİLENDİRME</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Bu sayım henüz taslak aşamasındadır. Onaylanmadan önce saha sayımının "Tamamlandı" olarak işaretlenmesi gerekir.</Typography>
                  </Alert>
                )}
                {selectedSayim.durum === 'TAMAMLANDI' && (
                  <Alert severity="warning" variant="outlined" icon={<WarningIcon />} sx={{ borderRadius: 4, bgcolor: alpha(theme.palette.warning.main, 0.02), border: '1.5px solid', borderColor: alpha(theme.palette.warning.main, 0.1) }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>DİKKAT: ONAY BEKLİYOR</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Saha sayımı bitti. Onayladığınızda sistem stokları sayılan miktarlara göre otomatik olarak güncellenecektir.</Typography>
                  </Alert>
                )}
                {selectedSayim.durum === 'ONAYLANDI' && (
                  <Alert severity="success" variant="outlined" icon={<CheckIcon />} sx={{ borderRadius: 4, bgcolor: alpha(theme.palette.success.main, 0.02), border: '1.5px solid', borderColor: alpha(theme.palette.success.main, 0.1) }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>İŞLEM TAMAMLANDI</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Bu sayım resmi olarak onaylanmış ve stok düzeltme hareketleri sisteme işlenmiştir.</Typography>
                  </Alert>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 4, pt: 0 }}>
              <Button onClick={() => setDetayDialog(false)} sx={{ fontWeight: 800 }}>Vazgeç</Button>
              {selectedSayim.durum === 'TASLAK' && (
                <Button variant="contained" startIcon={<CheckIcon />} onClick={() => { setDetayDialog(false); handleTamamla(selectedSayim.id); }} sx={{ borderRadius: 3, fontWeight: 900, px: 3 }}>Sayılanları Kesinleştir</Button>
              )}
              {selectedSayim.durum === 'TAMAMLANDI' && (
                <Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={() => setOnayDialog(true)} sx={{ borderRadius: 3, fontWeight: 900, px: 3 }}>Stokları Güncelle (Onayla)</Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Onay Dialog */}
      <Dialog open={onayDialog} onClose={() => setOnayDialog(false)} PaperProps={{ sx: { borderRadius: 5 } }}>
        <DialogTitle sx={{ p: 4, pb: 2, fontWeight: 950, letterSpacing: -0.5 }}>Stokları Güncelle?</DialogTitle>
        <DialogContent sx={{ p: 4, pt: 1 }}>
          <Stack spacing={3}>
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>Bu sayımı onaylayarak mevcut stok bakiyelerini sayım verilerine göre eşitlemek istediğinizden emin misiniz?</Typography>
            <Alert severity="error" icon={<WarningIcon />} sx={{ borderRadius: 4, fontWeight: 800, border: '1.5px solid', borderColor: alpha(theme.palette.error.main, 0.2) }}>
              BU İŞLEM GERİ ALINAMAZ VE OTOMATİK STOK HAREKETİ OLUŞTURUR!
            </Alert>
            {selectedSayim && (
              <Box sx={{ p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.02), border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}><HistoryIcon sx={{ fontSize: 16 }} /> İŞLEM ÖZETİ</Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}><span>Stok Girişi Yapılacak:</span> <Chip label={`${selectedSayim.kalemler.filter((k: any) => k.farkMiktari > 0).length} Ürün`} size="small" color="success" sx={{ fontWeight: 900, borderRadius: 1 }} /></Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}><span>Stok Çıkışı Yapılacak:</span> <Chip label={`${selectedSayim.kalemler.filter((k: any) => k.farkMiktari < 0).length} Ürün`} size="small" color="error" sx={{ fontWeight: 900, borderRadius: 1 }} /></Typography>
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 0 }}>
          <Button onClick={() => setOnayDialog(false)} sx={{ fontWeight: 800 }}>Vazgeç</Button>
          <Button variant="contained" color="success" onClick={handleOnayla} disabled={loading} sx={{ borderRadius: 3, fontWeight: 950, px: 5, boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.3)}` }}>
            {loading ? 'SİSTEME İŞLENİYOR...' : 'EVET, GÜNCELLE VE ONAYLA'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 3, fontWeight: 900, boxShadow: theme.shadows[10] }}>{snackbar.message}</Alert>
      </Snackbar>
    </StandardPage>
  );
}
