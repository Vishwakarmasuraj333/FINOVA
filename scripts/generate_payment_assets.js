const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'assets', 'payments');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const svgs = {
  // 1. PhonePe
  'phonepe.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#5F259F"/>
  <circle cx="24" cy="24" r="16" fill="#FFFFFF"/>
  <path d="M19 15H29M23.5 15V26C23.5 27.5 24.5 28.5 26 28.5H29.5M23.5 21H27.5C29.5 21 31 19.8 31 18C31 16.2 29.5 15 27.5 15M18.5 28L21 33H24.5L22 28H18.5Z" stroke="#5F259F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  // 2. Google Pay
  'google-pay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5"/>
  <path d="M22 24.2C22 23.3 21.9 22.5 21.7 21.7H12V26.4H17.6C17.3 27.9 16.4 29.1 15.1 30V33H19.3C21.7 30.7 23.1 27.4 22 24.2Z" fill="#4285F4"/>
  <path d="M12 34.5C14.7 34.5 17 33.6 18.7 32.1L14.5 29.1C13.3 29.9 11.8 30.3 10.2 30.3C7.2 30.3 4.8 28.2 3.9 25.5H-0.5V28.6C1.3 32.2 4.9 34.5 9.1 34.5" fill="#34A853" transform="translate(3, -1)"/>
  <path d="M6.9 24.5C6.5 23.2 6.5 21.8 6.9 20.5V17.4H2.5C0.7 20.7 0.7 24.5 2.5 27.8L6.9 24.5Z" fill="#FBBC04" transform="translate(3, 0)"/>
  <path d="M12 13.5C13.5 13.5 14.9 14 16 15.1L19.5 11.6C17.4 9.6 14.8 8.5 12 8.5C7.8 8.5 4.2 10.8 2.4 14.4L6.8 17.5C7.7 14.8 10.1 13.5 12 13.5Z" fill="#EA4335" transform="translate(3, 0)"/>
  <text x="25" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#3C4043">Pay</text>
</svg>`,

  // 3. Paytm
  'paytm.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#00BAF2" stroke-width="1.5"/>
  <path d="M8 17H13.8C16.3 17 18 18.2 18 20.3C18 22.4 16.3 23.6 13.8 23.6H10.7V31H8V17ZM10.7 21.3H13.5C14.8 21.3 15.6 20.9 15.6 20.3C15.6 19.7 14.8 19.3 13.5 19.3H10.7V21.3Z" fill="#002970"/>
  <path d="M19 25.8C19 23.7 20.5 22.2 22.8 22.2C25.1 22.2 26.6 23.7 26.6 25.8V31H24.2V26C24.2 25 23.6 24.4 22.8 24.4C22.1 24.4 21.4 25 21.4 26V31H19V25.8Z" fill="#002970"/>
  <path d="M28 20.2H35.5V22.5H32.8V31H30.5V22.5H28V20.2ZM36.2 22.5H38.5V24.3C39 23.1 40 22.5 41.2 22.5C42.5 22.5 43.4 23.2 43.7 24.4C44.3 23.2 45.4 22.5 46.7 22.5C48.5 22.5 49.4 23.7 49.4 25.8V31H47.1V26.1C47.1 25.1 46.7 24.5 45.8 24.5C45 24.5 44.4 25.1 44.4 26.1V31H42.1V26.1C42.1 25.1 41.7 24.5 40.8 24.5C40 24.5 39.4 25.1 39.4 26.1V31H37.1V22.5H36.2Z" fill="#00BAF2" transform="scale(0.8) translate(3, 3)"/>
</svg>`,

  // 4. BharatPe
  'bharatpe.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#00B5B8" stroke-width="1.5"/>
  <circle cx="24" cy="24" r="16" fill="none" stroke="#00B5B8" stroke-width="3.5"/>
  <rect x="16" y="18" width="16" height="3" rx="1.5" fill="#FF9933"/>
  <rect x="16" y="22.5" width="16" height="3" rx="1.5" fill="#00B5B8"/>
  <rect x="16" y="27" width="16" height="3" rx="1.5" fill="#138808"/>
</svg>`,

  // 5. BHIM UPI
  'bhim-upi.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#1C1E24"/>
  <text x="6" y="27" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="900" font-style="italic" fill="#FFFFFF">BHIM</text>
  <path d="M31 14L37 23L31 32H34.5L40.5 23L34.5 14H31Z" fill="#008848"/>
  <path d="M35 14L41 23L35 32H38.5L44.5 23L38.5 14H35Z" fill="#F47920"/>
</svg>`,

  // 6. Amazon Pay
  'amazon-pay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#131921"/>
  <text x="6" y="23" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF">amazon</text>
  <text x="26" y="32" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="bold" fill="#FF9900">pay</text>
  <path d="M9 28C14 31.5 22 31.5 27 28.5" stroke="#FF9900" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M28 28.2L26 27.2L26.8 29.5Z" fill="#FF9900"/>
</svg>`,

  // 7. Freecharge
  'freecharge.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#EB6324"/>
  <circle cx="24" cy="24" r="15" fill="#EB6324"/>
  <path d="M26 12L16 25H23L20 36L31 23H25L26 12Z" fill="#FFFFFF"/>
</svg>`,

  // 8. MobiKwik
  'mobikwik.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#002E6E"/>
  <path d="M11 33V15L17 24L23 15V33H19.5V21.5L17 25.5L14.5 21.5V33H11Z" fill="#00BAF2"/>
  <path d="M25 33V15L31 24L37 15V33H33.5V21.5L31 25.5L28.5 21.5V33H25Z" fill="#FFFFFF"/>
</svg>`,

  // 9. Airtel Payments Bank
  'airtel-payments-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#ED1C24"/>
  <path d="M24 12C17.4 12 12 17.4 12 24C12 29.3 15.5 33.6 20.3 35.2C22.2 36 24.3 36 26.2 35.2C31 33.6 34.5 29.3 34.5 24C34.5 17.4 29.1 12 24 12ZM21.8 27.8C19.7 27.8 18 26.1 18 24C18 21.9 19.7 20.2 21.8 20.2C23.9 20.2 25.5 21.9 25.5 24C25.5 26.1 23.9 27.8 21.8 27.8Z" fill="#FFFFFF"/>
</svg>`,

  // 10. PayZapp
  'payzapp.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#002D62" stroke-width="1.5"/>
  <path d="M10 16H13V32H10M22 16H19V32H22" stroke="#002D62" stroke-width="2.6"/>
  <text x="12" y="27" font-family="sans-serif" font-size="10" font-weight="900" fill="#002D62">P</text>
  <path d="M25 16H37L28 25H37L34 31H22L31 22H22L25 16Z" fill="#D8232A"/>
</svg>`,

  // 11. Pockets by ICICI
  'pockets.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#F37021" stroke-width="1.5"/>
  <polygon points="24,9 39,16 39,31 24,38 9,31 9,16" fill="#FFF5ED" stroke="#F37021" stroke-width="2"/>
  <text x="11.5" y="27" font-family="sans-serif" font-size="9" font-weight="900" fill="#F37021">pockets</text>
</svg>`,

  // 12. JioMoney
  'jiomoney.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#005B9F"/>
  <circle cx="24" cy="24" r="16" fill="#005B9F" stroke="#FFFFFF" stroke-width="1.5"/>
  <path d="M18 16H30M18 21H28M18 16V27C20.2 27 24 27 26.2 24.8M22.5 25.5L29.2 33" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  // 13. Razorpay
  'razorpay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#0C2340"/>
  <path d="M29 12H18L13 36H20L22.4 25.8H26.7L31.8 36H38.2L32.7 24.7C35.4 23.1 36.7 20.4 36.7 17.2C36.7 13.8 33.7 12 29 12ZM28 20.2H20.8L21.8 16.2H27.7C29.6 16.2 30.7 17 30.7 18.2C30.7 19.5 29.5 20.2 28 20.2Z" fill="#0A85EA"/>
  <path d="M16.5 30L23.2 16.5H27L20.2 30H16.5Z" fill="#3395FF" opacity="0.9"/>
</svg>`,

  // 14. Cashfree
  'cashfree.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#1E0B38"/>
  <circle cx="24" cy="24" r="16" fill="none" stroke="#F1B815" stroke-width="3" stroke-dasharray="75 22"/>
  <path d="M24 14L16 24H23L21 34L31 22H25L27 14H24Z" fill="#F1B815"/>
</svg>`,

  // 15. Fino Payments Bank
  'fino-payments-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#9C1A2E" stroke-width="1.5"/>
  <path d="M16 16L19 21H24L20 24L22 29L16 26L10 29L12 24L8 21H13L16 16Z" stroke="#9C1A2E" stroke-width="2" fill="#FFF0F2"/>
  <text x="24" y="27" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1C3F7A">Fino</text>
</svg>`,

  // 16. Visa
  'visa.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#1A1F71" stroke-width="1.5"/>
  <text x="7" y="30" font-family="sans-serif" font-size="15" font-weight="900" font-style="italic" fill="#1A1F71" letter-spacing="1.5">VISA</text>
  <path d="M7 20L11.5 20L9.2 27H7L7 20Z" fill="#F7B600"/>
</svg>`,

  // 17. Mastercard
  'mastercard.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#141414"/>
  <circle cx="19" cy="24" r="10.5" fill="#EB001B"/>
  <circle cx="29" cy="24" r="10.5" fill="#F79E1B" fill-opacity="0.9"/>
</svg>`,

  // 18. RuPay
  'rupay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#009540" stroke-width="1.5"/>
  <text x="6" y="28" font-family="sans-serif" font-size="11" font-weight="900" font-style="italic" fill="#003366">RuPay</text>
  <path d="M33 16L37.5 24L33 32H36L40.5 24L36 16H33Z" fill="#F47920"/>
  <path d="M37.5 16L42 24L37.5 32H40.5L45 24L40.5 16H37.5Z" fill="#009540"/>
</svg>`,

  // 19. American Express (AMEX)
  'amex.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#006FCF"/>
  <rect x="7" y="12" width="34" height="24" stroke="#FFFFFF" stroke-width="2" fill="none"/>
  <text x="10" y="28" font-family="sans-serif" font-size="10.5" font-weight="900" fill="#FFFFFF">AMEX</text>
</svg>`,

  // 20. Axis Bank
  'axis-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#97144D"/>
  <path d="M24 12L36 36H28L24 28L20 36H12L24 12Z" fill="#FFFFFF"/>
  <path d="M24 20L28 27H20L24 20Z" fill="#97144D"/>
</svg>`,

  // 21. Bank of Baroda
  'baroda-pay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#F26522" stroke-width="1.5"/>
  <circle cx="16" cy="24" r="8" fill="#F26522"/>
  <path d="M16 12V16M16 32V36M6 24H10M22 24H26" stroke="#F26522" stroke-width="2.2"/>
  <text x="24" y="27" font-family="sans-serif" font-size="9" font-weight="bold" fill="#F26522">Baroda</text>
</svg>`,

  // 22. RBL Bank
  'rbl-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#9B2779"/>
  <circle cx="24" cy="24" r="16" fill="#FFFFFF"/>
  <text x="14" y="29" font-family="sans-serif" font-size="12" font-weight="bold" fill="#9B2779">RBL</text>
</svg>`,

  // 23. SBI Pay
  'sbi-pay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#0091DA" stroke-width="1.5"/>
  <rect x="10" y="12" width="15" height="24" rx="3" stroke="#002D62" stroke-width="2.2"/>
  <path d="M14 21H20M17 18L20 21L17 24M20 27H14M17 24L14 27L17 30" stroke="#0091DA" stroke-width="1.8"/>
  <circle cx="34" cy="24" r="7" fill="#0091DA"/>
  <rect x="32.8" y="24" width="2.4" height="5.5" fill="#FFFFFF"/>
</svg>`,

  // 24. PayWiz
  'paywiz.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#00875A"/>
  <text x="7" y="24" font-family="sans-serif" font-size="10" font-weight="bold" fill="#FFFFFF">PayWiz</text>
  <text x="16" y="34" font-family="sans-serif" font-size="8" font-weight="bold" fill="#C0F477">UPI</text>
</svg>`,

  // 25. WhatsApp Pay
  'whatsapp-pay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#25D366"/>
  <path d="M24 10C16.3 10 10 16.3 10 24C10 26.8 10.8 29.4 12.2 31.6L10.5 38L17 36.2C19.1 37.4 21.5 38 24 38C31.7 38 38 31.7 38 24C38 16.3 31.7 10 24 10Z" fill="#FFFFFF"/>
  <path d="M19.7 17.5C19.3 16.6 18.8 16.6 18.3 16.6C17.9 16.6 17.4 16.6 17 17C16.5 17.5 15.3 18.7 15.3 21C15.3 23.4 17 25.6 17.3 26C17.5 26.3 20.6 31.1 25.5 33.2C29.5 34.8 30.4 34.6 31.3 34.5C32.2 34.3 34.2 33.2 34.6 32C35 30.8 35 29.8 34.9 29.5C34.7 29.2 34.4 29.1 34 28.8L31.1 27.5C30.7 27.2 30.2 27.3 29.9 27.8L28.7 29.3C28.4 29.6 28.1 29.8 27.7 29.5C27.2 29.3 25.7 28.7 23.9 27.1C22.4 25.7 21.5 24.1 21.2 23.6C20.9 23.1 21.2 22.8 21.4 22.6L22.5 21.3C22.8 21 22.6 20.7 22.5 20.4L20.6 18.3C20.2 18 19.8 18 19.7 17.5Z" fill="#25D366"/>
</svg>`,

  // 26. CRED Pay
  'cred.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#121212" stroke="#333333" stroke-width="1.5"/>
  <rect x="11" y="11" width="26" height="26" rx="6" stroke="#FFFFFF" stroke-width="3" fill="none"/>
  <path d="M18 17H30V23H21V26H30V32H18V17Z" fill="#C0F477"/>
</svg>`,

  // 27. Aadhaar Pay
  'aadhaar-pay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFF9E6" stroke="#F5A623" stroke-width="2"/>
  <path d="M18 16C21 14 27 14 30 16M15 21C20 18 28 18 33 21M17 26C21 23.5 27 23.5 31 26" stroke="#D0021B" stroke-width="2.2" stroke-linecap="round"/>
  <rect x="7" y="28" width="34" height="12" rx="3" fill="#F5A623"/>
  <text x="10" y="37" font-family="sans-serif" font-size="10" font-weight="900" fill="#9013FE">PAY</text>
</svg>`,

  // 28. Chillr
  'chillr.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#00B67A"/>
  <path d="M24 10L36 15V25C36 33 30.5 38 24 40C17.5 38 12 33 12 25V15L24 10Z" fill="#009C68"/>
  <path d="M24 16V31M28 20C21 20 19.5 22.5 19.5 24C19.5 25.5 21 28 28 28" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  // 29. Oxigen
  'oxigen.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#004A99" stroke-width="1.5"/>
  <circle cx="24" cy="24" r="15" stroke="#004A99" stroke-width="4.5" fill="none"/>
  <path d="M19 19L29 29M29 19L19 29" stroke="#00AEEF" stroke-width="3.5" stroke-linecap="round"/>
</svg>`,

  // 30. MoneyOnMobile
  'moneyonmobile.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#0C1F38"/>
  <rect x="11" y="15" width="12" height="20" rx="3" stroke="#FFFFFF" stroke-width="2.2" fill="none"/>
  <circle cx="17" cy="31" r="1.2" fill="#FFFFFF"/>
  <text x="25" y="24" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#00BAF2">M</text>
  <text x="25" y="33" font-family="sans-serif" font-size="9" font-weight="bold" fill="#F47920">ON</text>
</svg>`,

  // 31. ZipCash
  'zipcash.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#1A211B" stroke="#00A859" stroke-width="1.5"/>
  <text x="6" y="27" font-family="sans-serif" font-size="11.5" font-weight="bold" font-style="italic" fill="#00A859">ZipCash</text>
  <path d="M6 32H42M9 35H39" stroke="#00A859" stroke-width="1.8"/>
</svg>`,

  // 32. m-Purse
  'mpurse.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#0E2C5A"/>
  <text x="6" y="27" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF">mpurse</text>
  <path d="M33 16C35.5 18 35.5 22.5 33 25M37 13C41 17.5 41 25 37 30" stroke="#00AEEF" stroke-width="2.2" stroke-linecap="round"/>
</svg>`,

  // 33. ItzCash
  'itzcash.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#002966"/>
  <ellipse cx="24" cy="24" rx="19" ry="13" stroke="#FF9900" stroke-width="1.8" fill="none"/>
  <text x="9" y="27" font-family="sans-serif" font-size="10" font-weight="bold" fill="#FFFFFF">ItzCash</text>
  <path d="M31 16L37 19L33 22L31 16Z" fill="#FF9900"/>
</svg>`,

  // 34. QuikWallet
  'quikwallet.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#00B4D8" stroke-width="1.5"/>
  <circle cx="18" cy="22" r="6.5" stroke="#00B4D8" stroke-width="3.5" fill="none"/>
  <circle cx="30" cy="22" r="6.5" stroke="#C05020" stroke-width="3.5" fill="none"/>
  <text x="8" y="36" font-family="sans-serif" font-size="7.5" font-weight="bold" fill="#333333">Quikwallet</text>
</svg>`,

  // 35. SBI Buddy
  'sbi-buddy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#0091DA" stroke-width="1.5"/>
  <circle cx="15" cy="24" r="7.5" fill="#0091DA"/>
  <rect x="13.8" y="24" width="2.4" height="6" fill="#FFFFFF"/>
  <text x="24" y="27" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#002D62">Buddy</text>
</svg>`,

  // 36. mRUPEE
  'mrupee.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#0A3C78" stroke-width="1.5"/>
  <rect x="7" y="25" width="3" height="8" fill="#0A3C78"/>
  <rect x="12" y="21" width="3" height="12" fill="#0A3C78"/>
  <rect x="17" y="16" width="3" height="17" fill="#0A3C78"/>
  <text x="21" y="27" font-family="sans-serif" font-size="9" font-weight="900" fill="#0A3C78">RUPEE</text>
</svg>`,

  // 37. Citrus Pay
  'citrus.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#F37023" stroke-width="1.5"/>
  <circle cx="16" cy="24" r="9" stroke="#F37023" stroke-width="3.5" fill="none"/>
  <text x="26" y="28" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#F37023">Citrus</text>
</svg>`,

  // 38. Trupay
  'trupay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#1E88E5"/>
  <text x="6" y="30" font-family="sans-serif" font-size="13" font-weight="900" font-style="italic" fill="#FFFFFF">Trupay</text>
</svg>`,

  // 39. Stripe
  'stripe.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#635BFF"/>
  <path d="M28.2 19.8C28.2 18.5 26.8 17.4 24.8 17.4C22.2 17.4 20.1 18.5 18.6 19.4L17.2 15.7C19.2 14.5 22 13.8 25.2 13.8C29.7 13.8 32.7 16 32.7 19.9C32.7 25.8 24.8 25 24.8 28.2C24.8 29.7 26.4 30.6 28.7 30.6C31.4 30.6 33.9 29.4 35.5 28.3L36.9 31.9C34.8 33.3 31.6 34.2 28.3 34.2C23.4 34.2 20.2 31.8 20.2 28C20.2 21.9 28.2 22.9 28.2 19.8Z" fill="#FFFFFF"/>
</svg>`,

  // 40. PayPal
  'paypal.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#00457C" stroke-width="1.5"/>
  <path d="M15 13H24C27.3 13 29.7 15.2 29.7 18.2C29.7 21.2 27.3 23.5 24 23.5H18.7L16.5 34H12.7L15 13Z" fill="#0079C1"/>
  <path d="M19.5 17.5H28.5C31.8 17.5 34.2 19.7 34.2 22.7C34.2 25.7 31.8 28 28.5 28H23.2L21 38.5H17.2L19.5 17.5Z" fill="#00457C" opacity="0.85"/>
</svg>`,

  // 41. UPI Sovereign Switch
  'upi.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#1C1E24"/>
  <text x="7" y="30" font-family="sans-serif" font-size="14" font-weight="900" font-style="italic" fill="#FFFFFF">UPI</text>
  <path d="M31 15L37 24L31 33H34.7L40.7 24L34.7 15H31Z" fill="#008848"/>
  <path d="M35.5 15L41.5 24L35.5 33H39.2L45.2 24L39.2 15H35.5Z" fill="#F47920"/>
</svg>`,
};

for (const [filename, content] of Object.entries(svgs)) {
  fs.writeFileSync(path.join(outDir, filename), content.trim() + '\n', 'utf8');
}

console.log(`Successfully generated ${Object.keys(svgs).length} official SVG assets into public/assets/payments/`);
