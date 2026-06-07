import React from 'react';
import CheckWizardClient from './CheckWizardClient';
import StandardPage from '@/components/common/StandardPage';

export const metadata = {
    title: 'Yeni Çek / Senet Girişi',
    description: 'Portföye yeni müşteri çek veya senedi girişi yapın.',
};

export default function NewCheckPage() {
    return (
        <StandardPage
            title="Yeni Çek / Senet"
            breadcrumbs={[
                { label: 'Çek/Senet Listesi', href: '/checks' },
                { label: 'Yeni Evrak' }
            ]}
        >
            <CheckWizardClient />
        </StandardPage>
    );
}
