'use client';

import React from 'react';
import { Paper, Box } from '@mui/material';

interface StandardCardProps {
  children: React.ReactNode;
  sx?: Record<string, any>;
  /** MUI spacing unit bazlı padding (örn: 3 -> 24px) */
  padding?: number;
  /** Kart padding'ini tamamen sıfırlar */
  noPadding?: boolean;
  onClick?: () => void;
  [key: string]: any;
}

/**
 * Tutarlı yüzey dili için standardize edilmiş kart.
 * Tokenlar: var(--card), var(--border), var(--radius), var(--shadow-sm)
 */
export default function StandardCard({
  children,
  sx,
  padding = 3,
  noPadding = false,
  onClick,
  ...others
}: StandardCardProps) {
  const finalPadding = noPadding ? 0 : padding;

  return (
    <Paper
      onClick={onClick}
      sx={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-sm)',
        backgroundImage: 'none',
        p: finalPadding,
        cursor: onClick ? 'pointer' : 'default',
        ...(sx ?? {}),
      }}
      {...others}
    >
      <Box>{children}</Box>
    </Paper>
  );
}

