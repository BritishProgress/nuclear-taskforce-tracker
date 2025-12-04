'use client';

import { useState } from 'react';
import { List, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'grid';

interface TimelineViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function TimelineViewToggle({ view, onViewChange }: TimelineViewToggleProps) {
  return (
    <div className="flex items-center gap-2 p-1 rounded-lg border bg-card">
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className={cn(
          'gap-2',
          view === 'list' && 'bg-primary text-primary-foreground'
        )}
      >
        <List size={16} />
        <span className="hidden sm:inline">List</span>
      </Button>
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className={cn(
          'gap-2',
          view === 'grid' && 'bg-primary text-primary-foreground'
        )}
      >
        <Grid size={16} />
        <span className="hidden sm:inline">Grid</span>
      </Button>
    </div>
  );
}

