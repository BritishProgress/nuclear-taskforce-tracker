import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DashboardContent } from './dashboard-content';
import { 
  getStatusCounts, 
  getChaptersWithRecommendations, 
  getUpcomingDeadlines, 
  getRecentUpdates,
  getUniqueOwners,
  getChapters,
} from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const counts = await getStatusCounts();
  
  return {
    title: "Nuclear Taskforce Tracker | Centre for British Progress",
    description: `Tracking government progress on ${counts.total} recommendations from the UK Nuclear Regulatory Taskforce. ${counts.completed} completed, ${counts.on_track} on track, ${counts.off_track} off track.`,
    openGraph: {
      title: "Nuclear Taskforce Tracker | Centre for British Progress",
      description: `Tracking government progress on ${counts.total} recommendations from the UK Nuclear Regulatory Taskforce. ${counts.completed} completed, ${counts.on_track} on track, ${counts.off_track} off track.`,
      type: "website",
      url: "/",
      siteName: "Nuclear Taskforce Tracker",
      images: [
        {
          url: "/icon.svg",
          width: 400,
          height: 400,
          alt: "Nuclear Taskforce Tracker Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Nuclear Taskforce Tracker",
      description: `Tracking ${counts.total} nuclear regulatory recommendations. ${counts.completed} completed.`,
      images: ["/icon.svg"],
    },
    alternates: {
      canonical: "/",
    },
  };
}

export default async function HomePage() {
  // Fetch all data server-side
  const [counts, chaptersWithRecs, deadlines, recentUpdates, owners, chapters] = await Promise.all([
    getStatusCounts(),
    getChaptersWithRecommendations(),
    getUpcomingDeadlines(8),
    getRecentUpdates(6),
    getUniqueOwners(),
    getChapters(),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContentWrapper
            counts={counts}
            chaptersWithRecs={chaptersWithRecs}
            deadlines={deadlines}
            recentUpdates={recentUpdates}
            owners={owners}
            chapters={chapters}
          />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

function DashboardContentWrapper(props: Parameters<typeof DashboardContent>[0]) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent {...props} />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container py-8">
      <div className="animate-pulse space-y-8">
        {/* Hero skeleton */}
        <div className="text-center space-y-4">
          <div className="h-8 w-48 bg-muted rounded-full mx-auto" />
          <div className="h-12 w-96 bg-muted rounded mx-auto" />
          <div className="h-6 w-80 bg-muted rounded mx-auto" />
        </div>
        
        {/* Stats skeleton */}
        <div className="flex justify-center gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 w-24 bg-muted rounded-xl" />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-lg" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-80 bg-muted rounded-lg" />
            <div className="h-80 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
