import React from 'react';
import StandardPage from '@/components/common/StandardPage';
import ChecksReportsClient from './ChecksReportsClient';

export const metadata = {
    title: 'Çek / Senet Raporları',
    description: 'Banka pozisyonu, risk ve protesto raporları',
};

export default function ChecksReportsPage() {
    return (
        <StandardPage
            title="Çek ve Senet Raporları"
            breadcrumbs={[
                { label: 'Finans', href: '/finance' },
                { label: 'Çek ve Senet', href: '/checks' },
                { label: 'Raporlar' },
            ]}
        >
            <ChecksReportsClient />
        </StandardPage>
    );
}
