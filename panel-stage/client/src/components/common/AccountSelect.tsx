'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useAccounts } from '@/hooks/use-selects';
import { Account } from '@/types/check-bill';
import axios from '@/lib/axios';

interface AccountSelectProps {
    value: string | null;
    onChange: (value: string | null) => void;
    error?: boolean;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
}

export default function AccountSelect({ value, onChange, error, helperText, required, disabled }: AccountSelectProps) {
    const [inputValue, setInputValue] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(inputValue);
        }, 400);
        return () => clearTimeout(handler);
    }, [inputValue]);

    const { data: accounts, isLoading } = useAccounts(debouncedSearch);

    // Fetch selected account by ID to preserve it even when not in search results
    useEffect(() => {
        if (value && (!selectedAccount || selectedAccount.id !== value)) {
            // First check if it's in the current accounts list
            const inList = accounts?.find(a => a.id === value);
            if (inList) {
                setSelectedAccount(inList);
            } else if (!debouncedSearch) {
                // Only fetch if not searching (to avoid unnecessary requests)
                axios.get<Account>(`/account/${value}`)
                    .then(res => setSelectedAccount(res.data))
                    .catch(() => setSelectedAccount(null));
            }
        } else if (!value) {
            setSelectedAccount(null);
        }
    }, [value, accounts, debouncedSearch]);

    // Memoize options to include selected account even if not in search results
    const options = useMemo(() => {
        const opts = accounts || [];
        if (selectedAccount && !opts.find(a => a.id === selectedAccount.id)) {
            return [selectedAccount, ...opts];
        }
        return opts;
    }, [accounts, selectedAccount]);

    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option: Account) => option.code ? `[${option.code}] ${option.title}` : option.title}
            value={selectedAccount}
            onChange={(event, newValue) => {
                const newId = newValue ? newValue.id : null;
                if (newId !== value) {
                    onChange(newId);
                }
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            disabled={disabled}
            loading={isLoading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Cari Hesap"
                    required={required}
                    error={error}
                    helperText={helperText}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}
