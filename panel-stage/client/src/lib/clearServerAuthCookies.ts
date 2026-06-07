/** HttpOnly çerezleri temizlemek için (çıkış / oturum sonu) */
export async function clearServerAuthCookies(): Promise<void> {
    try {
        await fetch('/api/auth/cookies', { method: 'DELETE', credentials: 'same-origin' });
    } catch {
        /* ignore */
    }
}
