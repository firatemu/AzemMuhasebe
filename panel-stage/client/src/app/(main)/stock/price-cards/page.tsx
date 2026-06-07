import MainLayout from '@/components/Layout/MainLayout';
import PriceCardClient from './PriceCardClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Fiyat Kartları (Price Cards) | OtoMuhasebe',
    description: 'Gelişmiş Fiyat, Kampanya ve Müşteri Bazlı Fiyatlandırma Yönetimi.',
};

export default function PriceCardsPage() {
    return (
        <MainLayout>
            <PriceCardClient />
        </MainLayout>
    );
}
