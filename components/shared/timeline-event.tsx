'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Update, Recommendation, TimelineItem } from '@/lib/types';
import { formatDate } from '@/lib/date-utils';
import { StatusBadge } from './status-badge';
import { DeadlineIndicator } from './deadline-indicator';
import { DeadlineChangeBadge } from './deadline-change-badge';
import { ExternalLink, FileText, Calendar, ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

function TimelineUpdateEvent({
  item,
  update,
  recommendation,
  date,
  showRecommendation,
  isLast,
  isSignificant,
  className,
  onTagClick,
}: {
  item: TimelineItem;
  update: Update;
  recommendation: Recommendation;
  date: string;
  showRecommendation: boolean;
  isLast: boolean;
  isSignificant: boolean;
  className?: string;
  onTagClick?: (tag: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(isSignificant);

  const details = (
    <>
      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {update.description}
      </p>

      {/* Deadline change indicator */}
      {update.tags?.includes('deadline_change') &&
       recommendation.delivery_timeline.revised_target_date &&
       recommendation.delivery_timeline.revised_target_date !== recommendation.delivery_timeline.target_date && (
        <div className="mb-3">
          <DeadlineChangeBadge
            originalDate={recommendation.delivery_timeline.target_date}
            revisedDate={recommendation.delivery_timeline.revised_target_date}
          />
        </div>
      )}

      {/* Tags */}
      {update.tags && update.tags.filter(t => t !== 'deadline_change').length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {update.tags.filter(t => t !== 'deadline_change').map((tag) => (
            <button
              key={tag}
              onClick={onTagClick ? () => onTagClick(tag) : undefined}
              className={cn(
                'inline-flex items-center px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded transition-colors',
                onTagClick && 'cursor-pointer hover:bg-primary/10 hover:text-primary'
              )}
            >
              #{tag}
            </button>
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
    </>
  );

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

      <div className={cn(isSignificant ? 'pb-6' : 'pb-4')}>
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <time className="text-sm font-mono text-muted-foreground">
            {formatDate(date)}
          </time>
          <StatusBadge status={update.status} type="update" size="sm" />
          {!isSignificant && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown size={14} className={cn('transition-transform', isExpanded && 'rotate-180')} />
            </button>
          )}
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
        <Link
          href={`/recommendation/${recommendation.id}/update/${update.date}`}
          className="block"
        >
          <h4 className={cn(
            'font-semibold text-foreground hover:text-primary transition-colors cursor-pointer',
            isExpanded && 'mb-1.5'
          )}>
            {update.title}
          </h4>
        </Link>

        {/* Collapsible details */}
        {isExpanded && details}
      </div>
    </div>
  );
}

interface TimelineEventProps {
  item: TimelineItem;
  showRecommendation?: boolean;
  isLast?: boolean;
  className?: string;
  onTagClick?: (tag: string) => void;
}

export function TimelineEvent({
  item,
  showRecommendation = false,
  isLast = false,
  className,
  onTagClick,
}: TimelineEventProps) {
  const { type, date, update, recommendation, deadline } = item;
  
  // Render deadline item
  if (type === 'deadline' && deadline) {
    return (
      <div className={cn('relative pl-6', className)}>
        {/* Timeline line */}
        {!isLast && (
          <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-border" />
        )}
        
        {/* Timeline dot - different style for deadlines */}
        <div className="absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full bg-card border-2 border-orange flex items-center justify-center">
          <Calendar className="w-2.5 h-2.5 text-orange" />
        </div>

        <div className="pb-6">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <time className="text-sm font-mono text-muted-foreground">
              {formatDate(date)}
            </time>
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-orange/10 text-orange rounded border border-orange/30">
              Deadline
            </span>
          </div>

          {/* Recommendation link */}
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
          <h4 className="font-semibold text-foreground mb-1.5">
            Target Deadline: {recommendation.titles.short}
          </h4>

          {/* Deadline indicator */}
          <div className="mb-3">
            <DeadlineIndicator
              targetDate={deadline.targetDate}
              revisedDate={deadline.revisedDate}
              size="md"
              showLabel={true}
            />
          </div>

          {/* TODO: re-check timeline notes and re-add here if needed */}
          {/* Timeline notes if available 
          {recommendation.delivery_timeline.notes && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {recommendation.delivery_timeline.notes}
            </p>
          )} */}

          {/* Original timeline text - only show if there's a revised date that's different */}
          {recommendation.delivery_timeline.original_text && 
           deadline.revisedDate && 
           deadline.revisedDate !== deadline.targetDate && (
            <div className="mt-2 p-2 bg-muted/50 rounded-md text-sm text-muted-foreground border-l-2 border-orange">
              <span className="font-medium text-foreground">Original timeline: </span>
              {recommendation.delivery_timeline.original_text}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Render deadline moved marker
  if (type === 'deadline_moved' && deadline?.revisedDate) {
    return (
      <div className={cn('relative pl-6', className)}>
        {!isLast && (
          <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-border" />
        )}
        <div className="absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full bg-card border-2 border-muted-foreground/40 flex items-center justify-center">
          <Calendar className="w-2.5 h-2.5 text-muted-foreground/60" />
        </div>
        <div className="pb-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <time className="font-mono">{formatDate(date)}</time>
            <span className="text-muted-foreground/50">|</span>
            <Link
              href={`/recommendation/${recommendation.id}`}
              className="font-mono font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {recommendation.code}
            </Link>
            <span>deadline moved</span>
            <ArrowRight size={12} />
            <span className="font-mono font-medium">{formatDate(deadline.revisedDate)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Render update item
  if (type === 'update' && update) {
    const isSignificant = !!update.impact_on_overall?.changes_overall_status_to ||
      !!update.tags?.includes('deadline_change');

    return (
      <TimelineUpdateEvent
        item={item}
        update={update}
        recommendation={recommendation}
        date={date}
        showRecommendation={showRecommendation}
        isLast={isLast}
        isSignificant={isSignificant}
        className={className}
        onTagClick={onTagClick}
      />
    );
  }
  
  return null;
}

interface TimelineProps {
  items: TimelineItem[];
  showRecommendations?: boolean;
  className?: string;
  onTagClick?: (tag: string) => void;
}

export function Timeline({
  items,
  showRecommendations = false,
  className,
  onTagClick,
}: TimelineProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No timeline items yet
      </div>
    );
  }

  return (
    <div className={cn('', className)}>
      {items.map((item, index) => (
        <TimelineEvent
          key={`${item.type}-${item.recommendation.id}-${item.date}-${index}`}
          item={item}
          showRecommendation={showRecommendations}
          isLast={index === items.length - 1}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}

