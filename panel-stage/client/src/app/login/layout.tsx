import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Azem Muhasebe',
  description: 'Azem Muhasebe yönetim paneline giriş',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
