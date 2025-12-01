'use client';

import { Timeline } from '@/components/shared/timeline-event';
import { TimelineItem } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface TimelineClientProps {
  items: TimelineItem[];
}

export function TimelineClient({ items }: TimelineClientProps) {
  const router = useRouter();

  const handleTagClick = (tag: string) => {
    // Navigate to dashboard with tag filter
    router.push(`/?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <Timeline 
      items={items} 
      showRecommendations={true}
      onTagClick={handleTagClick}
    />
  );
}

