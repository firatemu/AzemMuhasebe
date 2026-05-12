import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ClientProviders } from './ClientProviders';
import '@/styles/design-system.css';

export const metadata: Metadata = {
  title: 'AzemMuhasebe',
  description: 'AzemMuhasebe - Multi-tenant ERP/SaaS Sistemi',
  icons: {
    icon: '/favicon.svg',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  // Auth state from cookies
  let initialAuth = undefined;
  const userCookie = cookieStore.get('user')?.value;
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (userCookie && accessToken) {
    try {
      initialAuth = {
        user: JSON.parse(decodeURIComponent(userCookie)),
        accessToken: accessToken,
        refreshToken: refreshToken || null,
      };
    } catch (e) {
      console.error('Failed to parse user cookie in layout:', e);
    }
  }

  // Theme state from cookies (optional, if we add it later)
  // For now, it defaults to light if no cookie is found
  const isDarkMode = cookieStore.get('isDarkMode')?.value === 'true';

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <ClientProviders
          initialAuth={initialAuth}
          initialTheme={{ isDarkMode }}
        >
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
// HMR Test 
// HMR Test Mon Mar 16 22:30:57 +03 2026
// Container HMR Test
// HMR Test 2
// HMR Final Test Mon Mar 16 22:33:01 +03 2026
