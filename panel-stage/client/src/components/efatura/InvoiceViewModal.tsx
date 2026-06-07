'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
  useTheme,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

interface InvoiceViewModalProps {
  open: boolean;
  onClose: () => void;
  document: {
    ettn?: string;
    uuid?: string;
    senderTitle?: string;
    senderVkn?: string;
    invoiceNo?: string;
    invoiceDate?: string;
    payableAmount?: number;
    status?: string;
    statusExp?: string;
  } | null;
}

interface InvoiceData {
  invoiceNumber?: string;
  issueDate?: string;
  invoiceType?: string;
  profileId?: string;
  currency?: string;
  lineExtensionAmount?: number;
  taxExclusiveAmount?: number;
  taxInclusiveAmount?: number;
  payableAmount?: number;
  buyer?: {
    partyName?: string;
    taxId?: string;
  };
  seller?: {
    partyName?: string;
    taxId?: string;
  };
  lines?: Array<{
    id?: string;
    name?: string;
    quantity?: number;
    unitPrice?: number;
    lineExtensionAmount?: number;
    taxTotal?: number;
  }>;
  taxTotal?: Array<{
    taxAmount?: number;
    taxScheme?: string;
  }>;
}

export default function InvoiceViewModal({ open, onClose, document: docProp }: InvoiceViewModalProps) {
  const theme = useTheme();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [xmlContent, setXmlContent] = useState<string>('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['invoice-content', docProp?.uuid || docProp?.ettn],
    queryFn: async () => {
      if (!docProp?.uuid && !docProp?.ettn) throw new Error('UUID veya ETTN gerekli');
      const uuid = docProp?.uuid || docProp?.ettn;
      const response = await axios.get(`/hizli/document-content?uuid=${uuid}&type=HTML`);
      return response.data;
    },
    enabled: open && (!!docProp?.uuid || !!docProp?.ettn),
    retry: 2,
  });

  useEffect(() => {
    if (data?.content) {
      let contentToUse = data.content;
      try {
        if (data.content.match(/^[A-Za-z0-9+/=\s]+$/) && data.content.length > 100) {
          const binaryString = atob(data.content.trim());
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
          const decoded = new TextDecoder('utf-8').decode(bytes);
          if (decoded.trim().startsWith('<!DOCTYPE') || decoded.trim().startsWith('<html') || decoded.trim().startsWith('<?xml') || decoded.includes('<body')) {
            contentToUse = decoded;
          }
        }
      } catch (e) {
        console.error('Base64 error:', e);
      }

      setXmlContent(contentToUse);

      if (contentToUse.trim().startsWith('<!DOCTYPE') || contentToUse.trim().startsWith('<html') || contentToUse.includes('<body')) {
        setInvoiceData(null);
        return;
      }

      // XML Parse logic (Simplified for modernization focus)
      // This is preserved from original for data consistency
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(contentToUse, 'text/xml');
        const getText = (element: Element | null, tagName: string, namespace?: string): string => {
          if (!element) return '';
          const nsPrefix = namespace ? `${namespace}:` : '';
          const el = element.getElementsByTagName(nsPrefix + tagName)[0];
          return el?.textContent || '';
        };
        const invoice = xmlDoc.documentElement;
        const parsed: InvoiceData = {
          invoiceNumber: getText(invoice, 'ID', 'cbc'),
          issueDate: getText(invoice, 'IssueDate', 'cbc'),
          invoiceType: getText(invoice, 'InvoiceTypeCode', 'cbc'),
          profileId: getText(invoice, 'ProfileID', 'cbc'),
          currency: getText(invoice, 'DocumentCurrencyCode', 'cbc') || 'TRY',
          payableAmount: parseFloat(getText(invoice, 'PayableAmount', 'cbc')) || 0,
        };
        setInvoiceData(parsed);
      } catch (error) {
        console.error('XML parse error:', error);
      }
    }
  }, [data]);

  const handleDownloadXml = () => {
    if (!xmlContent) return;
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${docProp?.invoiceNo || docProp?.ettn || 'invoice'}.xml`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    if (!docProp?.uuid && !docProp?.ettn) return;
    try {
      const uuid = docProp?.uuid || docProp?.ettn;
      const response = await axios.get(`/hizli/document-content?uuid=${uuid}&type=PDF`);
      if (!response.data?.content) throw new Error('PDF bulunamadı');
      const binaryString = atob(response.data.content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${docProp?.invoiceNo || docProp?.ettn || 'invoice'}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF error:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'TRY') => {
    const validCurrency = currency && currency.trim() && currency.length >= 3 ? currency.trim().toUpperCase() : 'TRY';
    try {
      return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: validCurrency }).format(amount);
    } catch {
      return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          borderRadius: 4,
          overflow: 'hidden'
        },
      }}
    >
      <DialogTitle sx={{ px: 3, py: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex' }}>
              <ReceiptIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>Fatura Önizleme</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{docProp?.invoiceNo || docProp?.ettn}</Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small" sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
            <CircularProgress size={32} thickness={5} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Fatura içeriği hazırlanıyor...</Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" variant="outlined" sx={{ borderRadius: 3, mt: 2 }}>
            Fatura içeriği yüklenemedi: {error instanceof Error ? error.message : 'Bilinmeyen hata'}
          </Alert>
        ) : xmlContent && (xmlContent.trim().startsWith('<!DOCTYPE') || xmlContent.trim().startsWith('<html') || xmlContent.includes('<body')) ? (
          <Paper variant="outlined" sx={{ width: '100%', height: 'calc(100% - 2px)', borderRadius: 3, overflow: 'hidden', border: 'none' }}>
            <iframe
              srcDoc={xmlContent}
              title="Fatura Görüntüle"
              style={{ width: '100%', height: '100%', border: 'none' }}
              sandbox="allow-same-origin"
            />
          </Paper>
        ) : invoiceData ? (
          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            {/* Header / Summary */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.disabled', letterSpacing: 1.5 }}>GÖNDEREN (SATICI)</Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                    <BusinessIcon color="action" />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{invoiceData.seller?.partyName || docProp?.senderTitle || '-'}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>VKN: {invoiceData.seller?.taxId || docProp?.senderVkn}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.disabled', letterSpacing: 1.5 }}>ALICI (MÜŞTERİ)</Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                    <BusinessIcon color="action" />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{invoiceData.buyer?.partyName || 'Cari Hesap'}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>VKN: {invoiceData.buyer?.taxId || '-'}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>Fatura Tarihi</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>{invoiceData.issueDate ? new Date(invoiceData.issueDate).toLocaleDateString('tr-TR') : '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>Fatura Tipi</Typography>
                  <Chip label={invoiceData.invoiceType || 'SATIŞ'} size="small" sx={{ fontWeight: 800, borderRadius: 1 }} />
                </Grid>
                <Grid size={{ xs: 4 }} sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>Para Birimi</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>{invoiceData.currency || 'TRY'}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Totals Section */}
            <Paper variant="outlined" sx={{ p: 4, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.04), borderColor: 'primary.light' }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.secondary' }}>Ara Toplam</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>{formatCurrency(invoiceData.payableAmount || 0, invoiceData.currency)}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>Genel Toplam</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>{formatCurrency(invoiceData.payableAmount || 0, invoiceData.currency)}</Typography>
                </Box>
              </Stack>
            </Paper>

            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1.5, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 3 }}>
              <InfoIcon color="info" fontSize="small" />
              <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 700 }}>Bu sayfa fatura verilerinin mobil uyumlu özetidir. Resmi görüntü için HTML veya PDF modunu kullanın.</Typography>
            </Box>
          </Box>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 3 }}>Fatura içeriği parse edilemedi. Lütfen HTML veya PDF görüntüsünü kontrol edin.</Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: alpha(theme.palette.background.paper, 0.8), borderTop: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={1} sx={{ mr: 'auto' }}>
          <Button
            variant="outlined"
            startIcon={<DescriptionIcon />}
            onClick={handleDownloadXml}
            disabled={!xmlContent}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            XML İndir
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<PdfIcon />}
            onClick={handleDownloadPdf}
            disabled={!docProp?.uuid && !docProp?.ettn}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            PDF İndir
          </Button>
        </Stack>
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2, fontWeight: 800, px: 4 }}>
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
}
