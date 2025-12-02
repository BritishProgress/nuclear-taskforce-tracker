import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search } from 'lucide-react';
import { BackButton } from '@/components/shared/back-button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="text-6xl font-bold text-muted-foreground mb-4">404</div>
            <CardTitle className="text-2xl">Page Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            
            <div className="flex flex-col gap-2 pt-4">
              <Button asChild variant="default" className="w-full">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/timeline">
                  <Search className="h-4 w-4 mr-2" />
                  View Timeline
                </Link>
              </Button>
              <BackButton />
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

