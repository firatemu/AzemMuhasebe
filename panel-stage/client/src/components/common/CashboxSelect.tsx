'use client';

import React from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useCashboxes } from '@/hooks/use-selects';
import { Cashbox } from '@/types/check-bill';

interface CashboxSelectProps {
    value: string | null;
    onChange: (value: string | null) => void;
    error?: boolean;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    isRetail?: boolean;
}

export default function CashboxSelect({ value, onChange, error, helperText, required, disabled, isRetail }: CashboxSelectProps) {
    const { data: cashboxes, isLoading } = useCashboxes(isRetail);

    const selectedObject = cashboxes?.find(c => c.id === value) || null;

    return (
        <Autocomplete
            options={cashboxes || []}
            getOptionLabel={(option: Cashbox) => option.name}
            value={selectedObject}
            onChange={(event, newValue) => {
                onChange(newValue ? newValue.id : null);
            }}
            disabled={disabled}
            loading={isLoading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Kasa"
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
