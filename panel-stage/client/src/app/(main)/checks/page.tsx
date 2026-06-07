import React from 'react';
import ChecksClient from './ChecksClient';
import StandardPage from '@/components/common/StandardPage';

export const metadata = {
    title: 'Çek ve Senet Yönetimi',
    description: 'Portföydeki tüm çek ve senetlerin takibi',
};

export default function ChecksPage() {
    return (
        <StandardPage
            title="Çek ve Senet Yönetimi"
            breadcrumbs={[{ label: 'Finans', href: '/finance' }, { label: 'Çek ve Senet' }]}
        >
            <ChecksClient />
        </StandardPage>
    );
}
