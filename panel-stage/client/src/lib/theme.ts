'use client';

import { createTheme } from '@mui/material/styles';
import { trTR as dataGridTR } from '@mui/x-data-grid/locales';
import { trTR as coreTR } from '@mui/material/locale';
import { DataGridProps } from '@mui/x-data-grid';

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> {
    MuiDataGrid?: {
      styleOverrides?: any;
      defaultProps?: Partial<DataGridProps>;
    };
  }
}

const getDesignTokens = (mode: 'light' | 'dark') => ({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.025em' },
    h2: { fontWeight: 700, letterSpacing: '-0.025em' },
    h3: { fontWeight: 700, letterSpacing: '-0.025em' },
    h4: { fontWeight: 700, letterSpacing: '-0.025em' },
    h5: { fontWeight: 600, letterSpacing: '-0.015em' },
    h6: { fontWeight: 600, letterSpacing: '-0.015em' },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.57 },
    subtitle1: { fontSize: '1rem', fontWeight: 500 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
    button: { textTransform: 'none' as const, fontWeight: 600 },
  },
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        background: {
          default: '#F8FAFC',
          paper: '#FFFFFF',
        },
        primary: {
          main: '#0F172A',
          light: '#334155',
          dark: '#020617',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#64748B',
          light: '#94A3B8',
          dark: '#475569',
          contrastText: '#FFFFFF',
        },
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
        },
        divider: '#E2E8F0',
      }
      : {
        background: {
          default: '#0F172A',
          paper: '#1E293B',
        },
        primary: {
          main: '#F8FAFC',
          light: '#94A3B8',
          dark: '#E2E8F0',
          contrastText: '#0F172A',
        },
        secondary: {
          main: '#64748B',
          light: '#94A3B8',
          dark: '#475569',
          contrastText: '#F8FAFC',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
        },
        divider: '#334155',
      }),
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }: { theme: any }) => ({
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 16,
          backgroundImage: 'none',
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation0: ({ theme }: { theme: any }) => ({
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
        }),
        elevation1: {
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          },
        },
        containedPrimary: ({ theme }: { theme: any }) => ({
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }),
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: ({ theme }: { theme: any }) => ({
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.primary,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,
            fontWeight: 600,
            color: theme.palette.text.secondary,
          },
          '& .MuiDataGrid-columnHeader': {
            color: theme.palette.text.secondary,
          },
          '& .MuiDataGrid-row': {
            backgroundColor: theme.palette.background.paper,
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          '& .MuiDataGrid-row:not(:hover) .action-buttons': {
            opacity: 0,
          },
          '& .MuiDataGrid-row:hover .action-buttons': {
            opacity: 1,
            transition: 'opacity 0.2s ease-in-out',
          },
        }),
        columnHeader: {
          '&:focus': { outline: 'none' },
          '&:focus-within': { outline: 'none' },
        },
        cell: {
          '&:focus': { outline: 'none' },
        },
      },
      defaultProps: {
        density: 'comfortable' as const,
        disableRowSelectionOnClick: true,
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: ({ theme }: { theme: any }) => ({
          backgroundColor: theme.palette.action.hover,
          borderRadius: 8,
        }),
      },
      defaultProps: {
        animation: 'wave' as const,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

export const lightTheme = createTheme(
  {
    ...getDesignTokens('light'),
  },
  dataGridTR,
  coreTR
);

export const darkTheme = createTheme(
  {
    ...getDesignTokens('dark'),
  },
  dataGridTR,
  coreTR
);

export const theme = lightTheme;
