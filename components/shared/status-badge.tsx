'use client';

import { cn } from '@/lib/utils';
import { OverallStatus, UpdateStatus } from '@/lib/types';
import { OVERALL_STATUS_LABELS, UPDATE_STATUS_LABELS, OVERALL_STATUS_CLASSES, UPDATE_STATUS_CLASSES } from '@/lib/constants';
import {
  Circle,
  CheckCircle2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  TrendingUp,
  AlertTriangle,
  Ban,
} from 'lucide-react';

const OVERALL_STATUS_ICON_MAP = {
  not_started: Circle,
  on_track: CheckCircle2,
  off_track: AlertCircle,
  completed: CheckCircle,
  abandoned: XCircle,
};

const UPDATE_STATUS_ICON_MAP = {
  info: Info,
  progress: TrendingUp,
  risk: AlertTriangle,
  on_track: CheckCircle2,
  off_track: AlertCircle,
  completed: CheckCircle,
  blocked: Ban,
};

interface StatusBadgeProps {
  status: OverallStatus | UpdateStatus;
  type: 'overall' | 'update';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  type,
  size = 'md',
  showIcon = true,
  className,
}: StatusBadgeProps) {
  const label = type === 'overall'
    ? OVERALL_STATUS_LABELS[status as OverallStatus]
    : UPDATE_STATUS_LABELS[status as UpdateStatus];

  const statusClass = type === 'overall'
    ? OVERALL_STATUS_CLASSES[status as OverallStatus]
    : UPDATE_STATUS_CLASSES[status as UpdateStatus];

  const IconComponent = type === 'overall'
    ? OVERALL_STATUS_ICON_MAP[status as OverallStatus]
    : UPDATE_STATUS_ICON_MAP[status as UpdateStatus];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        sizeClasses[size],
        statusClass,
        className
      )}
    >
      {showIcon && IconComponent && (
        <IconComponent size={iconSizes[size]} className="shrink-0" />
      )}
      {label}
    </span>
  );
}

