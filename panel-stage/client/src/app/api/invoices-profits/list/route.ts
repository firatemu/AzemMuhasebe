import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/invoices-profits/list
 * Fatura karlılık listesini getirir
 */
export async function GET(request: Request) {
  // Backend endpoint henüz mevcut değil
  return NextResponse.json({
    success: false,
    message: 'Fatura karlılık modülü henüz aktif değil',
    data: [],
    error: 'BACKEND_NOT_CONFIGURED'
  });
}
