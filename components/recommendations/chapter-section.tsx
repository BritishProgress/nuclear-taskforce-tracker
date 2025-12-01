'use client';

import { cn } from '@/lib/utils';
import { Chapter, Recommendation } from '@/lib/types';
import { getChapterColors } from '@/lib/constants';
import { RecommendationCard } from './recommendation-card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ChapterSectionProps {
  chapter: Chapter;
  recommendations: Recommendation[];
  defaultOpen?: boolean;
  className?: string;
}

export function ChapterSection({
  chapter,
  recommendations,
  defaultOpen = true,
  className,
}: ChapterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const colors = getChapterColors(chapter.id);

  // Calculate stats
  const completed = recommendations.filter(r => r.overall_status.status === 'completed').length;
  const onTrack = recommendations.filter(r => r.overall_status.status === 'on_track').length;
  const offTrack = recommendations.filter(r => r.overall_status.status === 'off_track').length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            'w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200',
            'hover:shadow-sm',
            colors.bg,
            colors.border,
            isOpen && 'rounded-b-none border-b-0'
          )}
        >
          <div className="flex items-center gap-3">
            {isOpen ? (
              <ChevronDown className={cn('h-5 w-5', colors.text)} />
            ) : (
              <ChevronRight className={cn('h-5 w-5', colors.text)} />
            )}
            <div className="text-left">
              <h2 className={cn('font-display font-bold text-lg', colors.text)}>
                Chapter {chapter.id}: {chapter.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex items-center gap-2">
            {completed > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-dark-green/10 text-dark-green">
                {completed} done
              </span>
            )}
            {onTrack > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-dark-green/10 text-dark-green">
                {onTrack} on track
              </span>
            )}
            {offTrack > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-deep-red/10 text-deep-red">
                {offTrack} off track
              </span>
            )}
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div
          className={cn(
            'p-4 rounded-b-lg border border-t-0',
            colors.border,
            'bg-card'
          )}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recommendations.map((rec, index) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                variant="compact"
                className="animate-scale-in opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              />
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

