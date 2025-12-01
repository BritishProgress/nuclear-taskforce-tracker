'use client';

import { cn } from '@/lib/utils';
import { daysUntil, formatDate, getDeadlineStatus } from '@/lib/date-utils';
import { Calendar, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface DeadlineIndicatorProps {
  targetDate: string;
  revisedDate?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function DeadlineIndicator({
  targetDate,
  revisedDate,
  size = 'md',
  showLabel = true,
  className,
}: DeadlineIndicatorProps) {
  const effectiveDate = revisedDate || targetDate;
  const days = daysUntil(effectiveDate);
  const status = getDeadlineStatus(effectiveDate);
  const isRevised = !!revisedDate;

  const statusConfig = {
    overdue: {
      icon: AlertTriangle,
      bgClass: 'bg-deep-red/10',
      textClass: 'text-deep-red',
      borderClass: 'border-deep-red/30',
      label: `${Math.abs(days)} days overdue`,
    },
    imminent: {
      icon: Clock,
      bgClass: 'bg-orange/10',
      textClass: 'text-orange',
      borderClass: 'border-orange/30',
      label: days === 0 ? 'Due today' : `${days} days`,
    },
    upcoming: {
      icon: Calendar,
      bgClass: 'bg-light-blue/10',
      textClass: 'text-dark-blue',
      borderClass: 'border-light-blue/30',
      label: `${days} days`,
    },
    distant: {
      icon: CheckCircle,
      bgClass: 'bg-muted',
      textClass: 'text-muted-foreground',
      borderClass: 'border-border',
      label: `${days} days`,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs gap-1',
    md: 'text-sm gap-1.5',
    lg: 'text-base gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div
        className={cn(
          'inline-flex items-center font-medium rounded-md px-2 py-1 border',
          config.bgClass,
          config.textClass,
          config.borderClass,
          sizeClasses[size]
        )}
      >
        <Icon size={iconSizes[size]} className="shrink-0" />
        {showLabel && <span>{config.label}</span>}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
        {isRevised && (
          <span className="line-through">{formatDate(targetDate)}</span>
        )}
        <span className={isRevised ? 'font-medium text-foreground' : ''}>
          {formatDate(effectiveDate)}
        </span>
      </div>
    </div>
  );
}

