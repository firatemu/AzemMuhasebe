import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { serverFetch } from '@/lib/serverFetch';

/**
 * POST /api/hizli/auto-login
 * Hızlı e-fatura otomatik giriş işlemi
 */
export async function POST(request: Request) {
  try {
    const data = await serverFetch('/quick-invoices/auto-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Oturum açma hatası',
        error: 'BACKEND_FETCH_ERROR',
        authenticated: false
      },
      { status: 500 }
    );
  }
}
