'use client';

import React, { useMemo } from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import {
  type DetailedStatementMovement,
  invoiceDetailColumns,
  keyValueDetailColumns,
  buildInvoiceRowsFromApi,
  buildInvoiceSubtitleFromApi,
  buildKeyValueRowsFromCollectionApi,
  buildKeyValueRowsFromCheckApi,
  buildKeyValueRowsFromGenericFields,
  formatDetailCurrency,
} from './cariHareketDetail.shared';
import { formatMoney } from './cariHareket.shared';

interface MovementDetailBlockProps {
  movement: DetailedStatementMovement;
}

export default function MovementDetailBlock({ movement }: MovementDetailBlockProps) {
  const theme = useTheme();

  const { rows, columns, subtitle, title, hasDetail } = useMemo(() => {
    if (movement.invoice?.items?.length) {
      return {
        rows: buildInvoiceRowsFromApi(movement),
        columns: invoiceDetailColumns,
        subtitle: buildInvoiceSubtitleFromApi(movement),
        title: `Fatura Kalemleri — ${movement.documentNo || movement.invoice.invoiceNo}`,
        hasDetail: true,
      };
    }
    if (movement.collection) {
      return {
        rows: buildKeyValueRowsFromCollectionApi(movement),
        columns: keyValueDetailColumns,
        subtitle: '',
        title: `${movement.documentTypeLabel} Detayı`,
        hasDetail: true,
      };
    }
    if (movement.checkBill) {
      return {
        rows: buildKeyValueRowsFromCheckApi(movement),
        columns: keyValueDetailColumns,
        subtitle: '',
        title: `Çek / Senet Detayı — ${movement.documentNo || ''}`,
        hasDetail: true,
      };
    }
    if (movement.genericFields?.length) {
      return {
        rows: buildKeyValueRowsFromGenericFields(movement.genericFields),
        columns: keyValueDetailColumns,
        subtitle: '',
        title: 'Hareket Detayı',
        hasDetail: true,
      };
    }
    return { rows: [], columns: keyValueDetailColumns, subtitle: '', title: '', hasDetail: false };
  }, [movement]);

  const debit = movement.type === 'DEBIT' ? movement.amount : 0;
  const credit = movement.type === 'CREDIT' ? movement.amount : 0;

  return (
    <Box
      sx={{
        border: '1px solid var(--border)',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'var(--card)',
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.25,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'color-mix(in srgb, var(--primary) 6%, var(--card))',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>
            {new Date(movement.date).toLocaleDateString('tr-TR')} · {movement.documentTypeLabel}
            {movement.documentNo ? ` · ${movement.documentNo}` : ''}
          </Typography>
          {movement.notes && (
            <Typography variant="caption" color="text.secondary" display="block">
              {movement.notes}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {debit > 0 && (
            <Typography variant="body2" fontWeight={700} color="error.main">
              Borç: {formatMoney(debit)}
            </Typography>
          )}
          {credit > 0 && (
            <Typography variant="body2" fontWeight={700} sx={{ color: 'var(--chart-2)' }}>
              Alacak: {formatMoney(credit)}
            </Typography>
          )}
          <Typography variant="body2" fontWeight={700}>
            Bakiye: {formatDetailCurrency(movement.balance)}
          </Typography>
        </Box>
      </Box>

      {hasDetail && (
        <Box sx={{ px: 1, py: 1 }}>
          <Typography variant="caption" fontWeight={800} color="primary.main" sx={{ px: 1 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ px: 1, mb: 0.5 }}>
              {subtitle}
            </Typography>
          )}
          <Box sx={{ height: Math.min(220, Math.max(80, (rows.length + 1) * 36 + 40)) }}>
            <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              hideFooter={rows.length <= 5}
              density="compact"
              localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                },
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
