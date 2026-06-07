import { redirect } from 'next/navigation';

export default function SatisRedirectPage() {
  redirect('/orders/sales');
}
