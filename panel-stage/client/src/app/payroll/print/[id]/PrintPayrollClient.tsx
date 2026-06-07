'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    Typography,
    Stack,
    Button,
    ButtonGroup,
    Divider,
    IconButton,
    Tooltip,
    Grid,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import { Print, PictureAsPdf, ZoomIn, ZoomOut } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import axios from '@/lib/axios';
import { useJournal } from '@/hooks/use-journals';
import { CheckBillJournal, CheckBillType } from '@/types/check-bill';
import { JOURNAL_TYPE_LABEL } from '@/lib/labels';
import { formatAmount, formatDate } from '@/lib/format';

interface TenantSettings {
    logoUrl?: string;
    companyName?: string;
    address?: string;
    phone?: string;
    email?: string;
}

interface Tenant {
    id: string;
    name: string;
    settings?: TenantSettings;
}

type PaperSize = 'A4' | 'A5' | 'A5-landscape';

export default function PrintPayrollClient({ journalId }: { journalId: string }) {
    const { data: journal, isLoading: journalLoading } = useJournal(journalId);
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [tenantLoading, setTenantLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);
    const [paperSize, setPaperSize] = useState<PaperSize>('A4');
    const [zoom, setZoom] = useState(100);

    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                const res = await axios.get('/tenants/current');
                setTenant(res.data);
            } catch (error) {
                console.error('Tenant verisi alınamadı:', error);
            } finally {
                setTenantLoading(false);
            }
        };
        fetchTenant();
    }, []);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: journal ? `Bordro-${journal.journalNo}` : 'Bordro-Makbuzu',
    });

    const handleDownloadPDF = async () => {
        if (!printRef.current || !journal) return;

        try {
            setExportLoading(true);
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');

            const element = printRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: paperSize === 'A5-landscape' ? 'landscape' : 'portrait',
                unit: 'mm',
                format: paperSize === 'A4' ? 'a4' : 'a5',
                compress: true,
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            pdf.save(`Bordro-${journal.journalNo}.pdf`);
        } catch (error) {
            console.error('PDF oluşturulamadı:', error);
        } finally {
            setExportLoading(false);
        }
    };

    if (journalLoading || tenantLoading || !journal) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>Yükleniyor...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
            <Paper sx={{ p: 2, mb: 3 }} className="no-print">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                        <Typography variant="h6">Bordro Makbuzu</Typography>
                        <ButtonGroup size="small">
                            <Button variant={paperSize === 'A4' ? 'contained' : 'outlined'} onClick={() => setPaperSize('A4')}>A4</Button>
                            <Button variant={paperSize === 'A5' ? 'contained' : 'outlined'} onClick={() => setPaperSize('A5')}>A5 ⬍</Button>
                            <Button variant={paperSize === 'A5-landscape' ? 'contained' : 'outlined'} onClick={() => setPaperSize('A5-landscape')}>A5 ⬌</Button>
                        </ButtonGroup>
                        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Tooltip title="Yakınlaştır"><IconButton size="small" onClick={() => setZoom((z) => Math.min(z + 10, 160))}><ZoomIn /></IconButton></Tooltip>
                            <Typography variant="body2">{zoom}%</Typography>
                            <Tooltip title="Uzaklaştır"><IconButton size="small" onClick={() => setZoom((z) => Math.max(z - 10, 50))}><ZoomOut /></IconButton></Tooltip>
                        </Stack>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button variant="contained" startIcon={<Print />} onClick={() => handlePrint()} sx={{ bgcolor: '#0f172a', '&:hover': { bgcolor: '#1e293b' } }}>Yazdır</Button>
                        <Button variant="contained" startIcon={<PictureAsPdf />} onClick={handleDownloadPDF} disabled={exportLoading} sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}>
                            {exportLoading ? 'Hazırlanıyor...' : 'PDF İndir'}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'center', transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s', mb: 10 }}>
                <div ref={printRef}>
                    <ReceiptTemplate journal={journal} tenant={tenant} paperSize={paperSize} />
                </div>
            </Box>

            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { margin: 0; padding: 0; background: white !important; }
                    @page {
                        size: ${paperSize === 'A4' ? 'A4 portrait' : paperSize === 'A5' ? 'A5 portrait' : 'A5 landscape'};
                        margin: 0;
                    }
                }
            `}</style>
        </Box>
    );
}

function ReceiptTemplate({ journal, tenant, paperSize }: { journal: CheckBillJournal; tenant: Tenant | null; paperSize: PaperSize }) {
    const isLandscape = paperSize === 'A5-landscape';
    const width = paperSize === 'A4' ? '210mm' : paperSize === 'A5' ? '148mm' : '210mm';
    const height = paperSize === 'A4' ? '297mm' : paperSize === 'A5' ? '210mm' : '148mm';
    const fontSize = paperSize === 'A4' ? '10pt' : isLandscape ? '8.5pt' : '9pt';

    const colors = { primary: '#1e293b', secondary: '#64748b', accent: '#0f172a', border: '#e2e8f0', bgLight: '#f8fafc' };
    const logoUrl = tenant?.settings?.logoUrl;

    return (
        <Paper sx={{ width, minHeight: height, p: 0, bgcolor: 'white', border: '1px solid #eee', boxShadow: 4, fontSize, fontFamily: '"Inter", sans-serif', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', '@media print': { boxShadow: 'none', border: 'none' } }}>
            {/* Header */}
            <Box sx={{ bgcolor: colors.bgLight, p: isLandscape ? 2 : 3, borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    {logoUrl ? <img src={logoUrl} alt="Logo" style={{ height: isLandscape ? '40px' : '50px', objectFit: 'contain' }} /> :
                        <Box sx={{ width: isLandscape ? 40 : 50, height: isLandscape ? 40 : 50, bgcolor: colors.accent, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, fontWeight: 'bold', fontSize: isLandscape ? '1rem' : '1.2rem' }}>
                            {tenant?.name?.substring(0, 2).toUpperCase() || 'OM'}
                        </Box>}
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.primary, lineHeight: 1.2 }}>{tenant?.settings?.companyName || tenant?.name || 'Firma Adı'}</Typography>
                        <Typography variant="caption" sx={{ color: colors.secondary, display: 'block', maxWidth: isLandscape ? '400px' : '300px', fontSize: '0.75rem' }}>{tenant?.settings?.address}</Typography>
                    </Box>
                </Stack>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant={isLandscape ? 'h6' : 'h5'} sx={{ color: colors.accent, fontWeight: 800, letterSpacing: '0.02em', textTransform: 'uppercase' }}>BORDRO MAKBUZU</Typography>
                    <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: colors.secondary }}>No: <strong>{journal.journalNo}</strong></Typography>
                        <Typography variant="caption" sx={{ color: colors.secondary }}> | </Typography>
                        <Typography variant="caption" sx={{ color: colors.secondary }}>Tarih: <strong>{formatDate(journal.date)}</strong></Typography>
                    </Stack>
                </Box>
            </Box>

            {/* Content Area */}
            <Box sx={{ p: isLandscape ? 2 : 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Grid container spacing={isLandscape ? 2 : 3} sx={{ mb: isLandscape ? 2 : 4 }}>
                    <Grid size={{ xs: 6 }}>
                        <Box sx={{ p: 2, border: `1px solid ${colors.border}`, borderRadius: 2, height: '100%', position: 'relative', '&::before': { content: '"CARI / MUHATTAP"', position: 'absolute', top: -10, left: 12, bgcolor: 'white', px: 1, fontSize: '0.65rem', fontWeight: 700, color: colors.secondary, letterSpacing: '0.05em' } }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.primary, mb: 0.5 }}>{journal.account?.title || journal.cashbox?.name || journal.bankAccount?.name || '—'}</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <Box sx={{ p: 2, border: `1px solid ${colors.border}`, borderRadius: 2, height: '100%', bgcolor: colors.bgLight }}>
                            <Stack spacing={1}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px dashed ${colors.border}`, pb: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: colors.secondary, fontWeight: 600 }}>İŞLEM TİPİ</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: colors.primary }}>{JOURNAL_TYPE_LABEL[journal.type] || journal.type}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: colors.secondary, fontWeight: 600 }}>EVRAK SAYISI</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: colors.primary }}>{journal.checkBills?.length || 0} Adet</Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mb: isLandscape ? 2 : 4 }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, mb: 1.5, color: colors.primary }}>Evrak Listesi</Typography>
                    <Table size="small" sx={{ border: `1px solid ${colors.border}`, mb: 2 }}>
                        <TableHead sx={{ bgcolor: colors.bgLight }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, py: 1 }}>Evrak No</TableCell>
                                <TableCell sx={{ fontWeight: 600, py: 1 }}>Tip</TableCell>
                                <TableCell sx={{ fontWeight: 600, py: 1 }}>Banka</TableCell>
                                <TableCell sx={{ fontWeight: 600, py: 1 }}>Vade</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, py: 1 }}>Tutar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {journal.checkBills?.map((evrak, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ py: 1 }}>{evrak.checkNo || '-'}</TableCell>
                                    <TableCell sx={{ py: 1 }}>{evrak.type === CheckBillType.CHECK ? 'Çek' : 'Senet'}</TableCell>
                                    <TableCell sx={{ py: 1 }}>{evrak.bank || '—'}</TableCell>
                                    <TableCell sx={{ py: 1 }}>{formatDate(evrak.dueDate)}</TableCell>
                                    <TableCell align="right" sx={{ py: 1, fontWeight: 500 }}>{formatAmount(evrak.amount)}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow sx={{ bgcolor: colors.bgLight }}>
                                <TableCell colSpan={4} align="right" sx={{ fontWeight: 700, py: 1.5 }}>TOPLAM TUTAR</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 800, py: 1.5 }}>{formatAmount(journal.totalAmount || 0)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>

                {journal.notes && (
                    <Box sx={{ mb: isLandscape ? 1 : 4 }}>
                        <Typography variant="caption" sx={{ color: colors.secondary, fontWeight: 700, letterSpacing: '0.05em', mb: 0.5, display: 'block' }}>AÇIKLAMA / NOTLAR</Typography>
                        <Box sx={{ p: 1.5, border: `1px solid ${colors.border}`, borderRadius: 2, bgcolor: 'white' }}>
                            <Typography variant="body2" sx={{ fontSize: '0.85rem', color: colors.primary }}>{journal.notes}</Typography>
                        </Box>
                    </Box>
                )}

                <Box sx={{ mt: 'auto', pt: isLandscape ? 1 : 2 }}>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 6 }} sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: colors.secondary, mb: isLandscape ? 2 : 4, display: 'block' }}>TESLİM EDEN</Typography>
                            <Box sx={{ height: 40, borderBottom: '1px solid #ccc', width: '60%', mx: 'auto', opacity: 0.5 }} />
                        </Grid>
                        <Grid size={{ xs: 6 }} sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: colors.secondary, mb: isLandscape ? 2 : 4, display: 'block' }}>TESLİM ALAN</Typography>
                            <Box sx={{ height: 40, borderBottom: '1px solid #ccc', width: '60%', mx: 'auto', opacity: 0.5 }} />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 4, pt: 1, borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: colors.secondary, fontSize: '0.65rem', opacity: 0.6 }}>Bu belge dijital olarak <strong>OTOMUHASEBE</strong> üzerinden oluşturulmuştur.</Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}
