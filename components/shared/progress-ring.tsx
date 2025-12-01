'use client';

import { cn } from '@/lib/utils';

interface ProgressRingProps {
  completed: number;
  total: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({
  completed,
  total,
  size = 'md',
  showLabel = true,
  strokeWidth,
  className,
}: ProgressRingProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  const sizeConfig = {
    sm: { dimension: 48, defaultStroke: 4, fontSize: 'text-xs' },
    md: { dimension: 64, defaultStroke: 5, fontSize: 'text-sm' },
    lg: { dimension: 96, defaultStroke: 6, fontSize: 'text-lg' },
    xl: { dimension: 128, defaultStroke: 8, fontSize: 'text-2xl' },
  };

  const config = sizeConfig[size];
  const actualStrokeWidth = strokeWidth || config.defaultStroke;
  const radius = (config.dimension - actualStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={config.dimension}
        height={config.dimension}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={actualStrokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={actualStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-neon-green transition-all duration-500 ease-out"
        />
      </svg>
      {showLabel && (
        <span
          className={cn(
            'absolute font-bold text-foreground',
            config.fontSize
          )}
        >
          {percentage}%
        </span>
      )}
    </div>
  );
}

interface ProgressBarProps {
  completed: number;
  total: number;
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  completed,
  total,
  showLabel = true,
  height = 'md',
  className,
}: ProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-mono font-medium">
            {completed}/{total} ({percentage}%)
          </span>
        </div>
      )}
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', heightClasses[height])}>
        <div
          className="h-full bg-neon-green rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

