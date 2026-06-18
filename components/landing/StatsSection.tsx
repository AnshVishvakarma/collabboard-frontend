// components/landing/StatsSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface StatItem {
  label: string;
  value: string;
  suffix?: string;
}

const stats: StatItem[] = [
  { label: 'Teams worldwide', value: '10,000+', suffix: '+' },
  { label: 'Average rating', value: '4.9', suffix: '/5' },
  { label: 'Reviews', value: '1,500+', suffix: '+' },
];

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="px-4 py-16 bg-white border-y border-gray-100">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={cn(
                'text-center transition-all duration-700 transform',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                `delay-${index * 100}`
              )}
            >
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {stat.value}
                {stat.suffix && (
                  <span className="text-blue-600 text-xl md:text-2xl font-medium">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Rating Stars */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-6 h-6 text-yellow-400 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-sm text-gray-600 ml-2">Based on 1,500+ reviews</span>
        </div>
      </div>
    </section>
  );
}