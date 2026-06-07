'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Alert,
  Snackbar,
  Stack,
  Chip,
  Grid,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Restore as RestoreIcon,
  FlashOn as FlashOnIcon,
  Info as InfoIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import StandardPage from '@/components/common/StandardPage';
import { useQuickMenuStore, QuickMenuItem } from '@/stores/quickMenuStore';
import QuickMenuEditor from '@/components/QuickMenu/QuickMenuEditor';
import QuickMenuItemCard from '@/components/QuickMenu/QuickMenuItemCard';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'stok-malzeme-listesi', label: 'Malzeme Listesi', path: '/stock/material-list' },
  { id: 'stok-malzeme-hareketleri', label: 'Malzeme Hareketleri', path: '/stock/material-movements' },
  { id: 'cari-liste', label: 'Cari Listesi', path: '/accounts' },
  { id: 'fatura-satis', label: 'Satış Faturaları', path: '/invoice/sales' },
  { id: 'fatura-alis', label: 'Satın Alma Faturaları', path: '/invoice/purchase' },
  { id: 'teklif-satis', label: 'Satış Teklifleri', path: '/quotes/sales' },
  { id: 'siparis-satis', label: 'Satış Siparişleri', path: '/orders/sales' },
  { id: 'satis-irsaliyesi', label: 'Satış İrsaliyeleri', path: '/sales-delivery-note' },
  { id: 'satin-alma-irsaliyesi', label: 'Satın Alma İrsaliyeleri', path: '/purchase-delivery-note' },
  { id: 'tahsilat', label: 'Tahsilat & Ödeme', path: '/collection' },
  { id: 'kasa', label: 'Kasa', path: '/cash' },
  { id: 'bankalar', label: 'Bankalar', path: '/bank' },
  { id: 'ik-personel', label: 'Personel Listesi', path: '/hr/personel' },
  { id: 'depo-depolar', label: 'Depo Yönetimi', path: '/warehouse/warehouses' },
  { id: 'masraf', label: 'Masraf', path: '/expense' },
  { id: 'raporlama-genel', label: 'Genel Raporlama', path: '/reporting' },
];

export default function HizliMenuPage() {
  const theme = useTheme();
  const router = useRouter();
  const {
    items,
    addQuickMenuItem,
    updateQuickMenuItem,
    deleteQuickMenuItem,
    reorderQuickMenuItems,
    resetToDefaults,
    fetchQuickMenuItems,
  } = useQuickMenuStore();

  useEffect(() => {
    fetchQuickMenuItems();
  }, [fetchQuickMenuItems]);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editItem, setEditItem] = useState<QuickMenuItem | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [draggedItem, setDraggedItem] = useState<QuickMenuItem | null>(null);

  const enabledItems = items.filter((item) => item.enabled).sort((a, b) => a.order - b.order);
  const disabledItems = items.filter((item) => !item.enabled).sort((a, b) => a.order - b.order);

  const handleAddNew = () => {
    setEditItem(null);
    setEditorOpen(true);
  };

  const handleEdit = (item: QuickMenuItem) => {
    setEditItem(item);
    setEditorOpen(true);
  };

  const handleSave = (itemData: Omit<QuickMenuItem, 'id' | 'order'>) => {
    if (editItem) {
      updateQuickMenuItem(editItem.id, itemData);
      showSnackbar('Hızlı menü öğesi güncellendi', 'success');
    } else {
      addQuickMenuItem(itemData);
      showSnackbar('Yeni hızlı menü öğesi eklendi', 'success');
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Bu kısa yolu silmek istediğinizden emin misiniz?')) return;
    deleteQuickMenuItem(id);
    showSnackbar('Hızlı menü öğesi silindi', 'success');
  };

  const handleToggleEnabled = (id: string, enabled: boolean) => {
    updateQuickMenuItem(id, { enabled });
    showSnackbar(
      enabled ? 'Kısa yol aktifleştirildi' : 'Kısa yol pasifleştirildi',
      'success'
    );
  };

  const handleReset = () => {
    if (confirm('Tüm hızlı menü ayarlarını varsayılanlara sıfırlamak istediğinizden emin misiniz?')) {
      resetToDefaults();
      showSnackbar('Ayarlar varsayılana getirildi', 'success');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDragStart = (item: QuickMenuItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent, targetItem: QuickMenuItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const newItems = [...items];
    const draggedIndex = newItems.findIndex((i) => i.id === draggedItem.id);
    const targetIndex = newItems.findIndex((i) => i.id === targetItem.id);

    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);

    reorderQuickMenuItems(newItems);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <StandardPage
      title="Hızlı İşlem Menüsü"
      breadcrumbs={[{ label: 'Ayarlar', href: '/settings' }, { label: 'Hızlı Menü' }]}
      headerActions={
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RestoreIcon />}
            onClick={handleReset}
            sx={{ fontWeight: 700, borderRadius: 3 }}
          >
            Varsayılana Dön
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{ fontWeight: 800, borderRadius: 3, px: 3 }}
          >
            Yeni Kısa Yol
          </Button>
        </Stack>
      }
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 800 }}>
          Sık kullandığınız sayfalara hızlıca erişmek için yan menü (Sidebar) ve ana ekrandaki "Hızlı İşlemler" bölümünü özelleştirin.
          Öğeleri sürükleyerek sıralayabilirsiniz.
        </Typography>
      </Box>

      <Alert
        severity="info"
        variant="outlined"
        icon={<InfoIcon />}
        sx={{ mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'info.light', bgcolor: alpha(theme.palette.info.main, 0.02) }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700 }}>Kişiselleştirilmiş Navigasyon</Typography>
        <Typography variant="caption">Bu ayarlar kullanıcı bazlıdır ve sadece sizin ekranınızdaki hızlı erişim menülerini etkiler.</Typography>
      </Alert>

      <Grid container spacing={4}>
        {/* Active Section */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Box sx={{ width: 8, height: 24, bgcolor: 'success.main', borderRadius: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1rem', color: 'text.primary' }}>AKTİF KISA YOLLAR</Typography>
            <Chip label={enabledItems.length} size="small" color="success" sx={{ fontWeight: 800, borderRadius: 1.5 }} />
          </Stack>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.background.paper, 0.4), minHeight: 200 }}>
            {enabledItems.map((item) => (
              <Box
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                onDragOver={(e) => handleDragOver(e, item)}
                onDragEnd={handleDragEnd}
                sx={{
                  cursor: 'grab',
                  mb: 1.5,
                  '&:last-child': { mb: 0 },
                  transition: 'transform 0.2s',
                  '&:active': { cursor: 'grabbing', transform: 'scale(0.98)' }
                }}
              >
                <QuickMenuItemCard
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleEnabled={handleToggleEnabled}
                  dragIcon={<DragIcon sx={{ color: 'text.disabled', mr: 1 }} />}
                />
              </Box>
            ))}
            {enabledItems.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center', opacity: 0.5 }}>
                <Typography variant="body2">Henüz aktif bir kısa yol yok.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Disabled Section */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Box sx={{ width: 8, height: 24, bgcolor: 'text.disabled', borderRadius: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1rem', color: 'text.secondary' }}>DEVRE DIŞI ÖĞELER</Typography>
            <Chip label={disabledItems.length} size="small" sx={{ fontWeight: 800, borderRadius: 1.5 }} />
          </Stack>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.action.disabledBackground, 0.05), minHeight: 200 }}>
            {disabledItems.map((item) => (
              <Box key={item.id} sx={{ mb: 1.5, '&:last-child': { mb: 0 }, opacity: 0.7 }}>
                <QuickMenuItemCard
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleEnabled={handleToggleEnabled}
                />
              </Box>
            ))}
            {disabledItems.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center', opacity: 0.5 }}>
                <Typography variant="body2">Tüm öğeler aktif veya liste boş.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {items.length === 0 && (
        <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderRadius: 6, borderStyle: 'dashed', mt: 4 }}>
          <FlashOnIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Sistemde Kayıt Yok</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Henüz hiç hızlı menü öğesi tanımlamadınız.</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{ fontWeight: 800, borderRadius: 3, px: 6, py: 1.5 }}
          >
            İlk Kısa Yolu Oluştur
          </Button>
        </Paper>
      )}

      <QuickMenuEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        editItem={editItem}
        availablePaths={menuItems}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 700 }}>{snackbar.message}</Alert>
      </Snackbar>
    </StandardPage>
  );
}
