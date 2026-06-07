'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, alpha, useTheme, Skeleton, TextField, IconButton } from '@mui/material';
import type { SelectedPerson } from '../types/pos.types';

interface SelectorBoxProps {
    label: string;
    placeholder: string;
    value: SelectedPerson | null;
    onSelect: (person: SelectedPerson) => void;
    onClear: () => void;
    fetchOptions: (search: string) => Promise<SelectedPerson[]>;
    accentColor?: 'accent' | 'pink';
    icon: 'person' | 'salesperson';
}

function PersonIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function SalespersonIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
        </svg>
    );
}

export function SelectorBox({
    label,
    placeholder,
    value,
    onSelect,
    onClear,
    fetchOptions,
    accentColor = 'accent',
    icon,
}: SelectorBoxProps) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState<SelectedPerson[]>([]);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        if (open) {
            setQuery('');
            doFetch('');
            setTimeout(() => searchRef.current?.focus(), 50);
        }
    }, [open]);

    const doFetch = useCallback(
        async (q: string) => {
            setLoading(true);
            try {
                const result = await fetchOptions(q);
                setOptions(result);
            } catch {
                setOptions([]);
            } finally {
                setLoading(false);
            }
        },
        [fetchOptions]
    );

    function handleSearchChange(q: string) {
        setQuery(q);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doFetch(q), 300);
    }

    function handleSelect(person: SelectedPerson) {
        onSelect(person);
        setOpen(false);
    }

    const hasValue = value !== null;
    const accentMain = accentColor === 'pink' ? theme.palette.secondary.main : theme.palette.primary.main;
    const accentLight = accentColor === 'pink' ? alpha(theme.palette.secondary.main, 0.08) : alpha(theme.palette.primary.main, 0.08);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="overline" sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', lineHeight: 1 }}>
                {label}
            </Typography>

            <Box ref={containerRef} sx={{ position: 'relative' }}>
                <Box
                    onClick={() => setOpen((o) => !o)}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        px: 1.5,
                        py: 1,
                        bgcolor: hasValue ? accentLight : alpha(theme.palette.background.default, 0.6),
                        border: '1px solid',
                        borderColor: hasValue ? accentMain : 'divider',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            borderColor: accentMain,
                            bgcolor: hasValue ? accentLight : alpha(theme.palette.background.default, 0.8),
                        }
                    }}
                >
                    <Box sx={{ color: hasValue ? accentMain : 'text.disabled', display: 'flex' }}>
                        {icon === 'person' ? <PersonIcon /> : <SalespersonIcon />}
                    </Box>

                    <Typography
                        sx={{
                            flex: 1,
                            fontSize: '0.8125rem',
                            fontWeight: hasValue ? 700 : 500,
                            color: hasValue ? 'text.primary' : 'text.disabled',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {hasValue ? value.title : placeholder}
                    </Typography>

                    {hasValue && (
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); onClear(); }}
                            sx={{
                                width: 20,
                                height: 20,
                                p: 0,
                                color: 'text.disabled',
                                '&:hover': { color: 'error.main', bgcolor: 'error.lighter' }
                            }}
                        >
                            ✕
                        </IconButton>
                    )}
                </Box>

                {open && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 'calc(100% + 6px)',
                            left: 0,
                            right: 0,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            zIndex: theme.zIndex.modal,
                            maxHeight: 240,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: theme.shadows[8],
                            animation: 'dropdownFade 0.2s ease-out'
                        }}
                    >
                        <Box sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <TextField
                                inputRef={searchRef}
                                fullWidth
                                size="small"
                                autoComplete="off"
                                placeholder="Ara..."
                                value={query}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: alpha(theme.palette.background.default, 0.4),
                                        fontSize: '0.75rem',
                                        borderRadius: 1.5,
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ overflowY: 'auto', flex: 1, scrollbarWidth: 'thin' }}>
                            {loading ? (
                                <Box sx={{ p: 1 }}>
                                    {[1, 2, 3].map((i) => <Skeleton key={i} height={40} sx={{ mb: 0.5, borderRadius: 1 }} />)}
                                </Box>
                            ) : options.length === 0 ? (
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>Sonuç bulunamadı</Typography>
                                </Box>
                            ) : (
                                options.map((opt) => (
                                    <Box
                                        key={opt.id}
                                        onClick={() => handleSelect(opt)}
                                        sx={{
                                            px: 2,
                                            py: 1.25,
                                            cursor: 'pointer',
                                            transition: 'all 0.1s',
                                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: 'text.primary' }}>{opt.title}</Typography>
                                        {opt.code && (
                                            <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>{opt.code}</Typography>
                                        )}
                                    </Box>
                                ))
                            )}
                        </Box>
                    </Box>
                )}
            </Box>

            <style>{`
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </Box>
    );
}
