'use client';

import { Building2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type GridViewMode = 'departments' | 'recommendations';

interface TimelineGridViewToggleProps {
  mode: GridViewMode;
  onModeChange: (mode: GridViewMode) => void;
}

export function TimelineGridViewToggle({ mode, onModeChange }: TimelineGridViewToggleProps) {
  return (
    <div className="flex items-center gap-1 p-0.5 rounded-lg border" suppressHydrationWarning>
      <Button
        variant={mode === 'departments' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('departments')}
        className={cn(
          'gap-1 px-2 h-7',
          mode === 'departments' && 'bg-primary text-primary-foreground'
        )}
        suppressHydrationWarning
      >
        <Building2 size={14} />
        <span className="hidden sm:inline text-xs">Depts</span>
      </Button>
      <Button
        variant={mode === 'recommendations' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('recommendations')}
        className={cn(
          'gap-1 px-2 h-7',
          mode === 'recommendations' && 'bg-primary text-primary-foreground'
        )}
        suppressHydrationWarning
      >
        <FileText size={14} />
        <span className="hidden sm:inline text-xs">Recs</span>
      </Button>
    </div>
  );
}

