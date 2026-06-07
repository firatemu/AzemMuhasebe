import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ElementType<SvgIconProps>;
    action?: {
        label: string;
        onClick: () => void;
        startIcon?: React.ReactNode;
    };
    compact?: boolean;
}

export default function EmptyState({
    title,
    description,
    icon: Icon,
    action,
    compact = false,
}: EmptyStateProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: compact ? 4 : 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                backgroundColor: 'var(--background)', // Blend with background
                border: '1px dashed var(--border)', // Dashed border for empty states
                borderRadius: 3, // 24px
                minHeight: compact ? 200 : 400,
            }}
        >
            {/* Tech-oriented Minimalist SVG Illustration */}
            <Box
                sx={{
                    width: 120,
                    height: 120,
                    mb: 3,
                    color: 'var(--muted-foreground)',
                    opacity: 0.5,
                    position: 'relative',
                }}
            >
                {Icon ? (
                    <Icon sx={{ fontSize: 120, strokeWidth: 0.5 }} />
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="100%"
                        height="100%"
                    >
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" vectorEffect="non-scaling-stroke" />
                        <line x1="8" y1="21" x2="16" y2="21" vectorEffect="non-scaling-stroke" />
                        <line x1="12" y1="17" x2="12" y2="21" vectorEffect="non-scaling-stroke" />
                        <path d="M10 9l2 2 4-4" vectorEffect="non-scaling-stroke" strokeDasharray="4 4" />
                    </svg>
                )}
            </Box>

            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    color: 'var(--foreground)',
                    mb: 1,
                    letterSpacing: '-0.01em',
                }}
            >
                {title}
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    maxWidth: 400,
                    color: 'var(--muted-foreground)',
                    mb: 4,
                    fontSize: '0.95rem',
                }}
            >
                {description}
            </Typography>

            {action && (
                <Button
                    variant="contained"
                    onClick={action.onClick}
                    startIcon={action.startIcon}
                    size="medium"
                    sx={{
                        px: 4,
                        py: 1.2,
                        borderRadius: 2, // 16px
                        background: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                            background: 'var(--primary-hover)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        },
                    }}
                >
                    {action.label}
                </Button>
            )}
        </Paper>
    );
}
