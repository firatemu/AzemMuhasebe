'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
    Box,
    Paper,
    Typography,
    Switch,
    FormControlLabel,
    Alert,
    Snackbar,
    CircularProgress,
    Divider,
    Card,
    CardContent,
    Stack,
    alpha,
    useTheme,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Chip,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Tabs,
    Tab,
} from '@mui/material';
import {
    Settings as SettingsIcon,
    Add,
    Edit,
    Delete,
    Close,
    Save,
    Search,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import StandardCard from '@/components/common/StandardCard';
import {
    getAllParameters,
    SystemParameter,
    setParameterAsBoolean,
    createParameter,
    updateParameter,
    deleteParameter,
} from '@/services/systemParameterService';
import CheckBillSettingsSection from '@/components/settings/CheckBillSettingsSection';

interface ParameterDefinition {
    key: string;
    label: string;
    description: string;
    category: string;
    defaultValue: boolean;
    icon?: React.ReactNode;
}

const PARAMETER_DEFINITIONS: ParameterDefinition[] = [
    {
        key: 'AUTO_COSTING_ON_PURCHASE_INVOICE',
        label: 'Otomatik Maliyetlendirme',
        description: 'Satın alma faturaları kaydedildiğinde veya silindiğinde otomatik olarak maliyetlendirme servisi çalışır.',
        category: 'FATURA',
        defaultValue: true,
    },
    {
        key: 'AUTO_APPROVE_INVOICE',
        label: 'Faturaları Otomatik Onayla',
        description: 'Yeni oluşturulan faturaların durumunu otomatik olarak "Onaylandı" yapar.',
        category: 'FATURA',
        defaultValue: false,
    },
    {
        key: 'NEGATIVE_STOCK_CONTROL',
        label: 'Negatif Stok Kontrolü',
        description: 'Satış faturası kaydedilirken stok kontrolü yapılır.',
        category: 'STOK',
        defaultValue: false,
    },
    {
        key: 'NEGATIVE_BANK_BALANCE_CONTROL',
        label: 'Negatif Banka Bakiyesi Kontrolü',
        description: 'Banka işlemlerinde bakiye kontrolü yapılır.',
        category: 'BANKA',
        defaultValue: true,
    },
    {
        key: 'ALLOW_NEGATIVE_CASH_BALANCE',
        label: 'Negatif Kasa Bakiyesi İzni',
        description: 'Kasa işlemlerinde bakiye kontrolü yapılır.',
        category: 'KASA',
        defaultValue: false,
    },
    {
        key: 'CARI_RISK_CONTROL',
        label: 'Cari Risk Limiti Kontrolü',
        description: 'Aktif olduğunda, tanımlanan risk limitini aşacak işlem oluşturulamaz.',
        category: 'CARİ',
        defaultValue: false,
    },
];

const SYSTEM_CATEGORIES = [
    'FATURA',
    'STOK',
    'BANKA',
    'KASA',
    'CARİ',
    'DİĞER',
];

interface ParameterFormData {
    key: string;
    value: string;
    description: string;
    category: string;
}

const emptyFormData: ParameterFormData = {
    key: '',
    value: '',
    description: '',
    category: 'DİĞER',
};

const ParameterFormDialog = memo(({
    open,
    editMode,
    initialData,
    loading,
    onClose,
    onSubmit,
    onFormChange,
}: {
    open: boolean;
    editMode: boolean;
    initialData: SystemParameter | null;
    loading: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onFormChange: (field: keyof ParameterFormData, value: string) => void;
}) => {
    const [formData, setFormDataLocal] = useState<ParameterFormData>(emptyFormData);

    useEffect(() => {
        if (open) {
            if (editMode && initialData) {
                setFormDataLocal({
                    key: initialData.key,
                    value: String(initialData.value ?? ''),
                    description: initialData.description || '',
                    category: initialData.category || 'DİĞER',
                });
            } else {
                setFormDataLocal(emptyFormData);
            }
        }
    }, [open, editMode, initialData]);

    const handleChange = (field: keyof ParameterFormData, value: string) => {
        setFormDataLocal(prev => ({ ...prev, [field]: value }));
        onFormChange(field, value);
    };

    if (!open) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    bgcolor: 'var(--card)',
                    backgroundImage: 'none',
                },
            }}
        >
            <Box sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                    }}>
                        <SettingsIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--foreground)' }}>
                            {editMode ? 'Parametre Düzenle' : 'Yeni Parametre'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                            Sistem parametresi oluşturun veya güncelleyin
                        </Typography>
                    </Box>
                </Box>
                <IconButton size="small" onClick={onClose}>
                    <Close fontSize="small" />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                    <TextField
                        fullWidth
                        required
                        label="Parametre Anahtarı"
                        value={formData.key}
                        onChange={(e) => handleChange('key', e.target.value.toUpperCase())}
                        placeholder="Örn: MY_CUSTOM_PARAMETER"
                        disabled={editMode}
                        helperText={editMode ? 'Anahtar değiştirilemez' : 'Benzersiz bir anahtar girin'}
                        inputProps={{
                            style: { fontFamily: 'monospace' },
                        }}
                    />

                    <TextField
                        fullWidth
                        required
                        label="Değer"
                        value={formData.value}
                        onChange={(e) => handleChange('value', e.target.value)}
                        placeholder="Parametre değeri"
                    />

                    <FormControl fullWidth>
                        <InputLabel>Kategori</InputLabel>
                        <Select
                            value={formData.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            label="Kategori"
                        >
                            {SYSTEM_CATEGORIES.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Açıklama"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Bu parametrenin ne işe yaradığını açıklayın"
                        multiline
                        rows={2}
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid var(--border)', gap: 1 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                    İptal
                </Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={loading || !formData.key || !formData.value}
                    startIcon={<Save />}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                >
                    {loading ? 'Kaydediliyor...' : (editMode ? 'Güncelle' : 'Oluştur')}
                </Button>
            </DialogActions>
        </Dialog>
    );
});

ParameterFormDialog.displayName = 'ParameterFormDialog';

export default function ParametrelerPage() {
    const theme = useTheme();
    const [parameters, setParameters] = useState<SystemParameter[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<Record<string, boolean>>({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedParameter, setSelectedParameter] = useState<SystemParameter | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<SystemParameter | null>(null);
    const [formData, setFormData] = useState<ParameterFormData>(emptyFormData);

    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchParameters();
    }, []);

    const fetchParameters = async () => {
        try {
            setLoading(true);
            const data = await getAllParameters();
            setParameters(data);
        } catch (error: any) {
            showSnackbar(error.response?.data?.message || 'Parametreler yüklenirken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleParameterChange = async (key: string, value: boolean) => {
        try {
            setSaving((prev) => ({ ...prev, [key]: true }));

            const definition = PARAMETER_DEFINITIONS.find((d) => d.key === key);
            if (!definition) throw new Error('Parametre tanımı bulunamadı');

            await setParameterAsBoolean(key, value, definition.description, definition.category);

            setParameters((prev) => {
                const existing = prev.find((p) => p.key === key);
                if (existing) {
                    return prev.map((p) => (p.key === key ? { ...p, value } : p));
                } else {
                    return [
                        ...prev,
                        {
                            id: '',
                            key,
                            value,
                            description: definition.description,
                            category: definition.category,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                    ];
                }
            });

            showSnackbar('Parametre başarıyla güncellendi', 'success');
        } catch (error: any) {
            showSnackbar(error.response?.data?.message || 'Parametre güncellenirken hata oluştu', 'error');
        } finally {
            setSaving((prev) => ({ ...prev, [key]: false }));
        }
    };

    const getParameterValue = (key: string, defaultValue: boolean): boolean => {
        const param = parameters.find((p) => p.key === key);
        if (!param) return defaultValue;
        return param.value === true || param.value === 'true' || param.value === 1;
    };

    const groupedParameters = PARAMETER_DEFINITIONS.reduce((acc, def) => {
        if (!acc[def.category]) {
            acc[def.category] = [];
        }
        acc[def.category].push(def);
        return acc;
    }, {} as Record<string, ParameterDefinition[]>);

    const customParameters = parameters.filter(
        (p) => !PARAMETER_DEFINITIONS.find((d) => d.key === p.key)
    );

    const groupedCustomParameters = useMemo(() => {
        const filtered = customParameters.filter((p) => {
            const matchesSearch = !searchQuery ||
                p.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTab = activeTab === 'all' || p.category === activeTab;
            return matchesSearch && matchesTab;
        });

        return filtered.reduce((acc, param) => {
            const cat = param.category || 'DİĞER';
            if (!acc[cat]) {
                acc[cat] = [];
            }
            acc[cat].push(param);
            return acc;
        }, {} as Record<string, SystemParameter[]>);
    }, [customParameters, searchQuery, activeTab]);

    const handleOpenDialog = (param?: SystemParameter) => {
        if (param) {
            setEditMode(true);
            setSelectedParameter(param);
            setFormData({
                key: param.key,
                value: String(param.value ?? ''),
                description: param.description || '',
                category: param.category || 'DİĞER',
            });
        } else {
            setEditMode(false);
            setSelectedParameter(null);
            setFormData(emptyFormData);
        }
        setDialogOpen(true);
    };

    const handleFormChange = (field: keyof ParameterFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            setActionLoading(true);

            if (editMode && selectedParameter) {
                await updateParameter(selectedParameter.key, {
                    value: formData.value,
                    description: formData.description,
                    category: formData.category,
                });
                showSnackbar('Parametre güncellendi', 'success');
            } else {
                await createParameter({
                    key: formData.key,
                    value: formData.value,
                    description: formData.description,
                    category: formData.category,
                });
                showSnackbar('Parametre oluşturuldu', 'success');
            }

            setDialogOpen(false);
            fetchParameters();
        } catch (error: any) {
            showSnackbar(error.response?.data?.message || 'İşlem sırasında hata oluştu', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedForDelete) return;

        try {
            setActionLoading(true);
            await deleteParameter(selectedForDelete.key);
            showSnackbar('Parametre silindi', 'success');
            setDeleteDialogOpen(false);
            setSelectedForDelete(null);
            fetchParameters();
        } catch (error: any) {
            showSnackbar(error.response?.data?.message || 'Silme sırasında hata oluştu', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <StandardPage title="Yükleniyor...">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress size={40} thickness={4} />
                </Box>
            </StandardPage>
        );
    }

    return (
        <StandardPage
            title="Sistem Parametreleri"
            breadcrumbs={[{ label: 'Ayarlar', href: '/settings' }, { label: 'Parametreler' }]}
            headerActions={
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none' }}
                >
                    Yeni Parametre
                </Button>
            }
        >
            <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 800 }}>
                    Uygulama genelindeki işleyiş kurallarını, otomatik kontrolleri ve limitleri buradan yönetebilirsiniz.
                </Typography>
            </Box>

            {/* Predefined Parameters */}
            {Object.entries(groupedParameters).map(([category, defs]) => (
                <Box key={category} sx={{ mb: 6 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                        <Box sx={{ width: 8, height: 24, bgcolor: 'primary.main', borderRadius: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.primary', fontSize: '1rem' }}>
                            {category} AYARLARI
                        </Typography>
                    </Stack>
                    <Divider sx={{ mb: 3 }} />

                    <Stack spacing={2}>
                        {defs.map((def) => {
                            const currentValue = getParameterValue(def.key, def.defaultValue);
                            const isSaving = saving[def.key] || false;

                            return (
                                <Card
                                    key={def.key}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 4,
                                        transition: 'all 0.2s',
                                        '&:hover': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.01) }
                                    }}
                                >
                                    <CardContent sx={{ p: '24px !important' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Box sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: 'primary.main',
                                                display: 'flex'
                                            }}>
                                                <SettingsIcon />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                                        {def.label}
                                                    </Typography>
                                                    {isSaving && <CircularProgress size={16} />}
                                                </Stack>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 700 }}>
                                                    {def.description}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ pl: 2, borderLeft: '1px solid', borderColor: 'divider' }}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={currentValue}
                                                            onChange={(e) => handleParameterChange(def.key, e.target.checked)}
                                                            disabled={isSaving}
                                                            color="primary"
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: currentValue ? 'primary.main' : 'text.disabled' }}>
                                                            {currentValue ? 'AKTİF' : 'PASİF'}
                                                        </Typography>
                                                    }
                                                    labelPlacement="bottom"
                                                />
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Stack>
                </Box>
            ))}

            {/* Custom Parameters Section */}
            <Box sx={{ mb: 6 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ width: 8, height: 24, bgcolor: 'secondary.main', borderRadius: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.primary', fontSize: '1rem' }}>
                        ÖZEL PARAMETRELER
                    </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />

                {/* Search and Filter */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <TextField
                        size="small"
                        placeholder="Parametre ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ minWidth: 250 }}
                        InputProps={{
                            startAdornment: (
                                <Search sx={{ color: 'text.disabled', mr: 1 }} />
                            ),
                        }}
                    />

                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => setActiveTab(v)}
                        sx={{
                            minHeight: 40,
                            '& .MuiTab-root': {
                                minHeight: 40,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                            },
                        }}
                    >
                        <Tab label="Tümü" value="all" />
                        {SYSTEM_CATEGORIES.map((cat) => (
                            <Tab key={cat} label={cat} value={cat} />
                        ))}
                    </Tabs>
                </Box>

                {Object.keys(groupedCustomParameters).length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3, borderStyle: 'dashed' }}>
                        <SettingsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            {searchQuery ? 'Arama sonucunda parametre bulunamadı.' : 'Henüz özel parametre tanımlanmamış.'}
                        </Typography>
                        {!searchQuery && (
                            <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={() => handleOpenDialog()}
                                sx={{ mt: 2 }}
                            >
                                Yeni Parametre Ekle
                            </Button>
                        )}
                    </Paper>
                ) : (
                    <Stack spacing={2}>
                        {Object.entries(groupedCustomParameters).map(([category, params]) => (
                            <Box key={category}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                    {category}
                                </Typography>
                                <Stack spacing={1} sx={{ mt: 1 }}>
                                    {params.map((param) => (
                                        <Card
                                            key={param.key}
                                            variant="outlined"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <CardContent sx={{ py: '12px !important', px: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                                                                {param.key}
                                                            </Typography>
                                                            {param.description && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {param.description}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Chip
                                                            label={String(param.value)}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontFamily: 'monospace' }}
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenDialog(param)}
                                                        >
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => {
                                                                setSelectedForDelete(param);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>

            {/* Check Bill Settings */}
            <Box id="cek-senet" sx={{ scrollMarginTop: 96 }}>
                <CheckBillSettingsSection embedInParametersPage showIntro={false} />
            </Box>

            <ParameterFormDialog
                open={dialogOpen}
                editMode={editMode}
                initialData={selectedParameter}
                loading={actionLoading}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleSubmit}
                onFormChange={handleFormChange}
            />

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: { borderRadius: 3 },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800 }}>
                    Parametreyi Sil
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        "{selectedForDelete?.key}" parametresini silmek istediğinizden emin misiniz?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                    >
                        İptal
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={actionLoading}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                    >
                        {actionLoading ? 'Siliniyor...' : 'Sil'}
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
