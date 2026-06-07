'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from '@/lib/axios';
import { useTabStore } from '@/stores/tabStore';
import {
  Add,
  Assessment,
  Close,
  Delete,
  Edit,
  Search,
  Visibility,
  Download,
  RefreshOutlined,
  FilterList,
  Warning,
  Business,
  DeleteForever,
  Restore,
  History,
  CheckCircle,
  Cancel,
  Info,
  Refresh,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  LinearProgress,
  Avatar,
  alpha,
  useTheme,
  InputAdornment,
  Checkbox,
} from '@mui/material';
import { StandardCard, StandardPage } from '@/components/common';

interface Tenant {
  id: string;
  name: string;
  code: string;
  status: string;
  createdAt: string;
  userCount?: number;
  invoiceCount?: number;
  orderCount?: number;
  lastActivityAt?: string;
}

interface PurgeAuditEntry {
  id: string;
  tenantId: string;
  tenantName: string;
  action: string;
  performedBy: string;
  performedAt: string;
  details?: string;
  status: 'SUCCESS' | 'FAILED';
}

interface PurgeStats {
  purgeableCount: number;
  lastPurgeAt: string | null;
  totalPurged: number;
}

export default function AdminTenantsPage() {
  const theme = useTheme();
  const { addTab } = useTabStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [auditLogs, setAuditLogs] = useState<PurgeAuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<PurgeStats | null>(null);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  // Tab view: 'tenants' | 'audit'
  const [activeTab, setActiveTab] = useState<'tenants' | 'audit'>('tenants');

  // Dialogs
  const [openPurgeConfirm, setOpenPurgeConfirm] = useState(false);
  const [openViewTenant, setOpenViewTenant] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [purging, setPurging] = useState(false);
  const [purgeNotes, setPurgeNotes] = useState('');

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  useEffect(() => {
    addTab({ id: 'admin-tenants', label: 'Tenant Temizleme', path: '/admin/tenants' });
  }, [addTab]);

  useEffect(() => {
    if (activeTab === 'tenants') {
      fetchTenants();
      fetchStats();
    } else {
      fetchAuditLogs();
    }
  }, [activeTab, filterStatus, searchTerm]);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStatus) params.status = filterStatus;

      const response = await axios.get('/admin/tenants/purgeable', { params });
      const tenantList = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
      setTenants(tenantList.map((tenant: any) => ({
        id: tenant.id,
        name: tenant.name,
        code: tenant.subdomain ?? tenant.uuid ?? tenant.id,
        status: tenant.status,
        createdAt: tenant.createdAt,
      })));
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Tenantlar yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get('/admin/tenants/purge-audit', { params });
      const logs = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
      setAuditLogs(logs.map((log: any) => ({
        id: log.id,
        tenantId: log.tenantId,
        tenantName: log.tenant?.name ?? log.tenantId,
        action: 'PURGE',
        performedBy: log.adminEmail ?? log.adminId,
        performedAt: log.createdAt,
        details: log.errors ? JSON.stringify(log.errors) : `${log.deletedFiles ?? 0} dosya silindi`,
        status: log.errors?.length ? 'FAILED' : 'SUCCESS',
      })));
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Audit logları yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/admin/tenants/purgeable');
      const tenantList = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
      const auditResponse = await axios.get('/admin/tenants/purge-audit');
      const logs = Array.isArray(auditResponse.data) ? auditResponse.data : (auditResponse.data?.data ?? []);
      setStats({
        purgeableCount: tenantList.length,
        lastPurgeAt: logs[0]?.createdAt ?? null,
        totalPurged: logs.length,
      });
    } catch (error: any) {
      console.error('Stats yüklenirken hata:', error);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClearFilters = () => {
    setFilterStatus('');
    setSearchTerm('');
  };

  const handleSelectTenant = (tenantId: string) => {
    setSelectedTenants(prev => 
      prev.includes(tenantId) 
        ? prev.filter(id => id !== tenantId)
        : [...prev, tenantId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTenants.length === tenants.length) {
      setSelectedTenants([]);
    } else {
      setSelectedTenants(tenants.map(t => t.id));
    }
  };

  const handlePurgeClick = (tenant?: Tenant) => {
    if (tenant) {
      setSelectedTenant(tenant);
      setSelectedTenants([tenant.id]);
    }
    setOpenPurgeConfirm(true);
  };

  const handlePurgeConfirm = async () => {
    if (selectedTenants.length === 0) return;

    setPurging(true);
    try {
      for (const tenantId of selectedTenants) {
        await axios.post('/admin/tenants/purge', { tenantId });
      }
      showSnackbar(`${selectedTenants.length} tenant başarıyla temizlendi`, 'success');
      setOpenPurgeConfirm(false);
      setSelectedTenants([]);
      setSelectedTenant(null);
      setPurgeNotes('');
      fetchTenants();
      fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Temizleme işlemi başarısız', 'error');
    } finally {
      setPurging(false);
    }
  };

  const handleViewTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setOpenViewTenant(true);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('tr-TR');

  const purgeableCount = tenants.length;

  return (
    <StandardPage maxWidth={false}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--destructive) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DeleteForever sx={{ color: 'var(--destructive)', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="700" color="text.primary">Tenant Temizleme</Typography>
            <Typography variant="caption" color="text.secondary">Silinmiş/temizlenecek tenantları yönet</Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" startIcon={<History />}
            onClick={() => setActiveTab(activeTab === 'tenants' ? 'audit' : 'tenants')}
            sx={{ fontWeight: 600, fontSize: '0.8rem', boxShadow: 'none' }}>
            {activeTab === 'tenants' ? 'Audit Geçmişi' : 'Tenant Listesi'}
          </Button>
        </Stack>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1, height: 3 }} color="secondary" />}

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StandardCard padding={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--chart-1) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Warning sx={{ color: 'var(--chart-1)', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Temizlenebilir Tenant</Typography>
                <Typography variant="h6" fontWeight={800}>{stats?.purgeableCount ?? purgeableCount}</Typography>
              </Box>
            </Stack>
          </StandardCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StandardCard padding={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--chart-2) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Delete sx={{ color: 'var(--chart-2)', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Toplam Temizlenen</Typography>
                <Typography variant="h6" fontWeight={800}>{stats?.totalPurged ?? '-'}</Typography>
              </Box>
            </Stack>
          </StandardCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StandardCard padding={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--chart-3) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle sx={{ color: 'var(--chart-3)', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Son Temizleme</Typography>
                <Typography variant="h6" fontWeight={800}>
                  {stats?.lastPurgeAt ? formatDate(stats.lastPurgeAt) : 'Hiç yok'}
                </Typography>
              </Box>
            </Stack>
          </StandardCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StandardCard padding={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--destructive) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DeleteForever sx={{ color: 'var(--destructive)', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Seçili Tenant</Typography>
                <Typography variant="h6" fontWeight={800}>{selectedTenants.length}</Typography>
              </Box>
            </Stack>
          </StandardCard>
        </Grid>
      </Grid>

      {/* Tab Content */}
      <StandardCard padding={0} sx={{ boxShadow: 'none', overflow: 'hidden' }}>
        {activeTab === 'tenants' ? (
          <>
            {/* Tenant List Header */}
            <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'var(--card)' }}>
              <TextField size="small" placeholder="Tenant Ara..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 250, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
                  endAdornment: searchTerm && (<IconButton size="small" onClick={() => setSearchTerm('')}><Close fontSize="small" /></IconButton>),
                }} />

              <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                {selectedTenants.length > 0 && (
                  <Button variant="contained" color="error" size="small" startIcon={<DeleteForever />}
                    onClick={() => handlePurgeClick()}
                    sx={{ fontWeight: 600 }}>
                    Seçili ({selectedTenants.length}) Temizle
                  </Button>
                )}
                <Tooltip title="Yenile">
                  <IconButton size="small" onClick={() => { fetchTenants(); fetchStats(); }}>
                    <RefreshOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Tenant Table */}
            <Box sx={{ width: '100%' }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'var(--muted)' }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedTenants.length > 0 && selectedTenants.length < tenants.length}
                          checked={tenants.length > 0 && selectedTenants.length === tenants.length}
                          onChange={handleSelectAll}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Tenant Adı</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Kod</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Durum</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Kullanıcı</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Fatura</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Sipariş</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Son Aktivite</TableCell>
                      <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>İşlemler</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                          <CircularProgress size={24} />
                        </TableCell>
                      </TableRow>
                    ) : tenants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">Silinebilir tenant bulunamadı</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      tenants.map((tenant) => (
                        <TableRow key={tenant.id} hover selected={selectedTenants.includes(tenant.id)}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedTenants.includes(tenant.id)}
                              onChange={() => handleSelectTenant(tenant.id)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: 'var(--muted)', color: 'text.secondary' }}>
                                <Business fontSize="small" />
                              </Avatar>
                              <Typography variant="body2" fontWeight={600}>{tenant.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>
                              {tenant.code}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={tenant.status || 'INACTIVE'}
                              size="small"
                              color={tenant.status === 'ACTIVE' ? 'success' : 'default'}
                              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={500}>{tenant.userCount ?? 0}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={500}>{tenant.invoiceCount ?? 0}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={500}>{tenant.orderCount ?? 0}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {tenant.lastActivityAt ? formatDate(tenant.lastActivityAt) : '-'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                              <Tooltip title="Detayları Görüntüle" arrow>
                                <IconButton size="small" onClick={() => handleViewTenant(tenant)}
                                  sx={{ bgcolor: alpha('#1976d2', 0.08), '&:hover': { bgcolor: alpha('#1976d2', 0.2) } }}>
                                  <Visibility sx={{ fontSize: 16, color: '#1976d2' }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Temizle" arrow>
                                <IconButton size="small" onClick={() => handlePurgeClick(tenant)}
                                  sx={{ bgcolor: alpha('#dc2626', 0.08), '&:hover': { bgcolor: alpha('#dc2626', 0.2) } }}>
                                  <DeleteForever sx={{ fontSize: 16, color: '#dc2626' }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        ) : (
          /* Audit Log Tab */
          <>
            <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'var(--card)' }}>
              <TextField size="small" placeholder="Audit Log Ara..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 250, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
                  endAdornment: searchTerm && (<IconButton size="small" onClick={() => setSearchTerm('')}><Close fontSize="small" /></IconButton>),
                }} />
              <Box sx={{ ml: 'auto' }}>
                <Tooltip title="Yenile">
                  <IconButton size="small" onClick={fetchAuditLogs}>
                    <RefreshOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'var(--muted)' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Tarih/Saat</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tenant</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>İşlem</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Yapan Kullanıcı</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Durum</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Detaylar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : auditLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">Audit log kaydı bulunamadı</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    auditLogs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          <Typography variant="caption">{formatDateTime(log.performedAt)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>{log.tenantName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.action}
                            size="small"
                            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{log.performedBy}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.status === 'SUCCESS' ? 'Başarılı' : 'Başarısız'}
                            color={log.status === 'SUCCESS' ? 'success' : 'error'}
                            size="small"
                            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ whiteSpace: 'pre-wrap' }}>
                            {log.details || '-'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </StandardCard>

      {/* Purge Confirmation Dialog */}
      <Dialog open={openPurgeConfirm} onClose={() => !purging && setOpenPurgeConfirm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle component="div" sx={{ background: 'linear-gradient(135deg, var(--destructive) 0%, #991b1b 100%)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning />
            Tenant Temizleme
          </Box>
          <IconButton size="small" onClick={() => setOpenPurgeConfirm(false)} disabled={purging} sx={{ color: '#fff' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold">Bu işlem geri alınamaz!</Typography>
            <Typography variant="body2">Seçili tenantlar ve tüm ilişkili veriler tamamen silinecektir.</Typography>
          </Alert>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{selectedTenants.length}</strong> tenant temizlenecek:
            </Typography>
            <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'var(--muted)', maxHeight: 150, overflow: 'auto' }}>
              {tenants
                .filter(t => selectedTenants.includes(t.id))
                .map(t => (
                  <Box key={t.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography variant="body2">{t.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{t.code}</Typography>
                  </Box>
                ))}
            </Paper>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Temizleme Notu (opsiyonel)"
            value={purgeNotes}
            onChange={(e) => setPurgeNotes(e.target.value)}
            placeholder="Bu işlem için bir not ekleyin..."
            disabled={purging}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenPurgeConfirm(false)} disabled={purging}>Vazgeç</Button>
          <Button
            onClick={handlePurgeConfirm}
            variant="contained"
            color="error"
            disabled={purging || selectedTenants.length === 0}
            startIcon={purging ? <CircularProgress size={16} color="inherit" /> : <DeleteForever />}
          >
            {purging ? 'Temizleniyor...' : 'Temizle'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Tenant Dialog */}
      <Dialog open={openViewTenant} onClose={() => setOpenViewTenant(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle component="div" sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Tenant Detayı
          <IconButton size="small" onClick={() => setOpenViewTenant(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTenant && (
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: 'var(--muted)' }}>
                      <Business fontSize="large" />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>{selectedTenant.name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                        {selectedTenant.code}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">Durum</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedTenant.status || 'INACTIVE'}
                      color={selectedTenant.status === 'ACTIVE' ? 'success' : 'default'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">Oluşturulma</Typography>
                  <Typography variant="body1" fontWeight={500}>{formatDate(selectedTenant.createdAt)}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption" color="text.secondary">Kullanıcı Sayısı</Typography>
                  <Typography variant="h6" fontWeight={700}>{selectedTenant.userCount ?? 0}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption" color="text.secondary">Fatura Sayısı</Typography>
                  <Typography variant="h6" fontWeight={700}>{selectedTenant.invoiceCount ?? 0}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption" color="text.secondary">Sipariş Sayısı</Typography>
                  <Typography variant="h6" fontWeight={700}>{selectedTenant.orderCount ?? 0}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary">Son Aktivite</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedTenant.lastActivityAt ? formatDateTime(selectedTenant.lastActivityAt) : '-'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenViewTenant(false)}>Kapat</Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForever />}
            onClick={() => {
              setOpenViewTenant(false);
              handlePurgeClick(selectedTenant);
            }}
          >
            Temizle
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StandardPage>
  );
}