'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimelineItem } from '@/lib/types';
import { UPDATE_STATUS_LABELS, getChapterColors } from '@/lib/constants';
import { formatDateShort } from '@/lib/date-utils';
import { Button } from '@/components/ui/button';
import { storeTimelineViewState } from '@/lib/url-utils';
import { useTimelineView } from '@/app/timeline/timeline-view-context';

interface TimelineItemsModalProps {
  items: TimelineItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function TimelineItemsModal({ items, isOpen, onClose }: TimelineItemsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { view, gridViewMode } = useTimelineView();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && mounted) {
      // Small delay to ensure DOM is ready, then trigger animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, mounted]);
  
  const handleLinkClick = () => {
    storeTimelineViewState(view, gridViewMode);
  };

  if (!isOpen || !mounted) return null;

  const sortedItems = [...items].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const updateCount = sortedItems.filter(item => item.type === 'update').length;
  const deadlineCount = sortedItems.filter(item => item.type === 'deadline').length;

  const modalContent = (
    <div 
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-300 ease-out",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className={cn(
          "bg-card rounded-lg border shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col transition-all duration-300 ease-out",
          isVisible 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-4"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="font-semibold text-lg">
              {sortedItems.length} items this week
            </h2>
            <div className="text-sm text-muted-foreground mt-1">
              {updateCount > 0 && `${updateCount} update${updateCount !== 1 ? 's' : ''}`}
              {updateCount > 0 && deadlineCount > 0 && ' • '}
              {deadlineCount > 0 && `${deadlineCount} deadline${deadlineCount !== 1 ? 's' : ''}`}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-3">
          {sortedItems.map((item, idx) => {
            const chapterColors = getChapterColors(item.recommendation.chapter_id);
            
            if (item.type === 'update' && item.update) {
              return (
                <Link
                  key={idx}
                  href={`/recommendation/${item.recommendation.id}/update/${item.update.date}`}
                  onClick={handleLinkClick}
                  className={cn(
                    'block p-3 rounded-lg border transition-colors hover:shadow-sm',
                    chapterColors.bg,
                    chapterColors.border
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('font-mono font-semibold text-sm', chapterColors.text)}>
                          {item.recommendation.code}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Chapter {item.recommendation.chapter_id}
                        </span>
                      </div>
                      <div className="font-medium text-sm mb-1">
                        {item.update.title}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {formatDateShort(item.update.date)} • {UPDATE_STATUS_LABELS[item.update.status]}
                      </div>
                      {item.update.description && (
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {item.update.description}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            } else if (item.type === 'deadline' && item.deadline) {
              return (
                <Link
                  key={idx}
                  href={`/recommendation/${item.recommendation.id}`}
                  onClick={handleLinkClick}
                  className={cn(
                    'block p-3 rounded-lg border transition-colors hover:shadow-sm',
                    chapterColors.bg,
                    chapterColors.border
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('font-mono font-semibold text-sm', chapterColors.text)}>
                          {item.recommendation.code}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Chapter {item.recommendation.chapter_id}
                        </span>
                      </div>
                      <div className="font-medium text-sm mb-1">
                        Deadline
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {formatDateShort(item.date)}
                        {item.deadline.isOverdue && (
                          <span className="text-deep-red ml-1">(Overdue)</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.recommendation.titles.short}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

