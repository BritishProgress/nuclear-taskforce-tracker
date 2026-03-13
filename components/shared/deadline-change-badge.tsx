'use client';

import { cn } from '@/lib/utils';
import { formatDateShort } from '@/lib/date-utils';
import { ArrowRight, CalendarClock } from 'lucide-react';

interface DeadlineChangeBadgeProps {
  originalDate: string;
  revisedDate: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function DeadlineChangeBadge({
  originalDate,
  revisedDate,
  size = 'sm',
  className,
}: DeadlineChangeBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-orange/30 bg-orange/10 px-2 py-1 font-mono',
        size === 'sm' ? 'text-xs' : 'text-sm',
        className
      )}
    >
      <CalendarClock size={size === 'sm' ? 12 : 14} className="text-orange shrink-0" />
      <span className="text-muted-foreground">Deadline moved</span>
      <span className="line-through text-muted-foreground/60">{formatDateShort(originalDate)}</span>
      <ArrowRight size={size === 'sm' ? 10 : 12} className="text-muted-foreground shrink-0" />
      <span className="font-medium text-orange">{formatDateShort(revisedDate)}</span>
    </div>
  );
}
