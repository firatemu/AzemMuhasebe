import React from 'react';
import PayrollClient from './PayrollClient';
import StandardPage from '@/components/common/StandardPage';

export const metadata = {
    title: 'Bordro Yönetimi',
    description: 'Çek ve Senet bordro kayıtları listesi',
};

export default function PayrollPage() {
    return (
        <StandardPage
            title="Bordro Yönetimi"
            breadcrumbs={[
                { label: 'Finans', href: '/finance' },
                { label: 'Bordro Yönetimi' }
            ]}
        >
            <PayrollClient />
        </StandardPage>
    );
}
