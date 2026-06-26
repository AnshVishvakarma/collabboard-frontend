'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn(
      'bg-white dark:bg-card rounded-xl border border-border shadow-sm p-5',
      className
    )}>
      {children}
    </div>
  );
};