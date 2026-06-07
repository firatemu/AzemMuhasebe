'use client';

import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  alpha,
  useTheme,
  Grid
} from '@mui/material';
import { Backspace, Clear } from '@mui/icons-material';

interface VirtualNumpadProps {
  open: boolean;
  onClose: () => void;
  onValueChange: (value: string) => void;
  title?: string;
}

export default function VirtualNumpad({
  open,
  onClose,
  onValueChange,
  title = 'Sayı Girişi',
}: VirtualNumpadProps) {
  const theme = useTheme();
  const [displayValue, setDisplayValue] = React.useState('0');

  const handleDigitClick = (digit: string) => {
    let newValue = displayValue;
    if (newValue === '0') {
      newValue = digit;
    } else {
      newValue += digit;
    }
    // Limit to 12 characters (common for most POS inputs)
    if (newValue.length > 12) {
      newValue = newValue.slice(0, 12);
    }
    setDisplayValue(newValue);
    onValueChange(newValue);
  };

  const handleBackspace = () => {
    let newValue = displayValue;
    if (newValue.length > 1) {
      newValue = newValue.slice(0, -1);
    } else if (newValue.length === 1) {
      newValue = '0';
    }
    setDisplayValue(newValue);
    onValueChange(newValue);
  };

  const handleClear = () => {
    setDisplayValue('0');
    onValueChange('0');
  };

  const handleDecimal = () => {
    let newValue = displayValue;
    if (!newValue.includes(',')) {
      newValue += ',';
    }
    setDisplayValue(newValue);
    onValueChange(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, bgcolor: 'background.paper', p: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, textAlign: 'center' }}>{title}</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Display Area */}
          <Box
            sx={{
              p: 2.5,
              textAlign: 'right',
              bgcolor: alpha(theme.palette.background.default, 0.6),
              border: '2px solid',
              borderColor: 'divider',
              borderRadius: 3,
              minHeight: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <Typography
              sx={{
                fontSize: '2.5rem',
                fontWeight: 900,
                fontFamily: 'monospace',
                color: 'text.primary',
                letterSpacing: 2
              }}
            >
              {displayValue}
            </Typography>
          </Box>

          {/* NumPad Grid */}
          <Grid container spacing={1.5}>
            {[
              ['7', '8', '9', 'CLR'],
              ['4', '5', '6', 'DEL'],
              ['1', '2', '3', ','],
              ['0', '00', 'ENT']
            ].map((row, rowIdx) => (
              <React.Fragment key={rowIdx}>
                {row.map((btn) => {
                  let isAction = ['CLR', 'DEL', 'ENT'].includes(btn);
                  let isZero = btn === '0' || btn === '00';

                  return (
                    <Grid key={btn} size={btn === 'ENT' ? 6 : 3}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                          if (btn === 'CLR') handleClear();
                          else if (btn === 'DEL') handleBackspace();
                          else if (btn === ',') handleDecimal();
                          else if (btn === 'ENT') onClose();
                          else handleDigitClick(btn);
                        }}
                        sx={{
                          height: 64,
                          borderRadius: 2.5,
                          fontSize: isAction ? '0.875rem' : '1.5rem',
                          fontWeight: 800,
                          textTransform: 'none',
                          boxShadow: 'none',
                          bgcolor: btn === 'ENT'
                            ? 'primary.main'
                            : btn === 'CLR'
                              ? 'error.main'
                              : btn === 'DEL'
                                ? 'warning.main'
                                : alpha(theme.palette.background.default, 0.8),
                          color: isAction ? '#fff' : 'text.primary',
                          border: isAction ? 'none' : '1px solid',
                          borderColor: 'divider',
                          '&:hover': {
                            bgcolor: btn === 'ENT'
                              ? 'primary.dark'
                              : btn === 'CLR'
                                ? 'error.dark'
                                : btn === 'DEL'
                                  ? 'warning.dark'
                                  : 'background.paper',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        {btn === 'DEL' ? <Backspace fontSize="small" /> : btn === 'CLR' ? <Clear fontSize="small" /> : btn}
                      </Button>
                    </Grid>
                  );
                })}
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
