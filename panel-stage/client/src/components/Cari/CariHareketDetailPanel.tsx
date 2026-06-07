'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  alpha,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import axios from '@/lib/axios';
import {
  type CariHareketForDetail,
  type InvoiceDetail,
  UUID_RE,
  resolveDetailKind,
  invoiceDetailColumns,
  keyValueDetailColumns,
  buildInvoiceDetailRows,
  buildInvoiceSubtitle,
  buildCollectionDetailRows,
  buildCheckDetailRows,
  buildGenericDetailRows,
  getDetailPanelTitle,
} from './cariHareketDetail.shared';

export type { CariHareketForDetail, InvoiceDetail, InvoiceItem } from './cariHareketDetail.shared';

interface CariHareketDetailPanelProps {
  hareket: CariHareketForDetail | null;
  getBelgeTipiLabel: (belgeTipi?: string) => string;
  inline?: boolean;
}

export default function CariHareketDetailPanel({
  hareket,
  getBelgeTipiLabel,
  inline = false,
}: CariHareketDetailPanelProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [collection, setCollection] = useState<Record<string, unknown> | null>(null);
  const [checkBill, setCheckBill] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!hareket) {
      setInvoice(null);
      setCollection(null);
      setCheckBill(null);
      setError(null);
      return;
    }

    const kind = resolveDetailKind(hareket);
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setInvoice(null);
      setCollection(null);
      setCheckBill(null);

      try {
        if (kind === 'invoice') {
          if (hareket.invoice?.items?.length) {
            if (!cancelled) setInvoice(hareket.invoice);
            return;
          }
          const id = hareket.invoiceId || hareket.invoice?.id;
          if (!id) {
            if (!cancelled) setError('Fatura bilgisi bulunamadı.');
            return;
          }
          const res = await axios.get(`/invoices/${id}`);
          if (!cancelled) setInvoice(res.data);
          return;
        }

        if (kind === 'collection') {
          const collectionId =
            hareket.belgeNo && UUID_RE.test(hareket.belgeNo) ? hareket.belgeNo : null;
          if (!collectionId) {
            if (!cancelled) setError('Tahsilat/ödeme kaydı bulunamadı.');
            return;
          }
          const res = await axios.get(`/collections/${collectionId}`);
          if (!cancelled) setCollection(res.data);
          return;
        }

        if (kind === 'check') {
          if (hareket.checkBill) {
            if (!cancelled) setCheckBill(hareket.checkBill as Record<string, unknown>);
            return;
          }
          const id = hareket.checkBillId;
          if (!id) {
            if (!cancelled) setError('Çek/senet bilgisi bulunamadı.');
            return;
          }
          const res = await axios.get(`/checks-promissory-notes/${id}`);
          if (!cancelled) setCheckBill(res.data);
          return;
        }
      } catch {
        if (!cancelled) setError('İşlem detayı yüklenemedi.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [hareket]);

  const kind = hareket ? resolveDetailKind(hareket) : null;

  const { detailRows, detailColumns, subtitle } = useMemo(() => {
    if (!hareket || !kind) {
      return { detailRows: [], detailColumns: keyValueDetailColumns, subtitle: '' };
    }

    if (kind === 'invoice' && invoice) {
      return {
        detailRows: buildInvoiceDetailRows(invoice),
        detailColumns: invoiceDetailColumns,
        subtitle: buildInvoiceSubtitle(invoice),
      };
    }

    if (kind === 'collection' && collection) {
      return {
        detailRows: buildCollectionDetailRows(collection, getBelgeTipiLabel, hareket.belgeTipi),
        detailColumns: keyValueDetailColumns,
        subtitle: '',
      };
    }

    if (kind === 'check' && checkBill) {
      return {
        detailRows: buildCheckDetailRows(checkBill),
        detailColumns: keyValueDetailColumns,
        subtitle: '',
      };
    }

    if (kind === 'generic') {
      return {
        detailRows: buildGenericDetailRows(hareket, getBelgeTipiLabel),
        detailColumns: keyValueDetailColumns,
        subtitle: '',
      };
    }

    return { detailRows: [], detailColumns: keyValueDetailColumns, subtitle: '' };
  }, [hareket, kind, invoice, collection, checkBill, getBelgeTipiLabel]);

  const title = getDetailPanelTitle(hareket, kind, getBelgeTipiLabel);

  const detailHeight = inline
    ? Math.min(200, Math.max(100, (detailRows.length + 1) * 36 + 48))
    : Math.min(280, Math.max(120, (detailRows.length + 1) * 42 + 56));

  if (!hareket && !inline) {
    return (
      <Box sx={{ py: 4, px: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Detay görmek için listeden bir hareket seçin.
        </Typography>
      </Box>
    );
  }

  if (!hareket) return null;

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(inline
          ? { bgcolor: 'transparent' }
          : {
              borderTop: '2px solid',
              borderColor: 'divider',
              bgcolor: alpha(theme.palette.grey[500], 0.04),
              minHeight: 140,
            }),
      }}
    >
      <Box
        sx={{
          px: inline ? 1 : 2,
          py: inline ? 0.5 : 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.primary.main, inline ? 0.04 : 0.06),
        }}
      >
        <Typography variant="subtitle2" fontWeight={800} color="primary.main">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Detay yükleniyor...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Typography variant="body2" color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <Box sx={{ width: '100%', height: detailHeight }}>
          <DataGrid
            rows={detailRows}
            columns={detailColumns}
            disableRowSelectionOnClick
            hideFooter={detailRows.length <= 5}
            density="compact"
            localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            slots={{
              noRowsOverlay: () => (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Bu işlem için detay satırı bulunamadı.
                  </Typography>
                </Box>
              ),
            }}
            sx={{
              border: 'none',
              bgcolor: 'background.paper',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: alpha(theme.palette.primary.main, 0.06),
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                },
              },
              '& .MuiDataGrid-cell': {
                fontSize: '0.8rem',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
