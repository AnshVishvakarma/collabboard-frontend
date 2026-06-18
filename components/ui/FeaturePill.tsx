'use client';

interface FeaturePillProps {
  icon: string;
  text: string;
}

export function FeaturePill({ icon, text }: FeaturePillProps) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200">
      <span className="text-base">{icon}</span>
      {text}
    </span>
  );
}