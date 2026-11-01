'use client';

import React from 'react';
import { normalizePaymentBrandCode, getPaymentBrand } from '@/lib/branding/PaymentBrandRegistry';

export interface PaymentBrandIconProps {
  code: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  shape?: 'rounded' | 'square' | 'circle' | 'none';
  showTooltip?: boolean;
}

export function PaymentBrandIcon({
  code,
  size = 'md',
  className = '',
  shape = 'rounded',
  showTooltip = false,
}: PaymentBrandIconProps) {
  const brandCode = normalizePaymentBrandCode(code);
  const brandMeta = getPaymentBrand(brandCode);
  const [imgError, setImgError] = React.useState(false);

  // Size mapping
  const sizeMap: Record<string, string> = {
    xs: 'w-4 h-4 text-[9px]',
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg',
  };

  const containerSize = typeof size === 'number' ? `w-[${size}px] h-[${size}px]` : sizeMap[size] || sizeMap.md;

  const shapeClass =
    shape === 'rounded'
      ? 'rounded-lg'
      : shape === 'circle'
      ? 'rounded-full'
      : shape === 'square'
      ? 'rounded-none'
      : '';

  const renderSvg = () => {
    switch (brandCode) {
      // 1. PHONEPE
      case 'phonepe':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#5F259F" />
            <circle cx="16" cy="16" r="10" fill="#FFFFFF" />
            {/* Authentic Hindi 'पे' Devanagari character */}
            <path
              d="M13 10.5H19M15.5 10.5V17C15.5 18 16.2 18.8 17.2 18.8H19.5M15.5 14H18.2C19.5 14 20.5 13.2 20.5 12C20.5 10.8 19.5 10.5 18.2 10.5M12.5 18.5L14 22H16.2L14.7 18.5H12.5Z"
              stroke="#5F259F"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      // 2. GOOGLE PAY
      case 'gpay':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#E1E8DF" strokeWidth="1" />
            {/* Google 4-color 'G' */}
            <path
              d="M14.5 16C14.5 15.4 14.4 14.9 14.3 14.4H8V17.5H11.7C11.5 18.5 10.9 19.3 10 19.9V21.9H12.8C14.4 20.4 15.3 18.2 14.5 16Z"
              fill="#4285F4"
            />
            <path
              d="M8 22.5C9.8 22.5 11.3 21.9 12.4 20.9L9.6 18.9C8.8 19.4 7.8 19.7 6.7 19.7C4.7 19.7 3.1 18.3 2.5 16.5H-0.4V18.6C0.8 21 3.2 22.5 6 22.5"
              fill="#34A853"
              transform="translate(2, -1)"
            />
            <path
              d="M4.5 15.5C4.2 14.6 4.2 13.7 4.5 12.8V10.7H1.6C0.4 12.9 0.4 15.4 1.6 17.6L4.5 15.5Z"
              fill="#FBBC04"
              transform="translate(2, 0)"
            />
            <path
              d="M8 8.5C9 8.5 9.9 8.8 10.6 9.5L12.9 7.2C11.5 5.9 9.8 5.2 8 5.2C5.2 5.2 2.8 6.7 1.6 9.1L4.5 11.2C5.1 9.4 6.7 8.5 8 8.5Z"
              fill="#EA4335"
              transform="translate(2, 1)"
            />
            {/* Wordmark Pay */}
            <path
              d="M17 12H19.8C21.2 12 22.2 12.9 22.2 14.2C22.2 15.6 21.2 16.5 19.8 16.5H18.2V20H17V12ZM18.2 15.4H19.7C20.5 15.4 21 14.9 21 14.2C21 13.6 20.5 13.1 19.7 13.1H18.2V15.4ZM23.2 17.3C23.2 16.4 23.9 15.7 24.8 15.7C25.5 15.7 26.1 16.1 26.3 16.7L25.3 17.1C25.1 16.8 24.9 16.7 24.7 16.7C24.3 16.7 24.1 17 24.1 17.3C24.1 17.7 24.4 18 24.8 18C25.1 18 25.3 17.9 25.4 17.7L26.3 18.2C26 18.7 25.5 19 24.8 19C23.9 19 23.2 18.3 23.2 17.3Z"
              fill="#5F6368"
            />
          </svg>
        );

      // 3. PAYTM
      case 'paytm':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#00BAF2" strokeWidth="1" />
            {/* Pay in navy blue */}
            <path
              d="M6 11H9.8C11.5 11 12.6 11.8 12.6 13.2C12.6 14.6 11.5 15.4 9.8 15.4H7.8V21H6V11ZM7.8 13.9H9.6C10.5 13.9 11 13.6 11 13.2C11 12.8 10.5 12.5 9.6 12.5H7.8V13.9ZM14 17.2C14 15.8 15 14.8 16.5 14.8C18 14.8 19 15.8 19 17.2V21H17.4V17.3C17.4 16.6 17 16.2 16.5 16.2C16 16.2 15.6 16.6 15.6 17.3V21H14V17.2Z"
              fill="#002970"
            />
            {/* tm in bright cyan */}
            <path
              d="M19.5 13.5H24.5V15H22.7V21H21.2V15H19.5V13.5ZM25 15H26.5V16.2C26.8 15.4 27.5 15 28.3 15C29.2 15 29.8 15.5 30 16.3C30.4 15.5 31.1 15 32 15C33.2 15 33.8 15.8 33.8 17.2V21H32.3V17.4C32.3 16.7 32 16.3 31.4 16.3C30.9 16.3 30.5 16.7 30.5 17.4V21H29V17.4C29 16.7 28.7 16.3 28.1 16.3C27.6 16.3 27.2 16.7 27.2 17.4V21H25.7V15H25Z"
              fill="#00BAF2"
              transform="scale(0.85) translate(3, 2)"
            />
          </svg>
        );

      // 4. BHARATPE
      case 'bharatpe':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#00B5B8" strokeWidth="1" />
            {/* Cyan outer ring */}
            <circle cx="16" cy="16" r="11" stroke="#00B5B8" strokeWidth="2.5" />
            {/* Tricolor bars: Orange top, White middle, Green bottom */}
            <rect x="10.5" y="12" width="11" height="2.2" rx="1" fill="#FF9933" />
            <rect x="10.5" y="14.9" width="11" height="2.2" rx="1" fill="#00B5B8" />
            <rect x="10.5" y="17.8" width="11" height="2.2" rx="1" fill="#138808" />
          </svg>
        );

      // 5. BHIM UPI
      case 'bhim':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#1C1E24" />
            {/* Italic BHIM */}
            <text
              x="5"
              y="18"
              fontFamily="sans-serif"
              fontSize="10"
              fontWeight="900"
              fontStyle="italic"
              fill="#FFFFFF"
            >
              BHIM
            </text>
            {/* Tri-color NPCI arrow chevrons */}
            <path d="M21 9L25 15L21 21H23.5L27.5 15L23.5 9H21Z" fill="#008848" />
            <path d="M24 9L28 15L24 21H26.5L30.5 15L26.5 9H24Z" fill="#F47920" />
          </svg>
        );

      // 6. AMAZON PAY
      case 'amazonpay':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#131921" />
            <text x="5" y="16" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#FFFFFF">
              amazon
            </text>
            <text x="18" y="22" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#FF9900">
              pay
            </text>
            {/* Authentic Amazon curved smile arrow */}
            <path
              d="M7 19C10.5 21.5 15.5 21.5 19 19.5"
              stroke="#FF9900"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path d="M19.8 19.2L18.4 18.5L18.9 20.2Z" fill="#FF9900" />
          </svg>
        );

      // 7. WHATSAPP PAY
      case 'whatsapppay':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#25D366" />
            {/* Speech bubble */}
            <path
              d="M16 7C11 7 7 11 7 16C7 17.8 7.5 19.4 8.5 20.8L7.2 24.8L11.4 23.5C12.8 24.4 14.3 25 16 25C21 25 25 21 25 16C25 11 21 7 16 7Z"
              fill="#FFFFFF"
            />
            {/* Phone receiver */}
            <path
              d="M13.2 11.8C12.9 11.2 12.6 11.2 12.3 11.2C12 11.2 11.7 11.2 11.4 11.5C11.1 11.8 10.3 12.6 10.3 14.1C10.3 15.7 11.4 17.2 11.6 17.4C11.7 17.6 13.8 20.8 17 22.2C19.7 23.3 20.3 23.1 20.9 23C21.5 22.9 22.8 22.2 23.1 21.4C23.4 20.6 23.4 19.9 23.3 19.7C23.2 19.5 23 19.4 22.7 19.2L20.8 18.3C20.5 18.1 20.2 18.2 20 18.5L19.2 19.5C19 19.7 18.8 19.8 18.5 19.6C18.2 19.5 17.2 19.1 16 18C15 17.1 14.4 16 14.2 15.7C14 15.4 14.2 15.2 14.3 15.1L15 14.2C15.2 14 15.1 13.8 15 13.6L13.8 12.2C13.5 12 13.3 12 13.2 11.8Z"
              fill="#25D366"
            />
          </svg>
        );

      // 8. CRED PAY
      case 'cred':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#121212" stroke="#333333" strokeWidth="1" />
            <rect x="7" y="7" width="18" height="18" rx="4" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M12 11H20V15H14V17H20V21H12V11Z" fill="#C0F477" />
          </svg>
        );

      // 9. FREECHARGE
      case 'freecharge':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#EB6324" />
            <circle cx="16" cy="16" r="10" fill="#EB6324" />
            {/* White Lightning Bolt inside circle */}
            <path
              d="M17.5 8L11 16.5H15.5L13.5 24L21 15.5H16.5L17.5 8Z"
              fill="#FFFFFF"
            />
          </svg>
        );

      // 10. MOBIKWIK
      case 'mobikwik':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#002E6E" />
            {/* Stylized Cyan 'M' */}
            <path
              d="M8 22V10L12 16L16 10V22H13.5V14.5L12 17L10.5 14.5V22H8Z"
              fill="#00BAF2"
            />
            <path
              d="M17.5 22V10L21.5 16L25.5 10V22H23V14.5L21.5 17L20 14.5V22H17.5Z"
              fill="#FFFFFF"
            />
          </svg>
        );

      // 11. AIRTEL THANKS / PAYMENTS BANK
      case 'airtel':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#ED1C24" />
            {/* Airtel signature white fluid curve */}
            <path
              d="M16 8C11.6 8 8 11.6 8 16C8 19.5 10.3 22.4 13.5 23.5C14.8 24 16.2 24 17.5 23.5C20.7 22.4 23 19.5 23 16C23 11.6 19.4 8 16 8ZM14.5 18.5C13.1 18.5 12 17.4 12 16C12 14.6 13.1 13.5 14.5 13.5C15.9 13.5 17 14.6 17 16C17 17.4 15.9 18.5 14.5 18.5Z"
              fill="#FFFFFF"
            />
          </svg>
        );

      // 12. JIOMONEY
      case 'jiomoney':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#005B9F" />
            <circle cx="16" cy="16" r="10.5" fill="#005B9F" stroke="#FFFFFF" strokeWidth="1" />
            {/* Indian Rupee ₹ Symbol */}
            <path
              d="M12 11H20M12 14H18.5M12 11V18C13.5 18 16 18 17.5 16.5M15 17L19.5 22"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      // 13. PAYZAPP BY HDFC BANK
      case 'payzapp':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#002D62" strokeWidth="1" />
            {/* Blue bracket [ PAY ] */}
            <path d="M7 11H9V21H7M15 11H13V21H15" stroke="#002D62" strokeWidth="1.8" />
            <text x="8.5" y="18" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#002D62">
              P
            </text>
            {/* Bold Red dynamic zigzag Z */}
            <path d="M17 11H25L19 17H25L23 21H15L21 15H15L17 11Z" fill="#D8232A" />
          </svg>
        );

      // 14. POCKETS BY ICICI BANK
      case 'pockets':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#F37021" strokeWidth="1" />
            {/* Polygon badge outline */}
            <polygon points="16,6 26,11 26,21 16,26 6,21 6,11" fill="#FFF5ED" stroke="#F37021" strokeWidth="1.5" />
            <text x="7.5" y="18" fontFamily="sans-serif" fontSize="6.5" fontWeight="900" fill="#F37021">
              pockets
            </text>
          </svg>
        );

      // 15. CHILLR (Legacy)
      case 'chillr':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#00B67A" />
            {/* Shield with cent ¢ symbol */}
            <path
              d="M16 7L24 10.5V17C24 22 20.5 25.5 16 27C11.5 25.5 8 22 8 17V10.5L16 7Z"
              fill="#009C68"
            />
            <path
              d="M16 11V21M18.5 13.5C14 13.5 13 15 13 16C13 17 14 18.5 18.5 18.5"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );

      // 16. TRUPAY
      case 'trupay':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#1E88E5" />
            <text x="4" y="20" fontFamily="sans-serif" fontSize="9" fontWeight="900" fontStyle="italic" fill="#FFFFFF">
              Trupay
            </text>
          </svg>
        );

      // 17. OXIGEN (Legacy)
      case 'oxigen':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#004A99" strokeWidth="1" />
            <circle cx="16" cy="16" r="10" stroke="#004A99" strokeWidth="3" fill="none" />
            <path d="M12.5 12.5L19.5 19.5M19.5 12.5L12.5 19.5" stroke="#00AEEF" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      // 18. MONEYONMOBILE
      case 'moneyonmobile':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#0C1F38" />
            <rect x="7" y="10" width="8" height="13" rx="2" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="11" cy="20.5" r="0.8" fill="#FFFFFF" />
            <text x="16.5" y="16" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#00BAF2">
              M
            </text>
            <text x="16.5" y="22" fontFamily="sans-serif" fontSize="6" fontWeight="bold" fill="#F47920">
              ON
            </text>
          </svg>
        );

      // 19. ZIPCASH
      case 'zipcash':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#1A211B" stroke="#00A859" strokeWidth="1" />
            <text x="4.5" y="18" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fontStyle="italic" fill="#00A859">
              ZipCash
            </text>
            <path d="M4.5 21H27M6.5 23H25" stroke="#00A859" strokeWidth="1.2" />
          </svg>
        );

      // 20. M-PURSE
      case 'mpurse':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#0E2C5A" />
            <text x="4.5" y="18" fontFamily="sans-serif" fontSize="7.5" fontWeight="bold" fill="#FFFFFF">
              mpurse
            </text>
            {/* Wireless broadcast signal arcs */}
            <path d="M22 11C23.5 12.5 23.5 15.5 22 17M24.5 9C27 12 27 17 24.5 20" stroke="#00AEEF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      // 21. AADHAAR PAY
      case 'aadhaar':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFF9E6" stroke="#F5A623" strokeWidth="1.5" />
            {/* Fingerprint biometric stylized arcs */}
            <path d="M12 11C14 9.5 18 9.5 20 11M10 14C13 12 19 12 22 14M11 17C14 15.5 18 15.5 21 17" stroke="#D0021B" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="5" y="19" width="22" height="8" rx="2" fill="#F5A623" />
            <text x="7" y="25" fontFamily="sans-serif" fontSize="6.5" fontWeight="900" fill="#9013FE">
              PAY
            </text>
          </svg>
        );

      // 22. ITZCASH
      case 'itzcash':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#002966" />
            <ellipse cx="16" cy="16" rx="13" ry="9" stroke="#FF9900" strokeWidth="1.2" />
            <text x="6" y="18" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#FFFFFF">
              ItzCash
            </text>
            <path d="M21 11L25 13L22 15L21 11Z" fill="#FF9900" />
          </svg>
        );

      // 23. QUIKWALLET
      case 'quikwallet':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#00B4D8" strokeWidth="1" />
            {/* Infinity loops */}
            <circle cx="12" cy="15" r="4.5" stroke="#00B4D8" strokeWidth="2.5" fill="none" />
            <circle cx="20" cy="15" r="4.5" stroke="#C05020" strokeWidth="2.5" fill="none" />
            <text x="5.5" y="24" fontFamily="sans-serif" fontSize="5" fontWeight="bold" fill="#333333">
              Quikwallet
            </text>
          </svg>
        );

      // 24. SBI BUDDY (Legacy)
      case 'sbi_buddy':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#0091DA" strokeWidth="1" />
            <circle cx="10" cy="16" r="5" fill="#0091DA" />
            <rect x="9.2" y="16" width="1.6" height="4" fill="#FFFFFF" />
            <text x="16" y="18" fontFamily="sans-serif" fontSize="6.5" fontWeight="bold" fill="#002D62">
              Buddy
            </text>
          </svg>
        );

      // 25. MRUPEE (Legacy)
      case 'mrupee':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#0A3C78" strokeWidth="1" />
            {/* Growth bar chart */}
            <rect x="5" y="17" width="2" height="5" fill="#0A3C78" />
            <rect x="8" y="14" width="2" height="8" fill="#0A3C78" />
            <rect x="11" y="11" width="2" height="11" fill="#0A3C78" />
            <text x="14" y="18" fontFamily="sans-serif" fontSize="6.5" fontWeight="900" fill="#0A3C78">
              RUPEE
            </text>
          </svg>
        );

      // 26. CITRUS PAY (Legacy)
      case 'citrus':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#F37023" strokeWidth="1" />
            <circle cx="11" cy="16" r="6" stroke="#F37023" strokeWidth="2.5" fill="none" />
            <text x="18" y="18.5" fontFamily="sans-serif" fontSize="6.5" fontWeight="bold" fill="#F37023">
              Citrus
            </text>
          </svg>
        );

      // 27. FINO PAYMENTS BANK
      case 'fino':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#9C1A2E" strokeWidth="1" />
            {/* Fino star outline icon */}
            <path
              d="M11 11L13 14H16L13.5 16L14.5 19L11 17L7.5 19L8.5 16L6 14H9L11 11Z"
              stroke="#9C1A2E"
              strokeWidth="1.5"
              fill="#FFF0F2"
            />
            <text x="16" y="18" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#1C3F7A">
              Fino
            </text>
          </svg>
        );

      // 28. BANK OF BARODA / BHIM BARODA PAY
      case 'bob':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#F26522" strokeWidth="1" />
            {/* Baroda vermilion sun rays stylized 'B' */}
            <circle cx="10" cy="16" r="5" fill="#F26522" />
            <path d="M10 8V11M10 21V24M4 16H7M13 16H16" stroke="#F26522" strokeWidth="1.5" />
            <text x="16" y="18" fontFamily="sans-serif" fontSize="6" fontWeight="bold" fill="#F26522">
              Baroda
            </text>
          </svg>
        );

      // 29. RBL BANK BHIM
      case 'rbl':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#9B2779" />
            <circle cx="16" cy="16" r="10" fill="#FFFFFF" />
            <text x="10" y="19" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#9B2779">
              RBL
            </text>
          </svg>
        );

      // 30. BHIM SBI PAY
      case 'sbi_pay':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#0091DA" strokeWidth="1" />
            <rect x="7" y="8" width="10" height="16" rx="2" stroke="#002D62" strokeWidth="1.5" />
            <path d="M10 14H14M12 12L14 14L12 16M14 18H10M12 16L10 18L12 20" stroke="#0091DA" strokeWidth="1.2" />
            <circle cx="23" cy="16" r="4.5" fill="#0091DA" />
            <rect x="22.2" y="16" width="1.6" height="3.5" fill="#FFFFFF" />
          </svg>
        );

      // 31. PAYWIZ (IDBI Bank)
      case 'paywiz':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#00875A" />
            <text x="5" y="16" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#FFFFFF">
              PayWiz
            </text>
            <text x="11" y="23" fontFamily="sans-serif" fontSize="5.5" fontWeight="bold" fill="#C0F477">
              UPI
            </text>
          </svg>
        );

      // 32. AXIS BANK / BHIM AXIS PAY
      case 'axis':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#97144D" />
            {/* Burgundy maroon tilted pyramid triangle 'A' */}
            <path d="M16 8L24 24H18.5L16 19L13.5 24H8L16 8Z" fill="#FFFFFF" />
            <path d="M16 13L18.5 18H13.5L16 13Z" fill="#97144D" />
          </svg>
        );

      // 33. HDFC BANK
      case 'hdfc_bank':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#004C8F" />
            <rect x="7" y="7" width="18" height="18" fill="#FFFFFF" />
            <rect x="9" y="9" width="14" height="14" fill="#ED1C24" />
            <rect x="11" y="11" width="10" height="10" fill="#004C8F" />
            <rect x="13.5" y="7" width="5" height="18" fill="#FFFFFF" />
            <rect x="7" y="13.5" width="18" height="5" fill="#FFFFFF" />
          </svg>
        );

      // 34. ICICI BANK
      case 'icici_bank':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#8C1824" />
            <circle cx="16" cy="16" r="10" fill="#B83227" />
            {/* Stylized 'i' in gold/white */}
            <circle cx="16" cy="11.5" r="2" fill="#F79E1B" />
            <path d="M14.5 15H17.5V21H14.5V15Z" fill="#FFFFFF" />
          </svg>
        );

      // 35. SBI CORPORATE
      case 'sbi':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#0091DA" />
            <circle cx="16" cy="16" r="10" fill="#0091DA" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="14.5" y="16" width="3" height="7" fill="#FFFFFF" />
            <circle cx="16" cy="16" r="3.2" fill="#FFFFFF" />
            <circle cx="16" cy="16" r="1.8" fill="#0091DA" />
          </svg>
        );

      // 36. RAZORPAY
      case 'razorpay':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#0C2340" />
            <path
              d="M19.5 8H12L8.5 24H13.2L14.8 17.2H17.8L21.2 24H25.5L21.8 16.5C23.6 15.4 24.5 13.6 24.5 11.5C24.5 9.2 22.5 8 19.5 8ZM18.8 13.5H14L14.7 10.8H18.6C19.9 10.8 20.6 11.3 20.6 12.1C20.6 13 19.8 13.5 18.8 13.5Z"
              fill="#0A85EA"
            />
            <path d="M11 20L15.5 11H18L13.5 20H11Z" fill="#3395FF" opacity="0.9" />
          </svg>
        );

      // 37. CASHFREE
      case 'cashfree':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#1E0B38" />
            <circle cx="16" cy="16" r="11" stroke="#F1B815" strokeWidth="2" strokeDasharray="50 15" />
            <path d="M16 9L11 16H15.5L14 23L21 15H16.5L18 9H16Z" fill="#F1B815" />
          </svg>
        );

      // 38. STRIPE
      case 'stripe':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#635BFF" />
            {/* Bold slanted 'S' */}
            <path
              d="M18.8 13.2C18.8 12.3 17.9 11.6 16.5 11.6C14.8 11.6 13.4 12.3 12.4 12.9L11.5 10.5C12.8 9.7 14.7 9.2 16.8 9.2C19.8 9.2 21.8 10.7 21.8 13.3C21.8 17.2 16.5 16.7 16.5 18.8C16.5 19.8 17.6 20.4 19.1 20.4C20.9 20.4 22.6 19.6 23.7 18.9L24.6 21.3C23.2 22.2 21.1 22.8 18.9 22.8C15.6 22.8 13.5 21.2 13.5 18.7C13.5 14.6 18.8 15.3 18.8 13.2Z"
              fill="#FFFFFF"
            />
          </svg>
        );

      // 39. PAYPAL
      case 'paypal':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#00457C" strokeWidth="1" />
            {/* Dual interlocking 'P' */}
            <path
              d="M10 9H16C18.2 9 19.8 10.5 19.8 12.5C19.8 14.5 18.2 16 16 16H12.5L11 23H8.5L10 9Z"
              fill="#0079C1"
            />
            <path
              d="M13 12H19C21.2 12 22.8 13.5 22.8 15.5C22.8 17.5 21.2 19 19 19H15.5L14 26H11.5L13 12Z"
              fill="#00457C"
              opacity="0.85"
            />
          </svg>
        );

      // 40. VISA
      case 'visa':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#1A1F71" strokeWidth="1" />
            <text
              x="5"
              y="20"
              fontFamily="sans-serif"
              fontSize="10"
              fontWeight="900"
              fontStyle="italic"
              fill="#1A1F71"
              letterSpacing="1"
            >
              VISA
            </text>
            <path d="M5 13L8 13L6.5 18H5L5 13Z" fill="#F7B600" />
          </svg>
        );

      // 41. MASTERCARD
      case 'mastercard':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#141414" />
            {/* Interlocking Red & Orange circles */}
            <circle cx="12.5" cy="16" r="7" fill="#EB001B" />
            <circle cx="19.5" cy="16" r="7" fill="#F79E1B" fillOpacity="0.9" />
          </svg>
        );

      // 42. RUPAY
      case 'rupay':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#009540" strokeWidth="1" />
            <text x="4" y="19" fontFamily="sans-serif" fontSize="7.5" fontWeight="900" fontStyle="italic" fill="#003366">
              RuPay
            </text>
            <path d="M22 11L25 16L22 21H24L27 16L24 11H22Z" fill="#F47920" />
            <path d="M25 11L28 16L25 21H27L30 16L27 11H25Z" fill="#009540" />
          </svg>
        );

      // 43. AMERICAN EXPRESS (AMEX)
      case 'amex':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#006FCF" />
            <rect x="5" y="8" width="22" height="16" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="7" y="18" fontFamily="sans-serif" fontSize="7" fontWeight="900" fill="#FFFFFF">
              AMEX
            </text>
          </svg>
        );

      // 44. UPI CORE (Sovereign Switch)
      case 'upi':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#1C1E24" />
            <text x="5" y="20" fontFamily="sans-serif" fontSize="9.5" fontWeight="900" fontStyle="italic" fill="#FFFFFF">
              UPI
            </text>
            <path d="M21 10L25 16L21 22H23.5L27.5 16L23.5 10H21Z" fill="#008848" />
            <path d="M24 10L28 16L24 22H26.5L30.5 16L26.5 10H24Z" fill="#F47920" />
          </svg>
        );

      // 45. NET BANKING (Corporate Switch)
      case 'netbanking':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#0F2840" />
            {/* Classical bank columns */}
            <path d="M7 11L16 6L25 11H7Z" fill="#C0F477" />
            <rect x="8.5" y="12" width="2.5" height="10" fill="#FFFFFF" />
            <rect x="13" y="12" width="2.5" height="10" fill="#FFFFFF" />
            <rect x="17.5" y="12" width="2.5" height="10" fill="#FFFFFF" />
            <rect x="22" y="12" width="2.5" height="10" fill="#FFFFFF" />
            <rect x="6.5" y="23" width="19" height="3" rx="1" fill="#C0F477" />
          </svg>
        );

      // 46. BANK TRANSFER (RTGS / NEFT / IMPS)
      case 'banktransfer':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#105B3A" />
            <path
              d="M8 13H21M21 13L17 9M21 13L17 17"
              stroke="#C0F477"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24 19H11M11 19L15 15M11 19L15 23"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      // 47. DEBIT / CREDIT CARDS
      case 'debitcards':
      case 'creditcards':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#1E252B" stroke="#3A4750" strokeWidth="1" />
            <rect x="6" y="9" width="20" height="14" rx="2.5" fill="#2E3842" />
            <rect x="6" y="12" width="20" height="3" fill="#12161A" />
            {/* EMV Chip */}
            <rect x="9" y="16" width="4.5" height="4" rx="0.8" fill="#F79E1B" />
          </svg>
        );

      // DEFAULT FALLBACK
      default:
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect width="32" height="32" rx="8" fill="#1A211B" stroke="#303A31" strokeWidth="1" />
            <circle cx="16" cy="16" r="6" stroke="#C0F477" strokeWidth="2" strokeDasharray="4 2" />
            <path d="M14 16L18 16M16 14L16 18" stroke="#C0F477" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 overflow-hidden ${containerSize} ${shapeClass} ${className}`}
      title={showTooltip ? `${brandMeta.name} (${brandMeta.category})` : undefined}
    >
      {brandMeta.assetPath && !imgError ? (
        <img
          src={brandMeta.assetPath}
          alt={brandMeta.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain pointer-events-none select-none"
          loading="lazy"
        />
      ) : (
        renderSvg()
      )}
    </div>
  );
}
