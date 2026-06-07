import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/invoices-profits/by-product
 * Ürün bazlı karlılık listesini getirir
 */
export async function GET(request: Request) {
  return NextResponse.json({
    success: false,
    message: 'Fatura karlılık modülü henüz aktif değil',
    data: [],
    error: 'BACKEND_NOT_CONFIGURED'
  });
}
