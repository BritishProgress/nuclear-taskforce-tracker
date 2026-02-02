'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TimelineGridData, TimelineGridCell, RecommendationGridCell, YearGroup } from '@/lib/timeline-grid';
import { UPDATE_STATUS_LABELS, OWNER_FULL_NAMES } from '@/lib/constants';
import { Calendar, Clock, AlertCircle, CheckCircle2, TrendingUp, Info, AlertTriangle, Ban, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { formatDateShort } from '@/lib/date-utils';
import { TimelineItemsModal } from './timeline-items-modal';
import { TimelineGridViewToggle } from '@/app/timeline/timeline-grid-view-toggle';
import { useTimelineView } from '@/app/timeline/timeline-view-context';
import { storeTimelineViewState } from '@/lib/url-utils';

const MobileContext = createContext(false);

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
}

interface TimelineGridProps {
  data: TimelineGridData;
  viewMode?: 'departments' | 'recommendations';
}

// Component to handle mobile tap behavior: first tap shows tooltip, second tap navigates
function MobileAwareIconLink({
  href,
  children,
  className,
  tooltipContent
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  tooltipContent: React.ReactNode;
}) {
  const { view, gridViewMode } = useTimelineView();
  const [hasTapped, setHasTapped] = useState(false);
  const isMobile = useContext(MobileContext);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Store timeline view state before navigation
    storeTimelineViewState(view, gridViewMode);
    
    if (isMobile) {
      if (!hasTapped) {
        // First tap on mobile: prevent navigation, show tooltip
        e.preventDefault();
        e.stopPropagation();
        setHasTapped(true);
        setTooltipOpen(true);
        // Reset after a delay so second tap can navigate
        setTimeout(() => {
          setHasTapped(false);
          setTooltipOpen(false);
        }, 3000);
      }
      // Second tap: allow Link to navigate naturally (don't prevent default)
    }
    // Desktop: normal behavior (navigate immediately via Link)
  };

  // Always control the tooltip to avoid controlled/uncontrolled warning
  // On mobile: control programmatically, on desktop: let it follow hover
  const handleOpenChange = (open: boolean) => {
    if (!isMobile) {
      // On desktop, allow normal hover behavior
      setTooltipOpen(open);
    }
    // On mobile, we control it programmatically, so ignore this
  };
  
  return (
    <Tooltip 
      open={tooltipOpen} 
      onOpenChange={handleOpenChange}
      delayDuration={200}
    >
      <TooltipTrigger asChild>
        <Link
          href={href}
          onClick={handleClick}
          className={className}
        >
          {children}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
}

const UPDATE_STATUS_ICONS = {
  info: Info,
  progress: TrendingUp,
  risk: AlertTriangle,
  on_track: CheckCircle2,
  off_track: AlertCircle,
  completed: CheckCircle,
  blocked: Ban,
};

function TimelineCell({ cell, hasItems, isMonthEnd, isYearEnd, isEven }: { cell: TimelineGridCell | null; hasItems: boolean; isMonthEnd: boolean; isYearEnd?: boolean; isEven?: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cellWidth = hasItems ? 'min-w-[50px]' : 'min-w-[12px]';
  
  if (!cell || cell.items.length === 0) {
    return (
      <td className={cn(
        'p-0.5 relative',
        cellWidth,
        isYearEnd && 'border-r-2 border-border',
        isMonthEnd && !isYearEnd && 'border-r border-border/50',
        isEven ? 'bg-background' : 'bg-muted/30'
      )}>
        <div className="h-12"></div>
      </td>
    );
  }
  
  const sortedItems = [...cell.items].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // If more than 2 items, show count badge
  if (sortedItems.length > 2) {
    return (
      <>
        <td className={cn(
          'p-0.5 relative align-top',
          cellWidth,
          isYearEnd && 'border-r-2 border-border',
          isMonthEnd && !isYearEnd && 'border-r border-border/50',
          isEven ? 'bg-background' : 'bg-muted/30'
        )}>
          {/* Number badge on top of line */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-2.5 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold border-2 border-primary/40 cursor-pointer hover:bg-primary/30 transition-colors shadow-sm"
                >
                  {sortedItems.length}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="text-xs">
                  {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''} - click to view
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </td>
        <TimelineItemsModal 
          items={sortedItems} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </>
    );
  }
  
  return (
    <td className={cn(
      'p-0.5 relative align-top',
      cellWidth,
      isYearEnd && 'border-r-2 border-border',
      isMonthEnd && !isYearEnd && 'border-r border-border/50',
      isEven ? 'bg-background' : 'bg-muted/30'
    )}>
      {/* Icons on top of line */}
      <div className="absolute inset-0 flex items-center justify-center gap-1 flex-row z-0 px-0.5">
        {sortedItems.map((item, idx) => {
          if (item.type === 'update' && item.update) {
            const Icon = UPDATE_STATUS_ICONS[item.update.status] || Info;
            const statusColor = 
              item.update.status === 'completed' ? 'text-neon-green' :
              item.update.status === 'progress' ? 'text-orange' :
              item.update.status === 'risk' ? 'text-deep-red' :
              item.update.status === 'on_track' ? 'text-dark-green' :
              item.update.status === 'off_track' ? 'text-deep-red' :
              item.update.status === 'blocked' ? 'text-dark-blue' :
              'text-light-blue';
            
            const tooltipContent = (
              <div className="space-y-1">
                <div className="font-semibold text-sm">
                  {item.recommendation.code}: {item.update.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDateShort(item.date)} • {UPDATE_STATUS_LABELS[item.update.status]}
                </div>
                {item.update.description && (
                  <div className="text-xs mt-1 line-clamp-2">
                    {item.update.description}
                  </div>
                )}
              </div>
            );

            return (
              <MobileAwareIconLink
                key={`${item.date}-${item.recommendation.id}-${idx}`}
                href={`/recommendation/${item.recommendation.id}/update/${item.update.date}`}
                className={cn(
                  'inline-flex items-center justify-center transition-all hover:scale-110',
                  statusColor
                )}
                tooltipContent={tooltipContent}
              >
                <Icon size={22} className="drop-shadow-md" />
              </MobileAwareIconLink>
            );
          } else if (item.type === 'deadline' && item.deadline) {
            const deadlineColor = item.deadline.isOverdue ? 'text-deep-red' : 'text-charcoal';
            const tooltipContent = (
              <div className="space-y-1">
                <div className="font-semibold text-sm">
                  {item.recommendation.code}: Deadline
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDateShort(item.date)}
                  {item.deadline.isOverdue && (
                    <span className="text-deep-red ml-1">(Overdue)</span>
                  )}
                </div>
                <div className="text-xs">
                  {item.recommendation.titles.short}
                </div>
              </div>
            );

            return (
              <MobileAwareIconLink
                key={`${item.date}-${item.recommendation.id}-deadline`}
                href={`/recommendation/${item.recommendation.id}`}
                className={cn(
                  'inline-flex items-center justify-center transition-all hover:scale-110',
                  deadlineColor
                )}
                tooltipContent={tooltipContent}
              >
                <Clock size={22} className="drop-shadow-md" />
              </MobileAwareIconLink>
            );
          }
          return null;
        })}
      </div>
    </td>
  );
}

function RecommendationCell({ cell, hasItems, isMonthEnd, isYearEnd, isEven }: { cell: RecommendationGridCell | null; hasItems: boolean; isMonthEnd: boolean; isYearEnd?: boolean; isEven?: boolean }) {
  // Convert RecommendationGridCell to TimelineGridCell format for TimelineCell component
  const timelineCell: TimelineGridCell | null = cell ? {
    items: cell.items,
    owner: '', // Not used for recommendation view
    weekKey: cell.weekKey,
  } : null;
  return <TimelineCell cell={timelineCell} hasItems={hasItems} isMonthEnd={isMonthEnd} isYearEnd={isYearEnd} isEven={isEven} />;
}

export function TimelineGrid({ data, viewMode = 'departments' }: TimelineGridProps) {
  const { weeks, owners, cells, recommendationCells, recommendations, weeksWithItems, monthGroups, yearGroups } = data;
  const { view, gridViewMode, setGridViewMode } = useTimelineView();
  const isMobile = useMobile();
  
  // Use gridViewMode from context if available, otherwise fall back to prop
  const activeViewMode = gridViewMode || viewMode;
  const isRecommendationView = activeViewMode === 'recommendations';
  const hasData = isRecommendationView 
    ? (weeks.length > 0 && recommendations && recommendations.length > 0)
    : (weeks.length > 0 && owners.length > 0);
  
  if (!hasData) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg">No timeline data available.</p>
      </div>
    );
  }
  
  // Create a map of week indices to month end flags
  const weekMonthEndMap = new Map<number, boolean>();
  monthGroups.forEach((month) => {
    const lastWeekIndex = month.weekIndices[month.weekIndices.length - 1];
    weekMonthEndMap.set(lastWeekIndex, true);
  });
  
  // Create a map of week indices to year end flags
  const weekYearEndMap = new Map<number, boolean>();
  yearGroups.forEach((yearGroup) => {
    // Find the last week index of the last month in this year
    const lastMonthIdx = yearGroup.monthIndices[yearGroup.monthIndices.length - 1];
    const lastMonth = monthGroups[lastMonthIdx];
    const lastWeekIndex = lastMonth.weekIndices[lastMonth.weekIndices.length - 1];
    weekYearEndMap.set(lastWeekIndex, true);
  });
  
  // Calculate total weeks per year for colspan
  const getYearColspan = (yearGroup: YearGroup): number => {
    return yearGroup.monthIndices.reduce((sum, monthIdx) => {
      return sum + monthGroups[monthIdx].weekIndices.length;
    }, 0);
  };
  
  // Render table header (shared between both views)
  const renderTableHeader = (label: string) => (
    <thead>
      {/* Year header row */}
      <tr>
        <th className="sticky left-0 top-0 z-[100] p-1 sm:p-2 bg-muted border-r border-border"></th>
        {yearGroups.map((yearGroup) => (
          <th
            key={yearGroup.year}
            colSpan={getYearColspan(yearGroup)}
            className="sticky top-0 z-[100] p-2 bg-muted text-center font-bold text-sm border-r border-border/50"
          >
            {yearGroup.year}
          </th>
        ))}
      </tr>
      {/* Month header row */}
      <tr>
        <th className="sticky left-0 z-[100] p-1 sm:p-2 bg-muted border-r border-border -mt-px"></th>
        {monthGroups.map((month, monthIdx) => {
          const lastWeekIndex = month.weekIndices[month.weekIndices.length - 1];
          const isYearEnd = weekYearEndMap.get(lastWeekIndex) || false;
          return (
            <th
              key={month.monthKey}
              colSpan={month.weekIndices.length}
              className={cn(
                "p-2 bg-muted text-center font-semibold text-xs border-r -mt-px",
                isYearEnd ? "border-r-2 border-border" : "border-border/50"
              )}
            >
              {month.monthLabel}
            </th>
          );
        })}
      </tr>
      {/* Week header row */}
      <tr>
        <th className="sticky left-0 z-[100] p-2 bg-muted border-r border-border text-left font-semibold text-sm min-w-[160px] border-t-0">
          {label}
        </th>
        {weeks.map((week, idx) => {
          const hasItems = weeksWithItems.includes(week.weekKey);
          const weekWidth = hasItems ? 'min-w-[50px]' : 'min-w-[12px]';
          const isMonthEnd = weekMonthEndMap.get(idx) || false;
          const isYearEnd = weekYearEndMap.get(idx) || false;
          return (
            <th
              key={week.weekKey}
              className={cn(
                'p-1 bg-muted/30 text-center',
                'hover:bg-muted/50 transition-colors',
                weekWidth,
                isYearEnd && 'border-r-2 border-border',
                isMonthEnd && !isYearEnd && 'border-r border-border/50'
              )}
              title={`${week.weekLabel} (${week.weekKey})`}
            >
              <div className="w-full h-8 flex items-center justify-center">
                <div className={cn(
                  'rounded-full bg-muted-foreground/40',
                  hasItems ? 'w-1.5 h-1.5' : 'w-1 h-1'
                )}></div>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );

  return (
    <MobileContext.Provider value={isMobile}>
    <div className="w-full">
      <div className="mb-2 flex justify-end">
        <TimelineGridViewToggle mode={activeViewMode} onModeChange={setGridViewMode} />
      </div>
      <div className="relative overflow-x-auto overflow-y-auto w-full max-h-[calc(100vh-200px)]">
        {/* Departments View */}
        {!isRecommendationView && (
        <div className="opacity-100 translate-x-0">
          <div className="inline-block min-w-full">
            <table className="border-collapse w-full border-spacing-0">
              {renderTableHeader('Department/Owner')}
              <tbody>
                {owners.map((owner, ownerIdx) => {
                  const isEven = ownerIdx % 2 === 0;
                  return (
                    <tr 
                      key={owner} 
                      className={cn(
                        "hover:bg-muted/20 transition-colors border-b border-border/30",
                        isEven ? "bg-background" : "bg-muted/30"
                      )}
                    >
                      <td className={cn(
                        "sticky left-0 z-[100] p-2 border-r border-border font-medium text-sm",
                        "bg-muted"
                      )}>
                        <div className="font-semibold text-xs">{owner}</div>
                      </td>
                      {weeks.map((week, weekIdx) => {
                        const cellKey = `${owner}-${week.weekKey}`;
                        const cell = cells[cellKey] || null;
                        const hasItems = weeksWithItems.includes(week.weekKey);
                        const isMonthEnd = weekMonthEndMap.get(weekIdx) || false;
                        const isYearEnd = weekYearEndMap.get(weekIdx) || false;
                        return (
                          <TimelineCell
                            key={`${owner}-${week.weekKey}`}
                            cell={cell}
                            hasItems={hasItems}
                            isMonthEnd={isMonthEnd}
                            isYearEnd={isYearEnd}
                            isEven={isEven}
                          />
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Recommendations View */}
        {isRecommendationView && (
        <div className="opacity-100 translate-x-0">
          <div className="inline-block min-w-full">
            <table className="border-collapse w-full border-spacing-0">
              {renderTableHeader('Recommendation')}
              <tbody>
                {recommendations?.map((rec, recIdx) => {
                  const isEven = recIdx % 2 === 0;
                  return (
                    <tr 
                      key={rec.id} 
                      className={cn(
                        "hover:bg-muted/20 transition-colors border-b border-border/30",
                        isEven ? "bg-background" : "bg-muted/30"
                      )}
                    >
                      <td className={cn(
                        "sticky left-0 z-[100] p-2 border-r border-border font-medium text-sm",
                        "bg-muted"
                      )}>
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/recommendation/${rec.id}`}
                              className="block space-y-0.5 hover:opacity-80 transition-opacity"
                              onClick={() => {
                                storeTimelineViewState(view, gridViewMode);
                              }}
                            >
                              <div className="font-mono font-semibold text-xs">{rec.code}</div>
                              <div className="text-[10px] text-muted-foreground line-clamp-1">
                                {rec.titles.short}
                              </div>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <div className="space-y-1">
                              <div className="font-semibold text-sm">{rec.code}</div>
                              <div className="text-xs">{rec.titles.long}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      {weeks.map((week, weekIdx) => {
                        const cellKey = `${rec.id}-${week.weekKey}`;
                        const cell = recommendationCells?.[cellKey] || null;
                        const hasItems = weeksWithItems.includes(week.weekKey);
                        const isMonthEnd = weekMonthEndMap.get(weekIdx) || false;
                        const isYearEnd = weekYearEndMap.get(weekIdx) || false;
                        return (
                          <RecommendationCell
                            key={`${rec.id}-${week.weekKey}`}
                            cell={cell}
                            hasItems={hasItems}
                            isMonthEnd={isMonthEnd}
                            isYearEnd={isYearEnd}
                            isEven={isEven}
                          />
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
    </MobileContext.Provider>
  );
}

