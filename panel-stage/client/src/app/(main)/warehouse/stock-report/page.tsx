'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  Stack,
  alpha,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Search, Download, CalendarToday, Warehouse as WarehouseIcon, Assessment, FilterAlt } from '@mui/icons-material';
import { StandardPage, StandardCard } from '@/components/common';
import axios from '@/lib/axios';
import * as XLSX from 'xlsx';

interface WarehouseInfo {
  id: string;
  name: string;
  code: string;
}

interface UniversalStockRow {
  productId: string;
  stokKodu: string;
  stokAdi: string;
  birim: string;
  warehouseStocks: Record<string, number>;
  total: number;
}

export default function AmbarStokRaporuPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState<UniversalStockRow[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/warehouses/all/universal-stock-report', {
        params: { date }
      });
      setReportData(response.data.report);
      setWarehouses(response.data.warehouses);
    } catch (error) {
      console.error('Evrensel stok raporu alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [date]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return reportData;
    const lowerSearch = searchTerm.toLowerCase();
    return reportData.filter(
      (item) =>
        item.stokKodu.toLowerCase().includes(lowerSearch) ||
        item.stokAdi.toLowerCase().includes(lowerSearch)
    );
  }, [reportData, searchTerm]);

  const columns = useMemo(() => {
    const baseColumns: GridColDef[] = [
      {
        field: 'stokKodu',
        headerName: 'Stok Kodu',
        width: 150,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: 'stokAdi',
        headerName: 'Ürün Adı',
        minWidth: 250,
        flex: 1,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{params.value}</Typography>
        )
      },
    ];

    const warehouseColumns: GridColDef[] = warehouses.map((w) => ({
      field: `warehouse_${w.id}`,
      headerName: `${w.code}`,
      description: w.name,
      width: 120,
      align: 'right',
      headerAlign: 'right',
      valueGetter: (_, row) => row.warehouseStocks[w.id] || 0,
      renderCell: (params) => (
        <Typography variant="body2" sx={{
          fontWeight: 600,
          color: params.value > 0 ? 'success.main' : params.value < 0 ? 'error.main' : 'text.disabled'
        }}>
          {params.value.toLocaleString('tr-TR')}
        </Typography>
      ),
    }));

    const totalColumn: GridColDef = {
      field: 'total',
      headerName: 'Genel Toplam',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Box sx={{
          bgcolor: alpha('#6366f1', 0.1),
          px: 1.5,
          py: 0.5,
          borderRadius: 1.5,
          border: '1px solid',
          borderColor: alpha('#6366f1', 0.2),
          width: '100%',
          textAlign: 'right'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
            {params.value.toLocaleString('tr-TR')} <Typography component="span" variant="caption" color="text.secondary">{params.row.birim}</Typography>
          </Typography>
        </Box>
      ),
    };

    return [...baseColumns, ...warehouseColumns, totalColumn];
  }, [warehouses]);

  const handleExport = () => {
    const exportData = filteredData.map(item => {
      const row: any = {
        'Stok Kodu': item.stokKodu,
        'Stok Adı': item.stokAdi,
        'Birim': item.birim
      };
      warehouses.forEach(w => {
        row[`${w.name} (${w.code})`] = item.warehouseStocks[w.id] || 0;
      });
      row['Genel Toplam'] = item.total;
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stok Raporu');
    XLSX.writeFile(workbook, `Evrensel_Stok_Raporu_${date}.xlsx`);
  };

  return (
    <StandardPage>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Assessment sx={{ fontSize: 32, color: 'primary.main' }} />
            Ambar Stok Raporu
          </Typography>
          <Typography variant="body2" color="text.secondary">Tüm ambarlardaki stok durumunu karşılaştırmalı olarak analiz edin.</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleExport}
          sx={{ borderRadius: 2 }}
        >
          Excel'e Aktar
        </Button>
      </Box>

      <StandardCard sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
          <Box sx={{ flex: 1, width: '100%' }}>
            <TextField
              fullWidth
              placeholder="Ürün adı veya kodu ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.disabled' }} />,
                sx: { borderRadius: 2 }
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', md: 240 } }}>
            <TextField
              fullWidth
              type="date"
              label="Rapor Tarihi"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.disabled' }} />,
                sx: { borderRadius: 2 }
              }}
            />
          </Box>
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
          <Stack direction="row" spacing={3} sx={{ minWidth: 200 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">ÜRÜN ÇEŞİDİ</Typography>
              <Typography variant="h6" fontWeight="900" color="primary">{filteredData.length}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">ETKİN AMBAR</Typography>
              <Typography variant="h6" fontWeight="900" color="primary">{warehouses.length}</Typography>
            </Box>
          </Stack>
        </Stack>
      </StandardCard>

      <StandardCard sx={{ p: 0, height: 650 }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          getRowId={(row) => row.productId}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: alpha('#000', 0.02),
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 800 }
            },
            '& .MuiDataGrid-cell': { borderBottom: 1, borderColor: 'divider' },
            '& .MuiDataGrid-row:hover': { bgcolor: alpha('#6366f1', 0.04) },
            '& .MuiDataGrid-footerContainer': { borderTop: 1, borderColor: 'divider' }
          }}
        />
      </StandardCard>

      <Box sx={{ mt: 2, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <FilterAlt sx={{ fontSize: 16, color: 'text.disabled', mt: 0.3 }} />
        <Typography variant="caption" color="text.disabled">
          Rapor seçilen tarihin sonu (23:59:59) itibariyle hesaplanmıştır. Sütunlar ambar bazlı stok miktarlarını, "Genel Toplam" ise tüm ambarların toplamını ifade eder.
        </Typography>
      </Box>
    </StandardPage>
  );
}
