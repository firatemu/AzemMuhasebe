import React from 'react';
import StandardPage from '@/components/common/StandardPage';
import AnalyticsDashboardClient from './AnalyticsDashboardClient';

export const metadata = {
    title: 'Analitikler',
    description: 'Platform analitikleri ve KPI özetleri',
};

export default function AnalyticsDashboardPage() {
    return (
        <StandardPage
            title="Analitikler"
            breadcrumbs={[
                { label: 'Raporlama', href: '/reporting' },
                { label: 'Analitikler' },
            ]}
        >
            <AnalyticsDashboardClient />
        </StandardPage>
    );
}
