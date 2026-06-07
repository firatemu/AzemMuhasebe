'use client';

import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    CircularProgress,
    Grid,
    Paper,
    InputAdornment,
    Stack,
    Divider,
    alpha,
    useTheme,
    Alert,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    AdminPanelSettings as AdminIcon,
    Security as SecurityIcon,
    People as PeopleIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    FilterList as FilterIcon,
    VerifiedUser as SystemIcon,
    ManageAccounts as RoleIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { RoleService } from '@/services/role.service';
import { useSnackbar } from 'notistack';
import StandardPage from '@/components/common/StandardPage';

export default function RolesPage() {
    const theme = useTheme();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDescription, setNewRoleDescription] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: roles = [], isLoading, isRefetching } = useQuery({
        queryKey: ['roles'],
        queryFn: RoleService.getRoles,
    });

    const createMutation = useMutation({
        mutationFn: RoleService.createRole,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            enqueueSnackbar('Rol başarıyla oluşturuldu', { variant: 'success' });
            setCreateDialogOpen(false);
            setNewRoleName('');
            setNewRoleDescription('');
            router.push(`/authorization/roller/${data.id}`);
        },
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Rol oluşturulurken hata oluştu', { variant: 'error' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: RoleService.deleteRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            enqueueSnackbar('Rol başarıyla silindi', { variant: 'success' });
            setDeleteDialogOpen(false);
            setSelectedRole(null);
        },
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Rol silinirken hata oluştu', { variant: 'error' });
        },
    });

    const handleCreate = () => {
        if (!newRoleName.trim()) return;
        createMutation.mutate({
            name: newRoleName,
            description: newRoleDescription,
            permissions: [],
        });
    };

    const handleDelete = () => {
        if (selectedRole) {
            deleteMutation.mutate(selectedRole.id);
        }
    };

    const filteredRoles = useMemo(() => {
        if (!searchQuery) return roles;
        const lowerQuery = searchQuery.toLowerCase();
        return roles.filter((role: any) =>
            role.name.toLowerCase().includes(lowerQuery) ||
            role.description?.toLowerCase().includes(lowerQuery)
        );
    }, [roles, searchQuery]);

    const stats = useMemo(() => {
        return {
            total: roles.length,
            system: roles.filter((r: any) => r.isSystemRole).length,
            custom: roles.filter((r: any) => !r.isSystemRole).length,
        };
    }, [roles]);

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Rol Tanımı',
            flex: 1,
            minWidth: 200,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            bgcolor: params.row.isSystemRole ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.action.disabled, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: params.row.isSystemRole ? 'primary.main' : 'text.disabled'
                        }}
                    >
                        {params.row.isSystemRole ? <SystemIcon fontSize="small" /> : <PeopleIcon fontSize="small" />}
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{params.value}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {params.row.description || 'Açıklama girilmedi.'}
                        </Typography>
                    </Box>
                </Box>
            )
        },
        {
            field: 'isSystemRole',
            headerName: 'Erişim Türü',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value ? 'Sistem Standart' : 'Özel Tanımlı'}
                    size="small"
                    sx={{
                        fontWeight: 800,
                        borderRadius: 1.5,
                        bgcolor: params.value ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.info.main, 0.1),
                        color: params.value ? 'primary.main' : 'info.main',
                        border: '1px solid',
                        borderColor: params.value ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.info.main, 0.2),
                    }}
                />
            ),
        },
        {
            field: '_count',
            headerName: 'Kullanıcılar',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={`${params.value?.users || 0} Kullanıcı`}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 800, borderRadius: 1.5 }}
                />
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'İşlemler',
            width: 120,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params: GridRenderCellParams) => {
                const isSystem = params.row.isSystemRole;
                return (
                    <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Düzenle / İzinler">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => router.push(`/authorization/roller/${params.row.id}`)}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        {!isSystem && (
                            <Tooltip title="Sil">
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                        setSelectedRole(params.row);
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                );
            },
        },
    ];

    return (
        <StandardPage
            title="Rol ve İzin Yönetimi"
            breadcrumbs={[
                { label: 'Ayarlar', href: '/settings' },
                { label: 'Yetkilendirme', href: '/authorization' },
                { label: 'Roller' }
            ]}
            headerActions={
                <Stack direction="row" spacing={1.5}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<RefreshIcon />}
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['roles'] })}
                        disabled={isRefetching}
                        sx={{ fontWeight: 700, borderRadius: 3 }}
                    >
                        Yenile
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateDialogOpen(true)}
                        sx={{ fontWeight: 800, borderRadius: 3, px: 3 }}
                    >
                        Yeni Rol
                    </Button>
                </Stack>
            }
        >
            <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 800 }}>
                    Kullanıcı yetki gruplarını buradan yönetebilirsiniz. Sistem rollerini değiştiremezsiniz ancak yeni özel roller oluşturup bunların uygulama içerisindeki yetki sınırlarını detaylıca yapılandırabilirsiniz.
                </Typography>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'Toplam Rol', value: stats.total, color: 'primary', icon: <RoleIcon /> },
                    { label: 'Sistem Standart', value: stats.system, color: 'info', icon: <SystemIcon /> },
                    { label: 'Özel Tanımlı', value: stats.custom, color: 'warning', icon: <PeopleIcon /> },
                ].map((s, i) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={i}>
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

            {/* Filter Bar */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: alpha(theme.palette.background.paper, 0.6) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', ml: 1, mr: 1 }}>
                    <FilterIcon fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>Filtrele:</Typography>
                </Box>
                <TextField
                    size="small"
                    placeholder="Rol adı veya açıklama ile ara..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    sx={{ width: 350, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'background.paper' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" sx={{ opacity: 0.5 }} />
                            </InputAdornment>
                        ),
                    }}
                />
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Ekranınızda <strong>{filteredRoles.length}</strong> rol listeleniyor.
                </Typography>
            </Paper>

            {/* Main Content Card */}
            <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={filteredRoles}
                        columns={columns}
                        loading={isLoading}
                        disableRowSelectionOnClick
                        getRowHeight={() => 'auto'}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 15 } },
                        }}
                        pageSizeOptions={[15, 30, 50]}
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

            {/* Create Dialog */}
            <Dialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4 } }}
            >
                <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>Yeni Rol Tanımla</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary', fontWeight: 600 }}>
                        Sistemde yeni bir yetki grubu oluşturun. İzin ayarlarını bir sonraki adımda detaylıca yapabilirsiniz.
                    </Typography>
                    <Stack spacing={3}>
                        <TextField
                            autoFocus
                            label="Rol Adı"
                            fullWidth
                            placeholder="Örn: Bölge Satış Sorumlusu"
                            value={newRoleName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRoleName(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Açıklama"
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Bu rolün görev ve yetki kapsamını buraya not edebilirsiniz..."
                            value={newRoleDescription}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRoleDescription(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setCreateDialogOpen(false)} sx={{ fontWeight: 700 }}>İptal</Button>
                    <Button
                        onClick={handleCreate}
                        variant="contained"
                        disabled={!newRoleName.trim() || createMutation.isPending}
                        sx={{ borderRadius: 2, px: 4, fontWeight: 800 }}
                    >
                        {createMutation.isPending ? 'İşleniyor...' : 'Rolü Oluştur'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 4 } }}
            >
                <DialogTitle sx={{ fontWeight: 800 }}>Rolü Sil</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        <strong>"{selectedRole?.name}"</strong> rolünü kalıcı olarak silmek üzeresiniz.
                    </Typography>
                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                        Bu işlem geri alınamaz. Eğer bu role atanmış kullanıcılar varsa silme işlemi sistem tarafından engellenebilir.
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontWeight: 700 }}>Vazgeç</Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={deleteMutation.isPending}
                        sx={{ borderRadius: 2, px: 4, fontWeight: 800 }}
                    >
                        {deleteMutation.isPending ? 'Siliniyor...' : 'Onayla ve Sil'}
                    </Button>
                </DialogActions>
            </Dialog>
        </StandardPage>
    );
}
