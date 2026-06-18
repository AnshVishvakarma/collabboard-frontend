// components/ui/Card/Card.tsx
import { cn } from '@/lib/utils';

interface CardProps {
  isSelected?: boolean;
  isHoverable?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Card({ 
  isSelected = false, 
  isHoverable = true, 
  className,
  children 
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-6 bg-white shadow-sm',
        // Conditional classes
        isSelected && 'border-blue-500 ring-2 ring-blue-200',
        isHoverable && 'hover:shadow-md hover:-translate-y-1 transition-all duration-200',
        // Custom classes
        className
      )}
    >
      {children}
    </div>
  );
}