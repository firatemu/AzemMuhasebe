'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  InputAdornment,
  Stack,
  alpha,
} from '@mui/material';
import MainLayout from '@/components/Layout/MainLayout';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { StandardPage, StandardCard } from '@/components/common';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Add,
  Visibility,
  Edit,
  Delete,
  LocalShipping,
  CheckCircle,
  Cancel,
  Print,
  SwapHoriz,
  Search,
  FilterList,
} from '@mui/icons-material';
import WarehouseTransferPrintForm from '@/components/PrintForm/WarehouseTransferPrintForm';

const statusConfig: Record<string, { label: string; color: any; icon: any }> = {
  HAZIRLANIYOR: { label: 'Hazırlanıyor', color: 'warning', icon: <Visibility sx={{ fontSize: 16 }} /> },
  YOLDA: { label: 'Yolda', color: 'info', icon: <LocalShipping sx={{ fontSize: 16 }} /> },
  TAMAMLANDI: { label: 'Tamamlandı', color: 'success', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
  IPTAL: { label: 'İptal', color: 'error', icon: <Cancel sx={{ fontSize: 16 }} /> },
};

export default function AmbarTransferFisiPage() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterDurum, setFilterDurum] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [printOpen, setPrintOpen] = useState(false);

  useEffect(() => {
    fetchTransfers();
  }, [filterDurum]);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterDurum) params.durum = filterDurum;

      const response = await axios.get('/warehouse-transfer', { params });
      setTransfers(response.data);
    } catch (error) {
      console.error('Transfer fişleri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Transfer fişini silmek istediğinizden emin misiniz?')) return;

    try {
      await axios.delete(`/warehouse-transfer/${id}`);
      fetchTransfers();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Silme işlemi başarısız', { variant: 'error' });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'transferNo',
      headerName: 'Fiş No',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'tarih',
      headerName: 'Tarih',
      width: 120,
      valueFormatter: (value) => value ? new Date(value).toLocaleDateString('tr-TR') : '-',
    },
    {
      field: 'fromWarehouse',
      headerName: 'Çıkış Ambarı',
      width: 180,
      valueGetter: (value, row) => row.fromWarehouse?.name || '-',
    },
    {
      field: 'toWarehouse',
      headerName: 'Giriş Ambarı',
      width: 180,
      valueGetter: (value, row) => row.toWarehouse?.name || '-',
    },
    {
      field: 'kalemler',
      headerName: 'Ürün',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.row.kalemler?.length || 0}
          size="small"
          sx={{ fontWeight: 700, borderRadius: 1.5, bgcolor: 'action.hover' }}
        />
      ),
    },
    {
      field: 'driverName',
      headerName: 'Sürücü / Plaka',
      width: 220,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>{params.row.driverName || '-'}</Typography>
          <Typography variant="caption" color="text.secondary">{params.row.vehiclePlate || 'Plaka Belirtilmemiş'}</Typography>
        </Box>
      ),
    },
    {
      field: 'durum',
      headerName: 'Durum',
      width: 150,
      renderCell: (params) => {
        const config = statusConfig[params.value] || { label: params.value, color: 'default', icon: null };
        return (
          <Chip
            icon={config.icon}
            label={config.label}
            color={config.color as any}
            size="small"
            variant="tonal"
            sx={{ fontWeight: 700, borderRadius: 1.5, px: 0.5 }}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 160,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', width: '100%' }}>
          <IconButton
            size="small"
            onClick={() => router.push(`/depo/transfer-fisi/${params.row.id}`)}
            title="Görüntüle"
          >
            <Visibility fontSize="small" />
          </IconButton>
          {params.row.durum === 'HAZIRLANIYOR' && (
            <>
              <IconButton
                size="small"
                onClick={() => router.push(`/depo/transfer-fisi/duzenle/${params.row.id}`)}
                sx={{ color: 'warning.main' }}
                title="Düzenle"
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDelete(params.row.id)}
                sx={{ color: 'error.main' }}
                title="Sil"
              >
                <Delete fontSize="small" />
              </IconButton>
            </>
          )}
          <IconButton
            size="small"
            onClick={() => {
              setSelectedTransfer(params.row);
              setPrintOpen(true);
            }}
            sx={{ color: 'info.main' }}
            title="Yazdır"
          >
            <Print fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const filteredTransfers = transfers.filter((transfer: any) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      transfer.transferNo?.toLowerCase().includes(search) ||
      transfer.fromWarehouse?.name?.toLowerCase().includes(search) ||
      transfer.toWarehouse?.name?.toLowerCase().includes(search) ||
      transfer.driverName?.toLowerCase().includes(search) ||
      transfer.vehiclePlate?.toLowerCase().includes(search)
    );
  });

  return (
    <StandardPage>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SwapHoriz sx={{ fontSize: 32, color: 'primary.main' }} />
            Ambar Transfer Fişleri
          </Typography>
          <Typography variant="body2" color="text.secondary">Ambarlar arası malzeme transferlerini buradan yönetebilir ve takip edebilirsiniz.</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push('/depo/transfer-fisi/yeni')}
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          Yeni Transfer Fişi
        </Button>
      </Box>

      <StandardCard sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            placeholder="Fiş no, ambar, sürücü, plaka..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
          />
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Durum Filtresi</InputLabel>
            <Select
              value={filterDurum}
              onChange={(e) => setFilterDurum(e.target.value)}
              label="Durum Filtresi"
              sx={{ borderRadius: 2 }}
              startAdornment={<FilterList fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />}
            >
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="HAZIRLANIYOR">Hazırlanıyor</MenuItem>
              <MenuItem value="YOLDA">Yolda</MenuItem>
              <MenuItem value="TAMAMLANDI">Tamamlandı</MenuItem>
              <MenuItem value="IPTAL">İptal</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </StandardCard>

      <StandardCard padding={0}>
        <Box sx={{ height: 600 }}>
          <DataGrid
            rows={filteredTransfers}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'action.hover',
                fontWeight: 700,
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 700,
                fontSize: '0.85rem',
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
          />
        </Box>
      </StandardCard>

      <WarehouseTransferPrintForm
        open={printOpen}
        transfer={selectedTransfer}
        onClose={() => setPrintOpen(false)}
      />
    </StandardPage>
  );
}
