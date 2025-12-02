import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import { getLastUpdated } from '@/lib/data';

interface FooterProps {
  className?: string;
}

export async function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const lastUpdated = await getLastUpdated();

  return (
    <footer
      className={cn(
        'border-t bg-dark-green text-beige',
        className
      )}
    >
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <img 
              src="/logo_light.svg" 
              alt="Centre for British Progress" 
              className="h-8 mb-3"
            />
            <p className="text-sm text-beige/80 leading-relaxed">
              The Centre for British Progress is a non-partisan think tank researching and producing concrete ideas for an era of British growth and progress.
            </p>
            <p className="text-sm text-beige/80 leading-relaxed mt-2">
              This project tracks the Government&apos;s progress in implementing the Nuclear Regulatory Taskforce recommendations.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.gov.uk/government/publications/nuclear-regulatory-taskforce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-beige/80 hover:text-beige transition-colors"
                >
                  Read the full report
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://britishprogress.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-beige/80 hover:text-beige transition-colors"
                >
                  Centre for British Progress
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Data */}
          <div>
            <h3 className="font-display font-bold text-lg mb-3">Data</h3>
            <p className="text-sm text-beige/80 leading-relaxed mb-2">
              Data is sourced from public government announcements, parliamentary
              statements, and official publications.
            </p>
            <p className="text-xs text-beige/60">
              Last updated: {lastUpdated 
                ? new Date(lastUpdated).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-beige/20">
          <p className="text-sm text-beige/60 text-center">
            © {currentYear} Centre for British Progress. This is an independent project
            and is not affiliated with HM Government.
          </p>
        </div>
      </div>
    </footer>
  );
}

