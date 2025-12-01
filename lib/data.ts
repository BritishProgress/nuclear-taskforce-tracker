import 'server-only';
import { loadTaskforceData } from './yaml';
import {
  TaskforceData,
  Recommendation,
  Chapter,
  Proposal,
  OverallStatus,
  StatusCounts,
  UpcomingDeadline,
  RecentUpdate,
  ChapterWithRecommendations,
  TimelineItem,
} from './types';

// Re-export date utilities for convenience (these are also in date-utils.ts for client use)
export { formatDate, formatDateShort, daysUntil, isOverdue, getDeadlineStatus } from './date-utils';

// ========================================
// DATA FETCHING (Server Only)
// ========================================

export async function getAllData(): Promise<TaskforceData> {
  return loadTaskforceData();
}

export async function getRecommendations(): Promise<Recommendation[]> {
  const data = await loadTaskforceData();
  return data.recommendations;
}

export async function getChapters(): Promise<Chapter[]> {
  const data = await loadTaskforceData();
  // Extract unique chapters from recommendations
  const chapterMap = new Map<number, Chapter>();
  
  for (const rec of data.recommendations) {
    if (!chapterMap.has(rec.chapter.number)) {
      chapterMap.set(rec.chapter.number, {
        id: rec.chapter.number,
        title: rec.chapter.title,
      });
    }
  }
  
  return Array.from(chapterMap.values()).sort((a, b) => a.id - b.id);
}

export async function getProposals(): Promise<Proposal[]> {
  const data = await loadTaskforceData();
  return data.proposals;
}

// ========================================
// SINGLE ITEM FETCHING
// ========================================

export async function getRecommendationById(id: number): Promise<Recommendation | null> {
  const data = await loadTaskforceData();
  const recommendation = data.recommendations.find(r => r.id === id);
  return recommendation || null;
}

export async function getRecommendationByCode(code: string): Promise<Recommendation | null> {
  const data = await loadTaskforceData();
  const recommendation = data.recommendations.find(r => r.code === code);
  return recommendation || null;
}

export async function getChapterById(id: number): Promise<ChapterWithRecommendations | null> {
  const data = await loadTaskforceData();
  const recommendations = data.recommendations.filter(r => r.chapter.number === id);
  
  if (recommendations.length === 0) return null;
  
  return {
    id: recommendations[0].chapter.number,
    title: recommendations[0].chapter.title,
    recommendations,
  };
}

// ========================================
// FILTERED QUERIES
// ========================================

export async function getRecommendationsByChapter(chapterId: number): Promise<Recommendation[]> {
  const data = await loadTaskforceData();
  return data.recommendations.filter(r => r.chapter.number === chapterId);
}

export async function getRecommendationsByStatus(status: OverallStatus): Promise<Recommendation[]> {
  const data = await loadTaskforceData();
  return data.recommendations.filter(r => r.overall_status.status === status);
}

export async function getRecommendationsByOwner(owner: string): Promise<Recommendation[]> {
  const data = await loadTaskforceData();
  return data.recommendations.filter(r => 
    r.ownership.primary_owner === owner ||
    r.ownership.co_owners?.includes(owner)
  );
}

export async function searchRecommendations(query: string): Promise<Recommendation[]> {
  const data = await loadTaskforceData();
  const lowerQuery = query.toLowerCase();
  
  return data.recommendations.filter(r =>
    r.titles.short.toLowerCase().includes(lowerQuery) ||
    r.titles.long.toLowerCase().includes(lowerQuery) ||
    r.text.toLowerCase().includes(lowerQuery) ||
    r.code.toLowerCase().includes(lowerQuery)
  );
}

// ========================================
// STATISTICS & AGGREGATIONS
// ========================================

export async function getStatusCounts(): Promise<StatusCounts> {
  const data = await loadTaskforceData();
  const counts: StatusCounts = {
    not_started: 0,
    on_track: 0,
    off_track: 0,
    completed: 0,
    abandoned: 0,
    total: data.recommendations.length,
  };
  
  for (const rec of data.recommendations) {
    counts[rec.overall_status.status]++;
  }
  
  return counts;
}

export async function getChaptersWithRecommendations(): Promise<ChapterWithRecommendations[]> {
  const data = await loadTaskforceData();
  const chapterMap = new Map<number, ChapterWithRecommendations>();
  
  for (const rec of data.recommendations) {
    const chapterNum = rec.chapter.number;
    if (!chapterMap.has(chapterNum)) {
      chapterMap.set(chapterNum, {
        id: chapterNum,
        title: rec.chapter.title,
        recommendations: [],
      });
    }
    chapterMap.get(chapterNum)!.recommendations.push(rec);
  }
  
  return Array.from(chapterMap.values()).sort((a, b) => a.id - b.id);
}

export async function getUniqueOwners(): Promise<string[]> {
  const data = await loadTaskforceData();
  const owners = new Set<string>();
  
  for (const rec of data.recommendations) {
    owners.add(rec.ownership.primary_owner);
    rec.ownership.co_owners?.forEach(o => owners.add(o));
  }
  
  return Array.from(owners).sort();
}

// ========================================
// DEADLINES & TIMELINE
// ========================================

export async function getUpcomingDeadlines(limit: number = 10): Promise<UpcomingDeadline[]> {
  const data = await loadTaskforceData();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const deadlines: UpcomingDeadline[] = data.recommendations
    .filter(r => r.overall_status.status !== 'completed' && r.overall_status.status !== 'abandoned')
    .map(r => {
      const targetDate = new Date(r.delivery_timeline.revised_target_date || r.delivery_timeline.target_date);
      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        recommendation: r,
        daysUntil: diffDays,
        isOverdue: diffDays < 0,
      };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);
  
  return deadlines.slice(0, limit);
}

export async function getRecentUpdates(limit: number = 10): Promise<RecentUpdate[]> {
  const data = await loadTaskforceData();
  const updates: RecentUpdate[] = [];
  
  for (const rec of data.recommendations) {
    if (rec.updates) {
      for (const update of rec.updates) {
        updates.push({ update, recommendation: rec });
      }
    }
  }
  
  return updates
    .sort((a, b) => new Date(b.update.date).getTime() - new Date(a.update.date).getTime())
    .slice(0, limit);
}

export async function getAllUpdates(): Promise<RecentUpdate[]> {
  const data = await loadTaskforceData();
  const updates: RecentUpdate[] = [];
  
  for (const rec of data.recommendations) {
    if (rec.updates) {
      for (const update of rec.updates) {
        updates.push({ update, recommendation: rec });
      }
    }
  }
  
  return updates.sort((a, b) => 
    new Date(b.update.date).getTime() - new Date(a.update.date).getTime()
  );
}

export async function getTimelineItems(includeFutureDeadlines: boolean = true): Promise<TimelineItem[]> {
  const data = await loadTaskforceData();
  const items: TimelineItem[] = [];
  
  // Add all updates
  for (const rec of data.recommendations) {
    if (rec.updates) {
      for (const update of rec.updates) {
        items.push({
          type: 'update',
          date: update.date,
          update,
          recommendation: rec,
        });
      }
    }
  }
  
  // Add all deadlines
  if (includeFutureDeadlines) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const rec of data.recommendations) {
      // Only include deadlines for non-completed/abandoned recommendations
      if (rec.overall_status.status !== 'completed' && rec.overall_status.status !== 'abandoned') {
        const targetDate = rec.delivery_timeline.revised_target_date || rec.delivery_timeline.target_date;
        if (targetDate) {
          const targetDateObj = new Date(targetDate);
          const diffTime = targetDateObj.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          items.push({
            type: 'deadline',
            date: targetDate,
            recommendation: rec,
            deadline: {
              targetDate: rec.delivery_timeline.target_date,
              revisedDate: rec.delivery_timeline.revised_target_date,
              daysUntil: diffDays,
              isOverdue: diffDays < 0,
            },
          });
        }
      }
    }
  }
  
  // Sort by date (soonest first - ascending order)
  return items.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

export function getProgressPercentage(counts: StatusCounts): number {
  if (counts.total === 0) return 0;
  return Math.round((counts.completed / counts.total) * 100);
}
