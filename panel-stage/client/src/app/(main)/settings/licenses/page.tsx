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
  Tabs,
  Tab,
  Divider,
  alpha,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Shield as ShieldIcon,
  CardMembership as LicenseIcon,
  Group as GroupIcon,
  ShoppingCart as PurchaseIcon,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';

interface LicenseStatus {
  maxUsers: number;
  usedUsers: number;
  assignedModules: string[];
  hasBasePlan: boolean;
  planName?: string;
}

interface LicensedUser {
  id: string;
  licenseId: string;
  email: string;
  fullName: string;
  modules: string[];
  assignedAt: string;
}

interface BackendLicenseStatus {
  subscription?: {
    status?: string;
    plan?: { name?: string };
  };
  userLimits?: {
    total?: number;
    active?: number;
    available?: number;
  };
  modules?: Array<{
    module?: { name?: string; slug?: string };
    purchased?: number;
    assigned?: number;
  }>;
}

function mapLicenseStatus(data: BackendLicenseStatus): LicenseStatus {
  return {
    maxUsers: data.userLimits?.total ?? 0,
    usedUsers: data.userLimits?.active ?? 0,
    assignedModules: (data.modules ?? [])
      .map(m => m.module?.name ?? m.module?.slug)
      .filter((name): name is string => Boolean(name)),
    hasBasePlan: ['ACTIVE', 'TRIAL'].includes(data.subscription?.status ?? ''),
    planName: data.subscription?.plan?.name,
  };
}

function mapLicensedUser(user: {
  id: string;
  email: string;
  fullName: string;
  createdAt?: string;
  licenses?: Array<{
    id: string;
    licenseType: string;
    assignedAt: string;
    module?: { name?: string; slug?: string };
  }>;
}): LicensedUser {
  const baseLicense = user.licenses?.find(l => l.licenseType === 'BASE_PLAN');
  const moduleLicenses = user.licenses?.filter(l => l.licenseType === 'MODULE') ?? [];

  return {
    id: user.id,
    licenseId: baseLicense?.id ?? user.id,
    email: user.email,
    fullName: user.fullName,
    modules: moduleLicenses.map(l => l.module?.name ?? l.module?.slug ?? 'Modül'),
    assignedAt: baseLicense?.assignedAt ?? user.createdAt ?? new Date().toISOString(),
  };
}

interface Invitation {
  id: string;
  email: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  createdAt: string;
}

export default function LicensesPage() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus | null>(null);
  const [licensedUsers, setLicensedUsers] = useState<LicensedUser[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Dialog states
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignType, setAssignType] = useState<'base-plan' | 'module'>('base-plan');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [purchaseType, setPurchaseType] = useState<'users' | 'module'>('users');
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchaseModuleSlug, setPurchaseModuleSlug] = useState('');

  const modules = [
    { slug: 'POS', name: 'POS Modülü' },
    { slug: 'WAREHOUSE', name: 'Depo Yönetimi' },
    { slug: 'HR', name: 'İK & Bordro' },
    { slug: 'ACCOUNTING', name: 'Muhasebe' },
    { slug: 'ANALYTICS', name: 'Raporlama & Analitik' },
  ];

  const fetchLicenseStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/licenses/status');
      setLicenseStatus(mapLicenseStatus(response.data));
    } catch (error) {
      console.error('Lisans durumu yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLicensedUsers = useCallback(async () => {
    try {
      const response = await axios.get('/licenses/users');
      setLicensedUsers((response.data ?? []).map(mapLicensedUser));
    } catch (error) {
      console.error('Lisanslı kullanıcılar yüklenemedi:', error);
    }
  }, []);

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await axios.get('/licenses/users/all');
      setAllUsers(
        (response.data ?? []).map((user: { licenses?: Array<{ licenseType: string }> }) => ({
          ...user,
          hasLicense: user.licenses?.some(l => l.licenseType === 'BASE_PLAN') ?? false,
        })),
      );
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error);
    }
  }, []);

  const fetchInvitations = useCallback(async () => {
    try {
      const response = await axios.get('/licenses/invitations');
      setInvitations(response.data ?? []);
    } catch (error) {
      console.error('Davetiyeler yüklenemedi:', error);
    }
  }, []);

  useEffect(() => {
    fetchLicenseStatus();
  }, [fetchLicenseStatus]);

  useEffect(() => {
    if (tabValue === 0) {
      fetchLicensedUsers();
    } else if (tabValue === 1) {
      fetchAllUsers();
    } else if (tabValue === 2) {
      fetchInvitations();
    }
  }, [tabValue, fetchLicensedUsers, fetchAllUsers, fetchInvitations]);

  const handleAssignLicense = async () => {
    if (!selectedUserId) {
      setSnackbar({ open: true, message: 'Lütfen bir kullanıcı seçin', severity: 'error' });
      return;
    }
    if (assignType === 'module' && !selectedModule) {
      setSnackbar({ open: true, message: 'Lütfen bir modül seçin', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      if (assignType === 'base-plan') {
        await axios.post('/licenses/assign/base-plan', { userId: selectedUserId });
        setSnackbar({ open: true, message: 'Base plan lisansı atandı', severity: 'success' });
      } else {
        await axios.post('/licenses/assign/module', { userId: selectedUserId, moduleSlug: selectedModule });
        setSnackbar({ open: true, message: 'Modül lisansı atandı', severity: 'success' });
      }
      setAssignDialogOpen(false);
      setSelectedUserId('');
      setSelectedModule('');
      fetchLicensedUsers();
      fetchLicenseStatus();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'İşlem başarısız', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeLicense = async (licenseId: string) => {
    if (!confirm('Lisansı iptal etmek istediğinize emin misiniz?')) return;
    try {
      await axios.delete(`/licenses/revoke/${licenseId}`);
      setSnackbar({ open: true, message: 'Lisans iptal edildi', severity: 'success' });
      fetchLicensedUsers();
      fetchLicenseStatus();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'İşlem başarısız', severity: 'error' });
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      setSnackbar({ open: true, message: 'Geçerli bir e-posta girin', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      await axios.post('/licenses/invite', { email: inviteEmail });
      setSnackbar({ open: true, message: 'Davet e-postası gönderildi', severity: 'success' });
      setInviteDialogOpen(false);
      setInviteEmail('');
      fetchInvitations();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Davet gönderilemedi', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (purchaseType === 'users' && purchaseQuantity < 1) {
      setSnackbar({ open: true, message: 'Geçerli bir adet girin', severity: 'error' });
      return;
    }
    if (purchaseType === 'module' && !purchaseModuleSlug) {
      setSnackbar({ open: true, message: 'Modül seçin', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      if (purchaseType === 'users') {
        await axios.post('/licenses/purchase/additional-users', { quantity: purchaseQuantity.toString() });
        setSnackbar({ open: true, message: 'Ek kullanıcı satın alındı', severity: 'success' });
      } else {
        await axios.post('/licenses/purchase/module', { moduleSlug: purchaseModuleSlug, quantity: '1' });
        setSnackbar({ open: true, message: 'Modül lisansı satın alındı', severity: 'success' });
      }
      setPurchaseDialogOpen(false);
      fetchLicenseStatus();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Satın alma başarısız', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandardPage
      title="Lisans Yönetimi"
      breadcrumbs={[{ label: 'Ayarlar', href: '/settings' }, { label: 'Lisanslar' }]}
    >
      {/* License Status Cards */}
      {licenseStatus && (
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            <Card
              variant="outlined"
              sx={{
                flex: '1 1 200px',
                borderRadius: 4,
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'primary.main', boxShadow: theme.shadows[4] }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                    <GroupIcon />
                  </Box>
                  <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 900 }}>Kullanıcılar</Typography>
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                  {licenseStatus.usedUsers}
                  <Typography variant="h6" component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}> / {licenseStatus.maxUsers === -1 ? '∞' : licenseStatus.maxUsers}</Typography>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Kullanıcı Limiti</Typography>
              </CardContent>
            </Card>

            <Card
              variant="outlined"
              sx={{
                flex: '1 1 200px',
                borderRadius: 4,
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'primary.main', boxShadow: theme.shadows[4] }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                    <LicenseIcon />
                  </Box>
                  <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 900 }}>Plan</Typography>
                </Stack>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{licenseStatus.planName || 'Base Plan'}</Typography>
                <Chip
                  label={licenseStatus.hasBasePlan ? 'Aktif' : 'Pasif'}
                  size="small"
                  color={licenseStatus.hasBasePlan ? 'success' : 'error'}
                  sx={{ mt: 1, fontWeight: 800 }}
                />
              </CardContent>
            </Card>

            <Card
              variant="outlined"
              sx={{
                flex: '1 1 200px',
                borderRadius: 4,
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'primary.main', boxShadow: theme.shadows[4] }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
                    <ShieldIcon />
                  </Box>
                  <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 900 }}>Modüller</Typography>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {(licenseStatus.assignedModules?.length ?? 0) > 0 ? (
                    licenseStatus.assignedModules.map(mod => (
                      <Chip key={mod} label={mod} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                    ))
                  ) : (
                    <Typography variant="caption" color="text.secondary">Modül yok</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      )}

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
        <Button variant="contained" startIcon={<PersonIcon />} onClick={() => { setAssignType('base-plan'); setAssignDialogOpen(true); }} sx={{ fontWeight: 800, borderRadius: 2 }}>
          Kullanıcıya Lisans Ata
        </Button>
        <Button variant="outlined" startIcon={<ShieldIcon />} onClick={() => { setAssignType('module'); setAssignDialogOpen(true); }} sx={{ fontWeight: 800, borderRadius: 2 }}>
          Modül Ekle
        </Button>
        <Button variant="outlined" startIcon={<EmailIcon />} onClick={() => setInviteDialogOpen(true)} sx={{ fontWeight: 800, borderRadius: 2 }}>
          Kullanıcı Davet Et
        </Button>
        <Button variant="contained" color="success" startIcon={<PurchaseIcon />} onClick={() => setPurchaseDialogOpen(true)} sx={{ fontWeight: 800, borderRadius: 2 }}>
          Satın Al
        </Button>
      </Stack>

      {/* Tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
            '& .MuiTab-root': { fontWeight: 800, fontSize: '0.9rem', color: 'text.secondary', '&.Mui-selected': { color: 'primary.main' } }
          }}
        >
          <Tab label="Lisanslı Kullanıcılar" />
          <Tab label="Tüm Kullanıcılar" />
          <Tab label="Davetiyeler" />
        </Tabs>
        <Divider />
      </Box>

      {/* Licensed Users Table */}
      {tabValue === 0 && (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 4 }}>
          <Table>
            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Kullanıcı</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Modüller</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Atama Tarihi</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {licensedUsers.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main' }}>
                        <PersonIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{user.fullName}</Typography>
                        <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {(user.modules ?? []).map(mod => (
                        <Chip key={mod} label={mod} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>{new Date(user.assignedAt).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Lisansı İptal Et">
                      <IconButton size="small" color="error" onClick={() => handleRevokeLicense(user.licenseId)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {licensedUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>Lisanslı kullanıcı bulunamadı</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* All Users Table */}
      {tabValue === 1 && (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 4 }}>
          <Table>
            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Kullanıcı</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Lisans Durumu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allUsers.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main' }}>
                        <PersonIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{user.fullName || user.username}</Typography>
                        <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {user.hasLicense ? (
                      <Chip label="Lisanslı" size="small" color="success" sx={{ fontWeight: 800 }} />
                    ) : (
                      <Chip label="Lisanssız" size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {allUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 4 }}>Kullanıcı bulunamadı</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Invitations Table */}
      {tabValue === 2 && (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 4 }}>
          <Table>
            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>E-posta</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Durum</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Tarih</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invitations.map(inv => (
                <TableRow key={inv.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2">{inv.email}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={inv.status === 'PENDING' ? 'Bekliyor' : inv.status === 'ACCEPTED' ? 'Kabul Edildi' : 'Süresi Dolmuş'}
                      size="small"
                      color={inv.status === 'PENDING' ? 'warning' : inv.status === 'ACCEPTED' ? 'success' : 'error'}
                      sx={{ fontWeight: 800 }}
                    />
                  </TableCell>
                  <TableCell>{new Date(inv.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                </TableRow>
              ))}
              {invitations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>Davetiyeler bulunamadı</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Assign License Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {assignType === 'base-plan' ? 'Base Plan Lisansı Ata' : 'Modül Lisansı Ata'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Kullanıcı</InputLabel>
              <Select
                value={selectedUserId}
                label="Kullanıcı"
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                {allUsers.filter(u => !u.hasLicense).map(user => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.fullName || user.username} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {assignType === 'module' && (
              <FormControl fullWidth>
                <InputLabel>Modül</InputLabel>
                <Select
                  value={selectedModule}
                  label="Modül"
                  onChange={(e) => setSelectedModule(e.target.value)}
                >
                  {modules.map(mod => (
                    <MenuItem key={mod.slug} value={mod.slug}>{mod.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAssignDialogOpen(false)} sx={{ fontWeight: 700 }}>İptal</Button>
          <Button variant="contained" onClick={handleAssignLicense} disabled={loading} sx={{ fontWeight: 800, borderRadius: 2 }}>
            {loading ? 'İşleniyor...' : 'Ata'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Kullanıcı Davet Et</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
            Davet e-postası gönderilecek. Kullanıcı daveti kabul ettiğinde lisans ataması yapabilirsiniz.
          </Alert>
          <TextField
            fullWidth
            label="E-posta Adresi"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="kullanici@example.com"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setInviteDialogOpen(false)} sx={{ fontWeight: 700 }}>İptal</Button>
          <Button variant="contained" onClick={handleInviteUser} disabled={loading} sx={{ fontWeight: 800, borderRadius: 2 }}>
            {loading ? 'Gönderiliyor...' : 'Davet Et'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Purchase Dialog */}
      <Dialog open={purchaseDialogOpen} onClose={() => setPurchaseDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Lisans Satın Al</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Tabs
              value={purchaseType}
              onChange={(_, v) => setPurchaseType(v)}
              sx={{ mb: 2 }}
            >
              <Tab value="users" label="Ek Kullanıcı" />
              <Tab value="module" label="Modül" />
            </Tabs>
            {purchaseType === 'users' ? (
              <TextField
                fullWidth
                label="Adet"
                type="number"
                value={purchaseQuantity}
                onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                inputProps={{ min: 1 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Modül</InputLabel>
                <Select
                  value={purchaseModuleSlug}
                  label="Modül"
                  onChange={(e) => setPurchaseModuleSlug(e.target.value)}
                >
                  {modules.map(mod => (
                    <MenuItem key={mod.slug} value={mod.slug}>{mod.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPurchaseDialogOpen(false)} sx={{ fontWeight: 700 }}>İptal</Button>
          <Button variant="contained" color="success" onClick={handlePurchase} disabled={loading} sx={{ fontWeight: 800, borderRadius: 2 }}>
            {loading ? 'İşleniyor...' : 'Satın Al'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 700 }}>{snackbar.message}</Alert>
      </Snackbar>
    </StandardPage>
  );
}
