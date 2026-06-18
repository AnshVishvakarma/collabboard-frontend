'use client';

interface StatsCardProps {
  value: string;
  label: string;
  icon?: string;
  subtext?: string;
}

export function StatsCard({ value, label, icon, subtext }: StatsCardProps) {
  return (
    <div className="text-center group">
      {icon && (
        <div className="text-4xl mb-3">{icon}</div>
      )}
      <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
        {value}
      </div>
      <div className="text-gray-600 text-sm md:text-base">
        {label}
      </div>
      {subtext && (
        <div className="text-gray-400 text-xs mt-1">
          {subtext}
        </div>
      )}
    </div>
  );
}