import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/invoice-profits/detail/[faturaId]
 * Fatura detay kar bilgilerini getirir
 */
export async function GET(
  request: Request,
  { params }: { params: { faturaId: string } }
) {
  return NextResponse.json({
    success: false,
    message: 'Fatura karlılık modülü henüz aktif değil',
    data: [],
    error: 'BACKEND_NOT_CONFIGURED'
  });
}
