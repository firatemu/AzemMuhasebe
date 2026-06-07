import React from 'react';
import PayrollDetailClient from './PayrollDetailClient';
import StandardPage from '@/components/common/StandardPage';

export const metadata = {
    title: 'Bordro Detayı',
    description: 'Bordro ve İçerisindeki Evrakların Yönetimi',
};

// Next.js params is a Promise in Next.js 15+
export default async function PayrollDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <StandardPage
            title="Bordro Detayı"
            breadcrumbs={[
                { label: 'Bordro Yönetimi', href: '/payroll' },
                { label: 'Bordro Detayı' }
            ]}
        >
            <PayrollDetailClient journalId={id} />
        </StandardPage>
    );
}
