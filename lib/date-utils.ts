// Client-safe date utility functions

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

export function daysUntil(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isOverdue(dateString: string): boolean {
  return daysUntil(dateString) < 0;
}

export function getDeadlineStatus(dateString: string): 'overdue' | 'imminent' | 'upcoming' | 'distant' {
  const days = daysUntil(dateString);
  if (days < 0) return 'overdue';
  if (days <= 30) return 'imminent';
  if (days <= 90) return 'upcoming';
  return 'distant';
}

