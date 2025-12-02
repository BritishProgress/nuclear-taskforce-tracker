'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackButton() {
  return (
    <Button
      variant="ghost"
      onClick={() => window.history.back()}
      className="w-full"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Go Back
    </Button>
  );
}

