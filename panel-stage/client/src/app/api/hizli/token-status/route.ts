import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { serverFetch } from '@/lib/serverFetch';

/**
 * GET /api/hizli/token-status
 * Hızlı e-fatura token durumunu döndürür
 */
export async function GET(request: Request) {
  try {
    const data = await serverFetch('/quick-invoices/token-status');
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({
      hasToken: false,
      isValid: false,
      message: error.message || 'Token statüsü alınamadı',
      status: 'error'
    }, { status: 500 });
  }
}
