'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
  MoneyOff as RefundIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';

type MaasDurum = 'ODENMEDI' | 'KISMI_ODENDI' | 'TAMAMEN_ODENDI';

function mapSalaryStatus(status?: string): MaasDurum {
  switch (status) {
    case 'FULLY_PAID':
      return 'TAMAMEN_ODENDI';
    case 'PARTIALLY_PAID':
      return 'KISMI_ODENDI';
    default:
      return 'ODENMEDI';
  }
}

function mapSalaryPlan(plan: any): SalaryPlan {
  return {
    id: plan.id,
    personelId: plan.employeeId,
    personel: {
      id: plan.employee?.id ?? plan.employeeId,
      ad: plan.employee?.firstName ?? '',
      soyad: plan.employee?.lastName ?? '',
      personelKodu: plan.employee?.employeeCode ?? '',
    },
    yil: plan.year,
    ay: plan.month,
    maas: Number(plan.salary ?? 0),
    prim: Number(plan.bonus ?? 0),
    toplam: Number(plan.total ?? 0),
    odenenTutar: Number(plan.paidAmount ?? 0),
    kalanTutar: Number(plan.remainingAmount ?? 0),
    durum: mapSalaryStatus(plan.status),
  };
}

function mapSalaryPayment(payment: any): SalaryPayment {
  const employee = payment.employee ?? payment.salaryPlan?.employee;
  return {
    id: payment.id,
    planId: payment.salaryPlanId,
    employeeId: payment.employeeId,
    employee: {
      id: employee?.id ?? payment.employeeId,
      ad: employee?.firstName ?? '',
      soyad: employee?.lastName ?? '',
      personelKodu: employee?.employeeCode ?? '',
    },
    yil: payment.year ?? payment.salaryPlan?.year ?? 0,
    ay: payment.month ?? payment.salaryPlan?.month ?? 0,
    tutar: Number(payment.totalAmount ?? payment.amount ?? 0),
    aciklama: payment.notes,
    odemeDetaylari: (payment.paymentDetails ?? []).map((detail: any) => ({
      odemeTipi: detail.paymentMethod === 'CASH' ? 'NAKIT' : 'BANKA_HAVALESI',
      tutar: Number(detail.amount ?? 0),
      kasaId: detail.cashboxId,
      kasaAdi: detail.cashbox?.name,
      bankaHesapId: detail.bankAccountId,
      bankaHesapAdi: detail.bankAccount?.name,
      referansNo: detail.referenceNo,
      createdAt: detail.createdAt ?? payment.createdAt,
    })),
    createdAt: payment.createdAt,
  };
}

function buildSalaryPaymentPayload(data: any) {
  return {
    salaryPlanId: data.planId,
    employeeId: data.personelId,
    amount: data.tutar,
    notes: data.aciklama,
    paymentDetails: (data.odemeDetaylari ?? []).map((detay: any) => ({
      paymentMethod: detay.odemeTipi === 'NAKIT' ? 'CASH' : 'BANK_TRANSFER',
      amount: Number(detay.tutar),
      cashboxId: detay.kasaId || undefined,
      bankAccountId: detay.bankaHesapId || undefined,
      referenceNo: detay.referansNo || undefined,
      notes: detay.aciklama || undefined,
    })),
  };
}

interface SalaryPayment {
  id: string;
  planId: string;
  employeeId: string;
  employee: {
    id: string;
    ad: string;
    soyad: string;
    personelKodu: string;
  };
  yil: number;
  ay: number;
  tutar: number;
  aciklama?: string;
  odemeDetaylari?: {
    odemeTipi: 'NAKIT' | 'BANKA_HAVALESI';
    tutar: number;
    kasaId?: string;
    kasaAdi?: string;
    bankaHesapId?: string;
    bankaHesapAdi?: string;
    referansNo?: string;
    createdAt: string;
  }[];
  createdAt: string;
}

interface SalaryPlan {
  id: string;
  personelId: string;
  personel: {
    id: string;
    ad: string;
    soyad: string;
    personelKodu: string;
  };
  yil: number;
  ay: number;
  maas: number;
  prim: number;
  toplam: number;
  odenenTutar: number;
  kalanTutar: number;
  durum: 'ODENMEDI' | 'KISMI_ODENDI' | 'TAMAMEN_ODENDI';
}

interface CreatePaymentDialogProps {
  open: boolean;
  onClose: () => void;
  plans: SalaryPlan[];
  onSave: (data: any) => void;
}

const CreatePaymentDialog = React.memo(({ open, onClose, plans, onSave }: CreatePaymentDialogProps) => {
  async function fetchFinansData() {
    try {
      const [kasaRes, bankaRes] = await Promise.all([
        axios.get('/cashbox?aktif=true'),
        axios.get('/bank-accounts?isActive=true'),
      ]);
      setKasalar(kasaRes.data || []);
      setBankaHesaplari(bankaRes.data || []);
    } catch (error) {
      console.error('Finans verileri yüklenemedi:', error);
    }
  }

  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [tutar, setTutar] = useState(0);
  const [odemeTipi, setOdemeTipi] = useState<'NAKIT' | 'BANKA_HAVALESI'>('NAKIT');
  const [kasaId, setKasaId] = useState('');
  const [bankaHesapId, setBankaHesapId] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [kasalar, setKasalar] = useState<any[]>([]);
  const [bankaHesaplari, setBankaHesaplari] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchFinansData();
    }
  }, [open]);

  useEffect(() => {
    const plan = plans.find(p => p.id === selectedPlanId);
    if (plan) {
      setTutar(plan.kalanTutar);
      setAciklama(`${plan.yil}/${plan.ay} Maaş Ödemesi`);
    }
  }, [selectedPlanId, plans]);

  const handleSubmit = async () => {
    if (!selectedPlanId) {
      alert('Lütfen bir maaş planı seçin');
      return;
    }
    if (tutar <= 0) {
      alert('Geçerli bir tutar girin');
      return;
    }

    const plan = plans.find(p => p.id === selectedPlanId);
    if (!plan) return;

    setLoading(true);
    try {
      const paymentData = {
        planId: selectedPlanId,
        personelId: plan.personelId,
        tutar,
        aciklama,
        odemeDetaylari: [{
          odemeTipi,
          tutar,
          kasaId: odemeTipi === 'NAKIT' ? kasaId : undefined,
          bankaHesapId: odemeTipi === 'BANKA_HAVALESI' ? bankaHesapId : undefined,
        }],
      };
      onSave(paymentData);
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || 'İşlem başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>Maaş Ödemesi Oluştur</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Maaş Planı</InputLabel>
            <Select
              value={selectedPlanId}
              label="Maaş Planı"
              onChange={(e) => setSelectedPlanId(e.target.value)}
            >
              {plans.filter(p => p.kalanTutar > 0).map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.personel.ad} {plan.personel.soyad} - {plan.yil}/{plan.ay} (Kalan: ₺{plan.kalanTutar})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Tutar"
            type="number"
            value={tutar}
            onChange={(e) => setTutar(parseFloat(e.target.value) || 0)}
            InputProps={{ startAdornment: <Box sx={{ mr: 1 }}>₺</Box> }}
          />

          <FormControl fullWidth>
            <InputLabel>Ödeme Türü</InputLabel>
            <Select
              value={odemeTipi}
              label="Ödeme Türü"
              onChange={(e) => setOdemeTipi(e.target.value as any)}
            >
              <MenuItem value="NAKIT">Nakit (Kasa)</MenuItem>
              <MenuItem value="BANKA_HAVALESI">Banka Havalesi</MenuItem>
            </Select>
          </FormControl>

          {odemeTipi === 'NAKIT' ? (
            <FormControl fullWidth>
              <InputLabel>Kasa</InputLabel>
              <Select
                value={kasaId}
                label="Kasa"
                onChange={(e) => setKasaId(e.target.value)}
              >
                {kasalar.map((k) => (
                  <MenuItem key={k.id} value={k.id}>
                    {k.name || k.kasaAdi} (Bakiye: ₺{k.balance || k.bakiye})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <FormControl fullWidth>
              <InputLabel>Banka Hesabı</InputLabel>
              <Select
                value={bankaHesapId}
                label="Banka Hesabı"
                onChange={(e) => setBankaHesapId(e.target.value)}
              >
                {bankaHesaplari.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.accountName || b.hesapAdi}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            fullWidth
            label="Açıklama"
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ fontWeight: 700 }}>İptal</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ fontWeight: 800 }}
        >
          {loading ? 'İşleniyor...' : 'Ödeme Oluştur'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default function SalaryPaymentsPage() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [payments, setPayments] = useState<SalaryPayment[]>([]);
  const [plans, setPlans] = useState<SalaryPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<SalaryPayment | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const fetchPlans = useCallback(async () => {
    try {
      const response = await axios.get(`/salary-plans/odenecek/${year}/${month}`);
      setPlans((response.data?.planlar ?? []).map(mapSalaryPlan));
    } catch (error) {
      console.error('Maaş planları yüklenemedi:', error);
      setPlans([]);
    }
  }, [year, month]);

  const fetchPayments = useCallback(async () => {
    try {
      const employeesRes = await axios.get('/employees?isActive=true');
      const employees = Array.isArray(employeesRes.data)
        ? employeesRes.data
        : (employeesRes.data?.data ?? []);

      const paymentResponses = await Promise.all(
        employees.map((employee: { id: string }) =>
          axios.get(`/salary-payments/employee/${employee.id}/${year}`).catch(() => ({ data: [] })),
        ),
      );

      const allPayments = paymentResponses
        .flatMap((response) => response.data ?? [])
        .filter((payment: any) => Number(payment.month) === month)
        .map(mapSalaryPayment);

      setPayments(allPayments);
    } catch (error) {
      console.error('Ödemeler yüklenemedi:', error);
      setPayments([]);
    }
  }, [year, month]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPlans(), fetchPayments()])
      .finally(() => setLoading(false));
  }, [fetchPlans, fetchPayments]);

  const handleCreatePayment = async (data: any) => {
    try {
      await axios.post('/salary-payments/create', buildSalaryPaymentPayload(data));
      setSnackbar({ open: true, message: 'Maaş ödemesi başarıyla oluşturuldu', severity: 'success' });
      fetchPayments();
      fetchPlans();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'İşlem başarısız', severity: 'error' });
    }
  };

  const handleDownloadMakbuz = async (id: string) => {
    try {
      const response = await axios.get(`/salary-payments/makbuz/${id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `odeme-makbuzu-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setSnackbar({ open: true, message: 'Makbuz indirilemedi', severity: 'error' });
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axios.get(`/salary-payments/export/excel/${year}/${month}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `maas-listesi-${year}-${month}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSnackbar({ open: true, message: 'Excel raporu indirildi', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Excel raporu oluşturulamadı', severity: 'error' });
    }
  };

  const getStatusColor = (durum: string) => {
    switch (durum) {
      case 'TAMAMEN_ODENDI': return 'success';
      case 'KISMI_ODENDI': return 'warning';
      default: return 'error';
    }
  };

  const getStatusLabel = (durum: string) => {
    switch (durum) {
      case 'TAMAMEN_ODENDI': return 'Tamamen Ödendi';
      case 'KISMI_ODENDI': return 'Kısmi Ödeme';
      default: return 'Ödenmedi';
    }
  };

  return (
    <StandardPage
      title="Maaş Ödemeleri"
      breadcrumbs={[{ label: 'İK' }, { label: 'Maaş Yönetimi' }, { label: 'Ödemeler' }]}
      headerActions={
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ReceiptIcon />}
            onClick={handleExportExcel}
            sx={{ fontWeight: 800 }}
          >
            Excel'e Aktar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ fontWeight: 800 }}
          >
            Yeni Ödeme
          </Button>
        </Stack>
      }
    >
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Yıl</InputLabel>
            <Select
              value={year}
              label="Yıl"
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Ay</InputLabel>
            <Select
              value={month}
              label="Ay"
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <MenuItem key={m} value={m}>{m}. Ay</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
        Maaş Planları Durumu
      </Typography>
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
        <Paper
          variant="outlined"
          sx={{
            flex: '1 1 180px',
            p: 2,
            borderRadius: 3,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.success.main, 0.05),
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Tamamlanan
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>
            {plans.filter(p => p.durum === 'TAMAMEN_ODENDI').length}
          </Typography>
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            flex: '1 1 180px',
            p: 2,
            borderRadius: 3,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.warning.main, 0.05),
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Kısmi Ödeme
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main' }}>
            {plans.filter(p => p.durum === 'KISMI_ODENDI').length}
          </Typography>
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            flex: '1 1 180px',
            p: 2,
            borderRadius: 3,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.error.main, 0.05),
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Ödenmemiş
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main' }}>
            {plans.filter(p => p.durum === 'ODENMEDI').length}
          </Typography>
        </Paper>
      </Stack>

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
        Maaş Ödemeleri
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Personel</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Dönem</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Tutar</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Ödeme Türü</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Tarih</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {payment.employee?.ad} {payment.employee?.soyad}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {payment.employee?.personelKodu}
                  </Typography>
                </TableCell>
                <TableCell>{payment.yil} / {payment.ay}</TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 800, color: 'primary.main' }}>
                    ₺{Number(payment.tutar).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={payment.odemeDetaylari?.[0]?.odemeTipi === 'NAKIT' ? 'Nakit' : 'Havale'}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  {new Date(payment.createdAt).toLocaleDateString('tr-TR')}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Makbuz İndir">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleDownloadMakbuz(payment.id)}
                      >
                        <ReceiptIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  Maaş ödemesi bulunamadı
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CreatePaymentDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        plans={plans}
        onSave={handleCreatePayment}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 700 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StandardPage>
  );
}
