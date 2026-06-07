import React from 'react';
import PayrollWizardClient from './PayrollWizardClient';
import StandardPage from '@/components/common/StandardPage';

export const metadata = {
    title: 'Yeni Bordro',
    description: 'Sihirbaz ile yeni çek/senet bordrosu oluşturma',
};

export default function NewPayrollPage() {
    return (
        <StandardPage
            title="Yeni Bordro Oluştur"
            breadcrumbs={[
                { label: 'Bordro Yönetimi', href: '/payroll' },
                { label: 'Yeni Bordro' }
            ]}
        >
            <PayrollWizardClient />
        </StandardPage>
    );
}
