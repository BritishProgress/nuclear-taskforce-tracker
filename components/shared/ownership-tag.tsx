'use client';

import { cn } from '@/lib/utils';
import { OWNER_FULL_NAMES } from '@/lib/constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface OwnershipTagProps {
  owner: string;
  isPrimary?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function OwnershipTag({
  owner,
  isPrimary = false,
  size = 'md',
  className,
}: OwnershipTagProps) {
  const fullName = OWNER_FULL_NAMES[owner] || owner;
  const showTooltip = fullName !== owner;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-0.5',
  };

  const tag = (
    <span
      className={cn(
        'inline-flex items-center rounded font-mono',
        isPrimary
          ? 'bg-dark-green text-beige font-medium'
          : 'bg-muted text-muted-foreground',
        sizeClasses[size],
        className
      )}
    >
      {owner}
    </span>
  );

  if (!showTooltip) {
    return tag;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{tag}</TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{fullName}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface OwnershipListProps {
  primaryOwner: string;
  coOwners?: string[];
  size?: 'sm' | 'md';
  className?: string;
}

export function OwnershipList({
  primaryOwner,
  coOwners,
  size = 'md',
  className,
}: OwnershipListProps) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      <OwnershipTag owner={primaryOwner} isPrimary size={size} />
      {coOwners?.map((owner) => (
        <OwnershipTag key={owner} owner={owner} size={size} />
      ))}
    </div>
  );
}

