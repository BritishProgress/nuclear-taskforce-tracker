'use client';

import { cn } from '@/lib/utils';
import { StatusCounts } from '@/lib/types';
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
}

export function HeroStats({ counts, className }: HeroStatsProps) {
  const stats = [
    {
      label: 'Total',
      value: counts.total,
      icon: Atom,
      color: 'text-dark-green',
      bgColor: 'bg-dark-green/10',
    },
    {
      label: 'On Track',
      value: counts.on_track,
      icon: CheckCircle2,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/20',
    },
    {
      label: 'Off Track',
      value: counts.off_track,
      icon: AlertCircle,
      color: 'text-deep-red',
      bgColor: 'bg-deep-red/10',
    },
    {
      label: 'Completed',
      value: counts.completed,
      icon: CheckCircle,
      color: 'text-dark-green',
      bgColor: 'bg-dark-green/10',
    },
    {
      label: 'Not Started',
      value: counts.not_started,
      icon: Circle,
      color: 'text-charcoal',
      bgColor: 'bg-charcoal/10',
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
      <div className="flex flex-col items-center gap-8">
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
        <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={cn(
                    'flex flex-col items-center p-4 rounded-xl transition-transform hover:scale-105',
                    stat.bgColor
                  )}
                >
                  <Icon className={cn('h-6 w-6 mb-2', stat.color)} />
                  <span className={cn('text-3xl font-bold font-mono', stat.color)}>
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

