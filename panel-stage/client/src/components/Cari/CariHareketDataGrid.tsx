'use client';

import React, { useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  Description,
} from '@mui/icons-material';
import CariHareketDetailPanel from './CariHareketDetailPanel';
import {
  type CariHareket,
  type CariHareketDisplayRow,
  type CariHareketMasterRow,
  MASTER_COLUMN_COUNT,
  DETAIL_CELL_FIELD,
  DETAIL_ROW_HEIGHT,
  DEFAULT_PAGE_SIZE,
  isDetailRow,
  getBelgeTipiLabel,
  formatMoney,
} from './cariHareket.shared';

interface CariHareketDataGridProps {
  hareketler: CariHareket[];
  loading: boolean;
  expandedHareketId: string | null;
  onToggleExpand: (rowId: string) => void;
}

function BelgeTipiChip({ belgeTipi }: { belgeTipi?: string }) {
  const label = getBelgeTipiLabel(belgeTipi);
  const isDebit =
    belgeTipi === 'INVOICE' ||
    belgeTipi === 'CHECK_ENTRY' ||
    belgeTipi === 'SATIS_FATURA' ||
    belgeTipi === 'ODEME' ||
    belgeTipi === 'PAYMENT';
  const isCredit =
    belgeTipi === 'COLLECTION' ||
    belgeTipi === 'TAHSILAT' ||
    belgeTipi === 'CHECK_EXIT';

  const color = isCredit ? 'var(--chart-2)' : isDebit ? 'var(--destructive)' : 'var(--primary)';

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 22,
        fontSize: '0.7rem',
        fontWeight: 600,
        bgcolor: `color-mix(in srgb, ${color} 12%, transparent)`,
        color,
        border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`,
      }}
    />
  );
}

export default function CariHareketDataGrid({
  hareketler,
  loading,
  expandedHareketId,
  onToggleExpand,
}: CariHareketDataGridProps) {
  const theme = useTheme();

  const displayRows = useMemo((): CariHareketDisplayRow[] => {
    const rows: CariHareketDisplayRow[] = [];
    for (const h of hareketler) {
      rows.push({ ...h, _rowType: 'master' });
      if (expandedHareketId === h.id) {
        rows.push({
          id: `${h.id}__detail`,
          _rowType: 'detail',
          _parentId: h.id,
          tarih: h.tarih,
          belgeTipi: h.belgeTipi,
          belgeNo: h.belgeNo,
          aciklama: h.aciklama,
        });
      }
    }
    return rows;
  }, [hareketler, expandedHareketId]);

  const getParentHareket = useCallback(
    (parentId: string) => hareketler.find((h) => h.id === parentId) ?? null,
    [hareketler],
  );

  const wrapColumnForMasterDetail = useCallback(
    (col: GridColDef): GridColDef => {
      const field = col.field;
      const originalRenderCell = col.renderCell;
      return {
        ...col,
        colSpan: (_value, row) => {
          if (isDetailRow(row as CariHareketDisplayRow)) {
            return field === DETAIL_CELL_FIELD ? MASTER_COLUMN_COUNT : 0;
          }
          return 1;
        },
        renderCell: (params: GridRenderCellParams) => {
          const row = params.row as CariHareketDisplayRow;
          if (isDetailRow(row)) {
            if (field !== DETAIL_CELL_FIELD) return null;
            const parent = getParentHareket(row._parentId);
            return (
              <Box sx={{ width: '100%', py: 0.75, px: 0.5 }} onClick={(e) => e.stopPropagation()}>
                {parent && (
                  <CariHareketDetailPanel
                    inline
                    hareket={parent}
                    getBelgeTipiLabel={getBelgeTipiLabel}
                  />
                )}
              </Box>
            );
          }
          if (originalRenderCell) return originalRenderCell(params);
          return params.formattedValue as React.ReactNode;
        },
      };
    },
    [getParentHareket],
  );

  const baseColumns: GridColDef[] = useMemo(
    () => [
      {
        field: '__expand__',
        headerName: '',
        width: 44,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams) => {
          const row = params.row as CariHareketDisplayRow;
          if (isDetailRow(row)) return null;
          const isExpanded = expandedHareketId === params.id;
          return (
            <IconButton
              size="small"
              aria-label={isExpanded ? 'Detayı kapat' : 'Detayı aç'}
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(String(params.id));
              }}
              sx={{
                bgcolor: isExpanded
                  ? alpha(theme.palette.primary.main, 0.12)
                  : 'transparent',
              }}
            >
              {isExpanded ? (
                <KeyboardArrowDown fontSize="small" color="primary" />
              ) : (
                <KeyboardArrowRight fontSize="small" />
              )}
            </IconButton>
          );
        },
      },
      {
        field: 'tarih',
        headerName: 'Tarih',
        width: 108,
        renderCell: (params: GridRenderCellParams) => (
          <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
            {new Date(params.value as string).toLocaleDateString('tr-TR')}
          </Typography>
        ),
      },
      {
        field: 'belgeTipi',
        headerName: 'Belge',
        width: 148,
        renderCell: (params: GridRenderCellParams) => (
          <BelgeTipiChip belgeTipi={params.value as string} />
        ),
      },
      {
        field: 'belgeNo',
        headerName: 'Belge No',
        width: 132,
        renderCell: (params: GridRenderCellParams) => (
          <Typography
            variant="body2"
            sx={{ fontSize: '0.8125rem', fontFamily: 'monospace', color: 'text.secondary' }}
          >
            {(params.value as string) || '-'}
          </Typography>
        ),
      },
      {
        field: 'aciklama',
        headerName: 'Açıklama',
        flex: 1,
        minWidth: 180,
        renderCell: (params: GridRenderCellParams) => (
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.8125rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={params.value as string}
          >
            {(params.value as string) || '-'}
          </Typography>
        ),
      },
      {
        field: 'borc',
        headerName: 'Borç',
        width: 128,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params: GridRenderCellParams) => {
          const row = params.row as CariHareketMasterRow;
          if (row.tip !== 'BORC') {
            return (
              <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.8125rem' }}>
                —
              </Typography>
            );
          }
          return (
            <Typography
              variant="body2"
              sx={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--destructive)' }}
            >
              {formatMoney(parseFloat(row.tutar))}
            </Typography>
          );
        },
      },
      {
        field: 'alacak',
        headerName: 'Alacak',
        width: 128,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params: GridRenderCellParams) => {
          const row = params.row as CariHareketMasterRow;
          if (row.tip !== 'ALACAK') {
            return (
              <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.8125rem' }}>
                —
              </Typography>
            );
          }
          return (
            <Typography
              variant="body2"
              sx={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--chart-2)' }}
            >
              {formatMoney(parseFloat(row.tutar))}
            </Typography>
          );
        },
      },
      {
        field: 'bakiye',
        headerName: 'Bakiye',
        width: 128,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params: GridRenderCellParams) => {
          const bakiye = parseFloat(params.value as string);
          return (
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: bakiye >= 0 ? 'text.primary' : 'var(--destructive)',
              }}
            >
              {formatMoney(bakiye, { signed: bakiye < 0 })}
            </Typography>
          );
        },
      },
    ],
    [expandedHareketId, onToggleExpand, theme.palette.primary.main],
  );

  const columns = useMemo(
    () => baseColumns.map(wrapColumnForMasterDetail),
    [baseColumns, wrapColumnForMasterDetail],
  );

  return (
    <DataGrid
      rows={displayRows}
      columns={columns}
      getRowId={(row) => row.id}
      disableRowSelectionOnClick
      onRowClick={(params) => {
        const row = params.row as CariHareketDisplayRow;
        if (isDetailRow(row)) return;
        onToggleExpand(String(params.id));
      }}
      getRowHeight={(params) =>
        isDetailRow(params.model as CariHareketDisplayRow) ? DETAIL_ROW_HEIGHT : null
      }
      isRowSelectable={(params) => !isDetailRow(params.row as CariHareketDisplayRow)}
      getRowClassName={(params) => {
        const row = params.row as CariHareketDisplayRow;
        if (isDetailRow(row)) return 'cari-hareket-detail-row';
        return expandedHareketId === params.id ? 'cari-hareket-row-selected' : '';
      }}
      loading={loading}
      localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
      initialState={{
        pagination: { paginationModel: { pageSize: DEFAULT_PAGE_SIZE, page: 0 } },
      }}
      pageSizeOptions={[25, 50, 100]}
      slots={{
        toolbar: () => (
          <GridToolbarContainer
            sx={{
              px: 1.5,
              py: 0.75,
              minHeight: 44,
              borderBottom: '1px solid var(--border)',
              bgcolor: 'color-mix(in srgb, var(--muted) 40%, transparent)',
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Satıra tıklayarak işlem detayını açın
            </Typography>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
          </GridToolbarContainer>
        ),
        noRowsOverlay: () => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 1,
              py: 6,
            }}
          >
            <Description sx={{ fontSize: 40, color: 'text.disabled', opacity: 0.4 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Hareket bulunamadı
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tarih filtresini değiştirmeyi deneyin
            </Typography>
          </Box>
        ),
      }}
      sx={{
        border: 'none',
        minHeight: 420,
        '& .MuiDataGrid-columnHeaders': {
          bgcolor: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
          },
        },
        '& .MuiDataGrid-row': {
          transition: 'background-color 0.15s ease',
        },
        '& .MuiDataGrid-row:hover': {
          bgcolor: 'color-mix(in srgb, var(--primary) 4%, transparent)',
          cursor: 'pointer',
        },
        '& .cari-hareket-row-selected': {
          bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
        },
        '& .cari-hareket-detail-row': {
          bgcolor: 'color-mix(in srgb, var(--primary) 5%, var(--background))',
        },
        '& .cari-hareket-detail-row .MuiDataGrid-cell': {
          py: 0,
          alignItems: 'flex-start',
          borderBottom: '2px solid color-mix(in srgb, var(--primary) 25%, transparent)',
        },
        '& .cari-hareket-detail-row:hover': {
          bgcolor: 'color-mix(in srgb, var(--primary) 5%, var(--background))',
          cursor: 'default',
        },
        '& .MuiDataGrid-footerContainer': {
          borderTop: '1px solid var(--border)',
        },
      }}
    />
  );
}
