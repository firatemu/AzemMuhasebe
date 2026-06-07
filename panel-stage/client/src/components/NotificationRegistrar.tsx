'use client';

import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { setNotificationHandler } from '@/lib/notifications';

/**
 * Registers the global notify handler with the SnackbarProvider.
 * Use once inside SnackbarProvider in layout/providers.
 */
export function NotificationRegistrar() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setNotificationHandler((message, variant) => {
      enqueueSnackbar(message, { variant });
    });
  }, [enqueueSnackbar]);

  return null;
}