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
  cariKodu?: string;
  unvan?: string;
  tip?: string;
  sirketTipi?: string;
  vergiNo?: string;
  vergiDairesi?: string;
  tcKimlikNo?: string;
  isimSoyisim?: string;
  telefon?: string;
  email?: string;
  yetkili?: string;
  ulke?: string;
  il?: string;
  ilce?: string;
  adres?: string;
  vadeSuresi?: string;
  aktif?: string | boolean;
}

interface ParsedExcelRow extends ExcelRow {
  rowNumber: number;
  status: 'pending' | 'success' | 'error';
  error?: string;
  cariId?: string;
}

interface ExcelErrorRow {
  rowNumber: number;
  cariKodu?: string;
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

export default function CariHesapAktarimPage() {
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

        const unvan = (row.unvan || row.ünvan || '') as string;
        const cariKodu = (row.carikodu || row.carikod || row.cari_kodu || '') as string;
        const tip = (row.tip || row.tipi || 'MUSTERI') as string;
        const sirketTipi = (row.sirkettipi || row.sirket_tipi || row.tip || 'KURUMSAL') as string;

        if (!unvan || !unvan.trim()) {
          errors.push('Ünvan zorunludur');
        }

        const parsedRow: ParsedExcelRow = {
          rowNumber,
          cariKodu: cariKodu || '',
          unvan: unvan || '',
          tip: tip === 'TEDARIKCI' || tip === 'tedarikci' ? 'TEDARIKCI' : 'MUSTERI',
          sirketTipi: sirketTipi === 'SAHIS' || sirketTipi === 'sahis' ? 'SAHIS' : 'KURUMSAL',
          vergiNo: (row.vergino || row.vergi_no || '') as string,
          vergiDairesi: (row.vergidairesi || row.vergi_dairesi || '') as string,
          tcKimlikNo: (row.tckimlikno || row.tc_kilimk_no || row.tcno || '') as string,
          isimSoyisim: (row.isimsoyisim || row.isim_soyisim || '') as string,
          telefon: (row.telefon || row.tel || '') as string,
          email: (row.email || row.e_posta || '') as string,
          yetkili: (row.yetkili || '') as string,
          ulke: (row.ulke || row.ülke || 'Türkiye') as string,
          il: (row.il || row.ilçe || 'İstanbul') as string,
          ilce: (row.ilce || row.ilçe || '') as string,
          adres: (row.adres || '') as string,
          vadeSuresi: (row.vadesuresi || row.vade_suresi || '') as string,
          aktif: row.aktif === false || row.aktif === 'false' || row.aktif === 'HAYIR' ? false : true,
          status: errors.length > 0 ? 'error' : 'pending',
          error: errors.length > 0 ? errors.join(', ') : undefined,
        };

        if (errors.length > 0) {
          validationErrors.push({ rowNumber, cariKodu: cariKodu || '', message: errors.join(', '), category: 'validation' });
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
            unvan: row.unvan,
            tip: row.tip || 'MUSTERI',
            sirketTipi: row.sirketTipi || 'KURUMSAL',
            aktif: row.aktif !== false,
          };
          if (row.cariKodu) payload.cariKodu = row.cariKodu;
          if (row.vergiNo) payload.vergiNo = row.vergiNo;
          if (row.vergiDairesi) payload.vergiDairesi = row.vergiDairesi;
          if (row.tcKimlikNo) payload.tcKimlikNo = row.tcKimlikNo;
          if (row.isimSoyisim) payload.isimSoyisim = row.isimSoyisim;
          if (row.telefon) payload.telefon = row.telefon;
          if (row.email) payload.email = row.email;
          if (row.yetkili) payload.yetkili = row.yetkili;
          if (row.ulke) payload.ulke = row.ulke;
          if (row.il) payload.il = row.il;
          if (row.ilce) payload.ilce = row.ilce;
          if (row.adres) payload.adres = row.adres;
          if (row.vadeSuresi) payload.vadeSuresi = row.vadeSuresi;

          const response = await axios.post('/account', payload);
          successCount += 1;
          setExcelData((prev) => prev.map((r) => r.rowNumber === row.rowNumber ? { ...r, status: 'success', cariId: response.data.id } : r));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Bilinmeyen hata';
          apiErrors.push({ rowNumber: row.rowNumber, cariKodu: row.cariKodu || '', message: errorMessage, category: 'api' });
          setExcelData((prev) => prev.map((r) => r.rowNumber === row.rowNumber ? { ...r, status: 'error', error: errorMessage } : r));
        }
      }

      setExcelErrors((prev) => [...prev, ...apiErrors]);
      enqueueSnackbar(`${successCount} cari hesap başarıyla aktarıldı. ${apiErrors.length} hata oluştu.`, {
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
      { cariKodu: 'CAR001', unvan: 'Örnek Şirket A.Ş.', tip: 'MUSTERI', sirketTipi: 'KURUMSAL', vergiNo: '1234567890', vergiDairesi: 'Kadıköy VD', tcKimlikNo: '', isimSoyisim: '', telefon: '02121234567', email: 'info@ornek.com', yetkili: 'Ahmet Yılmaz', ulke: 'Türkiye', il: 'İstanbul', ilce: 'Kadıköy', adres: 'Örnek Mah.', vadeSuresi: '30', aktif: 'EVET' },
    ];
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Şablon');
    XLSX.writeFile(workbook, 'cari-hesap-aktarim-sablonu.xlsx');
  };

  const clearExcelData = () => {
    setExcelData([]);
    setExcelErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadErrorReport = () => {
    if (excelErrors.length === 0) return;
    const rows = excelErrors.map((error, index) => ({ sira: index + 1, satir: error.rowNumber, cariKodu: error.cariKodu ?? '', kategori: error.category === 'validation' ? 'Doğrulama' : 'API', mesaj: error.message }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hatalar');
    XLSX.writeFile(workbook, `hata-raporu-${new Date().getTime()}.xlsx`);
  };

  const pendingCount = excelData.filter((r) => r.status === 'pending').length;
  const successCount = excelData.filter((r) => r.status === 'success').length;
  const errorCount = excelData.filter((r) => r.status === 'error').length;

  return (
    <StandardPage title="Cari Hesap Aktarımı" breadcrumbs={[{ label: 'Veri Aktarımı' }, { label: 'Cari Hesap Aktarımı' }]}>
      <Box>
        <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Kullanım Rehberi:</strong> Şablonu indirin, verileri doldurun ve yükleyin. Ünvan alanı zorunludur.
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
                      <TableCell sx={{ fontWeight: 900 }}>Cari Kodu</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Ünvan</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Tip</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Durum</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Hata</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {excelData.map((row) => (
                      <TableRow key={row.rowNumber} hover>
                        <TableCell>{row.rowNumber}</TableCell>
                        <TableCell>{row.cariKodu || '-'}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{row.unvan}</TableCell>
                        <TableCell><Chip label={row.tip === 'TEDARIKCI' ? 'Tedarikçi' : 'Müşteri'} size="small" variant="outlined" /></TableCell>
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
