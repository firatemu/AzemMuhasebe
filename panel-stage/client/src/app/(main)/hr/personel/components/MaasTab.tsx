'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Stack,
    CircularProgress,
} from '@mui/material';
import {
    Add,
    Visibility,
    Receipt,
    Money,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import axios from '@/lib/axios';

interface MaasPlan {
    id: string;
    yil: number;
    ay: number;
    maas: number;
    prim: number;
    toplam: number;
    odenenTutar: number;
    kalanTutar: number;
    durum: 'ODENMEDI' | 'KISMI_ODENDI' | 'TAMAMEN_ODENDI';
}

export default function MaasTab({ personelId }: { personelId: string }) {
    const [plans, setPlans] = useState<MaasPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [yil] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchPlans();
    }, [personelId]);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/maas-plan/personel/${personelId}/${yil}`);
            setPlans(response.data.planlar || []);
        } catch (error) {
            console.error('Planlar yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlan = async () => {
        try {
            await axios.post('/maas-plan/create', {
                personelId,
                yil,
            });
            fetchPlans();
        } catch (error: any) {
            console.error('Plan oluşturulurken hata:', error);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
        </Box>
    );

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Maaş Planları ({yil})</Typography>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<Add />}
                    onClick={handleCreatePlan}
                    sx={{ borderRadius: 1.5, fontWeight: 700 }}
                >
                    Yeni Plan Oluştur
                </Button>
            </Stack>

            <TableContainer sx={{ borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'background.neutral' }}>
                            <TableCell sx={{ fontWeight: 800 }}>Dönem</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Maaş</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Prim</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Toplam</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Ödenen</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Kalan</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Durum</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {plans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Bu yıl için henüz maaş planı bulunmuyor.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            plans.map((plan: MaasPlan) => (
                                <TableRow key={plan.id} hover sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                    <TableCell sx={{ fontWeight: 700 }}>{plan.yil} / {plan.ay}</TableCell>
                                    <TableCell align="right">₺{Number(plan.maas).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell align="right">₺{Number(plan.prim).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>₺{Number(plan.toplam).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell align="right" sx={{ color: 'success.main', fontWeight: 600 }}>₺{Number(plan.odenenTutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 800 }}>₺{Number(plan.kalanTutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={plan.durum === 'TAMAMEN_ODENDI' ? 'ÖDENDİ' : plan.durum === 'KISMI_ODENDI' ? 'KISMI' : 'ÖDENMEDİ'}
                                            color={
                                                plan.durum === 'TAMAMEN_ODENDI' ? 'success' :
                                                    plan.durum === 'KISMI_ODENDI' ? 'warning' : 'error'
                                            }
                                            size="small"
                                            sx={{ fontWeight: 800, borderRadius: 1, fontSize: '0.625rem' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
