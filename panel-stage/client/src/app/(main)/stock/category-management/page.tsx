'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Stack,
  alpha,
} from '@mui/material';
import { Add, Delete, Category, ExpandMore, Search, AutoAwesome } from '@mui/icons-material';
import { StandardPage, StandardCard } from '@/components/common';
import { useTheme } from '@mui/material/styles';
import axios from '@/lib/axios';

interface KategoriData {
  anaKategori: string;
  altKategoriler: string[];
}

interface AltKategoriDialogProps {
  open: boolean;
  anaKategori: string;
  onClose: () => void;
  onSave: (anaKategori: string, altKategori: string) => void;
}

// Alt Kategori Ekleme Dialog Component
const AltKategoriDialog = React.memo(({
  open,
  anaKategori,
  onClose,
  onSave,
}: AltKategoriDialogProps) => {
  const [localAltKategori, setLocalAltKategori] = useState('');

  React.useEffect(() => {
    if (open) {
      setLocalAltKategori('');
    }
  }, [open]);

  const handleLocalChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAltKategori(e.target.value);
  }, []);

  const handleLocalSave = React.useCallback(() => {
    if (localAltKategori.trim()) {
      onSave(anaKategori, localAltKategori.trim());
      setLocalAltKategori('');
    }
  }, [localAltKategori, anaKategori, onSave]);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {anaKategori} - Alt Kategori Ekle
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Ana Kategori"
            value={anaKategori}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Alt Kategori Adı"
            value={localAltKategori}
            onChange={handleLocalChange}
            placeholder="Örn: Fren Balatası"
            required
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter' && localAltKategori.trim()) {
                handleLocalSave();
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose}>İptal</Button>
        <Button
          onClick={handleLocalSave}
          variant="contained"
          disabled={!localAltKategori.trim()}
        >
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  );
});

AltKategoriDialog.displayName = 'AltKategoriDialog';

interface AnaKategoriDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (anaKategori: string) => void;
}

// Ana Kategori Ekleme Dialog Component
const AnaKategoriDialog = React.memo(({
  open,
  onClose,
  onSave,
}: AnaKategoriDialogProps) => {
  const [localAnaKategori, setLocalAnaKategori] = useState('');

  React.useEffect(() => {
    if (open) {
      setLocalAnaKategori('');
    }
  }, [open]);

  const handleLocalChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAnaKategori(e.target.value);
  }, []);

  const handleLocalSave = React.useCallback(() => {
    if (localAnaKategori.trim()) {
      onSave(localAnaKategori.trim());
      setLocalAnaKategori('');
    }
  }, [localAnaKategori, onSave]);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        Yeni Ana Kategori Ekle
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Ana Kategori Adı"
            value={localAnaKategori}
            onChange={handleLocalChange}
            placeholder="Örn: Fren Sistemleri"
            required
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter' && localAnaKategori.trim()) {
                handleLocalSave();
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose}>İptal</Button>
        <Button
          onClick={handleLocalSave}
          variant="contained"
          disabled={!localAnaKategori.trim()}
        >
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  );
});

AnaKategoriDialog.displayName = 'AnaKategoriDialog';

export default function KategoriYonetimiPage() {
  const theme = useTheme();
  const [kategoriler, setKategoriler] = useState<KategoriData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAltKategoriDialog, setOpenAltKategoriDialog] = useState(false);
  const [openAnaKategoriDialog, setOpenAnaKategoriDialog] = useState(false);
  const [selectedAnaKategori, setSelectedAnaKategori] = useState<string>('');
  const [deleting, setDeleting] = useState<{ anaKategori: string; altKategori: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedKategori, setExpandedKategori] = useState<string | false>(false);

  // Kategorileri backend'den yükle
  const fetchKategoriler = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[KategoriYonetimiPage] Kategoriler yükleniyor...');
      const response = await axios.get('/categories');
      console.log('[KategoriYonetimiPage] API yanıtı:', response.data);
      const mappedKategoriler = (response.data || []).map((kategori: any) => ({
        anaKategori: kategori.mainCategory || '',
        altKategoriler: kategori.subCategories || [],
      }));
      setKategoriler(mappedKategoriler);
    } catch (error: any) {
      console.error('[KategoriYonetimiPage] Kategoriler yüklenemedi:', error);
      setError(error.response?.data?.message || 'Kategoriler yüklenirken bir hata oluştu');
      setKategoriler([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKategoriler();
  }, [fetchKategoriler]);

  const handleOpenAnaKategoriDialog = useCallback(() => {
    setOpenAnaKategoriDialog(true);
  }, []);

  const handleCloseAnaKategoriDialog = useCallback(() => {
    setOpenAnaKategoriDialog(false);
  }, []);

  const handleSaveAnaKategori = useCallback(async (anaKategori: string) => {
    try {
      await axios.post('/categories/main-category', {
        mainCategory: anaKategori,
      });
      await fetchKategoriler();
      handleCloseAnaKategoriDialog();
    } catch (error: any) {
      console.error('Ana kategori eklenemedi:', error);
      setError(error.response?.data?.message || 'Ana kategori eklenirken bir hata oluştu');
    }
  }, [fetchKategoriler, handleCloseAnaKategoriDialog]);

  const handleOpenAltKategoriDialog = useCallback((anaKategori: string) => {
    setSelectedAnaKategori(anaKategori);
    setOpenAltKategoriDialog(true);
  }, []);

  const handleCloseAltKategoriDialog = useCallback(() => {
    setOpenAltKategoriDialog(false);
    setSelectedAnaKategori('');
  }, []);

  const handleSaveAltKategori = useCallback(async (anaKategori: string, altKategori: string) => {
    try {
      const encodedAnaKategori = encodeURIComponent(anaKategori);
      await axios.post(`/categories/${encodedAnaKategori}/subcategory`, {
        subCategory: altKategori,
      });
      await fetchKategoriler();
      handleCloseAltKategoriDialog();
    } catch (error: any) {
      console.error('Alt kategori eklenemedi:', error);
      setError(error.response?.data?.message || 'Alt kategori eklenirken bir hata oluştu');
    }
  }, [fetchKategoriler, handleCloseAltKategoriDialog]);

  const handleDeleteAltKategori = useCallback(async (anaKategori: string, altKategori: string) => {
    if (!confirm(`"${altKategori}" alt kategorisini silmek istediğinizden emin misiniz?`)) return;

    try {
      setDeleting({ anaKategori, altKategori });
      const encodedAnaKategori = encodeURIComponent(anaKategori);
      const encodedAltKategori = encodeURIComponent(altKategori);
      await axios.delete(`/categories/${encodedAnaKategori}/subcategory/${encodedAltKategori}`);
      await fetchKategoriler();
    } catch (error: any) {
      console.error('Alt kategori silinemedi:', error);
      setError(error.response?.data?.message || 'Alt kategori silinirken bir hata oluştu');
    } finally {
      setDeleting(null);
    }
  }, [fetchKategoriler]);

  const handleAccordionChange = useCallback((kategori: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedKategori(isExpanded ? kategori : false);
  }, []);

  const filteredKategoriler = useMemo(() => {
    if (!searchQuery.trim()) return kategoriler;
    const query = searchQuery.toLowerCase().trim();
    return kategoriler.filter((kategori) => {
      if (kategori.anaKategori.toLowerCase().includes(query)) return true;
      return kategori.altKategoriler.some((alt) => alt.toLowerCase().includes(query));
    }).map((kategori) => {
      if (kategori.anaKategori.toLowerCase().includes(query)) return kategori;
      return {
        anaKategori: kategori.anaKategori,
        altKategoriler: kategori.altKategoriler.filter((alt) => alt.toLowerCase().includes(query)),
      };
    });
  }, [kategoriler, searchQuery]);

  return (
    <StandardPage
      title="Kategori Yönetimi"
      subtitle="Ürün gruplarını ve hiyerarşiyi yönetin"
      headerActions={
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAnaKategoriDialog}
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
            borderRadius: 2,
            px: 3,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Yeni Ana Kategori Ekle
        </Button>
      }
    >
      {/* İstatistik ve Arama */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StandardCard>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Category color="primary" />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="800">
                  {kategoriler.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ana Kategori
                </Typography>
              </Box>
            </Stack>
          </StandardCard>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <StandardCard sx={{ height: '100%', display: 'flex', alignItems: 'center', py: 1 }}>
            <TextField
              fullWidth
              placeholder="Kategori veya alt kategori ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </StandardCard>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography color="text.secondary">Kategoriler yükleniyor...</Typography>
        </Box>
      ) : filteredKategoriler.length === 0 ? (
        <StandardCard sx={{ py: 6, textAlign: 'center' }}>
          <AutoAwesome sx={{ fontSize: 48, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
          <Typography color="text.secondary">
            {searchQuery ? 'Arama kriterine uygun kategori bulunamadı' : 'Henüz kategori eklenmemiş'}
          </Typography>
        </StandardCard>
      ) : (
        <Grid container spacing={2}>
          {filteredKategoriler.map((kategori) => (
            <Grid size={{ xs: 12, md: 6 }} key={kategori.anaKategori}>
              <Accordion
                expanded={expandedKategori === kategori.anaKategori}
                onChange={handleAccordionChange(kategori.anaKategori)}
                sx={{
                  background: alpha(theme.palette.background.paper, 0.6),
                  backdropFilter: 'blur(20px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '12px !important',
                  mb: 1,
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { m: '0 0 12px 0' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    px: 2.5,
                    py: 1,
                    '&.Mui-expanded': {
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1.5,
                          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                        }}
                      >
                        <Category fontSize="small" />
                      </Box>
                      <Typography variant="subtitle1" fontWeight="700">
                        {kategori.anaKategori}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={kategori.altKategoriler.length}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          color: 'info.main',
                        }}
                      />
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAltKategoriDialog(kategori.anaKategori);
                        }}
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                        }}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <Table size="small">
                    <TableBody>
                      {kategori.altKategoriler.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Alt kategori bulunmuyor
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        kategori.altKategoriler.map((alt) => (
                          <TableRow
                            key={alt}
                            sx={{ '&:last-child td': { border: 0 } }}
                          >
                            <TableCell sx={{ pl: 3, py: 1.5 }}>
                              <Typography variant="body2" fontWeight="500">
                                {alt}
                              </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ pr: 2 }}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteAltKategori(kategori.anaKategori, alt)}
                                disabled={deleting?.anaKategori === kategori.anaKategori && deleting?.altKategori === alt}
                                sx={{ bgcolor: alpha(theme.palette.error.main, 0.05) }}
                              >
                                {deleting?.anaKategori === kategori.anaKategori && deleting?.altKategori === alt ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <Delete fontSize="small" />
                                )}
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialoglar */}
      <AnaKategoriDialog
        open={openAnaKategoriDialog}
        onClose={handleCloseAnaKategoriDialog}
        onSave={handleSaveAnaKategori}
      />

      <AltKategoriDialog
        open={openAltKategoriDialog}
        anaKategori={selectedAnaKategori}
        onClose={handleCloseAltKategoriDialog}
        onSave={handleSaveAltKategori}
      />
    </StandardPage>
  );
}
