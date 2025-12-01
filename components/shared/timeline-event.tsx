'use client';

import { cn } from '@/lib/utils';
import { Update, Recommendation } from '@/lib/types';
import { formatDate } from '@/lib/date-utils';
import { StatusBadge } from './status-badge';
import { ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

interface TimelineEventProps {
  update: Update;
  recommendation?: Recommendation;
  showRecommendation?: boolean;
  isLast?: boolean;
  className?: string;
}

export function TimelineEvent({
  update,
  recommendation,
  showRecommendation = false,
  isLast = false,
  className,
}: TimelineEventProps) {
  return (
    <div className={cn('relative pl-6', className)}>
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-border" />
      )}
      
      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full bg-card border-2 border-primary flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>

      <div className="pb-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <time className="text-sm font-mono text-muted-foreground">
            {formatDate(update.date)}
          </time>
          <StatusBadge status={update.status} type="update" size="sm" />
        </div>

        {/* Recommendation link if showing */}
        {showRecommendation && recommendation && (
          <Link
            href={`/recommendation/${recommendation.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-2"
          >
            <span className="font-mono">{recommendation.code}</span>
            <span className="text-muted-foreground">•</span>
            <span>{recommendation.titles.short}</span>
          </Link>
        )}

        {/* Title */}
        <h4 className="font-semibold text-foreground mb-1">{update.title}</h4>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {update.description}
        </p>

        {/* Tags */}
        {update.tags && update.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {update.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {update.links && update.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {update.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-light-blue hover:text-dark-blue transition-colors"
              >
                <ExternalLink size={14} />
                {link.title}
              </a>
            ))}
          </div>
        )}

        {/* Source */}
        {update.source && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <FileText size={12} />
            <span>
              {update.source.type}
              {update.source.reference && ` • ${update.source.reference}`}
            </span>
          </div>
        )}

        {/* Impact note */}
        {update.impact_on_overall?.notes && (
          <div className="mt-3 p-2 bg-muted/50 rounded-md text-sm text-muted-foreground border-l-2 border-primary">
            {update.impact_on_overall.notes}
          </div>
        )}
      </div>
    </div>
  );
}

interface TimelineProps {
  updates: Array<{ update: Update; recommendation?: Recommendation }>;
  showRecommendations?: boolean;
  className?: string;
}

export function Timeline({
  updates,
  showRecommendations = false,
  className,
}: TimelineProps) {
  if (updates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No updates yet
      </div>
    );
  }

  return (
    <div className={cn('', className)}>
      {updates.map((item, index) => (
        <TimelineEvent
          key={`${item.recommendation?.id}-${item.update.date}-${index}`}
          update={item.update}
          recommendation={item.recommendation}
          showRecommendation={showRecommendations}
          isLast={index === updates.length - 1}
        />
      ))}
    </div>
  );
}

