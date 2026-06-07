export function formatAmount(value: number, currency = 'TRY'): string {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(value);
}

export function formatDate(value: string | Date | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
    if (!value) return '-';
    try {
        return new Intl.DateTimeFormat('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            ...opts,
        }).format(new Date(value));
    } catch (e) {
        return '-';
    }
}

export function formatDateShort(value: string | Date | null | undefined): string {
    return formatDate(value, { day: '2-digit', month: 'short', year: 'numeric' });
}

export function isOverdue(dueDate: string | Date | null | undefined): boolean {
    if (!dueDate) return false;
    const targetDate = new Date(dueDate);
    targetDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return targetDate < today;
}

export function daysUntilDue(dueDate: string | Date | null | undefined): number {
    if (!dueDate) return 0;
    const diff = new Date(dueDate).getTime() - Date.now();
    return Math.ceil(diff / 86_400_000);
}
