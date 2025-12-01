'use client';

import { cn } from '@/lib/utils';
import { StatusCounts, OverallStatus } from '@/lib/types';
import { ProgressRing } from '@/components/shared/progress-ring';
import { 
  Circle, 
  CheckCircle2, 
  AlertCircle, 
  CheckCircle,
  Atom
} from 'lucide-react';

interface HeroStatsProps {
  counts: StatusCounts;
  className?: string;
  onStatusClick?: (status: OverallStatus | 'all') => void;
}

export function HeroStats({ counts, className, onStatusClick }: HeroStatsProps) {
  const stats = [
    {
      label: 'Total',
      value: counts.total,
      icon: Atom,
      color: 'text-dark-green',
      bgColor: 'bg-dark-green/10',
      status: 'all' as const,
    },
    {
      label: 'On Track',
      value: counts.on_track,
      icon: CheckCircle2,
      color: 'text-dark-green',
      bgColor: 'bg-dark-green/10',
      status: 'on_track' as OverallStatus,
    },
    {
      label: 'Off Track',
      value: counts.off_track,
      icon: AlertCircle,
      color: 'text-deep-red',
      bgColor: 'bg-deep-red/10',
      status: 'off_track' as OverallStatus,
    },
    {
      label: 'Completed',
      value: counts.completed,
      icon: CheckCircle,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/20',
      status: 'completed' as OverallStatus,
    },
    {
      label: 'Not Started',
      value: counts.not_started,
      icon: Circle,
      color: 'text-charcoal',
      bgColor: 'bg-charcoal/10',
      status: 'not_started' as OverallStatus,
    },
  ];

  return (
    <div className={cn('', className)}>
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-green/10 text-dark-green text-sm font-medium mb-4">
          <Atom size={16} />
          Centre for British Progress
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green mb-4 tracking-tight">
          Nuclear Taskforce Tracker
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Monitoring government progress on{' '}
          <span className="font-semibold text-foreground">{counts.total} recommendations</span>{' '}
          from the UK Nuclear Regulatory Taskforce
        </p>
      </div>

      {/* Progress Ring & Stats */}
      <div className="flex flex-col items-center gap-4 sm:gap-8">
        {/* Central Progress Ring */}
        <div className="flex flex-col items-center">
          <ProgressRing
            completed={counts.completed}
            total={counts.total}
            size="xl"
            showLabel={true}
          />
          <p className="text-sm text-muted-foreground mt-2">Completed</p>
        </div>

        {/* Stats Grid - Centered */}
        <div className="flex justify-center sm:justify-center">
          <div className="flex flex-col w-full sm:w-auto sm:grid sm:grid-cols-3 md:grid-cols-5 gap-0 sm:gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const isClickable = !!onStatusClick;
              const Component = isClickable ? 'button' : 'div';
              return (
                <Component
                  key={stat.label}
                  onClick={isClickable ? () => onStatusClick?.(stat.status) : undefined}
                  className={cn(
                    'flex flex-col items-center p-1.5 sm:p-4 rounded-xl transition-all w-full sm:w-auto',
                    stat.bgColor,
                    isClickable && 'cursor-pointer hover:scale-105 hover:shadow-md active:scale-95'
                  )}
                >
                  <Icon className={cn('h-4 w-4 sm:h-6 sm:w-6 mb-1 sm:mb-2', stat.color)} />
                  <span className={cn('text-xl sm:text-3xl font-bold font-mono', stat.color)}>
                    {stat.value}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                    {stat.label}
                  </span>
                </Component>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

