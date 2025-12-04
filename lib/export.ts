import 'server-only';
import * as ExcelJS from 'exceljs';
import {
  Recommendation,
  RecentUpdate,
  Chapter,
  OverallStatus,
  UpdateStatus,
  TimelineItem,
} from './types';
import {
  OVERALL_STATUS_LABELS,
  UPDATE_STATUS_LABELS,
  OWNER_FULL_NAMES,
} from './constants';
import { daysUntil, isOverdue } from './date-utils';
import { getChapters, getRecommendations, getAllUpdates, getTimelineItems } from './data';

// ========================================
// CSV UTILITIES
// ========================================

function escapeCSVField(field: string | null | undefined): string {
  if (!field) return '';
  const str = String(field);
  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function arrayToCSV(array: string[]): string {
  return array.map(escapeCSVField).join(',');
}

// ========================================
// RECOMMENDATIONS EXPORT
// ========================================

interface RecommendationRow {
  Code: string;
  'Short Title': string;
  'Long Title': string;
  'Chapter ID': number;
  'Chapter Title': string;
  'Overall Status': string;
  'Status Last Updated': string;
  'Status Confidence': string;
  'Status Summary': string;
  'Primary Owner': string;
  'Co-Owners': string;
  'Key Regulators': string;
  'Target Date': string;
  'Revised Target Date': string;
  'Days Until Deadline': number;
  'Is Overdue': string;
  Sectors: string;
  Domains: string;
  'Implementation Types': string;
  'Depends On': string;
  Enables: string;
  'Update Count': number;
  'Latest Update Date': string;
  'Latest Update Status': string;
  'Full Recommendation Text': string;
}

async function getRecommendationRows(
  recommendations: Recommendation[],
  chapters: Chapter[]
): Promise<RecommendationRow[]> {
  const chapterMap = new Map(chapters.map(c => [c.id, c]));
  
  return recommendations.map(rec => {
    const chapter = chapterMap.get(rec.chapter_id);
    const targetDate = rec.delivery_timeline.revised_target_date || rec.delivery_timeline.target_date;
    const days = targetDate ? daysUntil(targetDate) : 0;
    const overdue = targetDate ? isOverdue(targetDate) : false;
    
    const latestUpdate = rec.updates && rec.updates.length > 0 
      ? rec.updates[0] 
      : null;
    
    return {
      Code: rec.code,
      'Short Title': rec.titles.short,
      'Long Title': rec.titles.long,
      'Chapter ID': rec.chapter_id,
      'Chapter Title': chapter?.title || `Chapter ${rec.chapter_id}`,
      'Overall Status': OVERALL_STATUS_LABELS[rec.overall_status.status],
      'Status Last Updated': rec.overall_status.last_updated || '',
      'Status Confidence': rec.overall_status.confidence || '',
      'Status Summary': rec.overall_status.summary || '',
      'Primary Owner': rec.ownership.primary_owner,
      'Co-Owners': rec.ownership.co_owners?.join(', ') || '',
      'Key Regulators': rec.ownership.key_regulators?.join(', ') || '',
      'Target Date': rec.delivery_timeline.target_date,
      'Revised Target Date': rec.delivery_timeline.revised_target_date || '',
      'Days Until Deadline': days,
      'Is Overdue': overdue ? 'Yes' : 'No',
      Sectors: rec.scope.sectors.join(', '),
      Domains: rec.scope.domains?.join(', ') || '',
      'Implementation Types': rec.implementation_type?.join(', ') || '',
      'Depends On': rec.dependencies?.depends_on?.map(id => `R${id.toString().padStart(2, '0')}`).join(', ') || '',
      Enables: rec.dependencies?.enables?.map(id => `R${id.toString().padStart(2, '0')}`).join(', ') || '',
      'Update Count': rec.updates?.length || 0,
      'Latest Update Date': latestUpdate ? latestUpdate.date : '',
      'Latest Update Status': latestUpdate ? UPDATE_STATUS_LABELS[latestUpdate.status] : '',
      'Full Recommendation Text': rec.text,
    };
  });
}

export async function exportRecommendationsToCSV(
  recommendations: Recommendation[]
): Promise<string> {
  const chapters = await getChapters();
  const rows = await getRecommendationRows(recommendations, chapters);
  
  if (rows.length === 0) return '';
  
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(header => escapeCSVField(String(row[header as keyof RecommendationRow]))).join(',')
    ),
  ];
  
  // Add BOM for Excel compatibility
  return '\uFEFF' + csvRows.join('\n');
}

export async function exportRecommendationsToExcel(
  recommendations: Recommendation[]
): Promise<Buffer> {
  const chapters = await getChapters();
  const rows = await getRecommendationRows(recommendations, chapters);
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Recommendations');
  
  // Add header row
  const headers = Object.keys(rows[0] || {});
  worksheet.addRow(headers);
  
  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0B4938' }, // Dark green
  };
  headerRow.font = { bold: true, color: { argb: 'FFFDF9E9' } }; // Beige text
  
  // Add data rows
  rows.forEach(row => {
    worksheet.addRow(Object.values(row));
  });
  
  // Set column widths
  worksheet.columns = [
    { width: 8 },   // Code
    { width: 30 },  // Short Title
    { width: 50 },  // Long Title
    { width: 10 },  // Chapter ID
    { width: 40 },  // Chapter Title
    { width: 15 },  // Overall Status
    { width: 18 },  // Status Last Updated
    { width: 12 },  // Status Confidence
    { width: 50 },  // Status Summary
    { width: 20 },  // Primary Owner
    { width: 30 },  // Co-Owners
    { width: 30 },  // Key Regulators
    { width: 12 },  // Target Date
    { width: 18 },  // Revised Target Date
    { width: 18 },  // Days Until Deadline
    { width: 10 },  // Is Overdue
    { width: 15 },  // Sectors
    { width: 30 },  // Domains
    { width: 30 },  // Implementation Types
    { width: 30 },  // Depends On
    { width: 30 },  // Enables
    { width: 12 },  // Update Count
    { width: 18 },  // Latest Update Date
    { width: 15 },  // Latest Update Status
    { width: 100 }, // Full Recommendation Text
  ];
  
  // Freeze header row
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// ========================================
// UPDATES EXPORT
// ========================================

interface UpdateRow {
  Date: string;
  'Recommendation Code': string;
  'Recommendation Title': string;
  'Update Status': string;
  'Update Title': string;
  'Update Description': string;
  Tags: string;
  Links: string;
  'Source Type': string;
  'Source Reference': string;
  'Impact on Overall Status': string;
  'Impact on Confidence': string;
  'Impact Notes': string;
}

function getUpdateRows(updates: RecentUpdate[]): UpdateRow[] {
  return updates.map(({ update, recommendation }) => ({
    Date: update.date,
    'Recommendation Code': recommendation.code,
    'Recommendation Title': recommendation.titles.short,
    'Update Status': UPDATE_STATUS_LABELS[update.status],
    'Update Title': update.title,
    'Update Description': update.description || '',
    Tags: update.tags?.join(', ') || '',
    Links: update.links?.map(l => `${l.title}|${l.url}`).join('; ') || '',
    'Source Type': update.source?.type || '',
    'Source Reference': update.source?.reference || '',
    'Impact on Overall Status': update.impact_on_overall?.changes_overall_status_to 
      ? OVERALL_STATUS_LABELS[update.impact_on_overall.changes_overall_status_to]
      : '',
    'Impact on Confidence': update.impact_on_overall?.changes_confidence_to || '',
    'Impact Notes': update.impact_on_overall?.notes || '',
  }));
}

// ========================================
// TIMELINE EXPORT (Updates + Deadlines)
// ========================================

interface TimelineRow {
  Date: string;
  Type: string;
  'Recommendation Code': string;
  'Recommendation Title': string;
  'Update Status': string;
  'Update Title': string;
  'Update Description': string;
  Tags: string;
  Links: string;
  'Source Type': string;
  'Source Reference': string;
  'Impact on Overall Status': string;
  'Impact on Confidence': string;
  'Impact Notes': string;
  'Deadline Target Date': string;
  'Deadline Revised Date': string;
  'Days Until Deadline': string;
  'Is Overdue': string;
}

function getTimelineRows(timelineItems: TimelineItem[]): TimelineRow[] {
  return timelineItems.map(item => {
    if (item.type === 'update' && item.update) {
      return {
        Date: item.date,
        Type: 'Update',
        'Recommendation Code': item.recommendation.code,
        'Recommendation Title': item.recommendation.titles.short,
        'Update Status': UPDATE_STATUS_LABELS[item.update.status],
        'Update Title': item.update.title,
        'Update Description': item.update.description || '',
        Tags: item.update.tags?.join(', ') || '',
        Links: item.update.links?.map(l => `${l.title}|${l.url}`).join('; ') || '',
        'Source Type': item.update.source?.type || '',
        'Source Reference': item.update.source?.reference || '',
        'Impact on Overall Status': item.update.impact_on_overall?.changes_overall_status_to 
          ? OVERALL_STATUS_LABELS[item.update.impact_on_overall.changes_overall_status_to]
          : '',
        'Impact on Confidence': item.update.impact_on_overall?.changes_confidence_to || '',
        'Impact Notes': item.update.impact_on_overall?.notes || '',
        'Deadline Target Date': '',
        'Deadline Revised Date': '',
        'Days Until Deadline': '',
        'Is Overdue': '',
      };
    } else if (item.type === 'deadline' && item.deadline) {
      return {
        Date: item.date,
        Type: 'Deadline',
        'Recommendation Code': item.recommendation.code,
        'Recommendation Title': item.recommendation.titles.short,
        'Update Status': '',
        'Update Title': `Deadline: ${item.recommendation.titles.short}`,
        'Update Description': '',
        Tags: '',
        Links: '',
        'Source Type': '',
        'Source Reference': '',
        'Impact on Overall Status': '',
        'Impact on Confidence': '',
        'Impact Notes': '',
        'Deadline Target Date': item.deadline.targetDate,
        'Deadline Revised Date': item.deadline.revisedDate || '',
        'Days Until Deadline': item.deadline.daysUntil.toString(),
        'Is Overdue': item.deadline.isOverdue ? 'Yes' : 'No',
      };
    } else {
      // Fallback for unexpected types
      return {
        Date: item.date,
        Type: item.type,
        'Recommendation Code': item.recommendation.code,
        'Recommendation Title': item.recommendation.titles.short,
        'Update Status': '',
        'Update Title': '',
        'Update Description': '',
        Tags: '',
        Links: '',
        'Source Type': '',
        'Source Reference': '',
        'Impact on Overall Status': '',
        'Impact on Confidence': '',
        'Impact Notes': '',
        'Deadline Target Date': '',
        'Deadline Revised Date': '',
        'Days Until Deadline': '',
        'Is Overdue': '',
      };
    }
  });
}

export async function exportTimelineToCSV(): Promise<string> {
  const timelineItems = await getTimelineItems(true);
  const rows = getTimelineRows(timelineItems);
  
  if (rows.length === 0) return '';
  
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(header => escapeCSVField(String(row[header as keyof TimelineRow]))).join(',')
    ),
  ];
  
  return '\uFEFF' + csvRows.join('\n');
}

export async function exportTimelineToExcel(): Promise<Buffer> {
  const timelineItems = await getTimelineItems(true);
  const rows = getTimelineRows(timelineItems);
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Timeline');
  
  // Add header row
  const headers = Object.keys(rows[0] || {});
  worksheet.addRow(headers);
  
  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0B4938' }, // Dark green
  };
  headerRow.font = { bold: true, color: { argb: 'FFFDF9E9' } }; // Beige text
  
  // Add data rows
  rows.forEach(row => {
    worksheet.addRow(Object.values(row));
  });
  
  // Set column widths
  worksheet.columns = [
    { width: 12 },  // Date
    { width: 10 },  // Type
    { width: 10 },  // Recommendation Code
    { width: 40 },  // Recommendation Title
    { width: 15 },  // Update Status
    { width: 50 },  // Update Title
    { width: 80 },  // Update Description
    { width: 30 },  // Tags
    { width: 60 },  // Links
    { width: 15 },  // Source Type
    { width: 20 },  // Source Reference
    { width: 20 },  // Impact on Overall Status
    { width: 15 },  // Impact on Confidence
    { width: 50 },  // Impact Notes
    { width: 18 },  // Deadline Target Date
    { width: 18 },  // Deadline Revised Date
    { width: 18 },  // Days Until Deadline
    { width: 10 },  // Is Overdue
  ];
  
  // Freeze header row
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// Legacy functions for backwards compatibility (updates only)
export async function exportUpdatesToCSV(updates: RecentUpdate[]): Promise<string> {
  const rows = getUpdateRows(updates);
  
  if (rows.length === 0) return '';
  
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(header => escapeCSVField(String(row[header as keyof UpdateRow]))).join(',')
    ),
  ];
  
  return '\uFEFF' + csvRows.join('\n');
}

export async function exportUpdatesToExcel(updates: RecentUpdate[]): Promise<Buffer> {
  const rows = getUpdateRows(updates);
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Updates');
  
  // Add header row
  const headers = Object.keys(rows[0] || {});
  worksheet.addRow(headers);
  
  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0B4938' }, // Dark green
  };
  headerRow.font = { bold: true, color: { argb: 'FFFDF9E9' } }; // Beige text
  
  // Add data rows
  rows.forEach(row => {
    worksheet.addRow(Object.values(row));
  });
  
  // Set column widths
  worksheet.columns = [
    { width: 12 },  // Date
    { width: 10 },  // Recommendation Code
    { width: 40 },  // Recommendation Title
    { width: 15 },  // Update Status
    { width: 50 },  // Update Title
    { width: 80 },  // Update Description
    { width: 30 },  // Tags
    { width: 60 },  // Links
    { width: 15 },  // Source Type
    { width: 20 },  // Source Reference
    { width: 20 },  // Impact on Overall Status
    { width: 15 },  // Impact on Confidence
    { width: 50 },  // Impact Notes
  ];
  
  // Freeze header row
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// ========================================
// DEPARTMENTS EXPORT
// ========================================

interface DepartmentRow {
  'Owner/Department': string;
  'Full Name': string;
  'Total Recommendations': number;
  'Not Started': number;
  'On Track': number;
  'Off Track': number;
  'Completed': number;
  'Abandoned': number;
  'Completion Percentage': string;
  'Average Days Until Deadline': string;
  'Overdue Count': number;
}

export async function exportDepartmentsToCSV(): Promise<string> {
  const recommendations = await getRecommendations();
  const owners = new Set<string>();
  
  // Collect all owners
  recommendations.forEach(rec => {
    owners.add(rec.ownership.primary_owner);
    rec.ownership.co_owners?.forEach(o => owners.add(o));
  });
  
  const rows: DepartmentRow[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (const owner of Array.from(owners).sort()) {
    const ownerRecs = recommendations.filter(
      rec => rec.ownership.primary_owner === owner || rec.ownership.co_owners?.includes(owner)
    );
    
    const statusCounts = {
      not_started: 0,
      on_track: 0,
      off_track: 0,
      completed: 0,
      abandoned: 0,
    };
    
    let totalDays = 0;
    let deadlineCount = 0;
    let overdueCount = 0;
    
    ownerRecs.forEach(rec => {
      statusCounts[rec.overall_status.status]++;
      
      if (rec.overall_status.status !== 'completed' && rec.overall_status.status !== 'abandoned') {
        const targetDate = rec.delivery_timeline.revised_target_date || rec.delivery_timeline.target_date;
        if (targetDate) {
          const days = daysUntil(targetDate);
          totalDays += days;
          deadlineCount++;
          if (days < 0) overdueCount++;
        }
      }
    });
    
    const total = ownerRecs.length;
    const completed = statusCounts.completed;
    const completionPercent = total > 0 ? ((completed / total) * 100).toFixed(1) : '0.0';
    const avgDays = deadlineCount > 0 ? (totalDays / deadlineCount).toFixed(1) : '';
    
    rows.push({
      'Owner/Department': owner,
      'Full Name': OWNER_FULL_NAMES[owner] || owner,
      'Total Recommendations': total,
      'Not Started': statusCounts.not_started,
      'On Track': statusCounts.on_track,
      'Off Track': statusCounts.off_track,
      'Completed': statusCounts.completed,
      'Abandoned': statusCounts.abandoned,
      'Completion Percentage': `${completionPercent}%`,
      'Average Days Until Deadline': avgDays,
      'Overdue Count': overdueCount,
    });
  }
  
  if (rows.length === 0) return '';
  
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(header => escapeCSVField(String(row[header as keyof DepartmentRow]))).join(',')
    ),
  ];
  
  return '\uFEFF' + csvRows.join('\n');
}

export async function exportDepartmentsToExcel(): Promise<Buffer> {
  const recommendations = await getRecommendations();
  const owners = new Set<string>();
  
  // Collect all owners
  recommendations.forEach(rec => {
    owners.add(rec.ownership.primary_owner);
    rec.ownership.co_owners?.forEach(o => owners.add(o));
  });
  
  const rows: DepartmentRow[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (const owner of Array.from(owners).sort()) {
    const ownerRecs = recommendations.filter(
      rec => rec.ownership.primary_owner === owner || rec.ownership.co_owners?.includes(owner)
    );
    
    const statusCounts = {
      not_started: 0,
      on_track: 0,
      off_track: 0,
      completed: 0,
      abandoned: 0,
    };
    
    let totalDays = 0;
    let deadlineCount = 0;
    let overdueCount = 0;
    
    ownerRecs.forEach(rec => {
      statusCounts[rec.overall_status.status]++;
      
      if (rec.overall_status.status !== 'completed' && rec.overall_status.status !== 'abandoned') {
        const targetDate = rec.delivery_timeline.revised_target_date || rec.delivery_timeline.target_date;
        if (targetDate) {
          const days = daysUntil(targetDate);
          totalDays += days;
          deadlineCount++;
          if (days < 0) overdueCount++;
        }
      }
    });
    
    const total = ownerRecs.length;
    const completed = statusCounts.completed;
    const completionPercent = total > 0 ? ((completed / total) * 100).toFixed(1) : '0.0';
    const avgDays = deadlineCount > 0 ? (totalDays / deadlineCount).toFixed(1) : '';
    
    rows.push({
      'Owner/Department': owner,
      'Full Name': OWNER_FULL_NAMES[owner] || owner,
      'Total Recommendations': total,
      'Not Started': statusCounts.not_started,
      'On Track': statusCounts.on_track,
      'Off Track': statusCounts.off_track,
      'Completed': statusCounts.completed,
      'Abandoned': statusCounts.abandoned,
      'Completion Percentage': `${completionPercent}%`,
      'Average Days Until Deadline': avgDays,
      'Overdue Count': overdueCount,
    });
  }
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Departments');
  
  // Add header row
  const headers = Object.keys(rows[0] || {});
  worksheet.addRow(headers);
  
  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0B4938' }, // Dark green
  };
  headerRow.font = { bold: true, color: { argb: 'FFFDF9E9' } }; // Beige text
  
  // Add data rows
  rows.forEach(row => {
    worksheet.addRow(Object.values(row));
  });
  
  // Set column widths
  worksheet.columns = [
    { width: 20 },  // Owner/Department
    { width: 50 },  // Full Name
    { width: 20 },  // Total Recommendations
    { width: 12 },  // Not Started
    { width: 12 },  // On Track
    { width: 12 },  // Off Track
    { width: 12 },  // Completed
    { width: 12 },  // Abandoned
    { width: 20 },  // Completion Percentage
    { width: 25 },  // Average Days Until Deadline
    { width: 15 },  // Overdue Count
  ];
  
  // Freeze header row
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// ========================================
// FILTERING HELPERS
// ========================================

export async function filterRecommendations(
  status?: OverallStatus | 'all',
  chapter?: number | 'all',
  owner?: string | 'all',
  tag?: string
): Promise<Recommendation[]> {
  let recommendations = await getRecommendations();
  
  if (status && status !== 'all') {
    recommendations = recommendations.filter(r => r.overall_status.status === status);
  }
  
  if (chapter && chapter !== 'all') {
    recommendations = recommendations.filter(r => r.chapter_id === chapter);
  }
  
  if (owner && owner !== 'all') {
    recommendations = recommendations.filter(r => 
      r.ownership.primary_owner === owner || r.ownership.co_owners?.includes(owner)
    );
  }
  
  if (tag) {
    recommendations = recommendations.filter(r => 
      r.updates?.some(u => u.tags?.includes(tag))
    );
  }
  
  return recommendations;
}

