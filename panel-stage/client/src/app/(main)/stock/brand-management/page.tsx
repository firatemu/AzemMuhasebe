'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  alpha,
  Stack,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  Delete,
  Edit,
  Add,
  Search,
  Refresh,
  ViewModule,
  ViewList,
  LocalOffer,
  Inventory2,
  Category,
  Block,
  ArrowBack,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { StandardPage, StandardCard } from '@/components/common';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import axios from '@/lib/axios';

const ACCENT = '#f59e0b';
const ACCENT_DARK = '#d97706';

interface Marka {
  markaAdi: string;
  urunSayisi: number;
}

type ViewMode = 'grid' | 'list';
type SortKey = 'name-asc' | 'name-desc' | 'products-desc' | 'products-asc';

function getMarkaInitials(markaAdi: string) {
  if (!markaAdi) return '?';
  return markaAdi
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hues = [38, 25, 210, 160, 280, 340];
  return hues[Math.abs(hash) % hues.length];
}

/** MUI Tooltip requires a non-disabled wrapper when the child is disabled */
function TooltipWrap({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <Tooltip title={title}>
      <span style={{ display: 'inline-flex' }}>{children}</span>
    </Tooltip>
  );
}

interface StatTileProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  tint: string;
}

function StatTile({ label, value, icon, tint }: StatTileProps) {
  return (
    <StandardCard padding={2.5} sx={{ height: '100%' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `color-mix(in srgb, ${tint} 14%, transparent)`,
            color: tint,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
        </Box>
      </Stack>
    </StandardCard>
  );
}

interface BrandFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialName: string;
  previousName?: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

function BrandFormDialog({
  open,
  mode,
  initialName,
  previousName,
  loading,
  onClose,
  onSubmit,
}: BrandFormDialogProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (open) setName(initialName);
  }, [open, initialName]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
        {mode === 'create' ? 'Yeni Marka' : 'Markayı Düzenle'}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          {mode === 'create'
            ? 'Malzeme kartlarında kullanılacak marka adını girin. Aynı isimde ikinci kayıt oluşturulamaz.'
            : 'Marka adı değiştiğinde bu markaya bağlı tüm ürünler güncellenir.'}
        </Typography>
        {mode === 'edit' && previousName && (
          <TextField
            fullWidth
            label="Mevcut ad"
            value={previousName}
            disabled
            size="small"
            sx={{ mb: 2 }}
          />
        )}
        <TextField
          fullWidth
          label="Marka adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn: Bosch, Valeo, Mann"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && name.trim()) onSubmit(name.trim());
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          İptal
        </Button>
        <Button
          variant="contained"
          disabled={!name.trim() || loading}
          onClick={() => onSubmit(name.trim())}
          sx={{
            bgcolor: ACCENT,
            fontWeight: 700,
            '&:hover': { bgcolor: ACCENT_DARK },
          }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : mode === 'create' ? 'Oluştur' : 'Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function MarkaYonetimiPage() {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [markalar, setMarkalar] = useState<Marka[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [deleting, setDeleting] = useState<string | null>(null);

  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | null>(null);
  const [editingMarka, setEditingMarka] = useState<Marka | null>(null);
  const [formName, setFormName] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchMarkalar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/brand');
      const mapped: Marka[] = (response.data || []).map((m: { brandName?: string; productCount?: number }) => ({
        markaAdi: m.brandName || '',
        urunSayisi: m.productCount || 0,
      }));
      setMarkalar(mapped);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      const msg = ax.response?.data?.message || 'Markalar yüklenirken bir hata oluştu';
      setError(msg);
      setMarkalar([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkalar();
  }, [fetchMarkalar]);

  const stats = useMemo(() => {
    const totalProducts = markalar.reduce((s, m) => s + m.urunSayisi, 0);
    const withProducts = markalar.filter((m) => m.urunSayisi > 0).length;
    return {
      total: markalar.length,
      totalProducts,
      withProducts,
      empty: markalar.length - withProducts,
    };
  }, [markalar]);

  const maxProducts = useMemo(
    () => Math.max(1, ...markalar.map((m) => m.urunSayisi)),
    [markalar],
  );

  const filteredMarkalar = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = q
      ? markalar.filter((m) => m.markaAdi.toLowerCase().includes(q))
      : [...markalar];

    list.sort((a, b) => {
      switch (sortKey) {
        case 'name-desc':
          return b.markaAdi.localeCompare(a.markaAdi, 'tr');
        case 'products-desc':
          return b.urunSayisi - a.urunSayisi;
        case 'products-asc':
          return a.urunSayisi - b.urunSayisi;
        default:
          return a.markaAdi.localeCompare(b.markaAdi, 'tr');
      }
    });
    return list;
  }, [markalar, search, sortKey]);

  const openCreate = () => {
    setEditingMarka(null);
    setFormName('');
    setDialogMode('create');
  };

  const openEdit = (marka: Marka) => {
    setEditingMarka(marka);
    setFormName(marka.markaAdi);
    setDialogMode('edit');
  };

  const closeDialog = () => {
    setDialogMode(null);
    setEditingMarka(null);
    setFormName('');
  };

  const handleSubmitForm = async (name: string) => {
    if (dialogMode === 'create') {
      const exists = markalar.some((m) => m.markaAdi.toLowerCase() === name.toLowerCase());
      if (exists) {
        enqueueSnackbar(`"${name}" zaten kayıtlı`, { variant: 'warning' });
        return;
      }
      try {
        setSaving(true);
        await axios.post('/brand', { brandName: name });
        enqueueSnackbar(`"${name}" eklendi`, { variant: 'success' });
        closeDialog();
        await fetchMarkalar();
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } } };
        const msg = ax.response?.data?.message || 'Marka eklenemedi';
        enqueueSnackbar(msg, { variant: 'error' });
      } finally {
        setSaving(false);
      }
      return;
    }

    if (dialogMode === 'edit' && editingMarka) {
      if (name === editingMarka.markaAdi) {
        enqueueSnackbar('Yeni ad mevcut adla aynı', { variant: 'info' });
        return;
      }
      try {
        setSaving(true);
        await axios.put(`/brand/${encodeURIComponent(editingMarka.markaAdi)}`, {
          newBrandName: name,
        });
        enqueueSnackbar('Marka güncellendi', { variant: 'success' });
        closeDialog();
        await fetchMarkalar();
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } } };
        enqueueSnackbar(ax.response?.data?.message || 'Güncelleme başarısız', { variant: 'error' });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDelete = async (marka: Marka) => {
    if (marka.urunSayisi > 0) {
      enqueueSnackbar(
        `Bu markada ${marka.urunSayisi} ürün var. Önce ürünleri başka markaya taşıyın.`,
        { variant: 'warning' },
      );
      return;
    }
    if (!confirm(`"${marka.markaAdi}" markasını silmek istediğinize emin misiniz?`)) return;

    try {
      setDeleting(marka.markaAdi);
      await axios.delete(`/brand/${encodeURIComponent(marka.markaAdi)}`);
      enqueueSnackbar('Marka silindi', { variant: 'success' });
      await fetchMarkalar();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      enqueueSnackbar(ax.response?.data?.message || 'Silme başarısız', { variant: 'error' });
    } finally {
      setDeleting(null);
    }
  };

  const renderBrandCard = (marka: Marka) => {
    const hue = avatarColor(marka.markaAdi);
    const productPct = (marka.urunSayisi / maxProducts) * 100;
    const canDelete = marka.urunSayisi === 0;

    return (
      <StandardCard
        key={marka.markaAdi}
        padding={0}
        sx={{
          overflow: 'hidden',
          transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 'var(--shadow-md)',
            borderColor: alpha(ACCENT, 0.35),
          },
        }}
      >
        <Box
          sx={{
            height: 4,
            background: `linear-gradient(90deg, hsl(${hue} 70% 48%) 0%, ${ACCENT} 100%)`,
          }}
        />
        <Box sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar
              sx={{
                width: 52,
                height: 52,
                fontWeight: 800,
                fontSize: '1rem',
                bgcolor: `hsl(${hue} 65% 92%)`,
                color: `hsl(${hue} 55% 35%)`,
                border: `2px solid hsl(${hue} 60% 85%)`,
              }}
            >
              {getMarkaInitials(marka.markaAdi)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, lineHeight: 1.3 }}
                noWrap
                title={marka.markaAdi}
              >
                {marka.markaAdi}
              </Typography>
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.5 }}>
                <Inventory2 sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {marka.urunSayisi} ürün
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Kullanım
              </Typography>
              <Typography variant="caption" fontWeight={700} color={marka.urunSayisi > 0 ? 'success.main' : 'text.disabled'}>
                {marka.urunSayisi > 0 ? 'Aktif' : 'Sadece tanım'}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={productPct}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.divider, 0.8),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: marka.urunSayisi > 0 ? ACCENT : theme.palette.action.disabled,
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <TooltipWrap title="Düzenle">
              <IconButton
                size="small"
                onClick={() => openEdit(marka)}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.16) },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </TooltipWrap>
            <TooltipWrap title={canDelete ? 'Sil' : 'Ürünü olan marka silinemez'}>
              <IconButton
                size="small"
                disabled={!canDelete || deleting === marka.markaAdi}
                onClick={() => handleDelete(marka)}
                sx={{
                  bgcolor: alpha(theme.palette.error.main, canDelete ? 0.08 : 0.04),
                  color: canDelete ? 'error.main' : 'action.disabled',
                  '&:hover': canDelete ? { bgcolor: alpha(theme.palette.error.main, 0.16) } : {},
                }}
              >
                {deleting === marka.markaAdi ? (
                  <CircularProgress size={18} />
                ) : (
                  <Delete fontSize="small" />
                )}
              </IconButton>
            </TooltipWrap>
          </Stack>
        </Box>
      </StandardCard>
    );
  };

  const renderListView = () => (
    <StandardCard noPadding sx={{ overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 120px 100px',
          gap: 2,
          px: 2.5,
          py: 1.5,
          bgcolor: alpha(ACCENT, 0.06),
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Typography variant="caption" fontWeight={800} color="text.secondary">
          MARKA
        </Typography>
        <Typography variant="caption" fontWeight={800} color="text.secondary" textAlign="center">
          ÜRÜN
        </Typography>
        <Typography variant="caption" fontWeight={800} color="text.secondary" textAlign="right">
          İŞLEM
        </Typography>
      </Box>
      {filteredMarkalar.map((marka, idx) => {
        const hue = avatarColor(marka.markaAdi);
        const canDelete = marka.urunSayisi === 0;
        return (
          <Box
            key={marka.markaAdi}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 100px',
              gap: 2,
              alignItems: 'center',
              px: 2.5,
              py: 1.75,
              borderBottom: idx < filteredMarkalar.length - 1 ? '1px solid var(--border)' : 'none',
              '&:hover': { bgcolor: alpha(ACCENT, 0.04) },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" minWidth={0}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  bgcolor: `hsl(${hue} 65% 92%)`,
                  color: `hsl(${hue} 55% 35%)`,
                }}
              >
                {getMarkaInitials(marka.markaAdi)}
              </Avatar>
              <Typography fontWeight={700} noWrap>
                {marka.markaAdi}
              </Typography>
            </Stack>
            <Chip
              label={marka.urunSayisi}
              size="small"
              sx={{
                justifySelf: 'center',
                fontWeight: 800,
                bgcolor: marka.urunSayisi > 0 ? alpha(ACCENT, 0.12) : 'transparent',
                color: marka.urunSayisi > 0 ? ACCENT_DARK : 'text.disabled',
              }}
            />
            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
              <TooltipWrap title="Düzenle">
                <IconButton size="small" onClick={() => openEdit(marka)}>
                  <Edit fontSize="small" />
                </IconButton>
              </TooltipWrap>
              <TooltipWrap title={canDelete ? 'Sil' : 'Ürünü olan marka silinemez'}>
                <IconButton
                  size="small"
                  disabled={!canDelete || deleting === marka.markaAdi}
                  onClick={() => handleDelete(marka)}
                  color={canDelete ? 'error' : 'default'}
                >
                  {deleting === marka.markaAdi ? <CircularProgress size={16} /> : <Delete fontSize="small" />}
                </IconButton>
              </TooltipWrap>
            </Stack>
          </Box>
        );
      })}
    </StandardCard>
  );

  const renderEmpty = () => (
    <StandardCard>
      <Stack alignItems="center" spacing={2} sx={{ py: 6, px: 2 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(ACCENT, 0.1),
            color: ACCENT,
          }}
        >
          <LocalOffer sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h6" fontWeight={800}>
          {search ? 'Sonuç bulunamadı' : 'Henüz marka yok'}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={360}>
          {search
            ? `"${search}" ile eşleşen marka yok. Aramayı temizleyin veya farklı bir terim deneyin.`
            : 'Malzeme kartlarında kullanmak üzere ilk markanızı ekleyerek başlayın.'}
        </Typography>
        {!search && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openCreate}
            sx={{ mt: 1, bgcolor: ACCENT, fontWeight: 700, '&:hover': { bgcolor: ACCENT_DARK } }}
          >
            İlk markayı ekle
          </Button>
        )}
      </Stack>
    </StandardCard>
  );

  const renderLoading = () => (
    <Grid container spacing={2}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
          <Skeleton variant="rounded" height={200} sx={{ borderRadius: 'var(--radius)' }} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <StandardPage
      title="Marka Yönetimi"
      subtitle="Stok kartlarında kullanılan markaları tanımlayın. Ürünü olan markalar silinemez; ad değişikliği tüm bağlı ürünlere yansır."
      breadcrumbs={[
        { label: 'Stok', href: '/stock' },
        { label: 'Marka Yönetimi' },
      ]}
      headerActions={
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBack />}
            onClick={() => router.push('/stock')}
            sx={{ fontWeight: 600, borderRadius: 1 }}
          >
            Stok menüsü
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openCreate}
            sx={{
              bgcolor: ACCENT,
              fontWeight: 800,
              borderRadius: 1,
              px: 2.5,
              boxShadow: `0 4px 14px ${alpha(ACCENT, 0.35)}`,
              '&:hover': { bgcolor: ACCENT_DARK },
            }}
          >
            Yeni marka
          </Button>
        </Stack>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatTile label="Toplam marka" value={stats.total} icon={<LocalOffer />} tint={ACCENT} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatTile
            label="Toplam ürün"
            value={stats.totalProducts}
            icon={<Inventory2 />}
            tint={theme.palette.info.main}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatTile
            label="Ürünlü marka"
            value={stats.withProducts}
            icon={<Category />}
            tint={theme.palette.success.main}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatTile
            label="Boş tanım"
            value={stats.empty}
            icon={<Block />}
            tint={theme.palette.text.secondary}
          />
        </Grid>
      </Grid>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 'var(--radius)',
          borderColor: 'var(--border)',
          bgcolor: alpha(ACCENT, 0.03),
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <TextField
            size="small"
            placeholder="Marka ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sırala</InputLabel>
            <Select
              label="Sırala"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              <MenuItem value="name-asc">Ada göre (A→Z)</MenuItem>
              <MenuItem value="name-desc">Ada göre (Z→A)</MenuItem>
              <MenuItem value="products-desc">Ürün sayısı (çok→az)</MenuItem>
              <MenuItem value="products-asc">Ürün sayısı (az→çok)</MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
            <ToggleButtonGroup
              size="small"
              exclusive
              value={viewMode}
              onChange={(_, v) => v && setViewMode(v)}
              sx={{
                bgcolor: 'var(--muted)',
                '& .MuiToggleButton-root': {
                  border: 'none',
                  px: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'var(--card)',
                    boxShadow: 'var(--shadow-sm)',
                  },
                },
              }}
            >
              <ToggleButton value="grid" aria-label="Kart görünümü">
                <ViewModule fontSize="small" />
              </ToggleButton>
              <ToggleButton value="list" aria-label="Liste görünümü">
                <ViewList fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
            <TooltipWrap title="Yenile">
              <IconButton onClick={fetchMarkalar} disabled={loading}>
                <Refresh />
              </IconButton>
            </TooltipWrap>
          </Stack>
        </Stack>
        {!loading && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block', fontWeight: 600 }}>
            {filteredMarkalar.length} marka gösteriliyor
            {search ? ` · "${search}" araması` : ''}
          </Typography>
        )}
      </Paper>

      {loading && renderLoading()}

      {!loading && filteredMarkalar.length === 0 && renderEmpty()}

      {!loading && filteredMarkalar.length > 0 && viewMode === 'grid' && (
        <Grid container spacing={2}>
          {filteredMarkalar.map((marka) => (
            <Grid key={marka.markaAdi} size={{ xs: 12, sm: 6, lg: 4 }}>
              {renderBrandCard(marka)}
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && filteredMarkalar.length > 0 && viewMode === 'list' && renderListView()}

      <BrandFormDialog
        open={dialogMode !== null}
        mode={dialogMode === 'edit' ? 'edit' : 'create'}
        initialName={formName}
        previousName={editingMarka?.markaAdi}
        loading={saving}
        onClose={closeDialog}
        onSubmit={handleSubmitForm}
      />
    </StandardPage>
  );
}
