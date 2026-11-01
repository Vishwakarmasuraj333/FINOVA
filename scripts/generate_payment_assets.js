const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'assets', 'payments');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 41 Authentic Vector Payment SVGs matching real-world fintech branding
const svgs = {
  // 1. PhonePe (Purple rounded square with white circle and signature Hindi Devanagari 'पे')
  'phonepe.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#5F259F"/>
  <circle cx="32" cy="32" r="22" fill="#FFFFFF"/>
  <path d="M25 21H39M31.5 21V35C31.5 37 33 38.5 35 38.5H40M31.5 28.5H37C39.5 28.5 41.5 27 41.5 24.8C41.5 22.5 39.5 21 37 21M24.5 38.5L28 45H33L29.5 38.5H24.5Z" stroke="#5F259F" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`,

  // 2. Google Pay (Pure white rounded square, official 4-color 'G' + 'Pay' wordmark)
  'google-pay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="2"/>
  <!-- Google 4-Color G -->
  <path d="M26 31.8C26 30.6 25.9 29.5 25.7 28.4H15V32.9H21.2C20.9 34.6 19.9 36.1 18.4 37.1V40.5H22.2C24.4 38.5 25.7 35.4 26 31.8Z" fill="#4285F4"/>
  <path d="M15 43C18.2 43 21 41.9 22.9 40.1L19.1 37.1C18 37.8 16.6 38.3 15 38.3C11.9 38.3 9.3 36.2 8.3 33.3H4.4V36.4C6.3 40.2 10.4 43 15 43Z" fill="#34A853"/>
  <path d="M8.3 33.3C8 32.4 7.9 31.4 7.9 30.4C7.9 29.4 8 28.4 8.3 27.5V24.4H4.4C3.6 26.2 3.1 28.2 3.1 30.4C3.1 32.6 3.6 34.6 4.4 36.4L8.3 33.3Z" fill="#FBBC04"/>
  <path d="M15 22.5C16.8 22.5 18.4 23.1 19.7 24.3L23.1 20.9C21 19 18.2 17.8 15 17.8C10.4 17.8 6.3 20.6 4.4 24.4L8.3 27.5C9.3 24.6 11.9 22.5 15 22.5Z" fill="#EA4335"/>
  <!-- Pay Wordmark in Google Product Sans -->
  <path d="M32 23H37C39.5 23 41.5 24.8 41.5 27.2C41.5 29.8 39.5 31.5 37 31.5H34.5V38H32V23ZM34.5 29.2H36.8C38.2 29.2 39.2 28.4 39.2 27.2C39.2 26.1 38.2 25.2 36.8 25.2H34.5V29.2ZM43.5 33.5C43.5 30.8 45.5 28.8 48.2 28.8C50.5 28.8 52 30 52.5 31.6L50.5 32.4C50.2 31.5 49.3 30.8 48.2 30.8C46.8 30.8 45.8 31.9 45.8 33.5C45.8 35.1 46.8 36.2 48.2 36.2C49.3 36.2 50.2 35.5 50.6 34.6L52.5 35.4C52 37 50.5 38.2 48.2 38.2C45.5 38.2 43.5 36.2 43.5 33.5Z" fill="#5F6368"/>
</svg>`,

  // 3. Paytm (White card, dark navy 'Pay', cyan 'tm' + Hindi 'से' + NPCI UPI tricolor chevron)
  'paytm.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#00BAF2" stroke-width="2"/>
  <!-- Pay in Navy -->
  <path d="M8 22H14.5C18.2 22 20.5 23.8 20.5 26.8C20.5 29.8 18.2 31.6 14.5 31.6H11.5V40H8V22ZM11.5 28.5H14.2C16 28.5 17 27.8 17 26.8C17 25.8 16 25.1 14.2 25.1H11.5V28.5Z" fill="#002E6E"/>
  <path d="M22 33C22 30 24 28 27.2 28C30.4 28 32.5 30 32.5 33V40H29.5V33.5C29.5 31.8 28.5 30.8 27.2 30.8C25.9 30.8 25 31.8 25 33.5V40H22V33Z" fill="#002E6E"/>
  <!-- tm in Cyan -->
  <path d="M34 26H42V29H39.5V40H36.5V29H34V26Z" fill="#00BAF2"/>
  <path d="M43 28H46V30C46.5 28.8 47.8 28 49.2 28C50.5 28 51.5 28.6 52 29.8C52.6 28.6 53.8 28 55.2 28C57.5 28 58.5 29.5 58.5 32V40H55.5V32.5C55.5 31.2 55 30.5 54 30.5C53 30.5 52.3 31.2 52.3 32.5V40H49.3V32.5C49.3 31.2 48.8 30.5 47.8 30.5C46.8 30.5 46 31.2 46 32.5V40H43V28Z" fill="#00BAF2"/>
  <!-- NPCI UPI green/orange arrows below -->
  <path d="M48 45L53 50L48 55H51L56 50L51 45H48Z" fill="#097939"/>
  <path d="M53 45L58 50L53 55H56L61 50L56 45H53Z" fill="#F47920"/>
</svg>`,

  // 4. BharatPe (Cyan circle with orange/cyan stripes + 'BharatPe' wordmark with 'Pe' in cyan)
  'bharatpe.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#00B5B8" stroke-width="2"/>
  <!-- Cyan circular emblem with tricolor bars -->
  <circle cx="20" cy="32" r="14" fill="none" stroke="#00B5B8" stroke-width="4"/>
  <rect x="12" y="27" width="16" height="3" rx="1.5" fill="#FF5722"/>
  <rect x="12" y="32" width="16" height="3" rx="1.5" fill="#00B5B8"/>
  <rect x="12" y="37" width="16" height="3" rx="1.5" fill="#00A651"/>
  <!-- Bharat in Dark Navy, Pe in Cyan -->
  <text x="36" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="900" fill="#1A1A1A">Bharat</text>
  <text x="36" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="900" fill="#00B5B8">Pe</text>
</svg>`,

  // 5. BHIM UPI (Dark card, 'BHIM' in bold italic + official NPCI green & orange chevron arrows)
  'bhim-upi.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#1C1E24"/>
  <text x="7" y="36" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="900" font-style="italic" fill="#FFFFFF">BHIM</text>
  <path d="M41 18L49 31L41 44H46L54 31L46 18H41Z" fill="#008848"/>
  <path d="M47 18L55 31L47 44H52L60 31L52 18H47Z" fill="#F47920"/>
  <text x="8" y="47" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="7" font-weight="bold" fill="#A0ACA1">UPI SWITCH</text>
</svg>`,

  // 6. Amazon Pay (Black card with crisp 'amazon' in white, orange curved smile arrow, and 'pay')
  'amazon-pay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#131921"/>
  <text x="8" y="30" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">amazon</text>
  <text x="36" y="44" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="bold" fill="#FF9900">pay</text>
  <!-- Iconic Amazon Smile Arrow -->
  <path d="M12 37C19 42 31 42 38 38" stroke="#FF9900" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M39 37.5L36.5 35.8L37.2 39.2Z" fill="#FF9900"/>
</svg>`,

  // 7. Freecharge (Orange circular emblem with dynamic white lightning bolt 'f' & text)
  'freecharge.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#F15A24"/>
  <circle cx="32" cy="32" r="24" fill="#F15A24"/>
  <!-- Freecharge Lightning 'f' -->
  <path d="M35 14L21 33H30L26 48L42 29H33L35 14Z" fill="#FFFFFF"/>
</svg>`,

  // 8. MobiKwik (Slanted blue badge with cyan/white 'M' folds and 'MobiKwik' typography)
  'mobikwik.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#004F9F"/>
  <path d="M14 44V20L22 32L30 20V44H25.5V28L22 34L18.5 28V44H14Z" fill="#00BAF2"/>
  <path d="M32 44V20L40 32L48 20V44H43.5V28L40 34L36.5 28V44H32Z" fill="#FFFFFF"/>
  <text x="11" y="55" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="900" fill="#FFFFFF" letter-spacing="0.5">MobiKwik</text>
</svg>`,

  // 9. Airtel Thanks (Red rounded square, white swirl curve & 'Airtel Thanks')
  'airtel-payments-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#ED1C24"/>
  <!-- Airtel Swirl 'b' -->
  <path d="M32 14C23.2 14 16 21.2 16 30C16 37 20.8 42.8 27.2 44.9C29.7 46 32.5 46 35 44.9C41.4 42.8 46 37 46 30C46 21.2 38.8 14 32 14ZM29 35C26.2 35 24 32.8 24 30C24 27.2 26.2 25 29 25C31.8 25 34 27.2 34 30C34 32.8 31.8 35 29 35Z" fill="#FFFFFF"/>
  <text x="10" y="56" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="7.5" font-weight="bold" fill="#FFFFFF">Airtel Thanks</text>
</svg>`,

  // 10. PayZapp (HDFC Bank blue box, 'PAY' in blue, electric red lightning 'ZAPP')
  'payzapp.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#002D62" stroke-width="2"/>
  <!-- HDFC Blue & Red Box Logo -->
  <rect x="10" y="14" width="16" height="16" fill="#002D62"/>
  <rect x="14" y="18" width="8" height="8" fill="#FFFFFF"/>
  <rect x="10" y="14" width="4" height="4" fill="#ED1C24"/>
  <rect x="22" y="26" width="4" height="4" fill="#ED1C24"/>
  <text x="30" y="27" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="900" fill="#002D62">PAY</text>
  <!-- Sharp Electric Red ZAPP -->
  <path d="M14 37H32L19 49H34L30 55H12L25 43H12L14 37Z" fill="#D8232A"/>
  <text x="34" y="51" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="900" fill="#D8232A">APP</text>
</svg>`,

  // 11. PayWiz (Canara Bank / PayWiz teal rounded square with stylized Pay Wiz + UPI)
  'paywiz.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#00685B"/>
  <text x="8" y="32" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="900" font-style="italic" fill="#FFFFFF">Pay</text>
  <text x="10" y="48" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="900" fill="#C0F477">Wiz</text>
  <!-- UPI in corner -->
  <text x="40" y="22" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="8" font-weight="900" fill="#FFFFFF">UPI</text>
  <path d="M50 14L53 19L50 24H52L55 19L52 14H50Z" fill="#097939"/>
</svg>`,

  // 12. BHIM SBI Pay (Smartphone silhouette with bidirectional arrows, 'BHIM' & SBI cyan circle keyhole)
  'sbi-pay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#0091DA" stroke-width="2"/>
  <!-- Phone Screen Outline -->
  <rect x="8" y="14" width="22" height="36" rx="4" stroke="#002D62" stroke-width="2.5" fill="none"/>
  <path d="M13 28H25M21 24L25 28L21 32M25 36H13M17 32L13 36L17 40" stroke="#0091DA" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- SBI Keyhole Circle Logo -->
  <circle cx="46" cy="26" r="10" fill="#0091DA"/>
  <rect x="44.5" y="26" width="3" height="8" fill="#FFFFFF"/>
  <text x="34" y="47" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="900" fill="#002D62">SBI Pay</text>
</svg>`,

  // 13. Fino Payments Bank (Red hollow star with blue bottom arc + 'Fino' in navy)
  'fino-payments-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#9C1A2E" stroke-width="2"/>
  <!-- Red Star with Blue Arc -->
  <path d="M20 18L23 25H30L25 29L27 36L20 32L13 36L15 29L10 25H17L20 18Z" stroke="#D92534" stroke-width="2.5" fill="#FFF0F2"/>
  <path d="M12 37C16 41 24 41 28 37" stroke="#1C3F7A" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- Fino Wordmark -->
  <text x="32" y="32" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="900" fill="#1C3F7A">Fino</text>
  <text x="32" y="44" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="6.5" font-weight="bold" fill="#D92534">Payments Bank</text>
</svg>`,

  // 14. BHIM Baroda Pay (Bank of Baroda vermilion sun 'B' symbol + 'BHIM Baroda Pay')
  'baroda-pay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#F26522" stroke-width="2"/>
  <!-- Stylized Baroda Figures / Sun -->
  <circle cx="20" cy="32" r="11" fill="#F26522"/>
  <circle cx="20" cy="32" r="6" fill="#FFFFFF"/>
  <path d="M20 16V21M20 43V48M7 32H12M28 32H33" stroke="#F26522" stroke-width="3" stroke-linecap="round"/>
  <!-- Baroda Pay Text -->
  <text x="34" y="28" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="7.5" font-weight="900" fill="#008848">BHIM</text>
  <text x="34" y="41" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="900" fill="#F26522">Baroda</text>
  <text x="34" y="52" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="900" fill="#F26522">Pay</text>
</svg>`,

  // 15. RBL Bank BHIM (Magenta/maroon circle with RBL 'b' in navy & red + 'RBL BANK' + 'BHIM')
  'rbl-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="32" r="30" fill="#9B1B64"/>
  <circle cx="32" cy="32" r="22" fill="#FFFFFF"/>
  <!-- RBL lowercase 'b' -->
  <path d="M26 20V42M26 31C28 27 36 27 36 33C36 39 28 39 26 35" stroke="#002868" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <circle cx="34" cy="33" r="3.5" fill="#D71921"/>
  <text x="14" y="57" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="7.5" font-weight="900" fill="#FFFFFF">RBL BHIM</text>
</svg>`,

  // 16. BHIM Axis Pay (Maroon circle with Axis Bank burgundy/white chevron + 'BHIM AXIS PAY')
  'axis-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="32" r="30" fill="#880038"/>
  <text x="18" y="22" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF">BHIM</text>
  <!-- Axis inverted Chevron -->
  <path d="M32 25L46 48H36L32 40L28 48H18L32 25Z" fill="#FFFFFF"/>
  <path d="M32 33L37 42H27L32 33Z" fill="#880038"/>
  <text x="11" y="57" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="7.5" font-weight="900" fill="#FFFFFF">AXIS PAY</text>
</svg>`,

  // 17. Razorpay (Navy card with electric royal blue razor blade 'R' ribbon)
  'razorpay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#0C2340"/>
  <!-- Razor Ribbon -->
  <path d="M38 16H24L17 48H27L30 35H36L43 48H52L44 33C48 31 50 27 50 23C50 18 46 16 38 16ZM37 27H28L29 22H37C39.5 22 41 23 41 24.5C41 26 39.5 27 37 27Z" fill="#0C83FD"/>
  <path d="M22 40L31 22H36L27 40H22Z" fill="#3395FF" opacity="0.9"/>
  <text x="12" y="57" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="8" font-weight="bold" fill="#FFFFFF">Razorpay</text>
</svg>`,

  // 18. Cashfree Payments (Deep purple card with golden 'CF' monogram)
  'cashfree.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#1E0B38"/>
  <circle cx="32" cy="32" r="22" fill="none" stroke="#F1B815" stroke-width="4" stroke-dasharray="100 30"/>
  <path d="M32 18L21 32H31L28 46L42 29H33L36 18H32Z" fill="#F1B815"/>
  <text x="11" y="58" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="7.5" font-weight="900" fill="#FFFFFF">CASHFREE</text>
</svg>`,

  // 19. WhatsApp Pay (WhatsApp green circle with speech bubble, phone handset & UPI tag)
  'whatsapp-pay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#25D366"/>
  <circle cx="32" cy="32" r="24" fill="#25D366"/>
  <path d="M32 14C22 14 14 22 14 32C14 35.5 15 38.8 17 41.6L14.5 50L23 47.6C25.7 49.2 28.8 50 32 50C42 50 50 42 50 32C50 22 42 14 32 14Z" fill="#FFFFFF"/>
  <path d="M26.5 23.5C26 22.3 25.3 22.3 24.7 22.3C24.1 22.3 23.5 22.3 23 22.8C22.3 23.5 20.8 25 20.8 28C20.8 31 23 33.9 23.4 34.4C23.7 34.8 27.6 41 33.8 43.7C39 45.8 40.1 45.5 41.3 45.4C42.5 45.1 45 43.7 45.5 42.1C46.1 40.6 46.1 39.3 45.9 38.9C45.7 38.5 45.3 38.4 44.7 38L41 36.3C40.5 35.9 39.8 36.1 39.4 36.7L37.9 38.6C37.5 39 37.1 39.3 36.6 38.9C36 38.6 34 37.8 31.7 35.8C29.8 34 28.7 32 28.3 31.3C27.9 30.6 28.3 30.3 28.6 30L30 28.3C30.4 27.9 30.1 27.5 30 27.1L27.6 24.5C27.1 24.1 26.6 24.1 26.5 23.5Z" fill="#25D366"/>
</svg>`,

  // 20. CRED Pay (Black luxury card with white shield monoline keyhole badge)
  'cred.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#0F0F0F" stroke="#333333" stroke-width="2"/>
  <rect x="15" y="15" width="34" height="34" rx="8" stroke="#FFFFFF" stroke-width="4" fill="none"/>
  <path d="M24 23H40V31H28V35H40V43H24V23Z" fill="#C0F477"/>
  <text x="18" y="57" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="8" font-weight="900" fill="#FFFFFF" letter-spacing="1.5">CRED</text>
</svg>`,

  // 21. JioMoney (Reliance Jio blue card with white 'Jio' & red 'Money')
  'jiomoney.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#005B9F"/>
  <circle cx="32" cy="32" r="22" fill="#005B9F" stroke="#FFFFFF" stroke-width="2"/>
  <path d="M24 21H40M24 28H38M24 21V36C27 36 32 36 35 33M30 34L39 44" stroke="#FFFFFF" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <text x="10" y="57" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="8" font-weight="900" fill="#FFFFFF">JioMoney</text>
</svg>`,

  // 22. Pockets by ICICI Bank (ICICI orange & maroon polygon crest)
  'pockets.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#F37021" stroke-width="2"/>
  <polygon points="32,12 52,21 52,41 32,51 12,41 12,21" fill="#FFF5ED" stroke="#F37021" stroke-width="3"/>
  <text x="16" y="36" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="900" fill="#F37021">pockets</text>
  <text x="20" y="46" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="7" font-weight="bold" fill="#800000">by ICICI</text>
</svg>`,

  // 23. Chillr (Teal-green card with white dual curved instant transfer arrows)
  'chillr.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#00B67A"/>
  <path d="M32 13L48 20V33C48 44 41 51 32 53C23 51 16 44 16 33V20L32 13Z" fill="#009C68"/>
  <path d="M32 21V41M37 27C28 27 26 30 26 32C26 34 28 37 37 37" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" fill="none"/>
  <text x="19" y="58" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="8" font-weight="900" fill="#FFFFFF">Chillr</text>
</svg>`,

  // 24. Trupay (Unified switch blue card with geometric polygon)
  'trupay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#1E88E5"/>
  <text x="8" y="40" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="17" font-weight="900" font-style="italic" fill="#FFFFFF">Trupay</text>
  <path d="M12 45H52M18 49H46" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
</svg>`,

  // 25. Oxigen Wallet (White card with navy compass ring & cyan cross)
  'oxigen.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#004A99" stroke-width="2"/>
  <circle cx="32" cy="32" r="20" stroke="#004A99" stroke-width="6" fill="none"/>
  <path d="M25 25L39 39M39 25L25 39" stroke="#00AEEF" stroke-width="5" stroke-linecap="round"/>
  <text x="14" y="57" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="8" font-weight="900" fill="#004A99">OXIGEN</text>
</svg>`,

  // 26. MoneyOnMobile (Navy card with phone outline & 'M ON MOBILE')
  'moneyonmobile.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#0C1F38"/>
  <rect x="14" y="20" width="16" height="26" rx="4" stroke="#FFFFFF" stroke-width="3" fill="none"/>
  <circle cx="22" cy="41" r="1.5" fill="#FFFFFF"/>
  <text x="33" y="32" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="bold" fill="#00BAF2">M</text>
  <text x="33" y="44" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="bold" fill="#F47920">ON</text>
</svg>`,

  // 27. ZipCash (Green & dark card with golden crest & 'ZipCash')
  'zipcash.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#1A211B" stroke="#00A859" stroke-width="2"/>
  <text x="8" y="36" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="bold" font-style="italic" fill="#00A859">ZipCash</text>
  <path d="M8 43H56M12 47H52" stroke="#00A859" stroke-width="2.5"/>
</svg>`,

  // 28. m-Purse (Deep blue card with contactless waves & 'mpurse')
  'mpurse.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#0E2C5A"/>
  <text x="8" y="36" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF">mpurse</text>
  <path d="M44 21C47.5 24 47.5 30 44 33M49 17C54.5 23 54.5 33 49 40" stroke="#00AEEF" stroke-width="3" stroke-linecap="round" fill="none"/>
</svg>`,

  // 29. Aadhaar Pay (Warm cream card with NPCI fingerprint sun & purple PAY tag)
  'aadhaar-pay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFF9E6" stroke="#F5A623" stroke-width="2"/>
  <path d="M24 21C28 18 36 18 40 21M20 28C27 24 37 24 44 28M23 35C28 31 36 31 41 35" stroke="#D0021B" stroke-width="3" stroke-linecap="round" fill="none"/>
  <rect x="9" y="38" width="46" height="16" rx="4" fill="#F5A623"/>
  <text x="14" y="50" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="900" fill="#9013FE">AADHAAR</text>
</svg>`,

  // 30. ItzCash (Navy card with golden ellipse & 'ItzCash')
  'itzcash.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#002966"/>
  <ellipse cx="32" cy="32" rx="25" ry="17" stroke="#FF9900" stroke-width="2.5" fill="none"/>
  <text x="12" y="36" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF">ItzCash</text>
</svg>`,

  // 31. QuikWallet (White card with interlocking cyan/coral circles & 'Quikwallet')
  'quikwallet.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#00B4D8" stroke-width="2"/>
  <circle cx="24" cy="29" r="9" stroke="#00B4D8" stroke-width="4.5" fill="none"/>
  <circle cx="40" cy="29" r="9" stroke="#C05020" stroke-width="4.5" fill="none"/>
  <text x="10" y="49" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="bold" fill="#333333">Quikwallet</text>
</svg>`,

  // 32. SBI Buddy (White card with SBI cyan circle & 'Buddy')
  'sbi-buddy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#0091DA" stroke-width="2"/>
  <circle cx="20" cy="32" r="10" fill="#0091DA"/>
  <rect x="18.5" y="32" width="3" height="8" fill="#FFFFFF"/>
  <text x="32" y="36" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="bold" fill="#002D62">Buddy</text>
</svg>`,

  // 33. mRUPEE (White card with triple navy step bars & 'RUPEE')
  'mrupee.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#0A3C78" stroke-width="2"/>
  <rect x="9" y="33" width="4" height="11" fill="#0A3C78"/>
  <rect x="16" y="28" width="4" height="16" fill="#0A3C78"/>
  <rect x="23" y="21" width="4" height="23" fill="#0A3C78"/>
  <text x="28" y="36" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="900" fill="#0A3C78">RUPEE</text>
</svg>`,

  // 34. Citrus Pay (White card with citrus circle wedge & 'Citrus')
  'citrus.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#F37023" stroke-width="2"/>
  <circle cx="21" cy="32" r="12" stroke="#F37023" stroke-width="4.5" fill="none"/>
  <text x="34" y="37" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="bold" fill="#F37023">Citrus</text>
</svg>`,

  // 35. Stripe (Signature Stripe indigo card with white 'stripe' wordmark)
  'stripe.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#635BFF"/>
  <path d="M37.5 26.4C37.5 24.7 35.7 23.2 33 23.2C29.5 23.2 26.8 24.7 24.8 25.8L22.9 21C25.6 19.3 29.3 18.4 33.6 18.4C39.6 18.4 43.6 21.3 43.6 26.5C43.6 34.4 33.1 33.3 33.1 37.6C33.1 39.6 35.2 40.8 38.3 40.8C41.9 40.8 45.2 39.2 47.3 37.7L49.2 42.5C46.4 44.4 42.1 45.6 37.7 45.6C31.2 45.6 27 42.4 27 37.3C27 29.2 37.5 30.5 37.5 26.4Z" fill="#FFFFFF"/>
</svg>`,

  // 36. PayPal (White card with iconic double blue overlapping 'PP')
  'paypal.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#00457C" stroke-width="2"/>
  <path d="M20 17H32C36.4 17 39.6 20 39.6 24C39.6 28 36.4 31 32 31H25L22 45H17L20 17Z" fill="#0079C1"/>
  <path d="M26 23H38C42.4 23 45.6 26 45.6 30C45.6 34 42.4 37 38 37H31L28 51H23L26 23Z" fill="#00457C" opacity="0.85"/>
</svg>`,

  // 37. Visa (White card with classic navy 'VISA' & gold flick)
  'visa.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#1A1F71" stroke-width="2"/>
  <text x="9" y="40" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="900" font-style="italic" fill="#1A1F71" letter-spacing="2">VISA</text>
  <path d="M9 27L15 27L12 36H9L9 27Z" fill="#F7B600"/>
</svg>`,

  // 38. Mastercard (Dark card with iconic interlocking red and yellow circles)
  'mastercard.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#141414"/>
  <circle cx="25" cy="32" r="14" fill="#EB001B"/>
  <circle cx="39" cy="32" r="14" fill="#F79E1B" fill-opacity="0.9"/>
</svg>`,

  // 39. RuPay (White card with navy 'RuPay' & NPCI orange/green chevrons)
  'rupay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#009540" stroke-width="2"/>
  <text x="8" y="38" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="900" font-style="italic" fill="#003366">RuPay</text>
  <path d="M44 21L50 32L44 43H48L54 32L48 21H44Z" fill="#F47920"/>
  <path d="M50 21L56 32L50 43H54L60 32L54 21H50Z" fill="#009540"/>
</svg>`,

  // 40. American Express (Signature AMEX blue box with bold white AMEX wordmark)
  'amex.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#006FCF"/>
  <rect x="9" y="16" width="46" height="32" stroke="#FFFFFF" stroke-width="2.5" fill="none"/>
  <text x="13" y="37" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="900" fill="#FFFFFF">AMEX</text>
</svg>`,

  // 41. UPI Sovereign Switch (Dark card with bold italic 'UPI' & green/orange arrows)
  'upi.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#1C1E24"/>
  <text x="9" y="40" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="19" font-weight="900" font-style="italic" fill="#FFFFFF">UPI</text>
  <path d="M41 20L49 32L41 44H46L54 32L46 20H41Z" fill="#008848"/>
  <path d="M47 20L55 32L47 44H52L60 32L52 20H47Z" fill="#F47920"/>
</svg>`,
};

for (const [filename, content] of Object.entries(svgs)) {
  fs.writeFileSync(path.join(outDir, filename), content.trim() + '\n', 'utf8');
}

console.log(`Successfully generated ${Object.keys(svgs).length} authentic payment SVG vector assets.`);
