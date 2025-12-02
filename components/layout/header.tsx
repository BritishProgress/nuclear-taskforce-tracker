'use client';

import { cn } from '@/lib/utils';
import { ExternalLink, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <img 
            src="/icon_dark.svg" 
            alt="Nuclear Taskforce" 
            className="w-8 h-8"
          />
          <span className="hidden sm:inline text-dark-green">
            Nuclear Taskforce Tracker
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
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
            Read the full report
            <ExternalLink size={12} />
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground/80 hover:text-foreground transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-3">
            <Link
              href="/"
              className="block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/timeline"
              className="block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Timeline
            </Link>
            <a
              href="https://www.gov.uk/government/publications/nuclear-regulatory-taskforce"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Read the full report
              <ExternalLink size={12} />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

