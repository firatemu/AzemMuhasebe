import React from 'react';
import { Box, Container, Breadcrumbs, Link, Typography } from '@mui/material';

interface PageContainerProps {
    children: React.ReactNode;
    title?: string;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export default function PageContainer({
    children,
    title,
    breadcrumbs,
    maxWidth = 'xl',
}: PageContainerProps) {
    return (
        <Box
            sx={{
                py: 4, // 32px
                px: { xs: 2, md: 4 }, // Responsive padding
                minHeight: '100%',
                backgroundColor: 'var(--background)',
            }}
        >
            <Container maxWidth={maxWidth} disableGutters>
                {/* Header Section */}
                {(title || breadcrumbs) && (
                    <Box sx={{ mb: 4 }}>
                        {breadcrumbs && (
                            <Breadcrumbs
                                separator={<Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'var(--muted-foreground)' }} />}
                                sx={{ mb: 1.5 }}
                            >
                                {breadcrumbs.map((crumb, index) => {
                                    const isLast = index === breadcrumbs.length - 1;
                                    return isLast ? (
                                        <Typography
                                            key={index}
                                            component="span"
                                            sx={{
                                                color: 'var(--foreground)',
                                                fontWeight: 600,
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            {crumb.label}
                                        </Typography>
                                    ) : (
                                        <Link
                                            key={index}
                                            underline="hover"
                                            href={crumb.href || '#'}
                                            sx={{
                                                color: 'var(--muted-foreground)',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                '&:hover': { color: 'var(--primary)' }
                                            }}
                                        >
                                            {crumb.label}
                                        </Link>
                                    );
                                })}
                            </Breadcrumbs>
                        )}

                        {title && (
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: '1.5rem', md: '2rem' },
                                    color: 'var(--foreground)',
                                    letterSpacing: '-0.025em',
                                    background: 'linear-gradient(to right, var(--foreground), var(--secondary))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'inline-block',
                                }}
                            >
                                {title}
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Page Content */}
                {children}
            </Container>
        </Box>
    );
}
