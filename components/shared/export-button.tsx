'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExportButtonProps {
  baseUrl: string;
  queryParams?: Record<string, string>;
  label?: string;
  className?: string;
}

export function ExportButton({
  baseUrl,
  queryParams = {},
  label = 'Export',
  className,
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const buildUrl = (format: 'csv' | 'xlsx') => {
    const params = new URLSearchParams({
      format,
      ...queryParams,
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const handleExport = (format: 'csv' | 'xlsx') => {
    const url = buildUrl(format);
    window.location.href = url;
    setIsOpen(false);
  };

  return (
    <div className={cn('relative inline-block', className)} ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Download size={16} />
        {label}
        <ChevronDown
          size={14}
          className={cn(
            'transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border bg-card shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => handleExport('csv')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
            >
              <FileText size={16} className="text-muted-foreground" />
              <span>Export as CSV</span>
            </button>
            <button
              onClick={() => handleExport('xlsx')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet size={16} className="text-muted-foreground" />
              <span>Export as Excel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

