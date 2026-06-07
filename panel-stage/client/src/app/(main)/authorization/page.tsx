'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    Alert,
    Paper,
    Stack,
    Divider,
    alpha,
    useTheme,
} from '@mui/material';
import {
    AdminPanelSettings as AdminIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    PersonOff as PersonOffIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Security as SecurityIcon,
    Group as GroupIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';

// ============= TYPE DEFINITIONS =============

interface User {
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: string;
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
    tenant?: {
        id: string;
        name: string;
    };
}

interface UserStats {
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
}

// ============= HELPER FUNCTIONS =============

const getRoleLabel = (role: string): string => {
    const labels: Record<string, string> = {
        SUPER_ADMIN: 'Süper Admin',
        TENANT_ADMIN: 'Tenant Admin',
        ADMIN: 'Yönetici',
        MANAGER: 'Müdür',
        SUPPORT: 'Destek',
        USER: 'Kullanıcı',
        VIEWER: 'İzleyici',
    };
    return labels[role] || role;
};

const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
        SUPER_ADMIN: '#8b5cf6',
        TENANT_ADMIN: '#3b82f6',
        ADMIN: '#6366f1',
        MANAGER: '#10b981',
        SUPPORT: '#f59e0b',
        USER: '#6b7280',
        VIEWER: '#9ca3af',
    };
    return colors[role] || '#6b7280';
};

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return 'Hiç giriş yapmadı';
    const date = new Date(dateStr);
    return date.toLocaleString('tr-TR');
};

// ============= MAIN PAGE =============

export default function YetkilendirmePage() {
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user } = useAuthStore((state: any) => state) as any;

    const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'TENANT_ADMIN' || user?.role === 'ADMIN';

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [newRole, setNewRole] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('ALL');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ['users', searchQuery],
        queryFn: async () => {
            const response = await axios.get('/users', {
                params: { search: searchQuery, limit: 1000 },
            });
            return response.data;
        },
    });

    const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
        queryKey: ['users-stats'],
        queryFn: async () => {
            const response = await axios.get('/users/stats/summary');
            return response.data;
        },
    });

    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
            const response = await axios.put(`/users/${userId}/role`, { role });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users-stats'] });
            setRoleDialogOpen(false);
            setSelectedUser(null);
            enqueueSnackbar('Kullanıcı rolü başarıyla güncellendi', { variant: 'success' });
        },
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Rol güncellenirken bir hata oluştu', { variant: 'error' });
        }
    });

    const suspendMutation = useMutation({
        mutationFn: async (userId: string) => {
            const response = await axios.post(`/users/${userId}/suspend`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users-stats'] });
            enqueueSnackbar('Kullanıcı erişim durumu güncellendi', { variant: 'success' });
        },
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Durum güncellenirken bir hata oluştu', { variant: 'error' });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (userId: string) => {
            await axios.delete(`/users/${userId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users-stats'] });
            setDeleteDialogOpen(false);
            setSelectedUser(null);
            enqueueSnackbar('Kullanıcı başarıyla silindi', { variant: 'success' });
        },
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Kullanıcı silinirken bir hata oluştu', { variant: 'error' });
        }
    });

    const filteredUsers = (usersData?.data || []).filter((user: User) => {
        if (roleFilter !== 'ALL' && user.role !== roleFilter) return false;
        if (statusFilter === 'ACTIVE' && !user.isActive) return false;
        if (statusFilter === 'INACTIVE' && user.isActive) return false;
        return true;
    });

    const handleRoleChange = () => {
        if (!selectedUser || !newRole) return;
        updateRoleMutation.mutate({ userId: selectedUser.id, role: newRole });
    };

    const handleDelete = () => {
        if (!selectedUser) return;
        deleteMutation.mutate(selectedUser.id);
    };

    const columns: GridColDef[] = [
        {
            field: 'fullName',
            headerName: 'Kullanıcı / E-posta',
            flex: 1,
            minWidth: 250,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: alpha(getRoleColor(params.row.role), 0.1), color: getRoleColor(params.row.role), fontWeight: 800, fontSize: '0.9rem' }}>
                        {params.row.fullName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{params.row.fullName}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{params.row.email}</Typography>
                    </Box>
                </Box>
            ),
        },
        {
            field: 'role',
            headerName: 'Yetki Rolü',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={getRoleLabel(params.value)}
                    size="small"
                    sx={{
                        fontWeight: 800,
                        borderRadius: 1.5,
                        bgcolor: alpha(getRoleColor(params.value), 0.1),
                        color: getRoleColor(params.value),
                        border: '1px solid',
                        borderColor: alpha(getRoleColor(params.value), 0.2),
                    }}
                />
            ),
        },
        {
            field: 'isActive',
            headerName: 'Durum',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value ? 'Aktif' : 'Pasif'}
                    size="small"
                    sx={{ fontWeight: 800, borderRadius: 1.5 }}
                    color={params.value ? 'success' : 'default'}
                />
            ),
        },
        {
            field: 'lastLoginAt',
            headerName: 'Son Etkinlik',
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDate(params.value)}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>K.Adı: {params.row.username}</Typography>
                </Box>
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'İşlemler',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Rolü Yönet">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                                setSelectedUser(params.row);
                                setNewRole(params.row.role);
                                setRoleDialogOpen(true);
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={params.row.isActive ? 'Erişimi Kısıtla' : 'Erişim Ver'}>
                        <IconButton
                            size="small"
                            color={params.row.isActive ? 'warning' : 'success'}
                            onClick={() => suspendMutation.mutate(params.row.id)}
                        >
                            {params.row.isActive ? <PersonOffIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Kullanıcıyı Sil">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                                setSelectedUser(params.row);
                                setDeleteDialogOpen(true);
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
        },
    ];

    if (!isAdmin) {
        return (
            <StandardPage title="Yetkisiz Erişim">
                <Alert severity="error" variant="outlined" sx={{ borderRadius: 3 }}>Bu sayfaya erişim yetkiniz yok.</Alert>
            </StandardPage>
        );
    }

    return (
        <StandardPage
            title="Kullanıcı Yetkilendirme"
            breadcrumbs={[
                { label: 'Ayarlar', href: '/settings' },
                { label: 'Yetkilendirme' }
            ]}
            headerActions={
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={() => {
                        queryClient.invalidateQueries({ queryKey: ['users'] });
                        queryClient.invalidateQueries({ queryKey: ['users-stats'] });
                    }}
                    sx={{ fontWeight: 700, borderRadius: 3 }}
                >
                    Yenile
                </Button>
            }
        >
            <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 800 }}>
                    Sistemdeki tüm kullanıcıları listeleyebilir, rollerini değiştirebilir veya erişim durumlarını yönetebilirsiniz. Her rol farklı yetki seviyelerine sahiptir.
                </Typography>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'Toplam', value: stats?.total || 0, color: 'primary', icon: <GroupIcon /> },
                    { label: 'Aktif', value: stats?.active || 0, color: 'success', icon: <PersonIcon /> },
                    { label: 'Pasif', value: stats?.inactive || 0, color: 'error', icon: <PersonOffIcon /> },
                    { label: 'Yönetici', value: (stats?.byRole?.ADMIN || 0) + (stats?.byRole?.TENANT_ADMIN || 0) + (stats?.byRole?.SUPER_ADMIN || 0), color: 'info', icon: <SecurityIcon /> },
                ].map((s, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: alpha(theme.palette[s.color as any].main, 0.02) }}>
                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette[s.color as any].main, 0.1), color: `${s.color}.main`, display: 'flex' }}>
                                {s.icon}
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1 }}>{s.value}</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>{s.label}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Filters Paper */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 4, bgcolor: alpha(theme.palette.background.paper, 0.6) }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="İsim, e-posta veya kullanıcı adı ile ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'background.paper' } }}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Rol Filtresi</InputLabel>
                            <Select value={roleFilter} label="Rol Filtresi" onChange={(e) => setRoleFilter(e.target.value)} sx={{ borderRadius: 3, bgcolor: 'background.paper' }}>
                                <MenuItem value="ALL">Tüm Roller</MenuItem>
                                <MenuItem value="SUPER_ADMIN">Süper Admin</MenuItem>
                                <MenuItem value="TENANT_ADMIN">Tenant Admin</MenuItem>
                                <MenuItem value="ADMIN">Yönetici</MenuItem>
                                <MenuItem value="MANAGER">Müdür</MenuItem>
                                <MenuItem value="SUPPORT">Destek</MenuItem>
                                <MenuItem value="USER">Kullanıcı</MenuItem>
                                <MenuItem value="VIEWER">İzleyici</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Durum</InputLabel>
                            <Select value={statusFilter} label="Durum" onChange={(e) => setStatusFilter(e.target.value)} sx={{ borderRadius: 3, bgcolor: 'background.paper' }}>
                                <MenuItem value="ALL">Tüm Durumlar</MenuItem>
                                <MenuItem value="ACTIVE">Aktif Kullanıcılar</MenuItem>
                                <MenuItem value="INACTIVE">Pasif Kullanıcılar</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* User DataGrid */}
            <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={filteredUsers}
                        columns={columns}
                        loading={usersLoading}
                        pageSizeOptions={[25, 50, 100]}
                        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                        disableRowSelectionOnClick
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                            },
                        }}
                    />
                </Box>
            </Paper>

            {/* Role Change Dialog */}
            <Dialog
                open={roleDialogOpen}
                onClose={() => setRoleDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4 } }}
            >
                <DialogTitle sx={{ fontWeight: 800 }}>Kullanıcı Rolünü Güncelle</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ pt: 1 }}>
                            <Alert severity="info" variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                                <Typography variant="body2"><strong>{selectedUser.fullName}</strong> kullanıcısının sisteme erişim yetkisini değiştirmek üzeresiniz.</Typography>
                            </Alert>
                            <FormControl fullWidth>
                                <InputLabel>Yeni Rol Seçin</InputLabel>
                                <Select value={newRole} label="Yeni Rol Seçin" onChange={(e) => setNewRole(e.target.value)} sx={{ borderRadius: 2 }}>
                                    <MenuItem value="SUPER_ADMIN">Süper Admin</MenuItem>
                                    <MenuItem value="TENANT_ADMIN">Tenant Admin</MenuItem>
                                    <MenuItem value="ADMIN">Yönetici</MenuItem>
                                    <MenuItem value="MANAGER">Müdür</MenuItem>
                                    <MenuItem value="SUPPORT">Destek</MenuItem>
                                    <MenuItem value="USER">Kullanıcı</MenuItem>
                                    <MenuItem value="VIEWER">İzleyici</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setRoleDialogOpen(false)} sx={{ fontWeight: 700 }}>İptal</Button>
                    <Button variant="contained" onClick={handleRoleChange} disabled={updateRoleMutation.isPending} sx={{ fontWeight: 800, borderRadius: 2, px: 4 }}>
                        {updateRoleMutation.isPending ? 'Güncelleniyor...' : 'Rolü Güncelle'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4 } }}
            >
                <DialogTitle sx={{ fontWeight: 800 }}>Kullanıcıyı Sil</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ pt: 1 }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                <strong>{selectedUser.fullName}</strong> adlı kullanıcıyı kalıcı olarak silmek istediğinizden emin misiniz?
                            </Typography>
                            <Alert severity="warning" sx={{ borderRadius: 2 }}>
                                Bu işlem geri alınamaz ve kullanıcının sisteme girişi tamamen engellenir.
                            </Alert>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontWeight: 700 }}>Vazgeç</Button>
                    <Button color="error" variant="contained" onClick={handleDelete} disabled={deleteMutation.isPending} sx={{ fontWeight: 800, borderRadius: 2, px: 4 }}>
                        {deleteMutation.isPending ? 'Siliniyor...' : 'Onayla ve Sil'}
                    </Button>
                </DialogActions>
            </Dialog>
        </StandardPage>
    );
}
