'use client';

import React, { startTransition, useCallback, useEffect, useRef } from 'react';
import {
    DataGrid,
    GridColDef,
    GridSortModel,
    GridPaginationModel,
    GridFilterModel,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
} from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import { Box } from '@mui/material';

interface InvoiceDataGridProps {
    rows: any[];
    columns: GridColDef[];
    loading: boolean;
    rowCount: number;
    paginationModel: GridPaginationModel;
    sortModel: GridSortModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
    onSortModelChange: (model: GridSortModel) => void;
    onFilterModelChange?: (model: GridFilterModel) => void;
    onRowClick?: (params: any) => void;
    checkboxSelection?: boolean;
    onRowSelectionModelChange?: (newSelectionModel: string[]) => void;
    /** Tablo yüksekliği (px). Varsayılan: 650 */
    height?: number;
}

function gridModelsEqual<T>(a: T, b: T): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

function CustomToolbar() {
    return (
        <GridToolbarContainer sx={{ p: 1, borderBottom: '1px solid var(--border)' }}>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport
                printOptions={{ disableToolbarButton: true }}
                csvOptions={{ fileName: 'Faturalar', delimiter: ';', utf8WithBom: true }}
            />
        </GridToolbarContainer>
    );
}

export default function InvoiceDataGrid({
    rows,
    columns,
    loading,
    rowCount,
    paginationModel,
    sortModel,
    onPaginationModelChange,
    onSortModelChange,
    onFilterModelChange,
    onRowClick,
    checkboxSelection = true,
    onRowSelectionModelChange,
    height = 650,
}: InvoiceDataGridProps) {
    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const notifyParent = useCallback((fn: () => void) => {
        if (!mountedRef.current) return;
        startTransition(fn);
    }, []);

    const handlePaginationChange = useCallback(
        (model: GridPaginationModel) => {
            if (gridModelsEqual(model, paginationModel)) return;
            notifyParent(() => onPaginationModelChange(model));
        },
        [paginationModel, onPaginationModelChange, notifyParent],
    );

    const handleSortChange = useCallback(
        (model: GridSortModel) => {
            if (gridModelsEqual(model, sortModel)) return;
            notifyParent(() => onSortModelChange(model));
        },
        [sortModel, onSortModelChange, notifyParent],
    );

    const handleFilterChange = useCallback(
        (model: GridFilterModel) => {
            if (!onFilterModelChange) return;
            notifyParent(() => onFilterModelChange(model));
        },
        [onFilterModelChange, notifyParent],
    );

    return (
        <Box sx={{ height, width: '100%', position: 'relative' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                rowCount={rowCount}
                pageSizeOptions={[25, 50, 100]}
                paginationModel={paginationModel}
                paginationMode="server"
                onPaginationModelChange={handlePaginationChange}
                sortModel={sortModel}
                sortingMode="server"
                onSortModelChange={handleSortChange}
                filterMode="server"
                onFilterModelChange={onFilterModelChange ? handleFilterChange : undefined}
                onRowClick={onRowClick}
                checkboxSelection={checkboxSelection}
                onRowSelectionModelChange={(newSelection) => {
                    if (onRowSelectionModelChange) {
                        onRowSelectionModelChange(newSelection as unknown as string[]);
                    }
                }}
                slots={{
                    toolbar: CustomToolbar,
                }}
                localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
                sx={{
                    border: 'none',
                    borderRadius: 0,
                    animation: 'fadeIn 0.2s ease-out',
                    '@keyframes fadeIn': {
                        from: { opacity: 0 },
                        to: { opacity: 1 },
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        bgcolor: '#f8fafc',
                        borderBottom: '2px solid #e2e8f0',
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            color: '#475569',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                        },
                        '& .MuiDataGrid-columnHeader:hover': {
                            bgcolor: '#f1f5f9',
                        },
                    },
                    '& .MuiDataGrid-row': {
                        cursor: onRowClick ? 'pointer' : 'default',
                        transition: 'background-color 0.15s ease',
                        '&:hover': {
                            backgroundColor: 'color-mix(in srgb, var(--primary) 6%, transparent)',
                        },
                        '&:nth-of-type(even)': {
                            backgroundColor: '#fafafa',
                        },
                        '&:nth-of-type(even):hover': {
                            backgroundColor: 'color-mix(in srgb, var(--chart-1) 8%, transparent)',
                        },
                    },
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #f1f5f9',
                        color: 'var(--foreground)',
                        fontSize: '0.875rem',
                        transition: 'background-color 0.15s ease',
                        '&:hover': {
                            backgroundColor: 'color-mix(in srgb, var(--chart-3) 8%, transparent)',
                        },
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: '2px solid #e2e8f0',
                        bgcolor: '#f8fafc',
                        '& .MuiTablePagination-root': {
                            fontSize: '0.875rem',
                            fontWeight: 600,
                        },
                        '& .MuiDataGrid-selectedRowCount': {
                            fontWeight: 700,
                            color: 'var(--primary)',
                        },
                    },
                    '& .MuiDataGrid-columnSeparator': {
                        display: 'none',
                    },
                    '& .MuiDataGrid-toolbarContainer': {
                        padding: '8px 16px',
                        gap: 1,
                        '& button': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            },
                        },
                    },
                    '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focusWithin': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focusWithin': {
                        outline: 'none',
                    },
                    /* Custom scrollbar */
                    '& ::-webkit-scrollbar': {
                        width: 6,
                        height: 6,
                    },
                    '& ::-webkit-scrollbar-track': {
                        background: '#f1f5f9',
                        borderRadius: 3,
                    },
                    '& ::-webkit-scrollbar-thumb': {
                        background: '#cbd5e1',
                        borderRadius: 3,
                        '&:hover': {
                            background: '#94a3b8',
                        },
                    },
                }}
            />
        </Box>
    );
}
