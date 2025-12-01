import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TimelineClient } from './timeline-client';
import { getTimelineItems } from '@/lib/data';
import { Clock } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const timelineItems = await getTimelineItems(true);
  
  return {
    title: 'Timeline | Nuclear Taskforce Tracker',
    description: `Track all ${timelineItems.length} updates and developments on nuclear regulatory taskforce recommendations. Chronological view of status changes, announcements, and deadlines.`,
    openGraph: {
      title: 'Timeline | Nuclear Taskforce Tracker',
      description: `Track all updates and developments on nuclear regulatory taskforce recommendations. ${timelineItems.length} timeline items.`,
      type: "website",
      url: "/timeline",
      siteName: "Nuclear Taskforce Tracker",
      images: [
        {
          url: "/icon.svg",
          width: 400,
          height: 400,
          alt: "Nuclear Taskforce Tracker Timeline",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Timeline | Nuclear Taskforce Tracker",
      description: `Track all updates on nuclear regulatory recommendations. ${timelineItems.length} timeline items.`,
      images: ["/icon.svg"],
    },
    alternates: {
      canonical: "/timeline",
    },
  };
}

export default async function TimelinePage() {
  const timelineItems = await getTimelineItems(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-beige to-background py-12">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-dark-green">
                Timeline
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Track all developments, announcements, status changes, and upcoming deadlines 
              across the nuclear regulatory taskforce recommendations.
            </p>
          </div>
        </section>

        {/* Timeline Content */}
        <section className="container py-8">
          <div className="max-w-3xl">
            {timelineItems.length > 0 ? (
              <TimelineClient items={timelineItems} />
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No timeline items recorded yet.</p>
                <p className="text-sm mt-2">
                  Check back as the government responds to taskforce recommendations.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

