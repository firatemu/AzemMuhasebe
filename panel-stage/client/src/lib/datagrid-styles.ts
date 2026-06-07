export const dataGridStyles = {
  border: 'none',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  color: 'var(--foreground)',
  backgroundColor: 'var(--card)',

  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'var(--muted)',
    color: 'var(--muted-foreground)',
    borderBottom: '1px solid var(--border)',
  },

  '& .MuiDataGrid-columnHeaderTitle': {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0,
  },

  '& .MuiDataGrid-cell': {
    borderBottom: '1px solid var(--border)',
    outline: 'none',
  },

  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'var(--muted)',
  },

  '& .MuiDataGrid-row.Mui-selected': {
    backgroundColor: 'var(--accent)',
  },

  '& .MuiDataGrid-footerContainer': {
    borderTop: '1px solid var(--border)',
    color: 'var(--muted-foreground)',
  },

  '& .MuiDataGrid-columnSeparator': {
    color: 'var(--border)',
  },

  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
};
