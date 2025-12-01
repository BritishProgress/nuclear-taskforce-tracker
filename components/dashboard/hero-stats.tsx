'use client';

import { cn } from '@/lib/utils';
import { StatusCounts, OverallStatus } from '@/lib/types';
import { ProgressRing } from '@/components/shared/progress-ring';
import { 
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
  const mainStats = [
    {
      label: 'On Track',
      value: counts.on_track,
      icon: Atom,
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
  ];

  const totalStat = {
    label: 'Total',
    value: counts.total,
    icon: 'atom' as const,
    color: 'text-dark-green',
    bgColor: 'bg-dark-green/10',
    status: 'all' as const,
  };

  return (
    <div className={cn('', className)}>
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-green/10 text-dark-green text-sm font-medium mb-4">
          <img 
            src="/icon.svg" 
            alt="" 
            className="w-4 h-4"
          />
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
            onTrack={counts.on_track}
            offTrack={counts.off_track}
            total={counts.total}
            size="xl"
            showLabel={true}
          />
          <p className="text-sm font-medium text-foreground mt-2">Completed</p>
        </div>

        {/* Stats Grid - Centered */}
        <div className="flex justify-center w-full">
          <div className="flex flex-col w-full sm:w-auto sm:grid sm:grid-cols-3 gap-2 sm:gap-4">
            {/* Main three stats */}
            {mainStats.map((stat) => {
              const Icon = stat.icon;
              const isClickable = !!onStatusClick;
              const Component = isClickable ? 'button' : 'div';
              return (
                <Component
                  key={stat.label}
                  onClick={isClickable ? () => onStatusClick?.(stat.status) : undefined}
                  className={cn(
                    'flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-0 p-1.5 sm:p-4 rounded-xl transition-all w-full',
                    stat.bgColor,
                    isClickable && 'cursor-pointer hover:scale-105 hover:shadow-md active:scale-95'
                  )}
                >
                  <div className="flex items-center gap-2 sm:flex-col sm:gap-0">
                    {Icon && (
                      <Icon className={cn(
                        'h-4 w-4 sm:h-6 sm:w-6 sm:mb-1 sm:mb-2',
                        stat.color,
                        stat.status === 'completed' && 'font-bold'
                      )} />
                    )}
                    <span className={cn(
                      'text-xl sm:text-3xl font-bold font-mono',
                      stat.color,
                      stat.status === 'completed' && 'font-extrabold'
                    )}>
                      {stat.value}
                    </span>
                  </div>
                  <span className={cn(
                    'text-sm sm:text-[10px] sm:mt-0.5 sm:mt-1',
                    stat.status === 'completed' ? 'font-semibold text-dark-green' : 'text-muted-foreground'
                  )}>
                    {stat.label}
                  </span>
                </Component>
              );
            })}

            {/* Total stat - underneath on desktop, spans all 3 columns */}
            {(() => {
              const isClickable = !!onStatusClick;
              const Component = isClickable ? 'button' : 'div';
              return (
                <Component
                  onClick={isClickable ? () => onStatusClick?.(totalStat.status) : undefined}
                  className={cn(
                    'flex flex-row items-center justify-center gap-3 p-1.5 sm:p-3 rounded-xl transition-all w-full sm:col-span-3',
                    totalStat.bgColor,
                    isClickable && 'cursor-pointer hover:scale-105 hover:shadow-md active:scale-95'
                  )}
                >
                  <span className={cn('text-xl sm:text-2xl font-bold font-mono', totalStat.color)}>
                    {totalStat.value}
                  </span>
                  <span className="text-sm sm:text-sm text-muted-foreground">
                    {totalStat.label}
                  </span>
                </Component>
              );
            })()}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center max-w-2xl mx-auto mt-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This is AI-generated content based on the{' '}
            <a
              href="https://www.gov.uk/government/publications/nuclear-regulatory-taskforce"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Nuclear Regulatory Taskforce report
            </a>
            . We have worked hard to ensure this is accurate but please{' '}
            <a
              href="https://britishprogress.org/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              report any errors
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

