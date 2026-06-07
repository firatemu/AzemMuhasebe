import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { serverFetch } from '@/lib/serverFetch';

/**
 * GET /api/hizli/incoming
 * Hızlı e-fatura gelen faturaları listeler
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await serverFetch(`/quick-invoices/incoming?${searchParams.toString()}`);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Entegrasyon bağlantı hatası',
      data: [],
      error: 'BACKEND_FETCH_ERROR'
    }, { status: 500 });
  }
}
