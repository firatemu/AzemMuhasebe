'use client';

import React, { useState, useMemo } from 'react';
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
    Alert,
    Snackbar,
    CircularProgress,
    Menu,
    MenuItem,
    ListItemIcon,
    Tooltip,
    InputAdornment,
    Stack,
    Divider,
    alpha,
    useTheme,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import {
    Person,
    Search,
    Close,
    Refresh,
    MoreVert,
    Block,
    AdminPanelSettings,
    Security,
    Email,
    Schedule,
    Edit,
    ToggleOn,
    ToggleOff,
    Delete,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuthStore } from '@/stores/authStore';
import { useSnackbar } from 'notistack';
import StandardPage from '@/components/common/StandardPage';

interface User {
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: string;
    roleId?: string;
    isActive: boolean;
    lastLoginAt?: string;
    createdAt: string;
    tenantId?: string;
}

interface UsersResponse {
    data: User[];
    total: number;
    page: number;
    limit: number;
}

export default function UsersPage() {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { permissions } = useAuthStore();
    const isAdmin = permissions.includes('ALL');

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 400);
    const [showInactive, setShowInactive] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

    // Dialogs
    const [openSuspend, setOpenSuspend] = useState(false);
    const [openRoleChange, setOpenRoleChange] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newRoleId, setNewRoleId] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const { data: usersData, isLoading, isRefetching, refetch } = useQuery<UsersResponse>({
        queryKey: ['users', debouncedSearch, showInactive, paginationModel.page, paginationModel.pageSize],
        queryFn: async () => {
            const params: any = {
                page: paginationModel.page + 1,
                limit: paginationModel.pageSize,
            };
            if (debouncedSearch) params.search = debouncedSearch;
            if (!showInactive) params.isActive = true;
            const response = await axios.get('/users', { params });
            return response.data;
        },
    });

    const { data: roles = [] } = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await axios.get('/roles');
            return response.data;
        },
    });

    const users = usersData?.data || [];
    const totalCount = usersData?.total || 0;

    const suspendMutation = useMutation({
        mutationFn: (userId: string) => axios.post(`/users/${userId}/suspend`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            enqueueSnackbar('Kullanıcı başarıyla askıya alındı', { variant: 'success' });
            setOpenSuspend(false);
            setSelectedUser(null);
        },
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'İşlem başarısız', { variant: 'error' });
        },
    });

    const changeRoleMutation = useMutation({
        mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
            axios.put(`/users/${userId}/role`, { role: roleId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            enqueueSnackbar('Kullanıcı rolü başarıyla değiştirildi', { variant: 'success' });
            setOpenRoleChange(false);
            setSelectedUser(null);
            setNewRoleId('');
        },
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Rol değiştirilemedi', { variant: 'error' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (userId: string) => axios.delete(`/users/${userId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            enqueueSnackbar('Kullanıcı başarıyla silindi', { variant: 'success' });
            setOpenDelete(false);
            setSelectedUser(null);
        },
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Kullanıcı silinemedi', { variant: 'error' });
        },
    });

    const stats = useMemo(() => {
        const all = usersData?.data || [];
        return {
            total: all.length,
            active: all.filter((u: User) => u.isActive).length,
            inactive: all.filter((u: User) => !u.isActive).length,
        };
    }, [usersData]);

    const columns: GridColDef[] = [
        {
            field: 'fullName',
            headerName: 'Kullanıcı',
            flex: 1.5,
            minWidth: 220,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'primary.main',
                            flexShrink: 0,
                        }}
                    >
                        <Person fontSize="small" />
                    </Box>
                    <Box minWidth={0}>
                        <Typography variant="body2" sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {params.value || params.row.username}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Email sx={{ fontSize: 11 }} /> {params.row.email}
                        </Typography>
                    </Box>
                </Box>
            ),
        },
        {
            field: 'role',
            headerName: 'Rol',
            width: 160,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    icon={params.value === 'SUPER_ADMIN' || params.value === 'TENANT_ADMIN' ? <AdminPanelSettings sx={{ fontSize: 14 }} /> : <Security sx={{ fontSize: 14 }} />}
                    label={params.value || 'Atanmamış'}
                    size="small"
                    sx={{
                        fontWeight: 700,
                        borderRadius: 1.5,
                        bgcolor: params.value === 'SUPER_ADMIN'
                            ? alpha(theme.palette.error.main, 0.1)
                            : params.value === 'TENANT_ADMIN'
                                ? alpha(theme.palette.warning.main, 0.1)
                                : alpha(theme.palette.info.main, 0.1),
                        color: params.value === 'SUPER_ADMIN'
                            ? 'error.main'
                            : params.value === 'TENANT_ADMIN'
                                ? 'warning.main'
                                : 'info.main',
                        border: '1px solid',
                        borderColor: params.value === 'SUPER_ADMIN'
                            ? alpha(theme.palette.error.main, 0.2)
                            : params.value === 'TENANT_ADMIN'
                                ? alpha(theme.palette.warning.main, 0.2)
                                : alpha(theme.palette.info.main, 0.2),
                    }}
                />
            ),
        },
        {
            field: 'isActive',
            headerName: 'Durum',
            width: 110,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value ? 'Aktif' : 'Askıda'}
                    size="small"
                    icon={params.value ? <ToggleOn sx={{ fontSize: 16 }} /> : <ToggleOff sx={{ fontSize: 16 }} />}
                    sx={{
                        fontWeight: 700,
                        borderRadius: 1.5,
                        bgcolor: params.value
                            ? alpha(theme.palette.success.main, 0.1)
                            : alpha(theme.palette.error.main, 0.1),
                        color: params.value ? 'success.main' : 'error.main',
                        border: '1px solid',
                        borderColor: params.value
                            ? alpha(theme.palette.success.main, 0.2)
                            : alpha(theme.palette.error.main, 0.2),
                        '& .MuiChip-icon': { color: 'inherit' },
                    }}
                />
            ),
        },
        {
            field: 'lastLoginAt',
            headerName: 'Son Giriş',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Schedule sx={{ fontSize: 13, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {params.value ? new Date(params.value).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : 'Henüz giriş yapmadı'}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'İşlemler',
            width: 100,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params: GridRenderCellParams) => {
                const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
                const open = Boolean(anchorEl);
                const user = params.row as User;
                const isCurrentUser = false; // Would need auth context

                const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    setAnchorEl(event.currentTarget);
                };

                const handleClose = () => setAnchorEl(null);

                const actions = [
                    ...(isAdmin ? [{
                        id: 'role',
                        label: 'Rol Değiştir',
                        icon: <Security fontSize="small" />,
                        color: 'info.main',
                        onClick: () => { handleClose(); setSelectedUser(user); setNewRoleId(user.roleId || ''); setOpenRoleChange(true); },
                    }] : []),
                    ...(isAdmin && user.isActive ? [{
                        id: 'suspend',
                        label: 'Askıya Al',
                        icon: <Block fontSize="small" />,
                        color: 'warning.main',
                        onClick: () => { handleClose(); setSelectedUser(user); setOpenSuspend(true); },
                    }] : []),
                    ...(isAdmin && !user.isActive ? [{
                        id: 'activate',
                        label: 'Aktive Et',
                        icon: <ToggleOn fontSize="small" />,
                        color: 'success.main',
                        onClick: () => { handleClose(); /* reactivate mutation */ },
                    }] : []),
                    ...(isAdmin ? [{
                        id: 'delete',
                        label: 'Sil',
                        icon: <Delete fontSize="small" />,
                        color: 'error.main',
                        onClick: () => { handleClose(); setSelectedUser(user); setOpenDelete(true); },
                    }] : []),
                ];

                return (
                    <>
                        <IconButton size="small" onClick={handleOpen} sx={{ color: 'text.secondary' }}>
                            <MoreVert fontSize="small" />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{ sx: { minWidth: 200, borderRadius: 3, border: '1px solid', borderColor: 'divider' } }}
                        >
                            <Box sx={{ px: 2, py: 1.5, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    Kullanıcı İşlemleri
                                </Typography>
                            </Box>
                            <Box sx={{ p: 1 }}>
                                {actions.map((action) => (
                                    <MenuItem
                                        key={action.id}
                                        onClick={action.onClick}
                                        sx={{ borderRadius: 2, color: action.color, py: 1 }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 36, color: action.color }}>
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
    ];

    return (
        <StandardPage
            title="Kullanıcı Yönetimi"
            breadcrumbs={[
                { label: 'Ayarlar', href: '/settings' },
                { label: 'Kullanıcılar' },
            ]}
            headerActions={
                <Stack direction="row" spacing={1.5}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Refresh />}
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        sx={{ fontWeight: 700, borderRadius: 3 }}
                    >
                        Yenile
                    </Button>
                </Stack>
            }
        >
            <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 800 }}>
                    Sistem kullanıcılarını yönetin. Roller atayın, hesapları askıya alın veya silin.
                </Typography>
            </Box>

            {/* Filter Bar */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: alpha(theme.palette.background.paper, 0.6) }}>
                <TextField
                    size="small"
                    placeholder="E-posta, kullanıcı adı veya ad ile ara..."
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    sx={{ width: 320, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'background.paper' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" sx={{ opacity: 0.5 }} />
                            </InputAdornment>
                        ),
                        endAdornment: search && (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setSearch('')} edge="end">
                                    <Close fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Tooltip title={showInactive ? 'Aktif kullanıcıları göster' : 'Tüm kullanıcıları göster'}>
                    <Button
                        variant={showInactive ? 'contained' : 'outlined'}
                        size="small"
                        startIcon={showInactive ? <ToggleOn /> : <ToggleOff />}
                        onClick={() => setShowInactive(!showInactive)}
                        sx={{ fontWeight: 700, borderRadius: 3 }}
                    >
                        {showInactive ? 'Tümü' : 'Aktifler'}
                    </Button>
                </Tooltip>
                <Box sx={{ ml: 'auto' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {totalCount} kullanıcı
                    </Typography>
                </Box>
            </Paper>

            {/* Data Grid */}
            <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={users}
                        columns={columns}
                        loading={isLoading}
                        rowCount={totalCount}
                        paginationMode="server"
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[25, 50, 100]}
                        disableRowSelectionOnClick
                        getRowHeight={() => 'auto'}
                        localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid',
                                borderColor: alpha(theme.palette.divider, 0.5),
                            },
                        }}
                    />
                </Box>
            </Paper>

            {/* Suspend Dialog */}
            <Dialog open={openSuspend} onClose={() => setOpenSuspend(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Block color="warning" /> Kullanıcıyı Askıya Al
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ borderRadius: 2, mb: 2 }}>
                        Bu kullanıcı giriş yapamayacak ve tüm erişimi geçici olarak kısıtlanacaktır.
                    </Alert>
                    <Typography>
                        <strong>{selectedUser?.fullName || selectedUser?.username}</strong> ({selectedUser?.email}) hesabını askıya almak üzeresiniz.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenSuspend(false)} sx={{ fontWeight: 700 }}>İptal</Button>
                    <Button
                        onClick={() => selectedUser && suspendMutation.mutate(selectedUser.id)}
                        variant="contained"
                        color="warning"
                        disabled={suspendMutation.isPending}
                        sx={{ borderRadius: 2, fontWeight: 800 }}
                    >
                        {suspendMutation.isPending ? 'İşleniyor...' : 'Askıya Al'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Role Change Dialog */}
            <Dialog open={openRoleChange} onClose={() => setOpenRoleChange(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Security color="info" /> Rol Değiştir
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 3 }}>
                        <strong>{selectedUser?.fullName || selectedUser?.username}</strong> için yeni rol seçin.
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel>Rol</InputLabel>
                        <Select
                            value={newRoleId}
                            label="Rol"
                            onChange={(e) => setNewRoleId(e.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            {roles.map((role: any) => (
                                <MenuItem key={role.id} value={role.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Security sx={{ fontSize: 18, color: 'info.main' }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{role.name}</Typography>
                                            {role.description && (
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{role.description}</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenRoleChange(false)} sx={{ fontWeight: 700 }}>İptal</Button>
                    <Button
                        onClick={() => selectedUser && newRoleId && changeRoleMutation.mutate({ userId: selectedUser.id, roleId: newRoleId })}
                        variant="contained"
                        disabled={!newRoleId || changeRoleMutation.isPending}
                        sx={{ borderRadius: 2, fontWeight: 800 }}
                    >
                        {changeRoleMutation.isPending ? 'İşleniyor...' : 'Rolü Değiştir'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800, color: 'error.main' }}>
                    ⚠️ Kullanıcıyı Sil
                </DialogTitle>
                <DialogContent>
                    <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
                        Bu işlem geri alınamaz. Kullanıcının tüm verileri silinecektir.
                    </Alert>
                    <Typography>
                        <strong>{selectedUser?.fullName || selectedUser?.username}</strong> ({selectedUser?.email}) kullanıcısını silmek üzeresiniz.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDelete(false)} sx={{ fontWeight: 700 }}>İptal</Button>
                    <Button
                        onClick={() => selectedUser && deleteMutation.mutate(selectedUser.id)}
                        variant="contained"
                        color="error"
                        disabled={deleteMutation.isPending}
                        sx={{ borderRadius: 2, fontWeight: 800 }}
                    >
                        {deleteMutation.isPending ? 'Siliniyor...' : 'Sil'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </StandardPage>
    );
}
