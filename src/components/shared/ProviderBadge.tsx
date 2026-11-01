'use client';

import React from 'react';
import { ProviderCode } from '@/types';
import { PaymentBrandIcon } from './PaymentBrandIcon';
import { getPaymentBrand, normalizePaymentBrandCode } from '@/lib/branding/PaymentBrandRegistry';

export interface ProviderBadgeProps {
  code: ProviderCode | string;
  name?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  iconOnly?: boolean;
  className?: string;
}

export function ProviderBadge({
  code,
  name,
  showName = true,
  size = 'md',
  iconOnly = false,
  className = '',
}: ProviderBadgeProps) {
  const brandCode = normalizePaymentBrandCode(code);
  const brandMeta = getPaymentBrand(brandCode);
  const displayName = name || brandMeta.shortName;

  if (iconOnly) {
    return (
      <div
        className={`inline-flex shrink-0 transition-transform hover:scale-105 duration-200 ${className}`}
        title={`${brandMeta.name} (${brandMeta.category})`}
      >
        <PaymentBrandIcon code={brandCode} size={size} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 group ${className}`}>
      <div className="shrink-0 transition-transform group-hover:scale-105 duration-200">
        <PaymentBrandIcon code={brandCode} size={size} />
      </div>
      {showName && (
        <span className="font-semibold text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] truncate group-hover:text-brand-primary transition-colors">
          {displayName}
        </span>
      )}
    </div>
  );
}
