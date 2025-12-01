'use client';

import { cn } from '@/lib/utils';
import { Atom, Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-dark-green text-beige">
            <Atom size={18} />
          </div>
          <span className="hidden sm:inline text-dark-green">
            Nuclear Taskforce Tracker
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/timeline"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Timeline
          </Link>
          <a
            href="https://www.gov.uk/government/publications/nuclear-regulatory-taskforce"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Report
            <ExternalLink size={12} />
          </a>
        </nav>
      </div>
    </header>
  );
}

