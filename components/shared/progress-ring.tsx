'use client';

import { cn } from '@/lib/utils';
import { Atom } from 'lucide-react';

interface ProgressRingProps {
  completed: number;
  onTrack?: number;
  offTrack?: number;
  total: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({
  completed,
  onTrack = 0,
  offTrack = 0,
  total,
  size = 'md',
  showLabel = true,
  strokeWidth,
  className,
}: ProgressRingProps) {
  const completedPercentage = total === 0 ? 0 : (completed / total) * 100;
  const onTrackPercentage = total === 0 ? 0 : (onTrack / total) * 100;
  const offTrackPercentage = total === 0 ? 0 : (offTrack / total) * 100;
  const completedDisplay = Math.round(completedPercentage);
  
  const sizeConfig = {
    sm: { dimension: 48, defaultStroke: 4, fontSize: 'text-xs', iconSize: 16 },
    md: { dimension: 64, defaultStroke: 5, fontSize: 'text-sm', iconSize: 20 },
    lg: { dimension: 96, defaultStroke: 6, fontSize: 'text-lg', iconSize: 28 },
    xl: { dimension: 128, defaultStroke: 12, fontSize: 'text-2xl', iconSize: 36 },
  };

  const config = sizeConfig[size];
  const actualStrokeWidth = strokeWidth || config.defaultStroke;
  const radius = (config.dimension - actualStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Calculate dash lengths for each segment
  const completedDash = (completedPercentage / 100) * circumference;
  const onTrackDash = (onTrackPercentage / 100) * circumference;
  const offTrackDash = (offTrackPercentage / 100) * circumference;

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
        {/* Completed segment */}
        {completed > 0 && (
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={actualStrokeWidth}
            strokeDasharray={`${completedDash} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="butt"
            className="text-neon-green transition-all duration-500 ease-out"
          />
        )}
        {/* On Track segment */}
        {onTrack > 0 && (
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={actualStrokeWidth}
            strokeDasharray={`${onTrackDash} ${circumference}`}
            strokeDashoffset={-completedDash}
            strokeLinecap="butt"
            className="text-dark-green/30 transition-all duration-500 ease-out"
          />
        )}
        {/* Off Track segment */}
        {offTrack > 0 && (
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={actualStrokeWidth}
            strokeDasharray={`${offTrackDash} ${circumference}`}
            strokeDashoffset={-(completedDash + onTrackDash)}
            strokeLinecap="butt"
            className="text-deep-red/30 transition-all duration-500 ease-out"
          />
        )}
      </svg>
      {showLabel ? (
        <span
          className={cn(
            'absolute font-bold text-foreground',
            config.fontSize
          )}
        >
          {completedDisplay}%
        </span>
      ) : (
        <Atom
          className="absolute text-dark-green"
          size={config.iconSize}
        />
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

