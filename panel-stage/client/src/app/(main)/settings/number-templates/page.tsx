'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Chip,
  Alert,
  Snackbar,
  Stack,
  Grid,
  alpha,
  useTheme,
  InputAdornment,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  AutoAwesome as AutoAwesomeIcon,
  CalendarToday as YearIcon,
  Numbers as NumbersIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Code as CodeIcon,
  TrendingUp as TrendingUpIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';

interface CodeTemplate {
  id: string;
  module: string;
  name: string;
  prefix: string;
  digitCount: number;
  currentValue: number;
  includeYear?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const moduleOptions = [
  { value: 'WAREHOUSE', label: 'Depo', color: '#3B82F6', icon: 'Warehouse' },
  { value: 'CASHBOX', label: 'Kasa', color: '#10B981', icon: 'Cashbox' },
  { value: 'PERSONNEL', label: 'Personel', color: '#F59E0B', icon: 'Personnel' },
  { value: 'PRODUCT', label: 'Ürün/Stok', color: '#8B5CF6', icon: 'Product' },
  { value: 'CUSTOMER', label: 'Cari/Müşteri', color: '#EC4899', icon: 'Customer' },
  { value: 'INVOICE_SALES', label: 'Satış Faturası', color: '#EF4444', icon: 'InvoiceSales' },
  { value: 'INVOICE_PURCHASE', label: 'Alış Faturası', color: '#F97316', icon: 'InvoicePurchase' },
  { value: 'ORDER_SALES', label: 'Satış Siparişi', color: '#06B6D4', icon: 'OrderSales' },
  { value: 'ORDER_PURCHASE', label: 'Satın Alma Siparişi', color: '#14B8A6', icon: 'OrderPurchase' },
  { value: 'INVENTORY_COUNT', label: 'Sayım', color: '#A855F7', icon: 'InventoryCount' },
  { value: 'QUOTE', label: 'Teklif', color: '#6366F1', icon: 'Quote' },
  { value: 'DELIVERY_NOTE_SALES', label: 'Satış İrsaliyesi', color: '#0EA5E9', icon: 'DeliveryNoteSales' },
  { value: 'DELIVERY_NOTE_PURCHASE', label: 'Alış İrsaliyesi', color: '#22C55E', icon: 'DeliveryNotePurchase' },
  { value: 'WAREHOUSE_TRANSFER', label: 'Depo Transferi', color: '#84CC16', icon: 'WarehouseTransfer' },
  { value: 'TECHNICIAN', label: 'Teknisyen', color: '#F43F5E', icon: 'Technician' },
  { value: 'WORK_ORDER', label: 'İş Emri', color: '#D946EF', icon: 'WorkOrder' },
  { value: 'SERVICE_INVOICE', label: 'Servis Faturası', color: '#FB923C', icon: 'ServiceInvoice' },
  { value: 'CHECK_BILL_JOURNAL', label: 'Bordro Numaralandırma', color: '#7C3AED', icon: 'CheckBillJournal' },
  { value: 'CHECK_BILL_DOCUMENT', label: 'Çek / Senet Evrak No', color: '#4F46E5', icon: 'CheckBillDocument' },
  { value: 'COLLECTION_RECEIPT', label: 'Tahsilat Makbuzu', color: '#10B981', icon: 'CollectionReceipt' },
  { value: 'PAYMENT_RECEIPT', label: 'Ödeme Makbuzu', color: '#EF4444', icon: 'PaymentReceipt' },
  { value: 'CROSS_PAYMENT', label: 'Çapraz Ödeme', color: '#0D9488', icon: 'CrossPayment' },
];

const exampleTemplates = [
  { module: 'WAREHOUSE', name: 'Depo Kodu', prefix: 'D', digitCount: 3, currentValue: 0, includeYear: false, isActive: true },
  { module: 'CASHBOX', name: 'Kasa Kodu', prefix: 'K', digitCount: 3, currentValue: 0, includeYear: false, isActive: true },
  { module: 'PERSONNEL', name: 'Personel Kodu', prefix: 'P', digitCount: 4, currentValue: 0, includeYear: false, isActive: true },
  { module: 'PRODUCT', name: 'Ürün Kodu', prefix: 'ST', digitCount: 4, currentValue: 0, includeYear: false, isActive: true },
  { module: 'CUSTOMER', name: 'Cari Kodu', prefix: 'C', digitCount: 4, currentValue: 0, includeYear: false, isActive: true },
  { module: 'INVOICE_SALES', name: 'Satış Fatura No', prefix: 'AZM', digitCount: 9, currentValue: 0, includeYear: true, isActive: true },
  { module: 'INVOICE_PURCHASE', name: 'Alış Fatura No', prefix: 'AF', digitCount: 6, currentValue: 0, includeYear: false, isActive: true },
  { module: 'ORDER_SALES', name: 'Satış Sipariş No', prefix: 'SS', digitCount: 6, currentValue: 0, includeYear: false, isActive: true },
  { module: 'ORDER_PURCHASE', name: 'Satın Alma Sipariş No', prefix: 'SAS', digitCount: 6, currentValue: 0, includeYear: false, isActive: true },
  { module: 'INVENTORY_COUNT', name: 'Sayım Kodu', prefix: 'SY', digitCount: 4, currentValue: 0, includeYear: false, isActive: true },
  { module: 'QUOTE', name: 'Teklif No', prefix: 'TK', digitCount: 6, currentValue: 0, includeYear: false, isActive: true },
  { module: 'DELIVERY_NOTE_SALES', name: 'Satış İrsaliye No', prefix: 'SI', digitCount: 6, currentValue: 0, includeYear: false, isActive: true },
  { module: 'DELIVERY_NOTE_PURCHASE', name: 'Alış İrsaliye No', prefix: 'AI', digitCount: 6, currentValue: 0, includeYear: false, isActive: true },
  { module: 'WAREHOUSE_TRANSFER', name: 'Depo Transfer No', prefix: 'DT', digitCount: 6, currentValue: 0, includeYear: false, isActive: true },
  { module: 'TECHNICIAN', name: 'Teknisyen Kodu', prefix: 'T', digitCount: 3, currentValue: 0, includeYear: false, isActive: true },
  { module: 'WORK_ORDER', name: 'İş Emri No', prefix: 'IE', digitCount: 5, currentValue: 0, includeYear: false, isActive: true },
  { module: 'SERVICE_INVOICE', name: 'Servis Fatura No', prefix: 'SF', digitCount: 6, currentValue: 0, includeYear: false, isActive: true },
  { module: 'CHECK_BILL_JOURNAL', name: 'Bordro Numaralandırma', prefix: 'BRD', digitCount: 6, currentValue: 0, includeYear: false, isActive: true },
  { module: 'CHECK_BILL_DOCUMENT', name: 'Çek / Senet Evrak No', prefix: 'EVR', digitCount: 6, currentValue: 0, includeYear: false, isActive: true },
  { module: 'COLLECTION_RECEIPT', name: 'Tahsilat Makbuzu No', prefix: 'THS', digitCount: 6, currentValue: 0, includeYear: true, isActive: true },
  { module: 'PAYMENT_RECEIPT', name: 'Ödeme Makbuzu No', prefix: 'ODE', digitCount: 6, currentValue: 0, includeYear: true, isActive: true },
  { module: 'CROSS_PAYMENT', name: 'Çapraz Ödeme No', prefix: 'COP', digitCount: 6, currentValue: 0, includeYear: true, isActive: true },
];

// Template Card Component
interface TemplateCardProps {
  template: CodeTemplate;
  onEdit: (template: CodeTemplate) => void;
  onDelete: (id: string) => void;
}

function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  const theme = useTheme();

  const moduleInfo = moduleOptions.find(m => m.value === template.module);
  const nextCode = `${template.prefix}${template.includeYear ? new Date().getFullYear() : ''}${String(template.currentValue + 1).padStart(template.digitCount, '0')}`;

  return (
    <Paper
      variant="outlined"
      sx={{
        position: 'relative',
        borderRadius: 1,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderColor: template.isActive ? alpha(moduleInfo?.color || '#3B82F6', 0.3) : 'divider',
        bgcolor: template.isActive ? 'var(--card)' : alpha(theme.palette.text.disabled, 0.02),
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
          borderColor: moduleInfo?.color || '#3B82F6',
        },
      }}
    >
      {/* Color Bar */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: moduleInfo?.color || '#3B82F6',
          opacity: template.isActive ? 1 : 0.3,
        }}
      />

      {/* Header */}
      <Box sx={{ p: 2.5, pl: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Chip
                label={moduleInfo?.label || template.module}
                size="small"
                sx={{
                  bgcolor: alpha(moduleInfo?.color || '#3B82F6', 0.1),
                  color: moduleInfo?.color || '#3B82F6',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 22,
                }}
              />
              {!template.isActive && (
                <Chip label="Pasif" size="small" color="default" sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22 }} />
              )}
            </Stack>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
              {template.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Son değer: <Box component="span" sx={{ fontWeight: 700, color: 'primary.main', fontFamily: 'monospace' }}>{template.currentValue}</Box>
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => onEdit(template)}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: 'primary.main',
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(template.id)}
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.08),
                color: 'error.main',
                '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.15) },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* Code Preview */}
      <Box
        sx={{
          p: 2,
          pl: 3,
          bgcolor: alpha(moduleInfo?.color || '#3B82F6', 0.06),
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: alpha(moduleInfo?.color || '#3B82F6', 0.15),
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1 }}>
          Gelecek Kod Örneği
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            color: moduleInfo?.color || '#3B82F6',
            fontFamily: 'monospace',
            letterSpacing: 1,
            fontSize: '1.1rem',
          }}
        >
          {nextCode}
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, pl: 3 }}>
        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <Chip
            icon={<CodeIcon sx={{ fontSize: 14 }} />}
            label={`Ön Ek: ${template.prefix}`}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 700, borderRadius: 1, fontSize: '0.7rem' }}
          />
          <Chip
            label={`${template.digitCount} Hane`}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 700, borderRadius: 1, fontSize: '0.7rem' }}
          />
          {template.includeYear && (
            <Chip
              icon={<YearIcon sx={{ fontSize: 14 }} />}
              label="Yıl"
              size="small"
              sx={{ fontWeight: 700, borderRadius: 1, fontSize: '0.7rem' }}
            />
          )}
        </Stack>
      </Box>
    </Paper>
  );
}

// Template List Item Component (Table Row Style)
interface TemplateListItemProps {
  template: CodeTemplate;
  onEdit: (template: CodeTemplate) => void;
  onDelete: (id: string) => void;
}

function TemplateListItem({ template, onEdit, onDelete }: TemplateListItemProps) {
  const theme = useTheme();

  const moduleInfo = moduleOptions.find(m => m.value === template.module);
  const nextCode = `${template.prefix}${template.includeYear ? new Date().getFullYear() : ''}${String(template.currentValue + 1).padStart(template.digitCount, '0')}`;

  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderRadius: 1,
        transition: 'all 0.2s ease',
        borderColor: template.isActive ? alpha(moduleInfo?.color || '#3B82F6', 0.2) : 'divider',
        bgcolor: template.isActive ? 'var(--card)' : alpha(theme.palette.text.disabled, 0.02),
        '&:hover': {
          borderColor: moduleInfo?.color || '#3B82F6',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      {/* Color Indicator */}
      <Box
        sx={{
          width: 4,
          height: 40,
          borderRadius: 1,
          bgcolor: moduleInfo?.color || '#3B82F6',
          opacity: template.isActive ? 1 : 0.3,
          mr: 2,
        }}
      />

      {/* Module & Name */}
      <Box sx={{ flex: '0 0 200px', minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <Chip
            label={moduleInfo?.label || template.module}
            size="small"
            sx={{
              bgcolor: alpha(moduleInfo?.color || '#3B82F6', 0.1),
              color: moduleInfo?.color || '#3B82F6',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 20,
            }}
          />
          {!template.isActive && (
            <Chip label="Pasif" size="small" color="default" sx={{ fontWeight: 600, fontSize: '0.65rem', height: 20 }} />
          )}
        </Stack>
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {template.name}
        </Typography>
      </Box>

      {/* Configuration */}
      <Box sx={{ flex: '0 0 180px', px: 1 }}>
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          <Chip label={`Ön Ek: ${template.prefix}`} size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1, fontSize: '0.7rem', height: 22 }} />
          <Chip label={`${template.digitCount} Hane`} size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1, fontSize: '0.7rem', height: 22 }} />
          {template.includeYear && (
            <Chip icon={<YearIcon sx={{ fontSize: 12 }} />} label="Yıl" size="small" sx={{ fontWeight: 700, borderRadius: 1, fontSize: '0.7rem', height: 22 }} />
          )}
        </Stack>
      </Box>

      {/* Current Value */}
      <Box sx={{ flex: '0 0 100px', textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.7rem' }}>
          Sayaç
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'monospace', lineHeight: 1.2 }}>
          {template.currentValue}
        </Typography>
      </Box>

      {/* Next Code Preview */}
      <Box sx={{ flex: '0 0 180px', px: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem', display: 'block', mb: 0.5 }}>
          Gelecek Kod
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 900,
            color: moduleInfo?.color || '#3B82F6',
            fontFamily: 'monospace',
            letterSpacing: 0.5,
            fontSize: '0.85rem',
            bgcolor: alpha(moduleInfo?.color || '#3B82F6', 0.08),
            px: 1,
            py: 0.5,
            borderRadius: 1,
            display: 'inline-block',
          }}
        >
          {nextCode}
        </Typography>
      </Box>

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Actions */}
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Tooltip title="Düzenle">
          <IconButton size="small" onClick={() => onEdit(template)} sx={{ color: 'primary.main' }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Sil">
          <IconButton size="small" onClick={() => onDelete(template.id)} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
}

// Form Dialog Component
interface TemplateFormDialogProps {
  open: boolean;
  initialFormData: any;
  editingTemplate: CodeTemplate | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

function TemplateFormDialog({ open, initialFormData, editingTemplate, onClose, onSubmit }: TemplateFormDialogProps) {
  const theme = useTheme();
  const [localFormData, setLocalFormData] = useState(initialFormData);

  useEffect(() => { setLocalFormData(initialFormData); }, [initialFormData, open]);

  const handleLocalChange = useCallback((field: string, value: any) => {
    setLocalFormData((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  const nextCode = useMemo(() => {
    if (!localFormData.prefix) return '';
    return `${localFormData.prefix}${localFormData.includeYear ? new Date().getFullYear() : ''}${String((localFormData.currentValue || 0) + 1).padStart(localFormData.digitCount || 3, '0')}`;
  }, [localFormData]);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          border: '1px solid var(--border)',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem', pb: 1 }}>
        {editingTemplate ? 'Şablon Düzenle' : 'Yeni Şablon Ekle'}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <TextField
            select
            label="İlgili Modül"
            fullWidth
            disabled={!!editingTemplate}
            value={localFormData.module}
            onChange={(e) => handleLocalChange('module', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 1 },
              '& .MuiInputLabel-root': { fontWeight: 600, fontSize: '0.85rem' },
            }}
          >
            {moduleOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value} sx={{ fontWeight: 600 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: opt.color }} />
                  {opt.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Şablon Tanımı"
            value={localFormData.name}
            onChange={(e) => handleLocalChange('name', e.target.value)}
            placeholder="Örn: Satış Faturası Serisi"
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 1 },
              '& .MuiInputLabel-root': { fontWeight: 600, fontSize: '0.85rem' },
            }}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Ön Ek (Prefix)"
              value={localFormData.prefix}
              onChange={(e) => handleLocalChange('prefix', e.target.value.toUpperCase())}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1 },
                '& .MuiInputLabel-root': { fontWeight: 600, fontSize: '0.85rem' },
              }}
            />
            <TextField
              fullWidth
              type="number"
              label="Hane Sayısı"
              value={localFormData.digitCount}
              onChange={(e) => handleLocalChange('digitCount', parseInt(e.target.value) || 0)}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1 },
                '& .MuiInputLabel-root': { fontWeight: 600, fontSize: '0.85rem' },
              }}
            />
          </Stack>

          <TextField
            fullWidth
            type="number"
            label="Mevcut Sayaç Değeri"
            value={localFormData.currentValue}
            onChange={(e) => handleLocalChange('currentValue', parseInt(e.target.value) || 0)}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 1 },
              '& .MuiInputLabel-root': { fontWeight: 600, fontSize: '0.85rem' },
            }}
          />

          <Box sx={{ p: 2.5, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1, border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.15) }}>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localFormData.includeYear}
                    onChange={(e) => handleLocalChange('includeYear', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--primary)' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ fontWeight: 700 }}>Yıl Bilgisi Ekle (Örn: 2024)</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={localFormData.isActive}
                    onChange={(e) => handleLocalChange('isActive', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--primary)' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ fontWeight: 700 }}>Şablon Aktif</Typography>}
              />
            </Stack>
          </Box>

          {nextCode && (
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 1,
                border: '1.5px solid',
                borderColor: 'success.light',
                bgcolor: alpha(theme.palette.success.main, 0.05),
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: alpha(theme.palette.success.main, 0.15), color: 'success.main', display: 'flex' }}>
                  <TrendingUpIcon fontSize="small" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                    Üretilecek Kod Önizlemesi
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: 'success.main', letterSpacing: 1, fontFamily: 'monospace' }}>
                    {nextCode}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1.5 }}>
        <Button onClick={onClose} sx={{ fontWeight: 700, borderRadius: 1, px: 3 }}>İptal</Button>
        <Button
          variant="contained"
          onClick={() => onSubmit(localFormData)}
          disabled={!localFormData.module || !localFormData.name || !localFormData.prefix}
          sx={{ fontWeight: 800, borderRadius: 1, px: 4 }}
        >
          {editingTemplate ? 'Güncelle' : 'Şablonu Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Main Page Component
export default function NumaraSablonlariPage() {
  const theme = useTheme();
  const [templates, setTemplates] = useState<CodeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CodeTemplate | null>(null);
  const [initialFormData, setInitialFormData] = useState({
    module: '', name: '', prefix: '', digitCount: 3, currentValue: 0, includeYear: false, isActive: true,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('');

  const showSnackbar = useCallback((message: string, severity: any) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/code-templates');
      setTemplates(response.data);
    } catch (error: any) {
      showSnackbar('Şablonlar yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const handleOpenDialog = useCallback((template?: CodeTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setInitialFormData({
        module: template.module,
        name: template.name,
        prefix: template.prefix,
        digitCount: template.digitCount,
        currentValue: template.currentValue,
        includeYear: template.includeYear || false,
        isActive: template.isActive,
      });
    } else {
      setEditingTemplate(null);
      setInitialFormData({
        module: '', name: '', prefix: '', digitCount: 3, currentValue: 0, includeYear: false, isActive: true,
      });
    }
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(async (data: any) => {
    try {
      if (editingTemplate) {
        await axios.patch(`/code-templates/${editingTemplate.id}`, data);
        showSnackbar('Şablon güncellendi', 'success');
      } else {
        await axios.post('/code-templates', data);
        showSnackbar('Şablon eklendi', 'success');
      }
      setDialogOpen(false);
      fetchTemplates();
    } catch (error: any) {
      showSnackbar('İşlem başarısız', 'error');
    }
  }, [editingTemplate, fetchTemplates, showSnackbar]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Bu şablonu silmek istediğinize emin misiniz?')) return;
    try {
      await axios.delete(`/code-templates/${id}`);
      showSnackbar('Şablon silindi', 'success');
      fetchTemplates();
    } catch (error: any) {
      showSnackbar('Silme işlemi başarısız', 'error');
    }
  }, [fetchTemplates, showSnackbar]);

  const handleAddExampleTemplates = async () => {
    if (!confirm('Tüm modüller için standart örnek şablonları eklemek ister misiniz?')) return;
    try {
      setLoading(true);
      for (const t of exampleTemplates) {
        if (!templates.find(x => x.module === t.module)) {
          await axios.post('/code-templates', t);
        }
      }
      showSnackbar('Eksik şablonlar başarıyla eklendi', 'success');
      fetchTemplates();
    } catch (error: any) {
      showSnackbar('Bazı şablonlar eklenemedi', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch = searchTerm === '' ||
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.prefix.toLowerCase().includes(searchTerm.toLowerCase()) ||
        moduleOptions.find(m => m.value === t.module)?.label.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModule = filterModule === '' || t.module === filterModule;
      return matchesSearch && matchesModule;
    });
  }, [templates, searchTerm, filterModule]);

  const activeCount = templates.filter(t => t.isActive).length;
  const inactiveCount = templates.length - activeCount;

  return (
    <StandardPage
      title="Numara Şablonları"
      breadcrumbs={[{ label: 'Ayarlar', href: '/settings' }, { label: 'Numara Şablonları' }]}
      headerActions={
        <Stack direction="row" spacing={1.5} alignItems="center">
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            sx={{
              bgcolor: 'var(--muted)',
              '& .MuiToggleButton-root': {
                px: 2,
                py: 0.75,
                borderRadius: 1,
                border: 'none',
                '&.Mui-selected': {
                  bgcolor: 'var(--card)',
                  color: 'var(--foreground)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                },
              },
            }}
          >
            <ToggleButton value="grid">
              <ViewModuleIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="outlined"
            size="small"
            startIcon={<AutoAwesomeIcon />}
            onClick={handleAddExampleTemplates}
            disabled={loading}
            sx={{ fontWeight: 700, borderRadius: 1 }}
          >
            Örnekleri Yükle
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ fontWeight: 800, borderRadius: 1, px: 3 }}
          >
            Yeni Şablon
          </Button>
        </Stack>
      }
    >
      {/* Description */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 800, lineHeight: 1.7 }}>
          Sistemde oluşturulan tüm resmi ve teknik evrakların numara serilerini buradan yönetebilirsiniz.
          Çek/senet <strong>bordro</strong> numarası <strong>Bordro Numaralandırma</strong> şablonundan; evrak (çek/senet) numarası{' '}
          <strong>Çek / Senet Evrak No</strong> şablonundan üretilir. Tahsilat ve ödeme makbuz numaraları sırasıyla{' '}
          <strong>Tahsilat Makbuzu</strong> ve <strong>Ödeme Makbuzu</strong> şablonlarından; çapraz ödeme işlemleri{' '}
          <strong>Çapraz Ödeme</strong> şablonundan üretilir.
        </Typography>
      </Box>

      {/* Info Box */}
      <Paper
        variant="outlined"
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderColor: alpha(theme.palette.primary.main, 0.25),
        }}
      >
        <Stack direction="row" spacing={2.5} alignItems="flex-start">
          <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: alpha(theme.palette.primary.main, 0.12), color: 'primary.main', display: 'flex' }}>
            <InfoIcon fontSize="small" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
              Bordro numaralandırma (çek / senet)
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, lineHeight: 1.7 }}>
              Bordro fiş numaraları bu sayfadaki <strong>Bordro Numaralandırma</strong> satırından yönetilir (ön ek, hane sayısı, sayaç).
              Yeni bordro oluştururken numara boş bırakılırsa bu şablona göre otomatik atanır.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              borderColor: alpha(theme.palette.primary.main, 0.2),
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: alpha(theme.palette.primary.main, 0.15), color: 'primary.main', display: 'flex' }}>
              <NumbersIcon />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main', lineHeight: 1.2 }}>
                {templates.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Toplam Şablon
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.success.main, 0.04),
              borderColor: alpha(theme.palette.success.main, 0.2),
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: alpha(theme.palette.success.main, 0.15), color: 'success.main', display: 'flex' }}>
              <TrendingUpIcon />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'success.main', lineHeight: 1.2 }}>
                {activeCount}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Aktif Şablon
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.text.disabled, 0.04),
              borderColor: alpha(theme.palette.text.disabled, 0.2),
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: alpha(theme.palette.text.disabled, 0.15), color: 'text.disabled', display: 'flex' }}>
              <FilterIcon />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.disabled', lineHeight: 1.2 }}>
                {inactiveCount}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Pasif Şablon
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Şablon ara... (Ad, ön ek, modül)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: { md: 400 },
            '& .MuiOutlinedInput-root': { borderRadius: 1 },
          }}
        />
        <TextField
          select
          fullWidth
          label="Modül Filtrele"
          value={filterModule}
          onChange={(e) => setFilterModule(e.target.value)}
          sx={{
            maxWidth: { md: 250 },
            '& .MuiOutlinedInput-root': { borderRadius: 1 },
          }}
        >
          <MenuItem value="">Tüm Modüller</MenuItem>
          {moduleOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: opt.color }} />
                {opt.label}
              </Box>
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchTemplates}
          disabled={loading}
          sx={{ borderRadius: 1, fontWeight: 700, minWidth: 120 }}
        >
          Yenile
        </Button>
      </Stack>

      {/* Templates Display */}
      {filteredTemplates.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 8,
            borderRadius: 1,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.text.disabled, 0.02),
          }}
        >
          <Box sx={{ mb: 2, color: 'text.disabled', display: 'flex', justifyContent: 'center' }}>
            <NumbersIcon sx={{ fontSize: 64, opacity: 0.5 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>
            {searchTerm || filterModule ? 'Şablon Bulunamadı' : 'Henüz Şablon Yok'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {searchTerm || filterModule ? 'Arama kriterlerinize uygun şablon bulunamadı.' : 'İlk şablonu oluşturmak için "Yeni Şablon" butonuna tıklayın veya "Örnekleri Yükle" ile hazır şablonları ekleyin.'}
          </Typography>
          {!searchTerm && !filterModule && (
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ fontWeight: 700, borderRadius: 1 }}
              >
                Yeni Şablon
              </Button>
              <Button
                variant="outlined"
                startIcon={<AutoAwesomeIcon />}
                onClick={handleAddExampleTemplates}
                sx={{ fontWeight: 700, borderRadius: 1 }}
              >
                Örnekleri Yükle
              </Button>
            </Stack>
          )}
        </Paper>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredTemplates.map((template) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={template.id}>
              <TemplateCard
                template={template}
                onEdit={handleOpenDialog}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack spacing={1.5}>
          {/* List Header */}
          <Paper
            variant="outlined"
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            }}
          >
            <Box sx={{ width: 4, height: 40, borderRadius: 1, bgcolor: 'primary.main', mr: 2 }} />
            <Box sx={{ flex: '0 0 200px' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                Şablon
              </Typography>
            </Box>
            <Box sx={{ flex: '0 0 180px', px: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                Yapılandırma
              </Typography>
            </Box>
            <Box sx={{ flex: '0 0 100px', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                Sayaç
              </Typography>
            </Box>
            <Box sx={{ flex: '0 0 180px', px: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                Gelecek Kod
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }} />
            <Box sx={{ width: 140 }} />
          </Paper>

          {/* List Items */}
          {filteredTemplates.map((template) => (
            <TemplateListItem
              key={template.id}
              template={template}
              onEdit={handleOpenDialog}
              onDelete={handleDelete}
            />
          ))}
        </Stack>
      )}

      {/* Dialogs */}
      <TemplateFormDialog
        open={dialogOpen}
        initialFormData={initialFormData}
        editingTemplate={editingTemplate}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 1, fontWeight: 700 }}>{snackbar.message}</Alert>
      </Snackbar>
    </StandardPage>
  );
}
