import 'server-only';
import { TimelineItem, Recommendation } from './types';
import { getTimelineItems, getRecommendations } from './data';

export interface WeekInfo {
  weekStart: string; // ISO date string
  weekEnd: string; // ISO date string
  weekLabel: string;
  weekKey: string;
}

export interface TimelineGridCell {
  items: TimelineItem[];
  owner: string;
  weekKey: string;
}

export interface MonthGroup {
  monthLabel: string;
  monthKey: string;
  weekIndices: number[]; // indices into the weeks array
  year: number;
}

export interface YearGroup {
  year: number;
  monthIndices: number[]; // indices into the monthGroups array
}

export interface RecommendationGridCell {
  items: TimelineItem[];
  recommendationId: number;
  weekKey: string;
}

export interface TimelineGridData {
  weeks: WeekInfo[];
  owners: string[];
  cells: Record<string, TimelineGridCell>; // key: `${owner}-${weekKey}`
  recommendationCells?: Record<string, RecommendationGridCell>; // key: `${recommendationId}-${weekKey}`
  recommendations?: Recommendation[]; // For recommendation view
  weeksWithItems: string[]; // weekKeys that have any items (as array for serialization)
  monthGroups: MonthGroup[];
  yearGroups: YearGroup[];
}

/**
 * Get the start of the week (Monday) for a given date
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const weekStart = new Date(d);
  weekStart.setDate(diff);
  return weekStart;
}

/**
 * Get the end of the week (Sunday) for a given date
 */
function getWeekEnd(weekStart: Date): Date {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  return end;
}

/**
 * Format week label (e.g., "1-7 Jan 2025")
 */
function formatWeekLabel(weekStart: Date, weekEnd: Date): string {
  const startDay = weekStart.getDate();
  const startMonth = weekStart.toLocaleDateString('en-GB', { month: 'short' });
  const endDay = weekEnd.getDate();
  const endMonth = weekEnd.toLocaleDateString('en-GB', { month: 'short' });
  const year = weekStart.getFullYear();
  
  if (startMonth === endMonth) {
    return `${startDay}-${endDay} ${startMonth} ${year}`;
  } else {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
  }
}

/**
 * Generate week key (YYYY-MM-DD format for unique identification)
 */
function getWeekKey(date: Date): string {
  const weekStart = getWeekStart(date);
  const year = weekStart.getFullYear();
  const month = (weekStart.getMonth() + 1).toString().padStart(2, '0');
  const day = weekStart.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get all weeks between start and end dates
 */
function generateWeeks(startDate: Date, endDate: Date): WeekInfo[] {
  const weeks: WeekInfo[] = [];
  const current = getWeekStart(startDate);
  const end = getWeekStart(endDate);
  
  while (current <= end) {
    const weekEnd = getWeekEnd(current);
    weeks.push({
      weekStart: new Date(current).toISOString(),
      weekEnd: new Date(weekEnd).toISOString(),
      weekLabel: formatWeekLabel(current, weekEnd),
      weekKey: getWeekKey(current),
    });
    current.setDate(current.getDate() + 7);
  }
  
  return weeks;
}

/**
 * Get all owners from timeline items (including co-owners)
 */
function getOwnersFromTimelineItems(items: TimelineItem[]): Set<string> {
  const owners = new Set<string>();
  
  for (const item of items) {
    const rec = item.recommendation;
    owners.add(rec.ownership.primary_owner);
    rec.ownership.co_owners?.forEach(o => owners.add(o));
  }
  
  return owners;
}

/**
 * Check if a timeline item belongs to an owner
 */
function itemBelongsToOwner(item: TimelineItem, owner: string): boolean {
  const rec = item.recommendation;
  return rec.ownership.primary_owner === owner || 
         (rec.ownership.co_owners?.includes(owner) ?? false);
}

/**
 * Generate timeline grid data
 */
export async function generateTimelineGrid(
  weeksAhead: number = 52,
  weeksBack: number = 4
): Promise<TimelineGridData> {
  const timelineItems = await getTimelineItems(true);
  
  if (timelineItems.length === 0) {
    return {
      weeks: [],
      owners: [],
      cells: {},
      weeksWithItems: [],
      monthGroups: [],
      yearGroups: [],
    };
  }
  
  // Find date range
  const dates = timelineItems.map(item => new Date(item.date));
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
  
  // Extend range
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(minDate);
  startDate.setDate(startDate.getDate() - (weeksBack * 7));
  
  const endDate = new Date(Math.max(maxDate.getTime(), today.getTime()));
  endDate.setDate(endDate.getDate() + (weeksAhead * 7));
  
  // Generate weeks
  const weeks = generateWeeks(startDate, endDate);
  
  // Get all owners
  const ownerSet = getOwnersFromTimelineItems(timelineItems);
  
  // Get all recommendations to calculate stats
  const allRecommendations = await getRecommendations();
  
  // Calculate stats for each owner and sort
  const ownerStats = Array.from(ownerSet).map(owner => {
    const ownerRecs = allRecommendations.filter(rec => 
      rec.ownership.primary_owner === owner || 
      rec.ownership.co_owners?.includes(owner)
    );
    
    const total = ownerRecs.length;
    const completed = ownerRecs.filter(r => r.overall_status.status === 'completed').length;
    const completionPercent = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      owner,
      completionPercent,
      total,
    };
  });
  
  // Sort by completion percentage (descending), then by total (descending)
  ownerStats.sort((a, b) => {
    if (b.completionPercent !== a.completionPercent) {
      return b.completionPercent - a.completionPercent;
    }
    return b.total - a.total;
  });
  
  const owners = ownerStats.map(s => s.owner);
  
  // Build grid cells and track which weeks have items
  const cells: Record<string, TimelineGridCell> = {};
  const weeksWithItemsSet = new Set<string>();
  
  for (const owner of owners) {
    for (const week of weeks) {
      const weekKey = week.weekKey;
      const cellKey = `${owner}-${weekKey}`;
      
      // Find items in this week for this owner
      const itemsInWeek = timelineItems.filter(item => {
        if (!itemBelongsToOwner(item, owner)) return false;
        
        const itemDate = new Date(item.date);
        const weekStart = new Date(week.weekStart);
        const weekEnd = new Date(week.weekEnd);
        weekEnd.setHours(23, 59, 59, 999); // Include end of day
        
        return itemDate >= weekStart && itemDate <= weekEnd;
      });
      
      if (itemsInWeek.length > 0) {
        cells[cellKey] = {
          items: itemsInWeek,
          owner,
          weekKey,
        };
        weeksWithItemsSet.add(weekKey);
      }
    }
  }
  
  // Convert Set to array for serialization
  const weeksWithItems = Array.from(weeksWithItemsSet);
  
  // Build recommendation-based cells for recommendation view
  const recommendationCells: Record<string, RecommendationGridCell> = {};
  const uniqueRecommendations = new Map<number, Recommendation>();
  
  // Collect unique recommendations from timeline items
  for (const item of timelineItems) {
    const rec = item.recommendation;
    if (!uniqueRecommendations.has(rec.id)) {
      uniqueRecommendations.set(rec.id, rec);
    }
  }
  
  const recommendations = Array.from(uniqueRecommendations.values()).sort((a, b) => {
    // Sort by code (R01, R02, etc.)
    return a.code.localeCompare(b.code);
  });
  
  // Build cells for each recommendation
  for (const rec of recommendations) {
    for (const week of weeks) {
      const weekKey = week.weekKey;
      const cellKey = `${rec.id}-${weekKey}`;
      
      // Find items in this week for this recommendation
      const itemsInWeek = timelineItems.filter(item => {
        if (item.recommendation.id !== rec.id) return false;
        
        const itemDate = new Date(item.date);
        const weekStart = new Date(week.weekStart);
        const weekEnd = new Date(week.weekEnd);
        weekEnd.setHours(23, 59, 59, 999);
        
        return itemDate >= weekStart && itemDate <= weekEnd;
      });
      
      if (itemsInWeek.length > 0) {
        recommendationCells[cellKey] = {
          items: itemsInWeek,
          recommendationId: rec.id,
          weekKey,
        };
        weeksWithItemsSet.add(weekKey);
      }
    }
  }
  
  // Group weeks by month
  const monthGroups: MonthGroup[] = [];
  let currentMonth: MonthGroup | null = null;
  
  weeks.forEach((week, index) => {
    const weekStart = new Date(week.weekStart);
    const year = weekStart.getFullYear();
    const monthKey = `${year}-${(weekStart.getMonth() + 1).toString().padStart(2, '0')}`;
    const monthLabel = weekStart.toLocaleDateString('en-GB', { month: 'long' }); // Remove year from label
    
    if (!currentMonth || currentMonth.monthKey !== monthKey) {
      if (currentMonth) {
        monthGroups.push(currentMonth);
      }
      currentMonth = {
        monthLabel,
        monthKey,
        weekIndices: [index],
        year,
      };
    } else {
      currentMonth.weekIndices.push(index);
    }
  });
  
  if (currentMonth) {
    monthGroups.push(currentMonth);
  }
  
  // Group months by year
  const yearGroups: YearGroup[] = [];
  let currentYear: YearGroup | null = null;
  
  monthGroups.forEach((month, index) => {
    if (!currentYear || currentYear.year !== month.year) {
      if (currentYear) {
        yearGroups.push(currentYear);
      }
      currentYear = {
        year: month.year,
        monthIndices: [index],
      };
    } else {
      currentYear.monthIndices.push(index);
    }
  });
  
  if (currentYear) {
    yearGroups.push(currentYear);
  }
  
  return {
    weeks,
    owners,
    cells,
    recommendationCells,
    recommendations,
    weeksWithItems,
    monthGroups,
    yearGroups,
  };
}

