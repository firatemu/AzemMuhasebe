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
    Stack,
    CircularProgress,
} from '@mui/material';
import {
    Add,
    History,
    ReceiptLong,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import axios from '@/lib/axios';

interface Avans {
    id: string;
    tutar: number;
    tarih: string;
    aciklama: string;
    kasa?: {
        kasaAdi: string;
    };
    mahsupEdilen: number;
    kalan: number;
    durum: 'ACIK' | 'KISMI' | 'KAPALI';
}

export default function AvansTab({ personelId }: { personelId: string }) {
    const [avanslar, setAvanslar] = useState<Avans[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAvanslar();
    }, [personelId]);

    const fetchAvanslar = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/avans/personel/${personelId}`);
            setAvanslar(res.data);
        } catch (error) {
            console.error('Avanslar yüklenemedi');
        } finally {
            setLoading(false);
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
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Avans Hareketleri</Typography>
            </Stack>

            <TableContainer sx={{ borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'background.neutral' }}>
                            <TableCell sx={{ fontWeight: 800 }}>Tarih</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Tutar</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Mahsup</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Kalan</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Durum</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Açıklama</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {avanslar.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Kayıtlı avans hareketi bulunamadı.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            avanslar.map((avans: Avans) => (
                                <TableRow key={avans.id} hover sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                    <TableCell sx={{ fontWeight: 600 }}>{new Date(avans.tarih).toLocaleDateString('tr-TR')}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>₺{Number(avans.tutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell align="right" sx={{ color: 'success.main', fontWeight: 600 }}>₺{Number(avans.mahsupEdilen).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 800 }}>₺{Number(avans.kalan).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={avans.durum}
                                            color={avans.durum === 'ACIK' ? 'error' : avans.durum === 'KISMI' ? 'warning' : 'success'}
                                            size="small"
                                            sx={{ fontWeight: 800, borderRadius: 1, fontSize: '0.625rem' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" sx={{ fontWeight: 500 }}>{avans.aciklama}</Typography>
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
