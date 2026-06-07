import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Nest API proxy — Node.js runtime (Edge middleware stream/duplex sorunları yok).
 * Daha spesifik route'lar (auth/cookies, hizli, work-order/...) bu handler'ı geçersiz kılar.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/** Host `pnpm dev`: Nest genelde 3120. Docker panel: API_PROXY_TARGET env kullanılır. */
const DEFAULT_TARGET = 'http://127.0.0.1:3120';

const SKIP_HEADERS = new Set([
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailers',
    'transfer-encoding',
    'upgrade',
    'host',
    'content-length',
    /** Tarayıcı gzip istemesin; Nest compression + Node fetch decode = ERR_CONTENT_DECODING_FAILED */
    'accept-encoding',
    /** Tarayıcı origin'i Nest CORS ile çakışmasın; istek sunucudan çıkıyor gibi görünsün */
    'origin',
    'referer',
]);

/** Backend gzip gönderse bile Node fetch çoğu zaman açar; header kalırsa tarayıcı tekrar açmaya çalışır → hata */
const SKIP_RESPONSE_HEADERS = new Set([
    'content-encoding',
    'content-length',
    'transfer-encoding',
]);

function resolveBackendBase(): string {
    const raw =
        process.env.API_PROXY_TARGET ||
        process.env.BACKEND_URL ||
        DEFAULT_TARGET;
    return raw.replace(
        /^http:\/\/localhost(?=:\d|\/|$)/i,
        'http://127.0.0.1',
    );
}

function forwardRequestHeaders(req: NextRequest): Headers {
    const h = new Headers();
    req.headers.forEach((value, key) => {
        if (!SKIP_HEADERS.has(key.toLowerCase())) {
            h.set(key, value);
        }
    });
    h.set('Accept-Encoding', 'identity');
    return h;
}

function buildProxyResponseHeaders(backend: Headers): Headers {
    const out = new Headers();
    backend.forEach((value, key) => {
        const k = key.toLowerCase();
        if (SKIP_RESPONSE_HEADERS.has(k)) return;
        if (k === 'set-cookie') {
            out.append(key, value);
        } else {
            out.set(key, value);
        }
    });
    return out;
}

async function proxyRequest(req: NextRequest, pathSegments: string[]) {
    const pathname = '/api/' + pathSegments.join('/');
    const target = new URL(pathname + req.nextUrl.search, resolveBackendBase());

    const method = req.method;
    const hasBody = !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method);
    let body: ArrayBuffer | undefined;
    if (hasBody) {
        body = await req.arrayBuffer();
    }

    const backendRes = await fetch(target.toString(), {
        method,
        headers: forwardRequestHeaders(req),
        body: body && body.byteLength > 0 ? body : undefined,
        cache: 'no-store',
        signal: AbortSignal.timeout(120_000),
    });

    return new NextResponse(backendRes.body, {
        status: backendRes.status,
        statusText: backendRes.statusText,
        headers: buildProxyResponseHeaders(backendRes.headers),
    });
}

type RouteCtx = { params: Promise<{ path: string[] }> };

async function handle(req: NextRequest, ctx: RouteCtx) {
    try {
        const { path } = await ctx.params;
        if (!path?.length) {
            return NextResponse.json({ error: 'Missing API path' }, { status: 400 });
        }
        return await proxyRequest(req, path);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Proxy error';
        console.error('[api proxy]', message);
        return NextResponse.json(
            { error: 'Backend unreachable', message },
            { status: 504 },
        );
    }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const HEAD = handle;
export const OPTIONS = handle;
