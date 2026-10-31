'use client';

import React from 'react';
import { ProviderCode } from '@/types';

interface ProviderBadgeProps {
  code: ProviderCode | string;
  name?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProviderBadge({ code, name, showName = true, size = 'md' }: ProviderBadgeProps) {
  const getProviderMeta = (c: string) => {
    switch (c) {
      case 'razorpay':
        return {
          label: 'Razorpay',
          bg: 'bg-[#0c2340]',
          border: 'border-[#3395ff]/40',
          text: 'text-[#3395ff]',
          tag: 'RZP',
        };
      case 'cashfree':
        return {
          label: 'Cashfree Payments',
          bg: 'bg-[#1e1333]',
          border: 'border-[#7a38ff]/40',
          text: 'text-[#9c66ff]',
          tag: 'CF',
        };
      case 'phonepe':
        return {
          label: 'PhonePe UPI',
          bg: 'bg-[#211236]',
          border: 'border-[#5f259f]/40',
          text: 'text-[#9b51e0]',
          tag: 'Pe',
        };
      case 'paytm':
        return {
          label: 'Paytm Business',
          bg: 'bg-[#0a2540]',
          border: 'border-[#00baf2]/40',
          text: 'text-[#00baf2]',
          tag: 'PTM',
        };
      case 'gpay':
        return {
          label: 'Google Pay',
          bg: 'bg-[#152417]',
          border: 'border-[#34a853]/40',
          text: 'text-[#34a853]',
          tag: 'GPay',
        };
      case 'bhim':
        return {
          label: 'BHIM UPI',
          bg: 'bg-[#29170e]',
          border: 'border-[#f37023]/40',
          text: 'text-[#f37023]',
          tag: 'BHIM',
        };
      case 'stripe':
        return {
          label: 'Stripe Global',
          bg: 'bg-[#1a1c36]',
          border: 'border-[#635bff]/40',
          text: 'text-[#635bff]',
          tag: 'Stripe',
        };
      case 'paypal':
        return {
          label: 'PayPal',
          bg: 'bg-[#0c2340]',
          border: 'border-[#00457c]/40',
          text: 'text-[#0079c1]',
          tag: 'PP',
        };
      case 'payu':
        return {
          label: 'PayU Payments',
          bg: 'bg-[#1c2e17]',
          border: 'border-[#84b819]/40',
          text: 'text-[#84b819]',
          tag: 'PayU',
        };
      case 'ccavenue':
        return {
          label: 'CCAvenue',
          bg: 'bg-[#2c1a17]',
          border: 'border-[#ff5900]/40',
          text: 'text-[#ff5900]',
          tag: 'CCA',
        };
      case 'hdfc_bank':
        return {
          label: 'HDFC Corporate Bank',
          bg: 'bg-[#10223b]',
          border: 'border-[#004c8f]/40',
          text: 'text-[#004c8f]',
          tag: 'HDFC',
        };
      case 'icici_bank':
        return {
          label: 'ICICI CIB Banking',
          bg: 'bg-[#2e1714]',
          border: 'border-[#f58220]/40',
          text: 'text-[#f58220]',
          tag: 'ICICI',
        };
      default:
        return {
          label: name || 'Payment Rail',
          bg: 'bg-[#1A211B]',
          border: 'border-[#303A31]',
          text: 'text-[#A0ACA1]',
          tag: 'RAIL',
        };
    }
  };

  const meta = getProviderMeta(code);
  const displayName = name || meta.label;

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div
        className={`inline-flex items-center justify-center font-bold tracking-wider rounded-md border ${meta.bg} ${meta.border} ${meta.text} ${sizeStyles[size]}`}
      >
        <span>{meta.tag}</span>
      </div>
      {showName && (
        <span className="font-medium text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] truncate">
          {displayName}
        </span>
      )}
    </div>
  );
}

