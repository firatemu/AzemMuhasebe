import { redirect } from 'next/navigation';

export default function SatisDuzenleRedirectPage({ params }: { params: { id: string } }) {
  redirect(`/orders/sales/duzenle/${params.id}`);
}
