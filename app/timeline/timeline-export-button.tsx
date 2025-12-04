'use client';

import { ExportButton } from '@/components/shared/export-button';

export function TimelineExportButton() {
  return (
    <ExportButton
      baseUrl="/api/export/updates"
      label="Export Timeline"
    />
  );
}

