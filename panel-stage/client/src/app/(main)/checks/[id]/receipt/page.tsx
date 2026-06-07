import React from 'react';
import PrintReceiptClient from './PrintReceiptClient';

export default async function PrintReceiptPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <PrintReceiptClient checkId={id} />;
}
