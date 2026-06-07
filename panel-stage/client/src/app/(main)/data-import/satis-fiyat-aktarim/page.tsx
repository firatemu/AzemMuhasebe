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
  price?: number | string;
  effectiveFrom?: string;
  effectiveTo?: string;
  note?: string;
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

interface Stok {
  id: string;
  stokKodu: string;
  stokAdi: string;
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

const extractValue = (row: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) if (key in row) return row[key];
  return undefined;
};

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

const formatDateOnly = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const parseExcelDateValue = (value: unknown): string | undefined => {
  if (value == null || value === '') return undefined;
  if (typeof value === 'number') {
    const parsed = (XLSX.SSF as any)?.parse_date_code?.(value);
    if (!parsed) return undefined;
    const date = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
    return Number.isNaN(date.getTime()) ? undefined : formatDateOnly(date);
  }
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : formatDateOnly(value);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsedDate = new Date(trimmed);
    return Number.isNaN(parsedDate.getTime()) ? undefined : formatDateOnly(parsedDate);
  }
  return undefined;
};

const toNoteValue = (value: unknown): string | undefined => {
  if (value == null) return undefined;
  return String(value).trim() || undefined;
};

export default function SatisFiyatAktarimPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [excelData, setExcelData] = useState<ParsedExcelRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [excelErrors, setExcelErrors] = useState<ExcelErrorRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stokLookupRef = useRef<Record<string, Stok>>({});

  const getStokByCode = async (stokKodu: string): Promise<Stok | null> => {
    if (stokLookupRef.current[stokKodu]) return stokLookupRef.current[stokKodu];
    try {
      const response = await axios.get('/products', { params: { limit: 1000, search: stokKodu } });
      const items: Stok[] = response.data?.data ?? [];
      const stok = items.find((s) => s.stokKodu === stokKodu);
      if (stok) {
        stokLookupRef.current[stokKodu] = stok;
        return stok;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

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

      const defaultEffectiveFrom = formatDateOnly(new Date());
      const defaultEffectiveTo = formatDateOnly(new Date(new Date().getFullYear(), 11, 31));

      const validationErrors: ExcelErrorRow[] = [];
      const parsedData: ParsedExcelRow[] = [];

      for (let index = 0; index < rawRows.length; index += 1) {
        const row = rawRows[index];
        const rowNumber = index + 2;
        const normalizedRow = Object.entries(row).reduce<Record<string, unknown>>((acc, [key, value]) => {
          acc[normalizeHeaderKey(key)] = value;
          return acc;
        }, {});

        const stokCodeRaw = extractValue(normalizedRow, ['stokkodu', 'stok_kodu', 'stok']);
        const stokKodu = typeof stokCodeRaw === 'string' ? stokCodeRaw.trim() : '';

        if (!stokKodu) {
          validationErrors.push({ rowNumber, message: 'Stok kodu bulunamadı.', category: 'validation' });
          parsedData.push({ rowNumber, status: 'error', error: 'Stok kodu bulunamadı.' });
          continue;
        }

        const stok = await getStokByCode(stokKodu);
        if (!stok) {
          validationErrors.push({ rowNumber, stokKodu, message: `Stok bulunamadı (${stokKodu})`, category: 'validation' });
          parsedData.push({ rowNumber, stokKodu, status: 'error', error: `Stok bulunamadı (${stokKodu})` });
          continue;
        }

        const price = parsePriceValue(extractValue(normalizedRow, ['price', 'fiyat', 'satisfiyati']));
        if (price == null || price <= 0) {
          validationErrors.push({ rowNumber, stokKodu, message: 'Geçersiz fiyat.', category: 'validation' });
          parsedData.push({ rowNumber, stokKodu, status: 'error', error: 'Geçersiz fiyat.', stokId: stok.id });
          continue;
        }

        parsedData.push({
          rowNumber,
          stokKodu,
          price,
          effectiveFrom: parseExcelDateValue(extractValue(normalizedRow, ['baslangic', 'effectivefrom'])) || defaultEffectiveFrom,
          effectiveTo: parseExcelDateValue(extractValue(normalizedRow, ['bitis', 'effectiveto'])) || defaultEffectiveTo,
          note: toNoteValue(extractValue(normalizedRow, ['note', 'not', 'aciklama'])),
          status: 'pending',
          stokId: stok.id,
        });
      }

      setExcelData(parsedData);
      setExcelErrors(validationErrors);
      enqueueSnackbar(`${parsedData.length} satır yüklendi. ${validationErrors.length} hatalı satır var.`, {
        variant: validationErrors.length > 0 ? 'warning' : 'success'
      });
    } catch (e) {
      console.error(e);
      enqueueSnackbar('Excel okuma hatası.', { variant: 'error' });
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
      const pendingRows = excelData.filter((r) => r.status === 'pending' && r.stokId && r.price);
      let successCount = 0;

      for (const row of pendingRows) {
        try {
          await axios.post('/price-cards', {
            stokId: row.stokId,
            type: 'SALE',
            price: row.price,
            effectiveFrom: row.effectiveFrom,
            effectiveTo: row.effectiveTo,
            note: row.note,
          });
          successCount += 1;
          setExcelData((prev) => prev.map((r) => r.rowNumber === row.rowNumber ? { ...r, status: 'success' } : r));
        } catch (error: any) {
          const msg = error.response?.data?.message || 'Hata';
          apiErrors.push({ rowNumber: row.rowNumber, stokKodu: row.stokKodu || '', message: msg, category: 'api' });
          setExcelData((prev) => prev.map((r) => r.rowNumber === row.rowNumber ? { ...r, status: 'error', error: msg } : r));
        }
      }

      setExcelErrors((prev) => [...prev, ...apiErrors]);
      enqueueSnackbar(`${successCount} satış fiyatı aktarıldı. ${apiErrors.length} hata oluştu.`, {
        variant: apiErrors.length > 0 ? 'warning' : 'success'
      });
    } catch (e) {
      console.error(e);
      enqueueSnackbar('Aktarım başarısız.', { variant: 'error' });
    } finally {
      setBulkLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template: ExcelRow[] = [
      { stokKodu: 'STK001', price: 150.50, effectiveFrom: formatDateOnly(new Date()), effectiveTo: '2026-12-31', note: 'Not' },
    ];
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Şablon');
    XLSX.writeFile(workbook, 'satis-fiyat-aktarim-sablonu.xlsx');
  };

  const clearExcelData = () => {
    setExcelData([]);
    setExcelErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadErrorReport = () => {
    if (excelErrors.length === 0) return;
    const rows = excelErrors.map((error, index) => ({ sira: index + 1, satir: error.rowNumber, stokKodu: error.stokKodu ?? '', kategori: error.category === 'api' ? 'Sistem' : 'Doğrulama', mesaj: error.message }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hatalar');
    XLSX.writeFile(workbook, `hata-raporu-satis-fiyat-${new Date().getTime()}.xlsx`);
  };

  const pendingCount = excelData.filter((r) => r.status === 'pending').length;
  const successCount = excelData.filter((r) => r.status === 'success').length;
  const errorCount = excelData.filter((r) => r.status === 'error').length;

  return (
    <StandardPage title="Satış Fiyat Aktarımı" breadcrumbs={[{ label: 'Veri Aktarımı' }, { label: 'Satış Fiyat Aktarımı' }]}>
      <Box>
        <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              Şablonu indirin, verileri doldurun ve yükleyin. Stok kodu sistemde bulunmalıdır.
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
                      <TableCell sx={{ fontWeight: 900 }}>Fiyat</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Geçerlilik</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Durum</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Hata</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {excelData.map((row) => (
                      <TableRow key={row.rowNumber} hover>
                        <TableCell>{row.rowNumber}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{row.stokKodu}</TableCell>
                        <TableCell>{typeof row.price === 'number' ? row.price.toFixed(2) : row.price}</TableCell>
                        <TableCell>{row.effectiveFrom} / {row.effectiveTo}</TableCell>
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
