'use client';

import React from 'react';
import { ProviderCode } from '@/types';

interface ProviderBadgeProps {
  code: ProviderCode | string;
  name?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  iconOnly?: boolean;
}

export function ProviderBadge({
  code,
  name,
  showName = true,
  size = 'md',
  iconOnly = false,
}: ProviderBadgeProps) {
  const normalized = (code || '').toLowerCase().replace(/[-_]/g, '');

  const renderIcon = (c: string, iconClass: string) => {
    switch (true) {
      // 1. RAZORPAY
      case c.includes('razorpay') || c === 'rzp':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={iconClass}>
            <rect width="32" height="32" rx="8" fill="#0C2340" />
            <path
              d="M19.5 8H12L8.5 24H13.2L14.8 17.2H17.8L21.2 24H25.5L21.8 16.5C23.6 15.4 24.5 13.6 24.5 11.5C24.5 9.2 22.5 8 19.5 8ZM18.8 13.5H14L14.7 10.8H18.6C19.9 10.8 20.6 11.3 20.6 12.1C20.6 13 19.8 13.5 18.8 13.5Z"
              fill="#0A85EA"
            />
            <path d="M11 20L15.5 11H18L13.5 20H11Z" fill="#3395FF" opacity="0.9" />
          </svg>
        );

      // 2. PHONEPE
      case c.includes('phonepe') || c === 'pe':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={iconClass}>
            <rect width="32" height="32" rx="8" fill="#5F259F" />
            <circle cx="16" cy="16" r="11" fill="#6739B7" />
            {/* Stylized Devanagari 'Pe' */}
            <path
              d="M13 10H18.5C20.4 10 21.8 11.3 21.8 13.2C21.8 15.1 20.4 16.5 18.5 16.5H15.2V22H13V10ZM15.2 14.5H18.2C19.2 14.5 19.8 14 19.8 13.2C19.8 12.5 19.2 12 18.2 12H15.2V14.5Z"
              fill="#FFFFFF"
            />
            <path d="M17.5 16.5L21.5 22H19L15.2 16.5H17.5Z" fill="#FFFFFF" opacity="0.9" />
          </svg>
        );

      // 3. CASHFREE
      case c.includes('cashfree') || c === 'cf':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={iconClass}>
            <rect width="32" height="32" rx="8" fill="#1E0B38" />
            <path
              d="M10 11C10 9.3 11.3 8 13 8H20C21.1 8 22 8.9 22 10V11H14C13.4 11 13 11.4 13 12V14.5C13 15.1 13.4 15.5 14 15.5H21C21.6 15.5 22 15.9 22 16.5V17.5C22 18.1 21.6 18.5 21 18.5H13C12.4 18.5 12 18.9 12 19.5V24H10V11Z"
              fill="#FF3366"
            />
            <circle cx="19.5" cy="21.5" r="2.5" fill="#00E5FF" />
          </svg>
        );

      // 4. GOOGLE PAY
      case c.includes('gpay') || c.includes('google'):
        return (
          <svg viewBox="0 0 32 32" fill="none" className={iconClass}>
            <rect width="32" height="32" rx="8" fill="#141A16" />
            <path
              d="M21.7 14.6H16V17.5H19.3C18.9 19.3 17.3 20.3 16 20.3C13.6 20.3 11.7 18.4 11.7 16C11.7 13.6 13.6 11.7 16 11.7C17.1 11.7 18.1 12.1 18.8 12.8L21 10.7C19.7 9.4 18 8.7 16 8.7C12 8.7 8.7 12 8.7 16C8.7 20 12 23.3 16 23.3C20.2 23.3 22.3 20.3 22.3 16.2C22.3 15.6 22.2 15.1 22.1 14.6H21.7Z"
              fill="#4285F4"
            />
            <path d="M10.1 13.8L12.5 15.6C13.1 13.9 14.4 12.8 16 12.8V9.8C13.5 9.8 11.4 11.4 10.1 13.8Z" fill="#EA4335" />
            <path d="M16 22.2C17.6 22.2 19 21.6 20 20.7L17.7 18.8C17.2 19.2 16.6 19.4 16 19.4C14.4 19.4 13.1 18.3 12.5 16.8L10.1 18.6C11.3 20.7 13.5 22.2 16 22.2Z" fill="#34A853" />
            <path d="M10.1 13.8C9.8 14.5 9.6 15.2 9.6 16C9.6 16.8 9.8 17.5 10.1 18.2L12.5 16.4C12.4 16.1 12.3 15.8 12.3 15.5C12.3 15.2 12.4 14.9 12.5 14.6L10.1 13.8Z" fill="#FBBC05" />
          </svg>
        );

      // 5. PAYTM
      case c.includes('paytm') || c === 'ptm':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={iconClass}>
            <rect width="32" height="32" rx="8" fill="#002970" />
            <path
              d="M7 11.5H10.5C11.8 11.5 12.8 12.4 12.8 13.7C12.8 15 11.8 15.9 10.5 15.9H9V20.5H7V11.5ZM9 14.2H10.3C10.7 14.2 11 13.9 11 13.7C11 13.4 10.7 13.1 10.3 13.1H9V14.2Z"
              fill="#00BAF2"
            />
            <path
              d="M14 14.2H16.2V20.5H18V14.2H20.2V12.5H14V14.2Z"
              fill="#FFFFFF"
            />
            <path
              d="M21 12.5H23L24.5 17.5L26 12.5H28V20.5H26.2V15.5L24.8 20.5H24.2L22.8 15.5V20.5H21V12.5Z"
              fill="#00BAF2"
            />
          </svg>
        );

      // 6. BHIM UPI
      case c.includes('bhim') || c.includes('npci'):
        return (
          <svg viewBox="0 0 32 32" fill="none" className={iconClass}>
            <rect width="32" height="32" rx="8" fill="#0A2012" />
            <path d="M12 9L18 16L12 23H15.5L21.5 16L15.5 9H12Z" fill="#FF9933" />
            <path d="M9 16L15 23H18.5L12.5 16H9Z" fill="#138808" />
            <circle cx="16" cy="16" r="1.5" fill="#000080" />
          </svg>
        );

      // 7. STRIPE
      case c.includes('stripe'):
        return (
          <svg viewBox="0 0 32 32" fill="none" className={iconClass}>
            <rect width="32" height="32" rx="8" fill="#1A1C36" />
            <path
              d="M17.8 13.4C17.8 12.8 17.3 12.4 16.3 12.4C15.1 12.4 13.6 12.8 12.6 13.4L11.8 10.6C13.1 9.9 14.8 9.5 16.5 9.5C19.7 9.5 21.9 11.1 21.9 14.1C21.9 18.5 16.2 18.1 16.2 20.1C16.2 20.8 16.8 21.2 17.9 21.2C19.3 21.2 20.9 20.6 22.1 19.8L22.8 22.6C21.4 23.4 19.5 23.9 17.7 23.9C14.3 23.9 12 22.3 12 19.2C12 14.6 17.8 15.2 17.8 13.4Z"
              fill="#635BFF"
            />
          </svg>
        );

      // 8. HDFC BANK
      case c.includes('hdfc'):
        return (
          <svg viewBox="0 0 32 32" fill="none" className={iconClass}>
            <rect width="32" height="32" rx="8" fill="#004C8F" />
            <rect x="8" y="8" width="16" height="16" fill="#004C8F" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="12" y="12" width="8" height="8" fill="#ED1C24" />
            <line x1="16" y1="8" x2="16" y2="24" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="8" y1="16" x2="24" y2="16" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        );

      // 9. PAYU
      case c.includes('payu'):
        return (
          <svg viewBox="0 0 32 32" fill="none" className={iconClass}>
            <rect width="32" height="32" rx="8" fill="#122410" />
            <path
              d="M10 10H14.5C16.5 10 18 11.2 18 13.2C18 15.2 16.5 16.4 14.5 16.4H12V22H10V10ZM12 14.5H14.3C15.2 14.5 15.8 14 15.8 13.2C15.8 12.4 15.2 11.9 14.3 11.9H12V14.5Z"
              fill="#A5C800"
            />
            <path
              d="M19 14V19C19 20.7 20.3 22 22 22C23.7 22 25 20.7 25 19V14H23V19C23 19.6 22.6 20 22 20C21.4 20 21 19.6 21 19V14H19Z"
              fill="#A5C800"
            />
          </svg>
        );

      // 10. CCAVENUE
      case c.includes('ccavenue') || c === 'cca':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={iconClass}>
            <rect width="32" height="32" rx="8" fill="#241210" />
            <path
              d="M16 8C11.6 8 8 11.6 8 16C8 20.4 11.6 24 16 24C19.3 24 22.1 22 23.3 19.1L20.8 18.2C20 20 18.1 21.3 16 21.3C13.1 21.3 10.7 18.9 10.7 16C10.7 13.1 13.1 10.7 16 10.7C18.1 10.7 20 12 20.8 13.8L23.3 12.9C22.1 10 19.3 8 16 8Z"
              fill="#E41E26"
            />
            <path d="M18.5 16H24V17.5H18.5V16Z" fill="#F58220" />
          </svg>
        );

      // 11. PAYPAL
      case c.includes('paypal') || c === 'pp':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={iconClass}>
            <rect width="32" height="32" rx="8" fill="#0C2340" />
            <path
              d="M12.5 9H18.2C20.6 9 22.2 10.2 21.8 12.8C21.4 15.2 19.5 16.8 17.2 16.8H14.8L13.7 23.5H10.5L12.5 9Z"
              fill="#0079C1"
            />
            <path
              d="M14.5 12H19.5C21.6 12 23 13.1 22.6 15.4C22.2 17.6 20.5 19 18.4 19H16.4L15.6 24H12.8L14.5 12Z"
              fill="#00457C"
              opacity="0.85"
            />
          </svg>
        );

      // 12. ICICI BANK
      case c.includes('icici'):
        return (
          <svg viewBox="0 0 32 32" fill="none" className={iconClass}>
            <rect width="32" height="32" rx="8" fill="#8C1824" />
            <circle cx="16" cy="16" r="10" stroke="#F37021" strokeWidth="2" fill="none" />
            <circle cx="16" cy="12" r="2" fill="#F37021" />
            <path d="M14.5 15.5H17.5V21H14.5V15.5Z" fill="#F37021" />
          </svg>
        );

      // Default
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-[#1A211B] border border-[#303A31] flex items-center justify-center font-mono font-bold text-[10px] text-brand-primary">
            {(c.slice(0, 3) || 'PAY').toUpperCase()}
          </div>
        );
    }
  };

  const getLabel = (c: string) => {
    if (name) return name;
    if (c.includes('razorpay')) return 'Razorpay Gateway';
    if (c.includes('phonepe')) return 'PhonePe for Business';
    if (c.includes('cashfree')) return 'Cashfree Payments';
    if (c.includes('gpay')) return 'Google Pay Business';
    if (c.includes('paytm')) return 'Paytm Business';
    if (c.includes('bhim')) return 'BHIM UPI NPCI';
    if (c.includes('stripe')) return 'Stripe Global';
    if (c.includes('hdfc')) return 'HDFC Corporate Bank';
    if (c.includes('payu')) return 'PayU Enterprise';
    if (c.includes('ccavenue')) return 'CCAvenue';
    if (c.includes('paypal')) return 'PayPal Commerce';
    if (c.includes('icici')) return 'ICICI Corporate CIB';
    return name || 'Payment Rail';
  };

  const iconDimension = {
    sm: 'w-6 h-6 rounded-md',
    md: 'w-8 h-8 rounded-lg shadow-sm',
    lg: 'w-10 h-10 rounded-xl shadow-md',
    xl: 'w-12 h-12 rounded-2xl shadow-lg',
  }[size];

  if (iconOnly) {
    return (
      <div className="inline-flex shrink-0 transition-transform hover:scale-105 duration-200">
        {renderIcon(normalized, iconDimension)}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2.5 group">
      <div className="shrink-0 transition-transform group-hover:scale-105 duration-200">
        {renderIcon(normalized, iconDimension)}
      </div>
      {showName && (
        <span className="font-semibold text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] truncate group-hover:text-brand-primary transition-colors">
          {getLabel(normalized)}
        </span>
      )}
    </div>
  );
}
