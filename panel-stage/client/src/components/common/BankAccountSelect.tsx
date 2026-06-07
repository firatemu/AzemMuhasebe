'use client';

import React from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useBankAccounts } from '@/hooks/use-selects';
import { BankAccount } from '@/types/check-bill';

interface BankAccountSelectProps {
    value: string | null;
    onChange: (value: string | null) => void;
    error?: boolean;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    type?: string;
}

export default function BankAccountSelect({ value, onChange, error, helperText, required, disabled, type }: BankAccountSelectProps) {
    const { data: bankAccounts, isLoading } = useBankAccounts(type);

    const selectedObject = bankAccounts?.find(b => b.id === value) || null;

    return (
        <Autocomplete
            options={bankAccounts || []}
            getOptionLabel={(option: BankAccount) => `${option.bankName} - ${option.name} ${option.iban ? `(Son 4: ${option.iban.slice(-4)})` : ''}`}
            value={selectedObject}
            onChange={(event, newValue) => {
                onChange(newValue ? newValue.id : null);
            }}
            disabled={disabled}
            loading={isLoading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Banka Hesabı"
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
