'use client';

import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

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
            <h3 className="font-display font-bold text-lg mb-3">
              Centre for British Progress
            </h3>
            <p className="text-sm text-beige/80 leading-relaxed">
              Tracking government progress on the UK Nuclear Regulatory Taskforce&apos;s
              recommendations for regulatory reform. An independent monitoring initiative.
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
                  Official Taskforce Report
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.centreforbritishprogress.org"
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
              Last updated: {new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
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

