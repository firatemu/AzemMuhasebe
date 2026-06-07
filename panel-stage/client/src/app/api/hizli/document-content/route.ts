import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { serverFetch } from '@/lib/serverFetch';

/**
 * GET /api/hizli/document-content
 * Hızlı e-fatura belge içeriğini (XML/HTML) döndürür
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await serverFetch(`/quick-invoices/document-content?${searchParams.toString()}`);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Fatura detayı alınamadı',
      error: 'BACKEND_FETCH_ERROR'
    }, { status: 500 });
  }
}
