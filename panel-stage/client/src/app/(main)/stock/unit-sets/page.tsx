'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Stack,
  Paper,
  Divider,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Scale,
  Lock,
  Business,
  Search,
  Refresh,
  AutoAwesome,
  Straighten,
  FitnessCenter,
  WaterDrop,
  SquareFoot,
  Tag,
  Close,
  Numbers,
  Inventory2,
  ViewModule,
  ViewList,
} from '@mui/icons-material';
import { StandardPage } from '@/components/common';
import axios from '@/lib/axios';
import { GIB_BIRIM_KODLARI } from '@/constants/birim-codes';
import { usePermission } from '@/hooks/usePermission';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Unit {
  id?: string;
  name: string;
  code?: string;
  conversionRate: number;
  isBaseUnit: boolean;
  isDivisible: boolean;
}

interface UnitSet {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  tenantId: string | null;
  units: Unit[];
  createdAt?: string;
  updatedAt?: string;
}

// ─── GİB Codes ────────────────────────────────────────────────────────────────

// Only valid GİB codes that exist in birim-codes.ts
const VALID_GIB_CODES = GIB_BIRIM_KODLARI.map(c => c.kod);

// ─── Minimal Template Presets (all codes guaranteed valid) ────────────────────

interface Template {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  units: Unit[];
}

const TEMPLATES: Template[] = [
  {
    id: 'adet',
    label: 'Adet',
    icon: <Numbers sx={{ fontSize: 20 }} />,
    description: 'Tek tek satılan ürünler',
    units: [{ name: 'Adet', code: 'ADET', conversionRate: 1, isBaseUnit: true, isDivisible: false }],
  },
  {
    id: 'takim',
    label: 'Takım / Set',
    icon: <AutoAwesome sx={{ fontSize: 20 }} />,
    description: 'Bir arada satılan setler',
    units: [
      { name: 'Takım', code: 'SET', conversionRate: 1, isBaseUnit: true, isDivisible: false },
      { name: 'Set', code: 'SET', conversionRate: 1, isBaseUnit: false, isDivisible: false },
    ],
  },
  {
    id: 'paket',
    label: 'Paket',
    icon: <Tag sx={{ fontSize: 20 }} />,
    description: 'Paketlenmiş ürünler',
    units: [
      { name: 'Paket', code: 'PK', conversionRate: 1, isBaseUnit: true, isDivisible: true },
      { name: 'Yarım Paket', code: 'PK', conversionRate: 0.5, isBaseUnit: false, isDivisible: false },
    ],
  },
  {
    id: 'koli',
    label: 'Koli / Kutu',
    icon: <Inventory2 sx={{ fontSize: 20 }} />,
    description: 'Koli veya kutu olarak satılan ürünler',
    units: [
      { name: 'Koli', code: 'BOX', conversionRate: 1, isBaseUnit: true, isDivisible: true },
      { name: 'Yarım Koli', code: 'BOX', conversionRate: 0.5, isBaseUnit: false, isDivisible: false },
    ],
  },
  {
    id: 'metre',
    label: 'Metre / Uzunluk',
    icon: <Straighten sx={{ fontSize: 20 }} />,
    description: 'Kumaş, boru, tel gibi ürünler',
    units: [
      { name: 'Metre', code: 'MTR', conversionRate: 1, isBaseUnit: true, isDivisible: true },
      { name: 'Santimetre', code: 'MTR', conversionRate: 0.01, isBaseUnit: false, isDivisible: false },
    ],
  },
  {
    id: 'agirlik',
    label: 'Kilogram / Gram',
    icon: <FitnessCenter sx={{ fontSize: 20 }} />,
    description: 'Gıda, hammadde gibi ürünler',
    units: [
      { name: 'Kilogram', code: 'KG', conversionRate: 1, isBaseUnit: true, isDivisible: true },
      { name: 'Gram', code: 'GRM', conversionRate: 0.001, isBaseUnit: false, isDivisible: false },
    ],
  },
  {
    id: 'litre',
    label: 'Litre / Hacim',
    icon: <WaterDrop sx={{ fontSize: 20 }} />,
    description: 'İçecek, kimyasal gibi sıvılar',
    units: [
      { name: 'Litre', code: 'LTR', conversionRate: 1, isBaseUnit: true, isDivisible: true },
      { name: 'Mililitre', code: 'MLT', conversionRate: 0.001, isBaseUnit: false, isDivisible: false },
    ],
  },
  {
    id: 'alan',
    label: 'Metrekare / Alan',
    icon: <SquareFoot sx={{ fontSize: 20 }} />,
    description: 'Kâğıt, panel, seramik gibi ürünler',
    units: [
      { name: 'Metrekare', code: 'MTK', conversionRate: 1, isBaseUnit: true, isDivisible: true },
    ],
  },
  {
    id: 'bos',
    label: 'Sıfırdan Başla',
    icon: <Add sx={{ fontSize: 20 }} />,
    description: 'Kendi birim setinizi oluşturun',
    units: [{ name: 'Adet', code: 'ADET', conversionRate: 1, isBaseUnit: true, isDivisible: false }],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSetIcon(name: string): React.ReactNode {
  const lower = name.toLowerCase();
  if (lower.includes('uzunluk') || lower.includes('metre')) return <Straighten sx={{ fontSize: 18 }} />;
  if (lower.includes('ağırlık') || lower.includes('gram') || lower.includes('kg')) return <FitnessCenter sx={{ fontSize: 18 }} />;
  if (lower.includes('hacim') || lower.includes('litre')) return <WaterDrop sx={{ fontSize: 18 }} />;
  if (lower.includes('alan') || lower.includes('metrekare')) return <SquareFoot sx={{ fontSize: 18 }} />;
  if (lower.includes('takım') || lower.includes('set')) return <AutoAwesome sx={{ fontSize: 18 }} />;
  if (lower.includes('paket')) return <Tag sx={{ fontSize: 18 }} />;
  if (lower.includes('koli') || lower.includes('kutu')) return <Inventory2 sx={{ fontSize: 18 }} />;
  return <Scale sx={{ fontSize: 18 }} />;
}

/** Ensures Select always receives a value from VALID_GIB_CODES */
function normalizeGibCode(code?: string): string {
  if (code && VALID_GIB_CODES.includes(code)) return code;
  return 'ADET';
}

/** Sunucuda bulk endpoint yoksa mevcut API ile şablonları tek tek oluşturur */
async function bulkCreateFromTemplatesClient(): Promise<{
  created: number;
  skipped: number;
  createdNames: string[];
}> {
  try {
    await axios.post('/unit-sets/ensure-defaults');
  } catch {
    // Sistem setleri zaten var veya endpoint kapalı olabilir
  }

  const listRes = await axios.get<UnitSet[]>('/unit-sets');
  const existing = Array.isArray(listRes.data) ? listRes.data : [];
  const existingNames = new Set(existing.map((s) => s.name.trim().toLowerCase()));

  let created = 0;
  let skipped = 0;
  const createdNames: string[] = [];

  for (const tpl of TEMPLATES.filter((t) => t.id !== 'bos')) {
    const key = tpl.label.trim().toLowerCase();
    if (existingNames.has(key)) {
      skipped++;
      continue;
    }

    await axios.post('/unit-sets', {
      name: tpl.label,
      description: tpl.description,
      units: tpl.units.map((u) => ({
        name: u.name,
        code: normalizeGibCode(u.code),
        conversionRate: u.conversionRate,
        isBaseUnit: u.isBaseUnit,
        isDivisible: u.isDivisible,
      })),
    });

    existingNames.add(key);
    created++;
    createdNames.push(tpl.label);
  }

  return { created, skipped, createdNames };
}

function cloneUnit(u: Unit): Unit {
  return {
    ...u,
    code: normalizeGibCode(u.code),
  };
}

// ─── Create / Edit Dialog (minimal) ───────────────────────────────────────────

interface UnitSetDialogProps {
  open: boolean;
  editingSet: UnitSet | null;
  onClose: () => void;
  onSaved: () => void;
}

function UnitSetDialog({ open, editingSet, onClose, onSaved }: UnitSetDialogProps) {
  const isEditing = !!editingSet;
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    if (!open) return;
    if (editingSet) {
      setFormData({ name: editingSet.name, description: editingSet.description ?? '' });
      setUnits(editingSet.units.map(cloneUnit));
    } else {
      setFormData({ name: '', description: '' });
      setUnits([{ name: 'Adet', code: 'ADET', conversionRate: 1, isBaseUnit: true, isDivisible: false }]);
    }
    setValidationError(null);
  }, [open, editingSet]);

  const applyTemplate = (id: string) => {
    const tpl = TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;
    setFormData({ name: tpl.label, description: tpl.description });
    setUnits(tpl.units.map(cloneUnit));
    setValidationError(null);
  };

  const addUnit = () => {
    setUnits((prev) => [
      ...prev,
      { name: '', code: 'ADET', conversionRate: 1, isBaseUnit: false, isDivisible: false },
    ]);
  };

  const removeUnit = (idx: number) => {
    const wasBase = units[idx].isBaseUnit;
    const next = units.filter((_, i) => i !== idx);
    if (wasBase && next.length > 0 && !next.some((u) => u.isBaseUnit)) {
      next[0] = { ...next[0], isBaseUnit: true, conversionRate: 1 };
    }
    setUnits(next);
  };

  const updateUnit = (idx: number, field: keyof Unit, value: unknown) => {
    setUnits((prev) =>
      prev.map((u, i) => {
        if (i !== idx) {
          if (field === 'isBaseUnit' && value) return { ...u, isBaseUnit: false };
          return u;
        }
        const updated = { ...u, [field]: value };
        if (field === 'isBaseUnit' && value) updated.conversionRate = 1;
        if (field === 'code') updated.code = normalizeGibCode(value as string);
        return updated;
      }),
    );
  };

  const validate = (): string | null => {
    if (!formData.name.trim()) return 'Birim seti adı zorunludur.';
    if (units.length === 0) return 'En az bir birim eklenmelidir.';
    if (units.filter((u) => u.isBaseUnit).length !== 1) return 'Tam olarak bir ana birim seçilmelidir.';
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      if (!u.name.trim()) return `${i + 1}. birim: ad zorunludur.`;
      if (!VALID_GIB_CODES.includes(normalizeGibCode(u.code))) return `${i + 1}. birim: geçersiz GİB kodu.`;
      if (u.conversionRate <= 0) return `${i + 1}. birim: katsayı 0'dan büyük olmalıdır.`;
    }
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError(null);
    setSaving(true);
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      units: units.map((u) => ({
        name: u.name.trim(),
        code: normalizeGibCode(u.code),
        conversionRate: u.isBaseUnit ? 1 : u.conversionRate,
        isBaseUnit: u.isBaseUnit,
        isDivisible: u.isDivisible,
      })),
    };
    try {
      if (editingSet) await axios.put(`/unit-sets/${editingSet.id}`, payload);
      else await axios.post('/unit-sets', payload);
      onSaved();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string | string[] } } };
      const msg = axiosErr.response?.data?.message;
      setValidationError(Array.isArray(msg) ? msg.join(' ') : (msg ?? 'İşlem başarısız oldu.'));
    } finally {
      setSaving(false);
    }
  };

  const baseUnit = units.find((u) => u.isBaseUnit);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, border: '1px solid', borderColor: 'divider' },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          {isEditing ? 'Birim Setini Düzenle' : 'Birim Seti Oluştur'}
        </Typography>
        <IconButton size="small" onClick={onClose} disabled={saving} aria-label="Kapat">
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {!isEditing && (
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Hızlı başlangıç
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              {TEMPLATES.map((tpl) => (
                <Chip
                  key={tpl.id}
                  label={tpl.label}
                  size="small"
                  variant="outlined"
                  onClick={() => applyTemplate(tpl.id)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Stack>
          </Box>
        )}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Set adı"
            required
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            error={!!validationError && !formData.name.trim()}
          />
          <TextField
            fullWidth
            size="small"
            label="Açıklama"
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            placeholder="İsteğe bağlı"
          />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Birimler
          </Typography>
          <Button size="small" startIcon={<Add />} onClick={addUnit} sx={{ textTransform: 'none' }}>
            Ekle
          </Button>
        </Box>

        {baseUnit && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Ana birim: <strong>{baseUnit.name}</strong> (katsayı 1)
          </Typography>
        )}

        <Stack spacing={1} sx={{ mb: 1 }}>
          {units.map((unit, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px 72px auto auto 32px',
                gap: 1,
                alignItems: 'center',
                py: 0.75,
                px: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: unit.isBaseUnit ? 'primary.main' : 'divider',
                bgcolor: unit.isBaseUnit ? 'action.hover' : 'transparent',
              }}
            >
              <TextField
                size="small"
                placeholder="Birim adı"
                value={unit.name}
                onChange={(e) => updateUnit(idx, 'name', e.target.value)}
                variant="outlined"
                hiddenLabel
              />
              <Select
                size="small"
                value={normalizeGibCode(unit.code)}
                onChange={(e) => updateUnit(idx, 'code', e.target.value)}
                displayEmpty={false}
              >
                {GIB_BIRIM_KODLARI.map((c) => (
                  <MenuItem key={c.kod} value={c.kod}>
                    {c.kod}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                size="small"
                type="number"
                value={unit.conversionRate}
                onChange={(e) => updateUnit(idx, 'conversionRate', parseFloat(e.target.value) || 0)}
                disabled={unit.isBaseUnit}
                inputProps={{ min: 0, step: 0.01 }}
                variant="outlined"
                hiddenLabel
              />
              <Chip
                label="Ana"
                size="small"
                color={unit.isBaseUnit ? 'primary' : 'default'}
                variant={unit.isBaseUnit ? 'filled' : 'outlined'}
                onClick={() => updateUnit(idx, 'isBaseUnit', !unit.isBaseUnit)}
                sx={{ cursor: 'pointer', minWidth: 44 }}
              />
              <IconButton
                size="small"
                onClick={() => removeUnit(idx)}
                disabled={units.length <= 1}
                aria-label="Birimi kaldır"
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>

        {validationError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {validationError}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          İptal
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {saving ? 'Kaydediliyor...' : isEditing ? 'Kaydet' : 'Oluştur'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type ViewMode = 'grid' | 'list';

const LIST_GRID = 'minmax(200px, 1.4fr) 88px minmax(120px, 1fr) minmax(160px, 1.6fr) 96px';

export default function BirimSetleriPage() {
  const [unitSets, setUnitSets] = useState<UnitSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<UnitSet | null>(null);
  const [bulkCreating, setBulkCreating] = useState(false);
  const { can } = usePermission();

  const AUTO_TEMPLATE_COUNT = TEMPLATES.filter((t) => t.id !== 'bos').length;

  const fetchUnitSets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/unit-sets');
      setUnitSets(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch {
      setError('Birim setleri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUnitSets(); }, [fetchUnitSets]);

  const filtered = unitSets.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.units.some(u => u.name.toLowerCase().includes(q) || u.code?.toLowerCase().includes(q));
  });

  const handleSaved = () => {
    setDialogOpen(false);
    setEditingSet(null);
    setSnackbar({ open: true, message: editingSet ? 'Birim seti güncellendi.' : 'Yeni birim seti oluşturuldu.', severity: 'success' });
    fetchUnitSets();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" birim setini silmek istediğinize emin misiniz?`)) return;
    try {
      await axios.delete(`/unit-sets/${id}`);
      setSnackbar({ open: true, message: 'Birim seti silindi.', severity: 'success' });
      fetchUnitSets();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Silme işlemi başarısız.');
    }
  };

  const openCreate = () => { setEditingSet(null); setDialogOpen(true); };
  const openEdit = (unitSet: UnitSet) => { setEditingSet(unitSet); setDialogOpen(true); };

  const handleBulkCreate = async () => {
    const confirmed = confirm(
      `Sistem varsayılan birim setleri ve ${AUTO_TEMPLATE_COUNT} hazır şablon (Adet, Paket, Koli, Metre, Kilogram, Litre vb.) otomatik oluşturulacak.\n\nAynı isimde kayıt varsa atlanır. Devam edilsin mi?`,
    );
    if (!confirmed) return;

    setBulkCreating(true);
    setError(null);
    try {
      let created: number;
      let skipped: number;
      let createdNames: string[];

      try {
        const res = await axios.post<{
          created: number;
          skipped: number;
          createdNames: string[];
        }>('/unit-sets/bulk-from-templates');
        ({ created, skipped, createdNames } = res.data);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          ({ created, skipped, createdNames } = await bulkCreateFromTemplatesClient());
        } else {
          throw err;
        }
      }

      await fetchUnitSets();

      if (created === 0) {
        setSnackbar({
          open: true,
          severity: 'info',
          message:
            skipped > 0
              ? 'Tüm şablon birim setleri zaten mevcut; yeni kayıt eklenmedi.'
              : 'Birim seti oluşturulmadı.',
        });
      } else {
        const preview =
          createdNames.length <= 4
            ? createdNames.join(', ')
            : `${createdNames.slice(0, 3).join(', ')} ve ${createdNames.length - 3} diğeri`;
        setSnackbar({
          open: true,
          severity: 'success',
          message: `${created} birim seti oluşturuldu${skipped > 0 ? `, ${skipped} atlandı` : ''}${preview ? `: ${preview}` : ''}.`,
        });
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Birim setleri otomatik oluşturulamadı.';
      setError(message);
    } finally {
      setBulkCreating(false);
    }
  };

  const renderUnitSetCard = (unitSet: UnitSet) => {
    const base = unitSet.units.find((u) => u.isBaseUnit);
    const subs = unitSet.units.filter((u) => !u.isBaseUnit);
    return (
      <Paper
        elevation={0}
        sx={{
          border: '1px solid var(--border)',
          borderRadius: 2.5,
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          '&:hover': { borderColor: 'var(--primary)', boxShadow: '0 8px 32px rgba(99,102,241,0.1)', transform: 'translateY(-2px)' },
        }}
      >
        <Box
          sx={{
            background: unitSet.isSystem
              ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
              : 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)',
            px: 2.5,
            py: 1.75,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1.5, p: 1, display: 'flex', alignItems: 'center', color: 'white', flexShrink: 0 }}>
            {getSetIcon(unitSet.name)}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" fontWeight={700} noWrap sx={{ color: 'white' }}>
              {unitSet.name}
            </Typography>
            {unitSet.description && (
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', noWrap: true }}>
                {unitSet.description}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <Chip
              icon={unitSet.isSystem ? <Lock sx={{ fontSize: '11px !important' }} /> : <Business sx={{ fontSize: '11px !important' }} />}
              label={unitSet.isSystem ? 'SİSTEM' : 'ÖZEL'}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.65rem',
                fontWeight: 700,
                bgcolor: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                '& .MuiChip-icon': { color: 'rgba(255,255,255,0.8)' },
              }}
            />
            {!unitSet.isSystem && (
              <IconButton
                size="small"
                onClick={() => openEdit(unitSet)}
                sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }, width: 30, height: 30 }}
              >
                <Edit sx={{ fontSize: 14 }} />
              </IconButton>
            )}
          </Box>
        </Box>

        <Box sx={{ p: 2.5 }}>
          {base && (
            <Box sx={{ mb: subs.length > 0 ? 2 : 0 }}>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.65rem', mb: 0.75, display: 'block' }}>
                Ana Birim
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, background: 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)', color: 'white', display: 'flex', alignItems: 'center', gap: 0.75, boxShadow: '0 2px 8px rgba(99,102,241,0.2)' }}>
                  <Typography variant="body2" fontWeight={700}>
                    {base.name}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {base.code}
                  </Typography>
                </Box>
                {base.isDivisible && (
                  <Chip label="Bölünebilir" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: 'color-mix(in srgb, var(--chart-3) 12%, transparent)', color: 'var(--chart-3)', border: '1px solid var(--chart-3)', borderRadius: 1 }} />
                )}
              </Box>
            </Box>
          )}

          {subs.length > 0 ? (
            <Box>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.65rem', mb: 0.75, display: 'block' }}>
                Alt Birimler ({subs.length})
              </Typography>
              <Stack spacing={0.75}>
                {subs.map((unit, idx) => (
                  <Box
                    key={unit.id ?? idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 1.5,
                      py: 1,
                      borderRadius: 1.5,
                      border: '1px solid var(--border)',
                      bgcolor: 'var(--muted)',
                      '&:hover': { borderColor: 'var(--primary)', bgcolor: 'color-mix(in srgb, var(--primary) 4%, var(--muted))' },
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
                      {unit.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 500 }}>
                      ×{unit.conversionRate}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          ) : (
            <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
              Alt birim yok
            </Typography>
          )}

          {!unitSet.isSystem && can('unit-set', 'delete') && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                startIcon={<Delete sx={{ fontSize: 14 }} />}
                onClick={() => handleDelete(unitSet.id, unitSet.name)}
                sx={{ color: 'var(--destructive)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'none', borderRadius: 1.5, px: 1.5, '&:hover': { bgcolor: 'color-mix(in srgb, var(--destructive) 10%, transparent)' } }}
              >
                Sil
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    );
  };

  const renderUnitSetList = () => (
    <Box sx={{ overflowX: 'auto', mx: -0.5, px: 0.5 }}>
    <Paper elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 2, overflow: 'hidden', minWidth: 720 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: LIST_GRID,
          gap: 2,
          px: 2.5,
          py: 1.25,
          bgcolor: 'var(--muted)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {['Birim seti', 'Tür', 'Ana birim', 'Birimler', 'İşlem'].map((label) => (
          <Typography
            key={label}
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: label === 'İşlem' ? 'right' : 'left' }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      {filtered.map((unitSet, idx) => {
        const base = unitSet.units.find((u) => u.isBaseUnit);
        const others = unitSet.units.filter((u) => !u.isBaseUnit);
        return (
          <Box
            key={unitSet.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: LIST_GRID,
              gap: 2,
              alignItems: 'center',
              px: 2.5,
              py: 1.5,
              borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none',
              '&:hover': { bgcolor: 'color-mix(in srgb, var(--primary) 4%, transparent)' },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" minWidth={0}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: unitSet.isSystem ? 'grey.200' : 'color-mix(in srgb, var(--primary) 12%, transparent)',
                  color: unitSet.isSystem ? 'grey.700' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {getSetIcon(unitSet.name)}
              </Box>
              <Box minWidth={0}>
                <Typography fontWeight={700} noWrap title={unitSet.name}>
                  {unitSet.name}
                </Typography>
                {unitSet.description && (
                  <Typography variant="caption" color="text.secondary" noWrap title={unitSet.description}>
                    {unitSet.description}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Chip
              icon={unitSet.isSystem ? <Lock sx={{ fontSize: '14px !important' }} /> : <Business sx={{ fontSize: '14px !important' }} />}
              label={unitSet.isSystem ? 'Sistem' : 'Özel'}
              size="small"
              variant="outlined"
              sx={{ width: 'fit-content', fontWeight: 600, fontSize: '0.7rem' }}
            />

            <Typography variant="body2" fontWeight={600} noWrap>
              {base ? (
                <>
                  {base.name}
                  {base.code && (
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      ({base.code})
                    </Typography>
                  )}
                </>
              ) : (
                '—'
              )}
            </Typography>

            <Stack direction="row" flexWrap="wrap" gap={0.5} useFlexGap>
              {others.length === 0 ? (
                <Typography variant="caption" color="text.disabled">
                  Alt birim yok
                </Typography>
              ) : (
                others.map((u, i) => (
                  <Chip
                    key={u.id ?? i}
                    label={`${u.name} ×${u.conversionRate}`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 22, fontSize: '0.7rem', fontWeight: 500 }}
                  />
                ))
              )}
            </Stack>

            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
              {!unitSet.isSystem && (
                <>
                  <Tooltip title="Düzenle">
                    <span>
                      <IconButton size="small" onClick={() => openEdit(unitSet)} aria-label="Düzenle">
                        <Edit fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  {can('unit-set', 'delete') && (
                    <Tooltip title="Sil">
                      <IconButton size="small" onClick={() => handleDelete(unitSet.id, unitSet.name)} aria-label="Sil" sx={{ color: 'var(--destructive)' }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
              {unitSet.isSystem && (
                <Typography variant="caption" color="text.disabled" sx={{ pr: 1 }}>
                  —
                </Typography>
              )}
            </Stack>
          </Box>
        );
      })}
    </Paper>
    </Box>
  );

  return (
    <StandardPage
      title="Birim Setleri"
      subtitle="Ürün birimlerini ve dönüşüm oranlarını yönetin"
      headerActions={
        <Stack direction="row" spacing={1.5}>
          <Tooltip title="Yenile">
            <span>
              <IconButton
                onClick={fetchUnitSets}
                disabled={loading}
                sx={{
                  width: 40, height: 40,
                  bgcolor: 'var(--muted)',
                  border: '1px solid var(--border)',
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'var(--secondary)', borderColor: 'var(--primary)' },
                }}
              >
                {loading ? <CircularProgress size={18} /> : <Refresh fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
{can('unit-set', 'create') && (
            <Button
              variant="outlined"
              startIcon={bulkCreating ? <CircularProgress size={16} color="inherit" /> : <AutoAwesome />}
              onClick={handleBulkCreate}
              disabled={loading || bulkCreating}
              sx={{
                borderRadius: 2,
                px: 2,
                fontWeight: 700,
                textTransform: 'none',
                borderColor: 'var(--border)',
                color: 'var(--primary)',
                '&:hover': {
                  borderColor: 'var(--primary)',
                  bgcolor: 'color-mix(in srgb, var(--primary) 8%, transparent)',
                },
              }}
            >
              Tümünü Otomatik Oluştur
            </Button>
          )}
          {can('unit-set', 'create') && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openCreate}
              disabled={bulkCreating}
              sx={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)',
                color: 'white',
                borderRadius: 2,
                px: 2.5,
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 4px 16px rgba(99,102,241,0.25)',
                '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', boxShadow: '0 6px 20px rgba(99,102,241,0.3)', transform: 'translateY(-1px)' },
                transition: 'all 0.2s ease',
              }}
            >
              Yeni Birim Seti
            </Button>
          )}
        </Stack>
      }
    >
      {/* Stats Row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {[
          { label: 'Toplam', value: unitSets.length, grad: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', icon: <Scale sx={{ fontSize: 18 }} /> },
          { label: 'Sistem', value: unitSets.filter(s => s.isSystem).length, grad: 'linear-gradient(135deg, #64748b 0%, #475569 100%)', icon: <Lock sx={{ fontSize: 18 }} /> },
          { label: 'Özel', value: unitSets.filter(s => !s.isSystem).length, grad: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', icon: <Business sx={{ fontSize: 18 }} /> },
        ].map((s, i) => (
          <Paper key={i} elevation={0} sx={{ flex: 1, border: '1px solid var(--border)', borderRadius: 2, p: 2, background: s.grad, color: 'white', display: 'flex', alignItems: 'center', gap: 1.5, '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }, transition: 'all 0.2s ease' }}>
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1.5, p: 1, display: 'flex', alignItems: 'center' }}>{s.icon}</Box>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1 }}>{s.value}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>{s.label} birim seti</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Search + view toggle */}
      <Paper
        variant="outlined"
        sx={{
          mb: 2,
          p: 1.5,
          borderRadius: 2,
          borderColor: 'var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
          '&:focus-within': { borderColor: 'var(--primary)', boxShadow: '0 0 0 3px color-mix(in srgb, var(--primary) 10%, transparent)' },
          transition: 'box-shadow 0.2s',
        }}
      >
        <Search sx={{ color: 'text.disabled', fontSize: 20 }} />
        <TextField
          fullWidth
          placeholder="Birim seti veya birim ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          InputProps={{ disableUnderline: true, sx: { '& input': { py: 0.5 } } }}
          variant="standard"
          sx={{ flex: 1, minWidth: 200 }}
        />
        {search && (
          <IconButton size="small" onClick={() => setSearch('')} sx={{ color: 'text.disabled' }} aria-label="Aramayı temizle">
            <Close sx={{ fontSize: 16 }} />
          </IconButton>
        )}
        <ToggleButtonGroup
          size="small"
          exclusive
          value={viewMode}
          onChange={(_, v: ViewMode | null) => v && setViewMode(v)}
          sx={{
            bgcolor: 'var(--muted)',
            flexShrink: 0,
            '& .MuiToggleButton-root': {
              border: 'none',
              px: 1.25,
              '&.Mui-selected': { bgcolor: 'background.paper', boxShadow: 'var(--shadow-sm)' },
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
      </Paper>

      {!loading && filtered.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontWeight: 600 }}>
          {filtered.length} birim seti
          {search ? ` · "${search}"` : ''}
        </Typography>
      )}

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={36} sx={{ color: 'var(--primary)' }} />
        </Box>
      ) : filtered.length === 0 ? (
        <Paper elevation={0} sx={{ py: 10, textAlign: 'center', border: '1px solid var(--border)', borderRadius: 2, bgcolor: 'background.paper' }}>
          <Box sx={{ width: 64, height: 64, borderRadius: 2.5, background: 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', mx: 'auto', mb: 2.5, boxShadow: '0 6px 20px rgba(99,102,241,0.25)' }}>
            <Scale sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>{search ? 'Sonuç bulunamadı' : 'Henüz birim seti yok'}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{search ? `"${search}" için arama sonucu yok` : 'Yeni birim seti oluşturarak başlayın'}</Typography>
          {!search && can('unit-set', 'create') && (
            <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<AutoAwesome />}
                onClick={handleBulkCreate}
                disabled={bulkCreating}
                sx={{ borderRadius: 1.5, fontWeight: 700, textTransform: 'none', px: 3 }}
              >
                Tümünü Otomatik Oluştur
              </Button>
              <Button variant="contained" startIcon={<Add />} onClick={openCreate} sx={{ borderRadius: 1.5, fontWeight: 700, textTransform: 'none', px: 3 }}>
                Yeni Birim Seti Oluştur
              </Button>
            </Stack>
          )}
        </Paper>
      ) : viewMode === 'list' ? (
        renderUnitSetList()
      ) : (
        <Grid container spacing={2.5}>
          {filtered.map((unitSet) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={unitSet.id}>
              {renderUnitSetCard(unitSet)}
            </Grid>
          ))}
        </Grid>
      )}

      <UnitSetDialog
        open={dialogOpen}
        editingSet={editingSet}
        onClose={() => { setDialogOpen(false); setEditingSet(null); }}
        onSaved={handleSaved}
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 500 }}>{snackbar.message}</Alert>
      </Snackbar>
    </StandardPage>
  );
}
