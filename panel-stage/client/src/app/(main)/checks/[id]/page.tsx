import React from 'react';
import CheckDetailClient from './CheckDetailClient';
import StandardPage from '@/components/common/StandardPage';

export const metadata = {
    title: 'Evrak Detayı',
    description: 'Çek veya Senet detaylı görünümü',
};

export default async function CheckDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <StandardPage
            title="Evrak Detayı"
            breadcrumbs={[
                { label: 'Çek/Senet Listesi', href: '/checks' },
                { label: 'Evrak Detayı' }
            ]}
        >
            <CheckDetailClient checkId={id} />
        </StandardPage>
    );
}
