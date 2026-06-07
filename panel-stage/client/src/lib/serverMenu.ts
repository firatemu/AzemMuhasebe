import { cookies } from 'next/headers';
import { menuItems } from '@/config/menuItems';

/** authorization/page ile aynı mantık — adminOnly menüler */
const ADMIN_ROLES = new Set(['SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN']);

function menuUserIsAdmin(user: { role?: string; isAdmin?: boolean } | null): boolean {
    if (!user) return false;
    if (user.isAdmin === true) return true;
    const role = user.role != null ? String(user.role) : '';
    return ADMIN_ROLES.has(role);
}

/**
 * Server-side utility to get filtered menu items based on user role/permissions in cookies.
 * This prevents the Client from even receiving the configuration for restricted pages.
 */
export async function getServerMenuItems() {
    const cookieStore = await cookies();
    const userDataStr = cookieStore.get('user')?.value;

    let isAdmin = false;
    if (userDataStr) {
        try {
            const user = JSON.parse(decodeURIComponent(userDataStr));
            isAdmin = menuUserIsAdmin(user);
        } catch (e) {
            console.error('Failed to parse user cookie for menu filtering:', e);
        }
    }

    // Filter out admin-only items if user is not admin
    return menuItems.filter((item) => !(item as { adminOnly?: boolean }).adminOnly || isAdmin);
}
