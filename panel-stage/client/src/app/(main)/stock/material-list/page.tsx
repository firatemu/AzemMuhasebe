'use client';

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  ListItemIcon,
  Grid,
  Autocomplete,
  Divider,
  InputAdornment,
  FormHelperText,
  ListSubheader,
  CircularProgress,
  Tooltip,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Switch,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import { Add, Edit, Delete, Search, FileDownload, History, CompareArrows, Warehouse, Refresh, ExpandLess, ExpandMore, BarChart, Close, ArrowUpward, ArrowDownward, CalendarToday, MoreVert } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme, alpha } from '@mui/material/styles';
import { StandardPage, StandardCard } from '@/components/common';
import { useTabStore } from '@/stores/tabStore';
import axios from '@/lib/axios';
import { useDebounce } from '@/hooks/useDebounce';
import TableSkeleton from '@/components/Loading/TableSkeleton';
import * as XLSX from 'xlsx';
import { useSnackbar } from 'notistack';

interface Malzeme {
  id: string;
  stokKodu: string;
  stokAdi: string;
  barkod?: string;
  aciklama?: string;
  marka: string;
  model?: string;
  anaKategori: string;
  altKategori: string;
  birim: string;
  birimId?: string;
  miktar?: number;
  olcu: string;
  oem: string;
  tedarikciKodu?: string;
  raf?: string;
  alisFiyati: number;
  satisFiyati: number;
  aracMarka?: string;
  aracModel?: string;
  aracMotorHacmi?: string;
  aracYakitTipi?: string;
  weight?: number;
  weightUnit?: string;
  dimensions?: string;
  countryOfOrigin?: string;
  warrantyMonths?: number;
  criticalQty?: number;
  internalNote?: string;
  minOrderQty?: number;
  leadTimeDays?: number;
  code?: string;
  name?: string;
  mainCategory?: string;
  subCategory?: string;
  size?: string;
  supplierCode?: string;
  quantity?: number;
}

interface Location {
  id: string;
  code: string;
  name: string;
  barcode?: string;
}

const mapProductToMalzeme = (p: any): Malzeme => {
  const purchasePrice = p.priceCards?.find((c: any) => c.type === 'PURCHASE')?.price || 0;
  const salePrice = p.priceCards?.find((c: any) => c.type === 'SALE')?.price || 0;

  return {
    ...p,
    stokKodu: p.code,
    stokAdi: p.name,
    barkod: p.barcode || '',
    aciklama: p.description || '',
    model: p.model || '',
    anaKategori: p.mainCategory || '',
    altKategori: p.subCategory || '',
    olcu: p.size || '',
    tedarikciKodu: p.supplierCode || '',
    miktar: p.quantity ?? 0,
    alisFiyati: Number(purchasePrice),
    satisFiyati: Number(salePrice),
    birim: p.unit || p.birim || 'Adet',
    birimId: p.unitId || p.birimId || '',
    criticalQty: p.criticalQty ?? 0,
    isB2B: p.isB2B || false,
  };
};

interface MalzemeFormData {
  stokKodu: string;
  stokAdi: string;
  barkod: string;
  aciklama?: string;
  marka: string;
  model?: string;
  anaKategori: string;
  altKategori: string;
  birim: string;
  birimId: string;
  olcu: string;
  oem: string;
  raf: string;
  tedarikciKodu: string;
  alisFiyati: number;
  satisFiyati: number;
  aracMarka?: string;
  aracModel?: string;
  aracMotorHacmi?: string;
  aracYakitTipi?: string;
  weight?: number;
  weightUnit?: string;
  dimensions?: string;
  countryOfOrigin?: string;
  warrantyMonths?: number;
  criticalQty?: number;
  internalNote?: string;
  minOrderQty?: number;
  leadTimeDays?: number;
  purchaseVatRate?: number;
  salesVatRate?: number;
  isB2B?: boolean;
}

interface MalzemeFormDialogProps {
  open: boolean;
  initialFormData: MalzemeFormData;
  editingMalzeme: Malzeme | null;
  locations: Location[];
  kategoriler: Record<string, string[]>;
  markalar: string[];
  aracMarkalar: string[];
  aracModeller: string[];
  aracMotorHacimleri: string[];
  aracYakitTipleri: string[];
  birimSetleri: any[];
  canEditUnit?: boolean;
  onAracMarkaChange: (marka: string) => void;
  onClose: () => void;
  onSubmit: (data: MalzemeFormData) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const MalzemeFormDialog = memo(({
  open,
  initialFormData,
  editingMalzeme,
  locations,
  kategoriler,
  markalar,
  aracMarkalar,
  aracModeller,
  aracMotorHacimleri,
  aracYakitTipleri,
  birimSetleri,
  canEditUnit = true,
  onAracMarkaChange,
  onClose,
  onSubmit,
}: MalzemeFormDialogProps) => {
  const [localFormData, setLocalFormData] = useState<MalzemeFormData>(initialFormData);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    if (open) {
      setTabIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (open && initialFormData.anaKategori && initialFormData.altKategori) {
      const currentOptions = kategoriler[initialFormData.anaKategori] || [];
      setLocalFormData(initialFormData);
    } else {
      setLocalFormData(initialFormData);
    }
  }, [initialFormData, open, kategoriler]);

  const handleLocalChange = useCallback((field: keyof MalzemeFormData, value: any) => {
    setLocalFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAnaKategoriChange = useCallback((value: string) => {
    setLocalFormData((prev) => ({ ...prev, anaKategori: value, altKategori: '' }));
  }, []);

  const handleAracMarkaChange = useCallback((value: string) => {
    setLocalFormData((prev) => ({ ...prev, aracMarka: value, aracModel: '' }));
    onAracMarkaChange(value);
  }, [onAracMarkaChange]);

  const handleLocalSubmit = useCallback(() => {
    onSubmit(localFormData);
  }, [localFormData, onSubmit]);

  const altKategoriOptions = useMemo(() => {
    if (!localFormData.anaKategori) {
      return [];
    }
    const options = kategoriler[localFormData.anaKategori] || [];

    if (editingMalzeme && localFormData.altKategori && !options.includes(localFormData.altKategori)) {
      return [...options, localFormData.altKategori];
    }

    return options;
  }, [localFormData.anaKategori, localFormData.altKategori, kategoriler, editingMalzeme]);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '70vh',
          bgcolor: 'var(--card)',
          backgroundImage: 'none',
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle component="div"
        sx={{
          background: 'linear-gradient(135deg, #1e293b, #334155)', // More stable dark slate gradient
          color: '#ffffff', // Explicit white for title
          fontSize: '1.1rem',
          py: 2,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {editingMalzeme ? <Edit sx={{ fontSize: 20, color: '#ffffff' }} /> : <Add sx={{ fontSize: 20, color: '#ffffff' }} />}
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1, color: '#ffffff' }}>
            {editingMalzeme ? 'Malzeme Düzenle' : 'Yeni Malzeme Ekle'}
          </Typography>
        </Box>
        <Typography variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5, fontWeight: 500 }}>
          {editingMalzeme ? 'Mevcut stok bilgilerini güncelleyin.' : 'Yeni bir stok kartı tanımlayarak envantere ekleyin.'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 0, bgcolor: 'var(--background)', borderTop: '1px solid var(--border)', px: 0, overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'var(--border)', bgcolor: 'var(--card)' }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="malzeme form sekmeleri"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                minHeight: 48,
              },
              '& .Mui-selected': {
                color: 'var(--primary) !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--primary)',
              }
            }}
          >
            <Tab label="Genel Bilgiler" {...a11yProps(0)} />
            <Tab label="Teknik Detaylar" {...a11yProps(1)} />
            <Tab label="Araç Uyumluluğu" {...a11yProps(2)} />
            <Tab label="Finans & Notlar" {...a11yProps(3)} />
          </Tabs>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
          <CustomTabPanel value={tabIndex} index={0}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Stok Kodu"
                  value={localFormData.stokKodu}
                  onChange={(e) => handleLocalChange('stokKodu', e.target.value)}
                  size="small"
                  helperText={localFormData.stokKodu ? "Önerilen kod" : "Otomatik üretilecek"}
                  sx={{ '& .MuiInputBase-input': { fontWeight: 600 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  fullWidth
                  label="Stok Adı"
                  value={localFormData.stokAdi}
                  onChange={(e) => handleLocalChange('stokAdi', e.target.value)}
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Barkod"
                  value={localFormData.barkod || ''}
                  onChange={(e) => handleLocalChange('barkod', e.target.value)}
                  size="small"
                  placeholder="Ürün barkod numarası"
                  helperText="Opsiyonel"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Model"
                  value={localFormData.model || ''}
                  onChange={(e) => handleLocalChange('model', e.target.value)}
                  size="small"
                  placeholder="Ürün modeli"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Açıklama"
                  value={localFormData.aciklama || ''}
                  onChange={(e) => handleLocalChange('aciklama', e.target.value)}
                  size="small"
                  multiline
                  rows={2}
                  placeholder="Ürün hakkında ek bilgiler"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel shrink>Marka</InputLabel>
                  <Select
                    value={localFormData.marka || ''}
                    label="Marka"
                    displayEmpty
                    onChange={(e) => handleLocalChange('marka', e.target.value)}
                  >
                    <MenuItem value=""><em>Seçiniz</em></MenuItem>
                    {markalar.filter(Boolean).map((marka, idx) => (
                      <MenuItem key={marka || `marka-${idx}`} value={marka}>{marka}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel shrink>Ana Kategori *</InputLabel>
                  <Select
                    value={localFormData.anaKategori}
                    label="Ana Kategori *"
                    displayEmpty
                    onChange={(e) => handleAnaKategoriChange(e.target.value)}
                  >
                    <MenuItem value=""><em>Seçiniz</em></MenuItem>
                    {Object.keys(kategoriler).filter(Boolean).map((kategori, idx) => (
                      <MenuItem key={kategori || `kat-${idx}`} value={kategori}>{kategori}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl
                  fullWidth
                  size="small"
                  disabled={!localFormData.anaKategori}
                >
                  <InputLabel shrink>Alt Kategori</InputLabel>
                  <Select
                    value={localFormData.altKategori || ''}
                    label="Alt Kategori"
                    displayEmpty
                    onChange={(e) => handleLocalChange('altKategori', e.target.value)}
                  >
                    <MenuItem value=""><em>Seçiniz</em></MenuItem>
                    {altKategoriOptions.filter(Boolean).map((altKat, idx) => (
                      <MenuItem key={altKat || `alt-kat-${idx}`} value={altKat}>{altKat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel shrink>Birim *</InputLabel>
                  <Select
                    value={localFormData.birimId || ''}
                    label="Birim *"
                    displayEmpty
                    disabled={!canEditUnit && !!editingMalzeme}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      let selectedName = '';
                      birimSetleri.forEach(set => {
                        const found = (set.units || []).find((b: any) => b.id === selectedId);
                        if (found) selectedName = found.name;
                      });
                      setLocalFormData(prev => ({ ...prev, birimId: selectedId, birim: selectedName }));
                    }}
                  >
                    <MenuItem value=""><em>Seçiniz</em></MenuItem>
                    {birimSetleri.flatMap((set) => [
                      <ListSubheader key={`header-${set.id}`}>{set.name}</ListSubheader>,
                      ...(set.units?.map((b: any) => (
                        <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                      )) || [])
                    ])}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Autocomplete<Location, false, false, true>
                  fullWidth
                  options={locations}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.code)}
                  value={locations.find((l) => l.code === localFormData.raf) ?? null}
                  onChange={(_, newValue) => handleLocalChange('raf', typeof newValue === 'string' ? newValue : newValue?.code || '')}
                  renderInput={(params) => <TextField {...params} label="Raf Adresi" size="small" id="material-list-raf" />}
                  freeSolo
                  onInputChange={(_, newValue) => handleLocalChange('raf', newValue)}
                />
              </Grid>
            </Grid>
          </CustomTabPanel>

          <CustomTabPanel value={tabIndex} index={1}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="OEM Kodu" value={localFormData.oem || ''} onChange={(e) => handleLocalChange('oem', e.target.value)} size="small" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Tedarikçi Kodu" value={localFormData.tedarikciKodu || ''} onChange={(e) => handleLocalChange('tedarikciKodu', e.target.value)} size="small" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Ölçü / Teknik Özellikler" value={localFormData.olcu || ''} onChange={(e) => handleLocalChange('olcu', e.target.value)} size="small" />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField fullWidth label="Ağırlık" type="number" value={localFormData.weight ?? ''} onChange={(e) => handleLocalChange('weight', e.target.value === '' ? undefined : parseFloat(e.target.value))} size="small" />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Ağırlık Birimi</InputLabel>
                  <Select value={localFormData.weightUnit || 'kg'} label="Ağırlık Birimi" onChange={(e) => handleLocalChange('weightUnit', e.target.value)}>
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="g">g</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Boyutlar" value={localFormData.dimensions || ''} onChange={(e) => handleLocalChange('dimensions', e.target.value)} placeholder="10x20x5 cm" size="small" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Menşei Ülke" value={localFormData.countryOfOrigin || ''} onChange={(e) => handleLocalChange('countryOfOrigin', e.target.value)} size="small" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Garanti (Ay)" type="number" value={localFormData.warrantyMonths ?? ''} onChange={(e) => handleLocalChange('warrantyMonths', e.target.value === '' ? undefined : parseInt(e.target.value, 10))} size="small" />
              </Grid>
            </Grid>
          </CustomTabPanel>

          <CustomTabPanel value={tabIndex} index={2}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel shrink>Araç Markası</InputLabel>
                  <Select
                    value={localFormData.aracMarka || ''}
                    label="Araç Markası"
                    displayEmpty
                    onChange={(e) => handleAracMarkaChange(e.target.value)}
                  >
                    <MenuItem value=""><em>Seçiniz</em></MenuItem>
                    {aracMarkalar.map((marka) => (
                      <MenuItem key={marka} value={marka}>{marka}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small" disabled={!localFormData.aracMarka}>
                  <InputLabel shrink>Araç Modeli</InputLabel>
                  <Select
                    value={localFormData.aracModel || ''}
                    label="Araç Modeli"
                    displayEmpty
                    onChange={(e) => handleLocalChange('aracModel', e.target.value)}
                  >
                    <MenuItem value=""><em>Seçiniz</em></MenuItem>
                    {aracModeller.map((model) => (
                      <MenuItem key={model} value={model}>{model}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel shrink>Motor Hacmi</InputLabel>
                  <Select
                    value={localFormData.aracMotorHacmi || ''}
                    label="Motor Hacmi"
                    displayEmpty
                    onChange={(e) => handleLocalChange('aracMotorHacmi', e.target.value)}
                  >
                    <MenuItem value=""><em>Seçiniz</em></MenuItem>
                    {aracMotorHacimleri.map((hacim) => (
                      <MenuItem key={hacim} value={hacim}>{hacim}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel shrink>Yakıt Tipi</InputLabel>
                  <Select
                    value={localFormData.aracYakitTipi || ''}
                    label="Yakıt Tipi"
                    displayEmpty
                    onChange={(e) => handleLocalChange('aracYakitTipi', e.target.value)}
                  >
                    <MenuItem value=""><em>Seçiniz</em></MenuItem>
                    {aracYakitTipleri.map((yakit) => (
                      <MenuItem key={yakit} value={yakit}>{yakit}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CustomTabPanel>

          <CustomTabPanel value={tabIndex} index={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel shrink>Satış KDV Oranı (%)</InputLabel>
                  <Select
                    value={localFormData.salesVatRate ?? 20}
                    label="Satış KDV Oranı (%)"
                    onChange={(e) => handleLocalChange('salesVatRate', e.target.value as number)}
                  >
                    <MenuItem value={0}>%0</MenuItem>
                    <MenuItem value={1}>%1</MenuItem>
                    <MenuItem value={8}>%8</MenuItem>
                    <MenuItem value={10}>%10</MenuItem>
                    <MenuItem value={18}>%18</MenuItem>
                    <MenuItem value={20}>%20</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel shrink>Satınalma KDV Oranı (%)</InputLabel>
                  <Select
                    value={localFormData.purchaseVatRate ?? 20}
                    label="Satınalma KDV Oranı (%)"
                    onChange={(e) => handleLocalChange('purchaseVatRate', e.target.value as number)}
                  >
                    <MenuItem value={0}>%0</MenuItem>
                    <MenuItem value={1}>%1</MenuItem>
                    <MenuItem value={8}>%8</MenuItem>
                    <MenuItem value={10}>%10</MenuItem>
                    <MenuItem value={18}>%18</MenuItem>
                    <MenuItem value={20}>%20</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Min. Sipariş Miktarı" type="number" value={localFormData.minOrderQty ?? ''} onChange={(e) => handleLocalChange('minOrderQty', e.target.value === '' ? undefined : parseInt(e.target.value, 10))} size="small" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Kritik Stok Miktarı"
                  type="number"
                  value={localFormData.criticalQty ?? ''}
                  onChange={(e) => handleLocalChange('criticalQty', e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                  size="small"
                  helperText="Bu miktarın altına düştüğünde uyarı verir"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Tedarik Süresi (Gün)" type="number" value={localFormData.leadTimeDays ?? ''} onChange={(e) => handleLocalChange('leadTimeDays', e.target.value === '' ? undefined : parseInt(e.target.value, 10))} size="small" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="İç Not" multiline rows={3} value={localFormData.internalNote || ''} onChange={(e) => handleLocalChange('internalNote', e.target.value)} size="small" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'color-mix(in srgb, var(--primary) 5%, transparent)', borderRadius: 2, border: '1px solid var(--border)' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--primary)' }}>
                      B2B Portalında Göster
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Bu ürün B2B portalında satışa sunulacak
                    </Typography>
                  </Box>
                  <Switch
                    checked={localFormData.isB2B || false}
                    onChange={(e) => handleLocalChange('isB2B', e.target.checked)}
                    color="primary"
                  />
                </Box>
              </Grid>
            </Grid>
          </CustomTabPanel>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, bgcolor: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
        <Button
          onClick={onClose}
          size="medium"
          sx={{
            borderRadius: 3,
            px: 2,
            border: '1px solid var(--border)',
            color: 'var(--muted-foreground)',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: 'var(--card)' },
          }}
        >
          İptal
        </Button>
        <Button
          onClick={handleLocalSubmit}
          variant="contained"
          size="medium"
          disabled={!localFormData.stokAdi}
          sx={{
            background: '#527575',
            color: '#0b0b0b',
            borderRadius: 3,
            px: 2.5,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              background: 'color-mix(in srgb, #527575 90%, #000 10%)',
              boxShadow: 'none',
            },
            '&:active': {
              boxShadow: 'none',
            },
          }}
        >
          {editingMalzeme ? '💾 Güncelle' : '➕ Ekle'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

MalzemeFormDialog.displayName = 'MalzemeFormDialog';

// Custom Toolbar Component
const CustomToolbar = () => {
  return (
    <GridToolbarContainer sx={{
      p: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border)',
      bgcolor: 'var(--card)'
    }}>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
        {/* MUI X v6/v7 standard search is through slots, but we can put a placeholder or custom one if needed */}
      </Box>
    </GridToolbarContainer>
  );
};

export default function MalzemeListesiPage() {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const router = useRouter();
  const { addTab, setActiveTab } = useTabStore();
  const [stoklar, setStoklar] = useState<Malzeme[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMalzeme, setEditingMalzeme] = useState<Malzeme | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedAltKategori, setSelectedAltKategori] = useState('');
  const [selectedMarka, setSelectedMarka] = useState('');
  const [stokDurumu, setStokDurumu] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [hareketDialogOpen, setHareketDialogOpen] = useState(false);
  const [hareketMalzeme, setHareketMalzeme] = useState<Malzeme | null>(null);
  const [hareketler, setHareketler] = useState<any[]>([]);
  const [hareketLoading, setHareketLoading] = useState(false);
  const [hareketTotal, setHareketTotal] = useState(0);
  const [canEditUnit, setCanEditUnit] = useState(true);

  const fetchHareketler = async (productId: string) => {
    try {
      setHareketLoading(true);
      const response = await axios.get('/product-movements', {
        params: {
          productId,
          limit: 100,
        },
      });
      setHareketler(response.data.data || []);
      setHareketTotal(response.data.meta?.total || 0);
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Hareketler yüklenirken hata oluştu', { variant: 'error' });
    } finally {
      setHareketLoading(false);
    }
  };

  const [hareketTipiFilter, setHareketTipiFilter] = useState('');
  const [esdegerDialogOpen, setEsdegerDialogOpen] = useState(false);
  const [esdegerMalzeme, setEsdegerMalzeme] = useState<Malzeme | null>(null);
  const [esdegerUrunler, setEsdegerUrunler] = useState<any[]>([]);
  const [esdegerLoading, setEsdegerLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const [kategoriler, setKategoriler] = useState<Record<string, string[]>>({});
  const [markalar, setMarkalar] = useState<string[]>([]);
  const [aracMarkalar, setAracMarkalar] = useState<string[]>([]);
  const [aracModeller, setAracModeller] = useState<string[]>([]);
  const [aracMotorHacimleri] = useState<string[]>(['1.0L', '1.2L', '1.4L', '1.5L', '1.6L', '1.8L', '2.0L', '2.2L', '2.5L', '3.0L', '3.5L', '4.0L', '5.0L']);
  const [aracYakitTipleri, setAracYakitTipleri] = useState<string[]>([]);
  const [selectedAracMarka, setSelectedAracMarka] = useState<string>('');
  const [birimSetleri, setBirimSetleri] = useState<any[]>([]);

  const [initialFormData, setInitialFormData] = useState<MalzemeFormData>({
    stokKodu: '',
    stokAdi: '',
    barkod: '',
    marka: '',
    anaKategori: '',
    altKategori: '',
    birim: 'Adet',
    olcu: '',
    oem: '',
    raf: '',
    tedarikciKodu: '',
    birimId: '',
    alisFiyati: 0,
    satisFiyati: 0,
  });

  useEffect(() => {
    setSelectedAltKategori('');
  }, [selectedKategori]);

  const fetchLocations = useCallback(async () => {
    try {
      const response = await axios.get('/location');
      setLocations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Raf listesi alınamadı:', error);
      setLocations([]);
    }
  }, []);

  const fetchKategoriler = useCallback(async () => {
    try {
      const response = await axios.get('/categories');
      const kategoriData = response.data || [];
      const kategoriMap: Record<string, string[]> = {};
      kategoriData.forEach((k: { mainCategory: string; subCategories: string[] }) => {
        kategoriMap[k.mainCategory] = k.subCategories || [];
      });
      setKategoriler(kategoriMap);
    } catch (error) {
      console.error('Kategori listesi alınamadı:', error);
      setKategoriler({});
    }
  }, []);

  const fetchMarkalar = useCallback(async () => {
    try {
      const response = await axios.get('/brand');
      const markaData = response.data || [];
      const markaList = markaData
        .map((m: { brandName: string; name?: string }) => m.brandName || m.name)
        .filter(Boolean);
      setMarkalar(markaList as string[]);
    } catch (error) {
      console.error('Marka listesi alınamadı:', error);
      setMarkalar([]);
    }
  }, []);

  const fetchAracMarkalar = useCallback(async () => {
    try {
      const response = await axios.get('/vehicle-brand/brands').catch(() => ({ data: [] }));
      setAracMarkalar(response.data || []);
    } catch (error) {
      console.error('Araç markaları yüklenemedi:', error);
      setAracMarkalar([]);
    }
  }, []);

  const fetchAracModeller = useCallback(async (marka: string) => {
    if (!marka) {
      setAracModeller([]);
      return;
    }
    try {
      const response = await axios.get('/vehicle-brand/models', {
        params: { brand: marka },
      });
      setAracModeller(response.data || []);
    } catch (error) {
      console.error('Araç modelleri yüklenemedi:', error);
      setAracModeller([]);
    }
  }, []);

  const fetchAracYakitTipleri = useCallback(async () => {
    try {
      const response = await axios.get('/vehicle-brand/fuel-types');
      setAracYakitTipleri(response.data || []);
    } catch (error) {
      console.error('Yakıt tipleri yüklenemedi:', error);
      setAracYakitTipleri([]);
    }
  }, []);

  const fetchBirimSetleri = useCallback(async () => {
    // Authentication kontrolü
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('MalzemeListesiPage: Authentication token bulunamadı, atlanıyor');
        setBirimSetleri([]);
        return;
      }
    }

    try {
      const response = await axios.get('/unit-sets');
      setBirimSetleri(response.data || []);
    } catch (error) {
      console.error('Birim setleri yüklenemedi:', error);
      setBirimSetleri([]);
    }
  }, []);

  const handleAracMarkaChange = useCallback((marka: string) => {
    setSelectedAracMarka(marka);
    fetchAracModeller(marka);
  }, [fetchAracModeller]);

  const fetchStoklar = useCallback(async () => {
    // Authentication kontrolü
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('MalzemeListesiPage: Authentication token bulunamadı, atlanıyor');
        setStoklar([]);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      const response = await axios.get('/products', {
        params: { search: debouncedSearch, limit: 100, page: 1 },
      });
      const rawData = response.data.data || [];
      const mappedData = rawData.map(mapProductToMalzeme);
      setStoklar(mappedData);
    } catch (error) {
      console.error('Stok verisi alınamadı:', error);
      setStoklar([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchStoklar();
    fetchLocations();
    fetchKategoriler();
    fetchMarkalar();
    fetchAracMarkalar();
    fetchAracYakitTipleri();
    fetchBirimSetleri();
  }, [fetchStoklar, fetchLocations, fetchKategoriler, fetchMarkalar, fetchAracMarkalar, fetchAracYakitTipleri, fetchBirimSetleri]);

  const handleOpenDialog = useCallback(async (malzeme?: Malzeme) => {
    if (malzeme) {
      setEditingMalzeme(malzeme);

      // Birim düzenleme iznini kontrol et (Hareket var mı?)
      try {
        const res = await axios.get(`/products/${malzeme.id}/can-delete`);
        setCanEditUnit(res.data.canDelete);
      } catch (e) {
        console.error('Birim düzenleme izni kontrol edilemedi:', e);
        setCanEditUnit(false);
      }

      if (malzeme.aracMarka) {
        await fetchAracModeller(malzeme.aracMarka);
        setSelectedAracMarka(malzeme.aracMarka);
      }
      setInitialFormData({
        stokKodu: malzeme.stokKodu,
        stokAdi: malzeme.stokAdi,
        barkod: malzeme.barkod || '',
        aciklama: malzeme.aciklama || '',
        marka: malzeme.marka || '',
        model: malzeme.model || '',
        anaKategori: malzeme.anaKategori || '',
        altKategori: malzeme.altKategori || '',
        birim: malzeme.birim || 'Adet',
        olcu: malzeme.olcu || '',
        oem: malzeme.oem || '',
        raf: malzeme.raf || '',
        tedarikciKodu: malzeme.tedarikciKodu || '',
        birimId: malzeme.birimId || '',
        aracMarka: malzeme.aracMarka || '',
        aracModel: malzeme.aracModel || '',
        aracMotorHacmi: malzeme.aracMotorHacmi || '',
        aracYakitTipi: malzeme.aracYakitTipi || '',
        alisFiyati: malzeme.alisFiyati || 0,
        satisFiyati: malzeme.satisFiyati || 0,
        weight: malzeme.weight,
        weightUnit: malzeme.weightUnit || 'kg',
        dimensions: malzeme.dimensions || '',
        countryOfOrigin: malzeme.countryOfOrigin || '',
        warrantyMonths: malzeme.warrantyMonths,
        criticalQty: malzeme.criticalQty ?? 0,
        internalNote: malzeme.internalNote || '',
        minOrderQty: malzeme.minOrderQty,
        leadTimeDays: malzeme.leadTimeDays,
        isB2B: malzeme.isB2B,
      });
    } else {
      setEditingMalzeme(null);
      setCanEditUnit(true);
      setSelectedAracMarka('');
      setAracModeller([]);

      let nextCode = '';
      try {
        const response = await axios.get('/code-templates/preview-code/PRODUCT');
        nextCode = response.data.nextCode || '';
        console.log('Bir sonraki stok kodu:', nextCode);
      } catch (error) {
        console.log('Numara şablonu bulunamadı veya hata oluştu, stok kodu manuel girilecek', error);
      }

      setInitialFormData({
        stokKodu: nextCode,
        stokAdi: '',
        barkod: '',
        aciklama: '',
        marka: '',
        model: '',
        anaKategori: '',
        altKategori: '',
        birim: 'Adet',
        olcu: '',
        oem: '',
        raf: '',
        tedarikciKodu: '',
        birimId: '',
        alisFiyati: 0,
        satisFiyati: 0,
        aracMarka: '',
        aracModel: '',
        aracMotorHacmi: '',
        aracYakitTipi: '',
        weight: undefined,
        weightUnit: 'kg',
        dimensions: '',
        countryOfOrigin: '',
        warrantyMonths: undefined,
        criticalQty: 0,
        internalNote: '',
        minOrderQty: undefined,
        leadTimeDays: undefined,
      });
    }
    setOpenDialog(true);
  }, [fetchAracModeller]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingMalzeme(null);
  }, []);

  const handleSubmit = useCallback(async (submitFormData: MalzemeFormData) => {
    if (submitFormData.stokKodu && submitFormData.stokKodu.trim().length > 0) {
      const mevcutStok = stoklar.find(s =>
        s.stokKodu.toLowerCase() === submitFormData.stokKodu.toLowerCase() &&
        s.id !== editingMalzeme?.id
      );

      if (mevcutStok) {
        enqueueSnackbar(`Bu stok kodu zaten kullanılıyor! (${mevcutStok.stokAdi})`, { variant: 'warning' });
        return;
      }
    }

    try {
      const payload = {
        code: submitFormData.stokKodu && submitFormData.stokKodu.trim().length > 0 ? submitFormData.stokKodu : undefined,
        name: submitFormData.stokAdi,
        barcode: submitFormData.barkod && submitFormData.barkod.trim().length > 0 ? submitFormData.barkod : undefined,
        description: submitFormData.aciklama && submitFormData.aciklama.trim().length > 0 ? submitFormData.aciklama : undefined,
        unit: submitFormData.birim,
        mainCategory: submitFormData.anaKategori || undefined,
        subCategory: submitFormData.altKategori || undefined,
        brand: submitFormData.marka || undefined,
        model: submitFormData.model && submitFormData.model.trim().length > 0 ? submitFormData.model : undefined,
        oem: submitFormData.oem || undefined,
        size: submitFormData.olcu || undefined,
        shelf: submitFormData.raf || undefined,
        supplierCode: submitFormData.tedarikciKodu && submitFormData.tedarikciKodu.trim().length > 0 ? submitFormData.tedarikciKodu : undefined,
        vehicleBrand: submitFormData.aracMarka || undefined,
        vehicleModel: submitFormData.aracModel || undefined,
        vehicleEngineSize: submitFormData.aracMotorHacmi || undefined,
        vehicleFuelType: submitFormData.aracYakitTipi || undefined,
        weight: submitFormData.weight != null ? submitFormData.weight : undefined,
        weightUnit: submitFormData.weightUnit || undefined,
        dimensions: submitFormData.dimensions || undefined,
        countryOfOrigin: submitFormData.countryOfOrigin || undefined,
        warrantyMonths: submitFormData.warrantyMonths != null ? submitFormData.warrantyMonths : undefined,
        criticalQty: submitFormData.criticalQty ?? 0,
        internalNote: submitFormData.internalNote || undefined,
        minOrderQty: submitFormData.minOrderQty != null ? submitFormData.minOrderQty : undefined,
        leadTimeDays: submitFormData.leadTimeDays != null ? submitFormData.leadTimeDays : undefined,
        purchaseVatRate: submitFormData.purchaseVatRate != null ? submitFormData.purchaseVatRate : undefined,
        salesVatRate: submitFormData.salesVatRate != null ? submitFormData.salesVatRate : undefined,
        vatRate: submitFormData.salesVatRate ?? 20,
        purchasePrice: Number(submitFormData.alisFiyati || 0),
        salePrice: Number(submitFormData.satisFiyati || 0),
        isB2B: submitFormData.isB2B,
      };

      console.log('Backend\'e gönderilen veri:', JSON.stringify(payload, null, 2));

      if (editingMalzeme) {
        await axios.patch(`/products/${editingMalzeme.id}`, payload);
      } else {
        await axios.post('/products', payload);
      }

      handleCloseDialog();
      fetchStoklar();
    } catch (error: any) {
      console.error('Malzeme kaydedilemedi:', error);
      console.error('Backend hatası:', error.response?.data);
      enqueueSnackbar(error.response?.data?.message || error.message || 'Malzeme kaydedilirken bir hata oluştu', { variant: 'error' });
    }
  }, [editingMalzeme, stoklar, handleCloseDialog, debouncedSearch, fetchStoklar]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const canDeleteResponse = await axios.get(`/products/${id}/can-delete`);
      const canDelete = canDeleteResponse.data;

      if (!canDelete.canDelete) {
        enqueueSnackbar(`Bu malzeme silinemez! (${canDelete.toplamHareketSayisi} işlemde kullanılmıştır)`, { variant: 'error' });
        return;
      }

      if (confirm('Bu malzemeyi silmek istediğinizden emin misiniz?')) {
        await axios.delete(`/products/${id}`);
        fetchStoklar();
      }
    } catch (error: any) {
      console.error('Malzeme silinemedi:', error);
      enqueueSnackbar(error.response?.data?.message || 'Malzeme silinirken bir hata oluştu', { variant: 'error' });
    }
  }, [debouncedSearch, fetchStoklar]);

  const handleOpenEsdegerDialog = useCallback(async (malzeme: Malzeme) => {
    setEsdegerMalzeme(malzeme);
    setEsdegerDialogOpen(true);
    setEsdegerLoading(true);
    setEsdegerUrunler([]);

    try {
      const response = await axios.get(`/products/${malzeme.id}/esdegerler`);
      if (response.data?.esdegerler && Array.isArray(response.data.esdegerler)) {
        setEsdegerUrunler(response.data.esdegerler.map(mapProductToMalzeme));
      } else {
        setEsdegerUrunler([]);
      }
    } catch (error: any) {
      console.error('Eşdeğer ürünler alınamadı:', error);
      if (error.response?.status !== 404) {
        enqueueSnackbar(error.response?.data?.message || 'Eşdeğer ürünler alınamadı.', { variant: 'error' });
      }
      setEsdegerUrunler([]);
    } finally {
      setEsdegerLoading(false);
    }
  }, []);

  const handleCloseEsdegerDialog = useCallback(() => {
    setEsdegerDialogOpen(false);
    setEsdegerMalzeme(null);
    setEsdegerUrunler([]);
  }, []);

  const handleOpenHareketDialog = (malzeme: Malzeme) => {
    setHareketMalzeme(malzeme);
    setHareketTipiFilter('');
    setHareketDialogOpen(true);
    fetchHareketler(malzeme.id);
  };

  const handleCloseHareketDialog = () => {
    setHareketDialogOpen(false);
    setHareketMalzeme(null);
  };

  const handleExportExcel = () => {
    if (filteredStoklar.length === 0) {
      enqueueSnackbar('Excel çıktısı için listede stok bulunamadı.', { variant: 'warning' });
      return;
    }

    const rows = filteredStoklar.map((stok) => ({
      'Stok Kodu': stok.stokKodu,
      'Stok Adı': stok.stokAdi,
      Marka: stok.marka || '-',
      'Raf Adresi': stok.raf || '-',
      'Ölçü': stok.olcu || '-',
      OEM: stok.oem || '-',
      'Araç Markası': stok.aracMarka || '-',
      'Araç Modeli': stok.aracModel || '-',
      'Motor Hacmi': stok.aracMotorHacmi || '-',
      'Yakıt Tipi': stok.aracYakitTipi || '-',
      Miktar: stok.miktar ?? 0,
      Birim: stok.birim,
      'Son Alış Fiyatı': Number(stok.alisFiyati ?? 0),
      'Satış Fiyatı': Number(stok.satisFiyati ?? 0),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Malzeme Listesi');
    const timestamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);
    XLSX.writeFile(workbook, `malzeme-listesi-${timestamp}.xlsx`);
  };

  const filteredStoklar = useMemo(() => {
    if (!Array.isArray(stoklar)) return [];
    return stoklar.filter((stok) => {
      const kategoriMatch = selectedKategori ? stok.anaKategori === selectedKategori : true;
      const altKategoriMatch = selectedAltKategori ? stok.altKategori === selectedAltKategori : true;
      const markaMatch = selectedMarka ? stok.marka === selectedMarka : true;
      const miktar = stok.miktar ?? 0;
      const stokMatch =
        stokDurumu === 'inStock'
          ? miktar > 0
          : stokDurumu === 'outOfStock'
            ? miktar <= 0
            : true;
      return kategoriMatch && altKategoriMatch && markaMatch && stokMatch;
    });
  }, [stoklar, selectedKategori, selectedAltKategori, selectedMarka, stokDurumu]);

  const altKategoriOptions = useMemo(() => {
    if (!selectedKategori) {
      return [] as string[];
    }
    return kategoriler[selectedKategori] || [];
  }, [selectedKategori, kategoriler]);

  const markaOptions = useMemo(() => {
    const collected = stoklar.map((s) => s.marka).filter(Boolean) as string[];
    return Array.from(new Set([...markalar, ...collected])).sort();
  }, [stoklar, markalar]);

  // Metrics calculation
  const totalMiktar = useMemo(() => {
    return filteredStoklar.reduce((sum, stok) => sum + (stok.miktar ?? 0), 0);
  }, [filteredStoklar]);

  const totalDeger = useMemo(() => {
    return filteredStoklar.reduce((sum, stok) => sum + ((stok.miktar ?? 0) * (stok.alisFiyati ?? 0)), 0);
  }, [filteredStoklar]);

  const stoktaOlan = useMemo(() => {
    return filteredStoklar.filter(s => (s.miktar ?? 0) > 0).length;
  }, [filteredStoklar]);

  const stokuBiten = useMemo(() => {
    return filteredStoklar.filter(s => (s.miktar ?? 0) <= 0).length;
  }, [filteredStoklar]);

  return (
    <StandardPage
      title="Malzeme Listesi"
      subtitle={`${filteredStoklar.length} malzeme gösteriliyor. ${totalMiktar.toLocaleString('tr-TR')} toplam adet envanterde bulunmaktadır.`}
      headerActions={
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownload />}
            onClick={handleExportExcel}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              '&:hover': {
                borderColor: 'var(--primary)',
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            Excel
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              bgcolor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              '&:hover': {
                bgcolor: 'var(--primary)',
                opacity: 0.9,
              },
            }}
          >
            Yeni Malzeme
          </Button>
        </Box>
      }
    >
      {/* 2. METRICS STRIP */}
      <Box
        sx={{
          mb: 3,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(5, 1fr)' },
          gap: 2,
        }}
      >
        {[
          { label: 'Toplam Malzeme', value: filteredStoklar.length, color: theme.palette.primary.main },
          { label: 'Toplam Miktar', value: totalMiktar.toLocaleString('tr-TR'), color: theme.palette.info.main },
          { label: 'Toplam Değer', value: `₺${totalDeger.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: theme.palette.success.main },
          { label: 'Stokta Olan', value: stoktaOlan, color: theme.palette.success.main },
          { label: 'Stoğu Biten', value: stokuBiten, color: theme.palette.error.main },
        ].map((metric, idx) => (
          <StandardCard key={idx} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {metric.label}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: metric.color, mt: 0.5 }}>
              {metric.value}
            </Typography>
          </StandardCard>
        ))}
      </Box>

      {/* 3. FILTERS & SEARCH */}
      <StandardCard sx={{ mb: 3 }}>
        <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          {/* Status Tabs */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              size="small"
              variant={stokDurumu === 'all' ? 'contained' : 'outlined'}
              onClick={() => setStokDurumu('all')}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Hepsi
            </Button>
            <Button
              size="small"
              variant={stokDurumu === 'inStock' ? 'contained' : 'outlined'}
              onClick={() => setStokDurumu('inStock')}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Stokta
            </Button>
            <Button
              size="small"
              variant={stokDurumu === 'outOfStock' ? 'contained' : 'outlined'}
              onClick={() => setStokDurumu('outOfStock')}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Bitmiş
            </Button>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Quick Selects */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Kategori</InputLabel>
            <Select
              label="Kategori"
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value=""><em>Hepsi</em></MenuItem>
              {Object.keys(kategoriler).filter(Boolean).map((kategori) => (
                <MenuItem key={kategori} value={kategori}>{kategori}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }} disabled={!selectedKategori}>
            <InputLabel>Alt Kategori</InputLabel>
            <Select
              label="Alt Kategori"
              value={selectedAltKategori}
              onChange={(e) => setSelectedAltKategori(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value=""><em>Hepsi</em></MenuItem>
              {altKategoriOptions.filter(Boolean).map((altKategori) => (
                <MenuItem key={altKategori} value={altKategori}>{altKategori}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Marka</InputLabel>
            <Select
              label="Marka"
              value={selectedMarka}
              onChange={(e) => setSelectedMarka(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value=""><em>Hepsi</em></MenuItem>
              {markaOptions.filter(Boolean).map((marka) => (
                <MenuItem key={marka} value={marka}>{marka}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="Kod, Ad, Marka vb. ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch('')}>
                    <Close fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Listeyi Yenile">
              <IconButton size="small" onClick={fetchStoklar} sx={{ border: '1px solid var(--border)', borderRadius: 2 }}>
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Grafik Göster/Gizle">
              <IconButton
                size="small"
                onClick={() => setShowChart(!showChart)}
                sx={{
                  border: '1px solid var(--border)',
                  borderRadius: 2,
                  bgcolor: showChart ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  color: showChart ? 'primary.main' : 'inherit'
                }}
              >
                <BarChart fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </StandardCard>

      {/* 4. CHART COLLAPSE */}
      <Collapse in={showChart}>
        <StandardCard sx={{ mb: 3, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>Kategori Dağılımı</Typography>
            <IconButton size="small" onClick={() => setShowChart(false)}><Close fontSize="small" /></IconButton>
          </Box>
          <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border)', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Envanter dağılım grafiği yakında...</Typography>
          </Box>
        </StandardCard>
      </Collapse>

      {/* 5. DATA GRID */}
      <StandardCard noPadding>
        <Box sx={{ height: 1410, width: '100%' }}>
          <DataGrid
            rows={filteredStoklar}
            columns={[
              {
                field: 'stokKodu',
                headerName: 'Stok Kodu',
                flex: 1.5,
                minWidth: 150,
                renderCell: (params: GridRenderCellParams) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight="700" sx={{ color: 'var(--primary)' }}>
                      {params.value}
                    </Typography>
                    <Tooltip title="Eşdeğer ürünleri göster">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEsdegerDialog(params.row);
                        }}
                        sx={{
                          padding: '4px',
                          color: 'var(--primary)',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <CompareArrows fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ),
              },
              {
                field: 'stokAdi',
                headerName: 'Stok Adı',
                flex: 2,
                minWidth: 200,
                renderCell: (params: GridRenderCellParams) => (
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {params.value}
                  </Typography>
                ),
              },
              {
                field: 'marka',
                headerName: 'Marka',
                flex: 1,
                minWidth: 120,
                renderCell: (params: GridRenderCellParams) => {
                  if (!params.value) return '-';
                  return (
                    <Chip
                      label={params.value}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: 'secondary.main',
                        border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                        borderRadius: 1.5,
                      }}
                    />
                  );
                },
              },
              {
                field: 'raf',
                headerName: 'Raf',
                width: 100,
                renderCell: (params: GridRenderCellParams) => {
                  if (!params.value) return '-';
                  return (
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {params.value}
                    </Typography>
                  );
                },
              },
              {
                field: 'anaKategori',
                headerName: 'Kategori',
                flex: 1.5,
                minWidth: 160,
                renderCell: (params: GridRenderCellParams) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, overflow: 'hidden' }}>
                    <Typography variant="caption" fontWeight={700} sx={{ whiteSpace: 'nowrap' }}>
                      {params.row.anaKategori}
                    </Typography>
                    {params.row.altKategori && (
                      <>
                        <Typography variant="caption" color="text.disabled">·</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {params.row.altKategori}
                        </Typography>
                      </>
                    )}
                  </Box>
                ),
              },
              {
                field: 'miktar',
                headerName: 'Miktar',
                type: 'number',
                width: 100,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => {
                  const miktar = params.value || 0;
                  const isLow = miktar <= (params.row.criticalQty || 0);
                  return (
                    <Chip
                      label={`${miktar.toLocaleString('tr-TR')} ${params.row.birim || ''}`}
                      size="small"
                      sx={{
                        bgcolor: miktar > 0
                          ? isLow ? alpha(theme.palette.warning.main, 0.1) : alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.error.main, 0.1),
                        color: miktar > 0 ? isLow ? 'warning.main' : 'success.main' : 'error.main',
                        borderColor: miktar > 0 ? isLow ? 'warning.main' : 'success.main' : 'error.main',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        borderRadius: 1.5,
                        width: '100%',
                      }}
                      variant="outlined"
                    />
                  );
                },
              },
              {
                field: 'alisFiyati',
                headerName: 'Alış Fiyatı',
                type: 'number',
                width: 130,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params: GridRenderCellParams) => (
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                    ₺{Number(params.value || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                ),
              },
              {
                field: 'satisFiyati',
                headerName: 'Satış Fiyatı',
                type: 'number',
                width: 130,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params: GridRenderCellParams) => (
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    ₺{Number(params.value || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                ),
              },
              {
                field: 'actions',
                headerName: 'İşlemler',
                width: 80,
                sortable: false,
                renderCell: (params: GridRenderCellParams) => {
                  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
                  const open = Boolean(anchorEl);
                  const row = params.row as Malzeme;

                  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    setAnchorEl(event.currentTarget);
                  };

                  const handleClose = () => {
                    setAnchorEl(null);
                  };

                  const menuActions = [
                    {
                      id: 'ambar',
                      label: 'Ambar Toplamları',
                      icon: <Warehouse fontSize="small" sx={{ color: 'var(--info)' }} />,
                      color: 'var(--foreground)',
                      onClick: () => { handleClose(); router.push(`/stock/${row.id}/ambar-toplamlari`); },
                      disabled: false,
                    },
                    {
                      id: 'hareketler',
                      label: 'Hareketler',
                      icon: <History fontSize="small" sx={{ color: 'var(--primary)' }} />,
                      color: 'var(--foreground)',
                      onClick: () => { handleClose(); handleOpenHareketDialog(row); },
                      disabled: false,
                    },
                    {
                      id: 'esdegerler',
                      label: 'Eşdeğerler',
                      icon: <CompareArrows fontSize="small" sx={{ color: 'var(--secondary)' }} />,
                      color: 'var(--foreground)',
                      onClick: () => { handleClose(); handleOpenEsdegerDialog(row); },
                      disabled: false,
                    },
                    {
                      id: 'edit',
                      label: 'Düzenle',
                      icon: <Edit fontSize="small" />,
                      color: 'var(--foreground)',
                      onClick: () => { handleClose(); handleOpenDialog(row); },
                      disabled: false,
                    },
                    {
                      id: 'delete',
                      label: 'Sil',
                      icon: <Delete fontSize="small" sx={{ color: 'var(--destructive)' }} />,
                      color: 'var(--destructive)',
                      onClick: () => { handleClose(); handleDelete(row.id); },
                      disabled: false,
                    },
                  ];

                  return (
                    <>
                      <IconButton
                        size="small"
                        onClick={handleToggle}
                        sx={{
                          bgcolor: open ? 'var(--secondary)' : 'transparent',
                          color: open ? 'var(--secondary-foreground)' : 'text.secondary',
                          '&:hover': {
                            bgcolor: 'var(--secondary)',
                            color: 'var(--secondary-foreground)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>

                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        onClick={(e) => e.stopPropagation()}
                        PaperProps={{
                          elevation: 8,
                          sx: {
                            minWidth: 280,
                            mt: 1,
                            borderRadius: 3,
                            border: '1px solid var(--border)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                            overflow: 'visible',
                            '&:before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                              borderTop: '1px solid var(--border)',
                              borderLeft: '1px solid var(--border)',
                            },
                          }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <Box
                          sx={{
                            px: 2,
                            py: 1.5,
                            bgcolor: 'var(--muted)',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Malzeme İşlemleri
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
                            {row.stokKodu}
                          </Typography>
                        </Box>

                        <Box sx={{ px: 1.5, py: 1 }}>
                          {menuActions.map((action) => (
                            <MenuItem
                              key={action.id}
                              onClick={action.onClick}
                              disabled={action.disabled}
                              sx={{
                                px: 1.5,
                                py: 1,
                                borderRadius: 2,
                                my: 0.25,
                                color: action.color,
                                '&:hover': {
                                  bgcolor: action.id === 'delete'
                                    ? 'var(--destructive)'
                                    : 'var(--secondary)',
                                },
                                '&.Mui-disabled': {
                                  opacity: 0.5,
                                },
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                                {action.icon}
                              </ListItemIcon>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {action.label}
                              </Typography>
                            </MenuItem>
                          ))}
                        </Box>
                      </Menu>
                    </>
                  );
                },
              },
            ]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25, page: 0 },
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            disableRowSelectionOnClick
            loading={loading}
            localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
            getRowId={(row) => row.id || row.stokKodu || `row-${Math.random()}`}
            rowHeight={44}
            columnHeaderHeight={40}
            density="compact"
            slots={{
              toolbar: CustomToolbar,
              loadingOverlay: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <CircularProgress size={32} />
                </Box>
              ),
            }}
            sx={{
              border: 'none',
              fontSize: '0.8125rem',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: '#111827',
                color: '#ffffff',
                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, fontSize: '0.75rem' },
                '& .MuiDataGrid-iconButtonContainer': { color: '#fff' },
                '& .MuiDataGrid-menuIcon': { color: '#fff' },
              },
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
                py: 0,
                borderBottom: '1px solid var(--border)',
              },
              '& .MuiDataGrid-row:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
              '& .MuiDataGrid-footerContainer': { minHeight: 40 },
            }}
          />
        </Box>
      </StandardCard>

      {/* Dialogs */}
      <Dialog open={hareketDialogOpen} onClose={handleCloseHareketDialog} fullWidth maxWidth="lg" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700, bgcolor: 'var(--muted)', p: 3 }}>
          {hareketMalzeme ? `${hareketMalzeme.stokKodu} - ${hareketMalzeme.stokAdi} Hareket Analizi` : 'Hareketler'}
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {hareketMalzeme && (
            <Box sx={{ height: 500, mt: 2 }}>
              <DataGrid
                rows={hareketler}
                columns={[
                  { field: 'createdAt', headerName: 'Tarih', width: 180, renderCell: (params) => new Date(params.value).toLocaleString('tr-TR') },
                  { field: 'invoiceNo', headerName: 'Fiş/Fatura No', flex: 1, valueGetter: (params, row) => row.invoiceItem?.invoice?.invoiceNo || row.stockMove?.moveNo || '-' },
                  { field: 'account', headerName: 'Cari/İşlem Yeri', flex: 1.5, valueGetter: (params, row) => row.invoiceItem?.invoice?.account?.title || row.stockMove?.targetWarehouse?.name || '-' },
                  {
                    field: 'movementType',
                    headerName: 'Tip',
                    width: 140,
                    renderCell: (params) => {
                      const types: Record<string, { label: string, color: any }> = {
                        ENTRY: { label: 'Giriş', color: 'success' },
                        EXIT: { label: 'Çıkış', color: 'error' },
                        SALE: { label: 'Satış', color: 'info' },
                        RETURN: { label: 'İade', color: 'warning' },
                        STOCK_TRANSFER: { label: 'Transfer', color: 'secondary' },
                      };
                      const type = types[params.value] || { label: params.value, color: 'default' };
                      return <Chip label={type.label} size="small" color={type.color} variant="outlined" sx={{ fontWeight: 700 }} />;
                    }
                  },
                  { field: 'quantity', headerName: 'Miktar', width: 120, align: 'right', headerAlign: 'right', renderCell: (params) => <strong>{params.value} {hareketMalzeme.birim}</strong> },
                ]}
                loading={hareketLoading}
                density="comfortable"
                localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
                sx={{ border: '1px solid var(--border)', borderRadius: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 3, bgcolor: 'var(--muted)' }}>
          <Button onClick={handleCloseHareketDialog} variant="contained" sx={{ borderRadius: 2, px: 4 }}>Kapat</Button>
        </DialogActions>
      </Dialog>

      <MalzemeFormDialog
        open={openDialog}
        initialFormData={initialFormData}
        editingMalzeme={editingMalzeme}
        locations={locations}
        kategoriler={kategoriler}
        markalar={markalar}
        aracMarkalar={aracMarkalar}
        aracModeller={aracModeller}
        aracMotorHacimleri={aracMotorHacimleri}
        aracYakitTipleri={aracYakitTipleri}
        birimSetleri={birimSetleri}
        canEditUnit={canEditUnit}
        onAracMarkaChange={handleAracMarkaChange}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      />

      <Dialog open={esdegerDialogOpen} onClose={handleCloseEsdegerDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5, p: 3, borderBottom: '1px solid var(--border)' }}>
          <CompareArrows color="primary" /> Eşdeğer Ürünler
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {esdegerLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'var(--muted)' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Stok Kodu</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Stok Adı</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Marka</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Miktar</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Fiyat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {esdegerUrunler.map((urun: any, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell><Typography variant="body2" fontWeight={700} color="primary">{urun.stokKodu}</Typography></TableCell>
                      <TableCell>{urun.stokAdi}</TableCell>
                      <TableCell>{urun.marka || '-'}</TableCell>
                      <TableCell align="center">
                        <Chip label={urun.miktar || 0} size="small" variant="outlined" color={urun.miktar > 0 ? 'success' : 'error'} sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell align="right"><strong>₺{Number(urun.satisFiyati).toLocaleString('tr-TR')}</strong></TableCell>
                    </TableRow>
                  ))}
                  {esdegerUrunler.length === 0 && (
                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>Eşdeğer ürün bulunamadı.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: 'var(--muted)' }}>
          <Button onClick={handleCloseEsdegerDialog} variant="contained" sx={{ borderRadius: 2 }}>Kapat</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar kaldırıldı (notistack kullanılıyor) */}
    </StandardPage>
  );
}