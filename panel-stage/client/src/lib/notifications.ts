type NotificationHandler = (message: string, variant?: 'error' | 'warning' | 'success' | 'info') => void;

let handler: NotificationHandler | null = null;

export function setNotificationHandler(fn: NotificationHandler) {
  handler = fn;
}

export function notify(message: string, variant: 'error' | 'warning' | 'success' | 'info' = 'error') {
  handler?.(message, variant);
}

/**
 * Registers notistack globally so axios interceptor can call notify().
 * Usage: <NotificationRegistrar /> inside SnackbarProvider.
 */
export { notify as notifyError };