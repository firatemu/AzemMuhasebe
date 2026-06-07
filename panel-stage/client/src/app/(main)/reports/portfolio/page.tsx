import React from 'react';
import ReportPortfolioClient from './ReportPortfolioClient';
import StandardPage from '@/components/common/StandardPage';

export const metadata = {
    title: 'Portföy Raporu',
    description: 'Çek / Senet portföy analizi ve raporlaması',
};

export default function ReportPortfolioPage() {
    return (
        <StandardPage
            title="Portföy Analizi"
            breadcrumbs={[
                { label: 'Raporlar', href: '/reporting' },
                { label: 'Portföy Analizi' }
            ]}
        >
            <ReportPortfolioClient />
        </StandardPage>
    );
}
