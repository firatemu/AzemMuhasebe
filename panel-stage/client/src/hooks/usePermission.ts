'use client';

import { useAuthStore } from '@/stores/authStore';
import { useMemo } from 'react';

export function usePermission() {
  const permissions = useAuthStore((s) => s.permissions ?? []);

  return useMemo(() => {
    const set = new Set(permissions);
    const can = (module: string, action: string) =>
      set.has('ALL') || set.has(`${module}.${action}`);
    return { can, permissions };
  }, [permissions]);
}
