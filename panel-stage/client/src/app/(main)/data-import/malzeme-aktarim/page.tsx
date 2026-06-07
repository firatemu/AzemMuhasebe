'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import { UploadFile, Download, Save, Delete, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';
import * as XLSX from 'xlsx';
import { useSnackbar } from 'notistack';

interface ExcelRow {
  stokKodu?: string;
  stokAdi?: string;
  barkod?: string;
  marka?: string;
  anaKategori?: string;
  altKategori?: string;
  birim?: string;
  olcu?: string;
  oem?: string;
  raf?: string;
  tedarikciKodu?: string;
  alisFiyati?: number | string;
  satisFiyati?: number | string;
  aracMarka?: string;
  aracModel?: string;
  aracMotorHacmi?: string;
  aracYakitTipi?: string;
}

interface ParsedExcelRow extends ExcelRow {
  rowNumber: number;
  status: 'pending' | 'success' | 'error';
  error?: string;
  stokId?: string;
}

interface ExcelErrorRow {
  rowNumber: number;
  stokKodu?: string;
  message: string;
  category: 'validation' | 'api';
}

const normalizeHeaderKey = (key: string) =>
  key
    .trim()
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'g')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'u')
    .replace(/\s+/g, '');

const parsePriceValue = (value: unknown): number | null => {
  if (value == null) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const compact = value.trim().replace(/\s/g, '');
    if (!compact) return null;
    const hasComma = compact.includes(',');
    const hasDot = compact.includes('.');
    let normalized = compact;
    if (hasComma && hasDot) normalized = compact.replace(/\./g, '').replace(/,/g, '.');
    else if (hasComma) normalized = compact.replace(/,/g, '.');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export default function MalzemeAktarimPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [excelData, setExcelData] = useState<ParsedExcelRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [excelErrors, setExcelErrors] = useState<ExcelErrorRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!sheet) {
        enqueueSnackbar('Excel sayfası bulunamadı.', { variant: 'error' });
        return;
      }

      const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null });
      if (rawRows.length === 0) {
        enqueueSnackbar('Excel dosyasında veri bulunamadı.', { variant: 'info' });
        return;
      }

      const normalizedRows = rawRows.map((row) => {
        const normalized: Record<string, unknown> = {};
        Object.keys(row).forEach((key) => {
          const normalizedKey = normalizeHeaderKey(key);
          normalized[normalizedKey] = row[key];
        });
        return normalized;
      });

      const validationErrors: ExcelErrorRow[] = [];
      const parsedData: ParsedExcelRow[] = [];

      for (let index = 0; index < normalizedRows.length; index += 1) {
        const row = normalizedRows[index];
        const rowNumber = index + 2;
        const errors: string[] = [];

        const stokKodu = (row.stokkodu || row.stok_kodu || '') as string;
        const stokAdi = (row.stokadi || row.stok_adi || '') as string;

        if (!stokKodu || !stokKodu.trim()) errors.push('Stok Kodu zorunludur');
        if (!stokAdi || !stokAdi.trim()) errors.push('Stok Adı zorunludur');

        const parsedRow: ParsedExcelRow = {
          rowNumber,
          stokKodu: stokKodu || '',
          stokAdi: stokAdi || '',
          barkod: (row.barkod || '') as string,
          marka: (row.marka || '') as string,
          anaKategori: (row.anakategori || row.ana_kategori || '') as string,
          altKategori: (row.altkategori || row.alt_kategori || '') as string,
          birim: (row.birim || 'ADET') as string,
          olcu: (row.olcu || row.ölçü || '') as string,
          oem: (row.oem || '') as string,
          raf: (row.raf || '') as string,
          tedarikciKodu: (row.tedarikcikodu || row.tedarikci_kodu || '') as string,
          alisFiyati: parsePriceValue(row.alisfiyati || row.alis_fiyati || 0) || 0,
          satisFiyati: parsePriceValue(row.satisfiyati || row.satis_fiyati || 0) || 0,
          aracMarka: (row.aracmarka || row.arac_marka || '') as string,
          aracModel: (row.aracmodel || row.arac_model || '') as string,
          aracMotorHacmi: (row.aracmotorhacmi || row.arac_motor_hacmi || '') as string,
          aracYakitTipi: (row.aracyakittipi || row.arac_yakit_tipi || '') as string,
          status: errors.length > 0 ? 'error' : 'pending',
          error: errors.length > 0 ? errors.join(', ') : undefined,
        };

        if (errors.length > 0) {
          validationErrors.push({ rowNumber, stokKodu: stokKodu || '', message: errors.join(', '), category: 'validation' });
        }
        parsedData.push(parsedRow);
      }

      setExcelData(parsedData);
      setExcelErrors(validationErrors);
      enqueueSnackbar(`${parsedData.length} satır yüklendi. ${validationErrors.length} hatalı satır var.`, {
        variant: validationErrors.length > 0 ? 'warning' : 'success'
      });
    } catch (error) {
      console.error('Excel okuma hatası:', error);
      enqueueSnackbar('Excel dosyası okunurken hata oluştu.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async () => {
    if (excelData.filter((r) => r.status === 'pending').length === 0) {
      enqueueSnackbar('İşlenecek veri bulunamadı.', { variant: 'info' });
      return;
    }

    try {
      setBulkLoading(true);
      const apiErrors: ExcelErrorRow[] = [];
      const pendingRows = excelData.filter((r) => r.status === 'pending');
      let successCount = 0;

      for (const row of pendingRows) {
        try {
          const payload: any = {
            stokKodu: row.stokKodu,
            stokAdi: row.stokAdi,
            birim: row.birim || 'ADET',
            alisFiyati: row.alisFiyati || 0,
            satisFiyati: row.satisFiyati || 0,
          };
          if (row.barkod) payload.barkod = row.barkod;
          if (row.marka) payload.marka = row.marka;
          if (row.anaKategori) payload.anaKategori = row.anaKategori;
          if (row.altKategori) payload.altKategori = row.altKategori;
          if (row.olcu) payload.olcu = row.olcu;
          if (row.oem) payload.oem = row.oem;
          if (row.raf) payload.raf = row.raf;
          if (row.tedarikciKodu) payload.tedarikciKodu = row.tedarikciKodu;
          if (row.aracMarka) payload.aracMarka = row.aracMarka;
          if (row.aracModel) payload.aracModel = row.aracModel;
          if (row.aracMotorHacmi) payload.aracMotorHacmi = row.aracMotorHacmi;
          if (row.aracYakitTipi) payload.aracYakitTipi = row.aracYakitTipi;

          const response = await axios.post('/products', payload);
          successCount += 1;
          setExcelData((prev) => prev.map((r) => r.rowNumber === row.rowNumber ? { ...r, status: 'success', stokId: response.data.id } : r));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Bilinmeyen hata';
          apiErrors.push({ rowNumber: row.rowNumber, stokKodu: row.stokKodu || '', message: errorMessage, category: 'api' });
          setExcelData((prev) => prev.map((r) => r.rowNumber === row.rowNumber ? { ...r, status: 'error', error: errorMessage } : r));
        }
      }

      setExcelErrors((prev) => [...prev, ...apiErrors]);
      enqueueSnackbar(`${successCount} malzeme başarıyla aktarıldı. ${apiErrors.length} hata oluştu.`, {
        variant: apiErrors.length > 0 ? 'warning' : 'success'
      });
    } catch (error) {
      console.error('Toplu işlem hatası:', error);
      enqueueSnackbar('Toplu işlem başarısız', { variant: 'error' });
    } finally {
      setBulkLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template: ExcelRow[] = [
      { stokKodu: 'STK001', stokAdi: 'Örnek Malzeme', barkod: '123...', marka: 'Marka', anaKategori: 'Kategori', birim: 'ADET', alisFiyati: 100, satisFiyati: 150 },
    ];
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Şablon');
    XLSX.writeFile(workbook, 'malzeme-aktarim-sablonu.xlsx');
  };

  const clearExcelData = () => {
    setExcelData([]);
    setExcelErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadErrorReport = () => {
    if (excelErrors.length === 0) return;
    const rows = excelErrors.map((error, index) => ({ sira: index + 1, satir: error.rowNumber, stokKodu: error.stokKodu ?? '', kategori: error.category === 'validation' ? 'Doğrulama' : 'API', mesaj: error.message }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hatalar');
    XLSX.writeFile(workbook, `hata-raporu-stok-${new Date().getTime()}.xlsx`);
  };

  const pendingCount = excelData.filter((r) => r.status === 'pending').length;
  const successCount = excelData.filter((r) => r.status === 'success').length;
  const errorCount = excelData.filter((r) => r.status === 'error').length;

  return (
    <StandardPage title="Malzeme Aktarımı" breadcrumbs={[{ label: 'Veri Aktarımı' }, { label: 'Malzeme Aktarımı' }]}>
      <Box>
        <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Kullanım Rehberi:</strong> Şablonu indirin, verileri doldurun ve yükleyin. Stok Kodu ve Stok Adı zorunludur.
            </Typography>
          </Alert>

          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button variant="outlined" startIcon={<Download />} onClick={downloadTemplate} sx={{ fontWeight: 800 }}>Şablon İndir</Button>
            <Button variant="contained" component="label" startIcon={<UploadFile />} disabled={loading} sx={{ fontWeight: 900 }}>
              {loading ? <CircularProgress size={20} /> : 'Excel Yükle'}
              <input ref={fileInputRef} type="file" hidden accept=".xlsx,.xls" onChange={handleExcelUpload} />
            </Button>
            {excelData.length > 0 && (
              <>
                <Button variant="contained" color="success" startIcon={bulkLoading ? <CircularProgress size={20} /> : <Save />} onClick={handleBulkSubmit} disabled={bulkLoading || pendingCount === 0} sx={{ fontWeight: 900 }}>
                  {bulkLoading ? 'Aktarılıyor...' : `${pendingCount} Kaydı Aktar`}
                </Button>
                {excelErrors.length > 0 && <Button variant="outlined" color="error" startIcon={<Download />} onClick={downloadErrorReport} sx={{ fontWeight: 800 }}>Hata Raporu</Button>}
                <Button variant="outlined" color="error" startIcon={<Delete />} onClick={clearExcelData} sx={{ fontWeight: 800 }}>Temizle</Button>
              </>
            )}
          </Stack>

          {excelData.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip label={`Toplam: ${excelData.length}`} size="small" sx={{ fontWeight: 800 }} />
                <Chip label={`Beklemede: ${pendingCount}`} color="warning" size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                <Chip label={`Başarılı: ${successCount}`} color="success" icon={<CheckCircle />} size="small" sx={{ fontWeight: 800 }} />
                <Chip label={`Hatalı: ${errorCount}`} color="error" icon={<ErrorIcon />} size="small" sx={{ fontWeight: 800 }} />
              </Box>
              <TableContainer sx={{ maxHeight: 600, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 900 }}>Satır</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Stok Kodu</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Stok Adı</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Marka</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Kategori</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Durum</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Hata</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {excelData.map((row) => (
                      <TableRow key={row.rowNumber} hover>
                        <TableCell>{row.rowNumber}</TableCell>
                        <TableCell>{row.stokKodu}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{row.stokAdi}</TableCell>
                        <TableCell>{row.marka || '-'}</TableCell>
                        <TableCell>{row.anaKategori}{row.altKategori && ` / ${row.altKategori}`}</TableCell>
                        <TableCell>
                          {row.status === 'success' && <Chip label="Başarılı" color="success" size="small" sx={{ fontWeight: 800 }} />}
                          {row.status === 'error' && <Chip label="Hatalı" color="error" size="small" sx={{ fontWeight: 800 }} />}
                          {row.status === 'pending' && <Chip label="Beklemede" color="warning" size="small" sx={{ fontWeight: 800 }} />}
                        </TableCell>
                        <TableCell>{row.error && <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>{row.error}</Typography>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Box>
    </StandardPage>
  );
}
