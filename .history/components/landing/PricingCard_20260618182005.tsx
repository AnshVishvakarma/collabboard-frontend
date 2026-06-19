'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular: boolean;
}

export function PricingCard({ name, price, description, features, buttonText, isPopular }: PricingCardProps) {
  return (
    <div className={cn(
      'rounded-2xl p-6 bg-white border transition-all duration-300',
      isPopular 
        ? 'border-blue-500 shadow-lg shadow-blue-500/10 scale-105' 
        : 'border-gray-200 hover:shadow-md hover:border-blue-200'
    )} style={{padding:"23px"}}>
      {isPopular && (
        <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full mb-4">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        {price !== '$0' && <span className="text-gray-500">/month</span>}
      </div>
      <p className="text-gray-600 text-sm mb-6">{description}</p>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Button 
        className={cn(
          'w-full',
          isPopular ? 'bg-blue-600 hover:bg-blue-700' : 'border-2 border-gray-300 hover:border-blue-500'
        )}
        variant={isPopular ? 'default' : 'outline'}
      >
        {buttonText}
      </Button>
    </div>
  );
}