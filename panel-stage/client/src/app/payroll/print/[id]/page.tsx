import React from 'react';
import PrintPayrollClient from './PrintPayrollClient';

export default async function PrintPayrollPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <PrintPayrollClient journalId={id} />;
}
