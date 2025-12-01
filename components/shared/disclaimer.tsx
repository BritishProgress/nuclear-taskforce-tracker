import { cn } from '@/lib/utils';

export function Disclaimer({ className }: { className?: string }) {
  return (
    <div className={cn('text-center max-w-2xl mx-auto mt-4', className)}>
      <p className="text-xs text-muted-foreground leading-relaxed">
        The content in this tracker is partially AI-generated based on the{' '}
        <a
          href="https://www.gov.uk/government/publications/nuclear-regulatory-taskforce"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Nuclear Regulatory Taskforce report
        </a>
        . We have worked hard to ensure it is accurate, but some of the titles, descriptions, etc. may be slightly different or truncated. If you find any errors or inaccuracies, please{' '}
        <a
          href="https://britishprogress.org/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-bold"
        >
          report them to us
        </a>
        .
      </p>
    </div>
  );
}

