'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    TextField,
    CircularProgress,
    Grid,
    Chip,
    Alert,
    Stack,
    Paper,
    Divider,
    IconButton,
    CardContent,
    alpha,
    useTheme,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
} from '@mui/material';
import {
    Save as SaveIcon,
    AdminPanelSettings as AdminIcon,
    Security as SecurityIcon,
    History as HistoryIcon,
    Person as PersonIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { RoleService } from '@/services/role.service';
import axios from '@/lib/axios';
import PermissionMatrix from '@/components/Roles/PermissionMatrix';
import { useSnackbar } from 'notistack';
import StandardPage from '@/components/common/StandardPage';

export default function RoleDetailPage() {
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();
    const roleId = params.id as string;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isSystemRole, setIsSystemRole] = useState(false);

    const { data: role, isLoading: roleLoading } = useQuery({
        queryKey: ['role', roleId],
        queryFn: () => RoleService.getRole(roleId),
    });

    const { data: allPermissions = [], isLoading: permsLoading } = useQuery({
        queryKey: ['permissions'],
        queryFn: RoleService.getAllPermissions,
    });

    // Fetch users for this role
    const { data: usersData } = useQuery({
        queryKey: ['users-by-role', roleId],
        queryFn: async () => {
            const response = await axios.get('/users', { params: { role: roleId, limit: 100 } });
            return response.data;
        },
        enabled: !!roleId,
    });

    useEffect(() => {
        if (role) {
            setName(role.name);
            setDescription(role.description || '');
            setIsSystemRole(role.isSystemRole);
            if (role.permissions) {
                setSelectedPermissions(role.permissions.map((p: any) => p.permissionId));
            }
        }
    }, [role]);

    const updateMutation = useMutation({
        mutationFn: (data: any) => RoleService.updateRole(roleId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['role', roleId] });
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            enqueueSnackbar('Rol başarıyla güncellendi', { variant: 'success' });
            router.push('/authorization/roller');
        },
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Rol güncellenirken hata oluştu', { variant: 'error' });
        },
    });

    const handleSave = () => {
        updateMutation.mutate({
            name,
            description,
            permissions: selectedPermissions,
        });
    };

    if (roleLoading || permsLoading) {
        return (
            <StandardPage title="Yükleniyor...">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <CircularProgress size={40} thickness={5} />
                </Box>
            </StandardPage>
        );
    }

    if (!role) {
        return (
            <StandardPage title="Hata">
                <Alert severity="error" variant="outlined" sx={{ borderRadius: 3 }}>Rol bulunamadı.</Alert>
            </StandardPage>
        );
    }

    const roleUsers = usersData?.data || [];

    return (
        <StandardPage
            title={role.name}
            breadcrumbs={[
                { label: 'Ayarlar', href: '/settings' },
                { label: 'Yetkilendirme', href: '/authorization' },
                { label: 'Roller', href: '/authorization/roller' },
                { label: 'Düzenle' }
            ]}
            headerActions={
                !isSystemRole && (
                    <Button
                        variant="contained"
                        startIcon={updateMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        sx={{ fontWeight: 800, borderRadius: 3, px: 4 }}
                    >
                        {updateMutation.isPending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </Button>
                )
            }
        >
            {isSystemRole && (
                <Alert
                    severity="info"
                    variant="outlined"
                    icon={<SecurityIcon />}
                    sx={{ mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'primary.light', bgcolor: alpha(theme.palette.primary.main, 0.04) }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Bu bir <strong>Sistem Standart Rolüdür</strong>.</Typography>
                    <Typography variant="caption">Güvenlik gereği sistem tarafından otomatik tanımlanan rollerin isimleri ve yetki kapsamları değiştirilemez.</Typography>
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Left Col: Role Details */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Stack spacing={4}>
                        <Card variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
                            <Box sx={{ px: 3, py: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <AdminIcon color="primary" fontSize="small" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Rol Kimliği</Typography>
                            </Box>
                            <CardContent sx={{ p: 3 }}>
                                <Stack spacing={3}>
                                    <TextField
                                        label="Rol Adı"
                                        fullWidth
                                        variant="outlined"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={isSystemRole}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        label="Rol Açıklaması"
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rows={6}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={isSystemRole}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>

                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.action.disabledBackground, 0.1) }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'background.paper', color: 'text.secondary', display: 'flex' }}>
                                    <HistoryIcon />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase' }}>Düzenleme Bilgisi</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        {(role as any).updatedAt ? new Date((role as any).updatedAt).toLocaleString('tr-TR') : 'Kayıt bulunamadı'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Users with this role */}
                        <Card variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
                            <Box sx={{ px: 3, py: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <PersonIcon color="info" fontSize="small" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Rol Kullanıcıları</Typography>
                                <Chip label={`${roleUsers.length}`} size="small" color="info" sx={{ ml: 'auto', fontWeight: 800, borderRadius: 1.5 }} />
                            </Box>
                            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                                {roleUsers.length === 0 ? (
                                    <Box sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Bu role atanmış kullanıcı yok.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <List dense disablePadding>
                                        {roleUsers.slice(0, 5).map((user: any) => (
                                            <ListItem key={user.id} divider sx={{ py: 1.5 }}>
                                                <ListItemAvatar sx={{ minWidth: 40 }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                                                        <PersonIcon fontSize="small" />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                            {user.fullName || user.username}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <EmailIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
                                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                                {user.email}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                        {roleUsers.length > 5 && (
                                            <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                    +{roleUsers.length - 5} kullanıcı daha
                                                </Typography>
                                            </Box>
                                        )}
                                    </List>
                                )}
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                {/* Right Col: Permission Matrix */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Card variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
                        <Box sx={{ px: 3, py: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <SecurityIcon color="primary" fontSize="small" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Yetki Matrisi</Typography>
                            </Stack>
                            <Chip
                                label={`${selectedPermissions.length} Aktif Yetki`}
                                size="small"
                                color="primary"
                                sx={{ fontWeight: 800, borderRadius: 1.5 }}
                            />
                        </Box>
                        <Box sx={{ p: 0 }}>
                            <PermissionMatrix
                                permissions={allPermissions}
                                selectedPermissions={selectedPermissions}
                                onChange={setSelectedPermissions}
                                readOnly={isSystemRole}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </StandardPage>
    );
}
