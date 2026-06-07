'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from './PageContainer';

interface StandardPageProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  headerActions?: React.ReactNode;
}

/**
 * Yeni sayfalarda (POS hariç) önerilen üst seviye iskelet.
 * Renk token + padding + zemin davranışını PageContainer ile standardize eder.
 */
export default function StandardPage({
  children,
  title,
  subtitle,
  breadcrumbs,
  maxWidth = 'xl',
  headerActions,
}: StandardPageProps) {
  return (
    <PageContainer title={title} breadcrumbs={breadcrumbs} maxWidth={maxWidth}>
      {(subtitle || headerActions) && (
        <Box sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: subtitle ? 'flex-start' : 'center',
          gap: 2,
          mt: -2 // PageContainer mb: 4 sonrası boşluğu dengelemek için
        }}>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: 'var(--muted-foreground)',
                fontWeight: 500,
                maxWidth: '600px'
              }}
            >
              {subtitle}
            </Typography>
          )}
          <Box sx={{ flexShrink: 0, ml: 'auto' }}>
            {headerActions}
          </Box>
        </Box>
      )}
      {children}
    </PageContainer>
  );
}

