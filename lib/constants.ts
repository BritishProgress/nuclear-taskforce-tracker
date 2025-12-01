import { OverallStatus, UpdateStatus } from './types';

// Status display names
export const OVERALL_STATUS_LABELS: Record<OverallStatus, string> = {
  not_started: 'Not Started',
  on_track: 'On Track',
  off_track: 'Off Track',
  completed: 'Completed',
  abandoned: 'Abandoned',
};

export const UPDATE_STATUS_LABELS: Record<UpdateStatus, string> = {
  info: 'Info',
  progress: 'Progress',
  risk: 'Risk',
  off_track: 'Off Track',
  completed: 'Completed',
  blocked: 'Blocked',
};

// Status CSS class mappings
export const OVERALL_STATUS_CLASSES: Record<OverallStatus, string> = {
  not_started: 'status-not-started',
  on_track: 'status-on-track',
  off_track: 'status-off-track',
  completed: 'status-completed',
  abandoned: 'status-abandoned',
};

export const UPDATE_STATUS_CLASSES: Record<UpdateStatus, string> = {
  info: 'status-info',
  progress: 'status-progress',
  risk: 'status-risk',
  off_track: 'status-off-track',
  completed: 'status-completed',
  blocked: 'status-blocked',
};

// Status icons (Lucide icon names)
export const OVERALL_STATUS_ICONS: Record<OverallStatus, string> = {
  not_started: 'Circle',
  on_track: 'CheckCircle2',
  off_track: 'AlertCircle',
  completed: 'CheckCircle',
  abandoned: 'XCircle',
};

export const UPDATE_STATUS_ICONS: Record<UpdateStatus, string> = {
  info: 'Info',
  progress: 'TrendingUp',
  risk: 'AlertTriangle',
  off_track: 'AlertCircle',
  completed: 'CheckCircle',
  blocked: 'Ban',
};

// Department/Owner abbreviation mappings
export const OWNER_FULL_NAMES: Record<string, string> = {
  'DESNZ': 'Department for Energy Security and Net Zero',
  'MOD': 'Ministry of Defence',
  'ONR': 'Office for Nuclear Regulation',
  'EA': 'Environment Agency',
  'MHCLG': 'Ministry of Housing, Communities and Local Government',
  'DEFRA': 'Department for Environment, Food & Rural Affairs',
  'NDA': 'Nuclear Decommissioning Authority',
  'HSE': 'Health and Safety Executive',
  'DWP': 'Department for Work and Pensions',
  'HM Treasury': 'HM Treasury',
  'UKHSA': 'UK Health Security Agency',
  'UKRI': 'UK Research and Innovation',
  'DBT': 'Department for Business and Trade',
  'FCDO': 'Foreign, Commonwealth & Development Office',
  'MOJ': 'Ministry of Justice',
  'EDF': 'EDF Energy',
};

// Chapter colors for visual distinction (chapters 5-11 from the taskforce report)
export const CHAPTER_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  5: { bg: 'bg-dark-green/10', text: 'text-dark-green', border: 'border-dark-green/20' },
  6: { bg: 'bg-light-blue/10', text: 'text-dark-blue', border: 'border-light-blue/30' },
  7: { bg: 'bg-neon-green/10', text: 'text-dark-green', border: 'border-neon-green/30' },
  8: { bg: 'bg-orange/10', text: 'text-orange', border: 'border-orange/30' },
  9: { bg: 'bg-light-red/10', text: 'text-deep-red', border: 'border-light-red/30' },
  10: { bg: 'bg-dark-blue/10', text: 'text-dark-blue', border: 'border-dark-blue/20' },
  11: { bg: 'bg-charcoal/10', text: 'text-charcoal', border: 'border-charcoal/20' },
};

// Default chapter colors for unknown chapters
export const DEFAULT_CHAPTER_COLORS = { bg: 'bg-muted', text: 'text-foreground', border: 'border-border' };

export function getChapterColors(chapterNumber: number) {
  return CHAPTER_COLORS[chapterNumber] || DEFAULT_CHAPTER_COLORS;
}

// Date formatting options
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
};

export const DATE_FORMAT_SHORT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
};

