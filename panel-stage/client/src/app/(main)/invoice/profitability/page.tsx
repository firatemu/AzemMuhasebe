import React from 'react';
import StandardPage from '@/components/common/StandardPage';
import InvoiceProfitabilityClient from './InvoiceProfitabilityClient';

export const metadata = {
    title: 'Fatura Karlılığı',
    description: 'Fatura ve ürün bazlı karlılık analizi',
};

export default function InvoiceProfitabilityPage() {
    return (
        <StandardPage
            breadcrumbs={[
                { label: 'Raporlama', href: '/reporting' },
                { label: 'Karlılık Analizi' },
            ]}
        >
            <InvoiceProfitabilityClient />
        </StandardPage>
    );
}
