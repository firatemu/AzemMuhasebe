import React from 'react';
import { Box, Typography, Divider, Paper, Stack } from '@mui/material';

interface DiffViewerProps {
    before: any;
    after: any;
    changedFields: string[];
}

export function DiffViewer({ before, after, changedFields }: DiffViewerProps) {
    if (!changedFields || changedFields.length === 0) {
        return <Typography variant="body2" sx={{ p: 2 }}>Değişiklik bulunamadı.</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
                {changedFields.map((field) => (
                    <Paper key={field} variant="outlined" sx={{ p: 1.5 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                            {field}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary">Eski Değer:</Typography>
                                <Typography variant="body2" sx={{ color: 'error.main', textDecoration: 'line-through' }}>
                                    {JSON.stringify(before?.[field]) || '-'}
                                </Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary">Yeni Değer:</Typography>
                                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                                    {JSON.stringify(after?.[field]) || '-'}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
}
