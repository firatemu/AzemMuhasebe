import React from 'react';
import CollectionClient from './CollectionClient';
import StandardPage from '@/components/common/StandardPage';

export const metadata = {
    title: 'Tahsilat İşlemi',
    description: 'Çek veya Senet için tahsilat girişi',
};

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <StandardPage
            title="Tahsilat İşlemi"
            breadcrumbs={[
                { label: 'Çek/Senet Listesi', href: '/checks' },
                { label: 'Evrak Detayı', href: `/checks/${id}` },
                { label: 'Tahsilat' }
            ]}
        >
            <CollectionClient checkId={id} />
        </StandardPage>
    );
}
