
export type IntegrationStatusType =
  | 'CONNECTED'
  | 'CONFIGURED_NOT_VERIFIED'
  | 'SANDBOX'
  | 'NEEDS_SETUP'
  | 'TEMPORARILY_UNAVAILABLE'
  | 'DISCONTINUED'
  | 'NOT_SUPPORTED';

export type PaymentCategory =
  | 'UPI'
  | 'WALLET'
  | 'GATEWAY'
  | 'BANK'
  | 'CARD_NETWORK'
  | 'NET_BANKING';

export interface PaymentBrandMeta {
  code: string;
  name: string;
  shortName: string;
  category: PaymentCategory;
  typeLabel: string;
  status: IntegrationStatusType;
  environment: 'PRODUCTION' | 'SANDBOX' | 'HISTORIC';
  brandColor: string;
  officialWebsite?: string;
  operationalNote?: string;
  isDiscontinued?: boolean;
  assetPath?: string;
  supportedOperations: ('PAYMENTS' | 'PAYOUTS' | 'REFUNDS' | 'SETTLEMENTS' | 'SUBSCRIPTIONS')[];
}

export const PAYMENT_BRAND_REGISTRY: Record<string, PaymentBrandMeta> = {
  // ==================== INDIAN UPI APPS ====================
  bharatpe: {
    code: 'bharatpe',
    name: 'BharatPe Merchant QR & POS',
    shortName: 'BharatPe',
    category: 'UPI',
    typeLabel: 'Interoperable Zero-MDR Merchant QR Switch',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#00B5B8',
    officialWebsite: 'https://bharatpe.com/',
    supportedOperations: ['PAYMENTS', 'SETTLEMENTS'],
  },
  phonepe: {
    code: 'phonepe',
    name: 'PhonePe for Business',
    shortName: 'PhonePe',
    category: 'UPI',
    typeLabel: 'UPI Merchant Intent & Dynamic QR',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#5F259F',
    officialWebsite: 'https://www.phonepe.com/business-solutions/',
    supportedOperations: ['PAYMENTS', 'REFUNDS', 'SETTLEMENTS'],
  },
  gpay: {
    code: 'gpay',
    name: 'Google Pay for Business',
    shortName: 'Google Pay',
    category: 'UPI',
    typeLabel: 'Google Spot & Merchant UPI 2.0',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#4285F4',
    officialWebsite: 'https://pay.google.com/about/business/',
    supportedOperations: ['PAYMENTS', 'REFUNDS', 'SETTLEMENTS'],
  },
  paytm: {
    code: 'paytm',
    name: 'Paytm Business PG & Wallet',
    shortName: 'Paytm',
    category: 'UPI',
    typeLabel: 'All-in-One Merchant QR & Gateway',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#00BAF2',
    officialWebsite: 'https://business.paytm.com/',
    supportedOperations: ['PAYMENTS', 'REFUNDS', 'SETTLEMENTS'],
  },
  bhim: {
    code: 'bhim',
    name: 'BHIM UPI Direct Switch (NPCI)',
    shortName: 'BHIM UPI',
    category: 'UPI',
    typeLabel: 'Sovereign NPCI ISO 8583 Message Switch',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#FF9933',
    officialWebsite: 'https://www.bhimupi.org.in/',
    supportedOperations: ['PAYMENTS', 'REFUNDS', 'SETTLEMENTS'],
  },
  amazonpay: {
    code: 'amazonpay',
    name: 'Amazon Pay UPI & Wallet',
    shortName: 'Amazon Pay',
    category: 'UPI',
    typeLabel: 'Amazon Payments Merchant Switch',
    status: 'CONFIGURED_NOT_VERIFIED',
    environment: 'SANDBOX',
    brandColor: '#FF9900',
    officialWebsite: 'https://www.amazon.in/amazonpay/home',
    operationalNote: 'Requires Amazon Seller Central merchant agreement and OAuth token refresh.',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },
  whatsapppay: {
    code: 'whatsapppay',
    name: 'WhatsApp Pay (Meta / NPCI)',
    shortName: 'WhatsApp Pay',
    category: 'UPI',
    typeLabel: 'Conversational UPI Invoicing',
    status: 'CONFIGURED_NOT_VERIFIED',
    environment: 'SANDBOX',
    brandColor: '#25D366',
    officialWebsite: 'https://www.whatsapp.com/payments/in',
    operationalNote: 'Configured on WhatsApp Business Platform API. Awaiting Meta verified badge.',
    supportedOperations: ['PAYMENTS'],
  },
  cred: {
    code: 'cred',
    name: 'CRED Pay (Dreamplug Technologies)',
    shortName: 'CRED Pay',
    category: 'UPI',
    typeLabel: 'High-Ticket Premium UPI Rail',
    status: 'CONFIGURED_NOT_VERIFIED',
    environment: 'SANDBOX',
    brandColor: '#1A1A1A',
    officialWebsite: 'https://cred.club/',
    operationalNote: 'REST API integration ready; merchant eligibility requires annual turnover > ₹50M.',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },

  // ==================== WALLETS & PAYMENT SERVICES ====================
  freecharge: {
    code: 'freecharge',
    name: 'FreeCharge Merchant Pay (Axis Bank)',
    shortName: 'FreeCharge',
    category: 'WALLET',
    typeLabel: 'Prepaid Wallet & UPI Clearing',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#EB6324',
    officialWebsite: 'https://www.freecharge.in/',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },
  mobikwik: {
    code: 'mobikwik',
    name: 'MobiKwik ZIP & Wallet PG',
    shortName: 'MobiKwik',
    category: 'WALLET',
    typeLabel: 'ZIP Pay Later & Prepaid Switch',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#00AEEF',
    officialWebsite: 'https://www.mobikwik.com/',
    supportedOperations: ['PAYMENTS', 'REFUNDS', 'PAYOUTS'],
  },
  airtel: {
    code: 'airtel',
    name: 'Airtel Money & Payments Bank',
    shortName: 'Airtel Money',
    category: 'WALLET',
    typeLabel: 'APBL Banking Escrow & Merchant QR',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#ED1C24',
    officialWebsite: 'https://www.airtel.in/bank/',
    supportedOperations: ['PAYMENTS', 'REFUNDS', 'SETTLEMENTS'],
  },
  jiomoney: {
    code: 'jiomoney',
    name: 'JioMoney Enterprise PG',
    shortName: 'JioMoney',
    category: 'WALLET',
    typeLabel: 'Jio Payments Bank PPI Host',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#005B9F',
    officialWebsite: 'https://www.jiomoney.com/',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },
  payzapp: {
    code: 'payzapp',
    name: 'PayZapp by HDFC Bank',
    shortName: 'PayZapp',
    category: 'WALLET',
    typeLabel: 'SmartBuy Merchant Clearing & Instant CashBack',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#002D62',
    officialWebsite: 'https://v.hdfcbank.com/payzapp/index.html',
    supportedOperations: ['PAYMENTS', 'REFUNDS', 'SETTLEMENTS'],
  },
  pockets: {
    code: 'pockets',
    name: 'Pockets by ICICI Bank',
    shortName: 'Pockets',
    category: 'WALLET',
    typeLabel: 'Virtual VISA Card & ICICI Wallet Switch',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#F37021',
    officialWebsite: 'https://www.icicibank.com/Personal-Banking/pockets/pockets.page',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },
  chillr: {
    code: 'chillr',
    name: 'Chillr Multi-Bank IMPS (Discontinued / Historic)',
    shortName: 'Chillr (Legacy)',
    category: 'UPI',
    typeLabel: 'Historic IMPS P2M Clearing',
    status: 'DISCONTINUED',
    environment: 'HISTORIC',
    brandColor: '#00A88F',
    isDiscontinued: true,
    operationalNote: 'Chillr ceased public consumer operations in 2021 after HDFC integration; records preserved for audited financial reconciliation.',
    supportedOperations: ['REFUNDS'],
  },
  trupay: {
    code: 'trupay',
    name: 'Trupay Unified Switch',
    shortName: 'Trupay',
    category: 'UPI',
    typeLabel: 'Direct Bank-to-Bank IMPS/UPI Router',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#1E88E5',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },
  oxigen: {
    code: 'oxigen',
    name: 'Oxigen Services & Wallet (Discontinued / Historic)',
    shortName: 'Oxigen (Legacy)',
    category: 'WALLET',
    typeLabel: 'RBL White-label Prepaid PPI',
    status: 'DISCONTINUED',
    environment: 'HISTORIC',
    brandColor: '#004A99',
    isDiscontinued: true,
    operationalNote: 'Oxigen wallet PPI license was surrendered; historical ledger records preserved for audit continuity.',
    supportedOperations: ['REFUNDS'],
  },
  moneyonmobile: {
    code: 'moneyonmobile',
    name: 'MoneyOnMobile Digital M-Purse',
    shortName: 'MoneyOnMobile',
    category: 'WALLET',
    typeLabel: 'Semi-Closed PPI Retailer Switch',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#0C1F38',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },
  zipcash: {
    code: 'zipcash',
    name: 'ZipCash RBI Card Rail (Ola Money)',
    shortName: 'ZipCash',
    category: 'WALLET',
    typeLabel: 'RBI Certified Prepaid Card Rail',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#00D06C',
    operationalNote: 'Acquired by Ola Financial Services; operates as PPI card switch.',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },
  mpurse: {
    code: 'mpurse',
    name: 'm-Purse Pay Anywhere',
    shortName: 'm-Purse',
    category: 'WALLET',
    typeLabel: 'NFC & QR Merchant POS Routing',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#0E2C5A',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },
  aadhaar: {
    code: 'aadhaar',
    name: 'Aadhaar Pay (AePS NPCI Direct)',
    shortName: 'Aadhaar Pay',
    category: 'UPI',
    typeLabel: 'UIDAI Biometric Micro-ATM & Merchant Pay',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#ED1C24',
    officialWebsite: 'https://www.npci.org.in/what-we-do/aeps/product-overview',
    supportedOperations: ['PAYMENTS', 'SETTLEMENTS'],
  },
  itzcash: {
    code: 'itzcash',
    name: 'ItzCash Card & Payouts (EbixCash)',
    shortName: 'ItzCash',
    category: 'WALLET',
    typeLabel: 'EbixCash PPI FinTech Clearing',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#002966',
    supportedOperations: ['PAYMENTS', 'PAYOUTS'],
  },
  quikwallet: {
    code: 'quikwallet',
    name: 'QuikWallet Restaurant & POS',
    shortName: 'QuikWallet',
    category: 'WALLET',
    typeLabel: 'Dynamic Invoicing POS Rail',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#C05020',
    supportedOperations: ['PAYMENTS', 'SETTLEMENTS'],
  },
  sbi_buddy: {
    code: 'sbi_buddy',
    name: 'State Bank Buddy (Merged into SBI YONO)',
    shortName: 'SBI Buddy (Legacy)',
    category: 'WALLET',
    typeLabel: 'State Bank PPI Wallet',
    status: 'DISCONTINUED',
    environment: 'HISTORIC',
    brandColor: '#0091DA',
    isDiscontinued: true,
    operationalNote: 'SBI Buddy was merged into SBI YONO in 2018; historical balances and settlement entries retained for statutory compliance.',
    supportedOperations: ['SETTLEMENTS'],
  },
  mrupee: {
    code: 'mrupee',
    name: 'mRUPEE Mobile Payment (Tata Teleservices Legacy)',
    shortName: 'mRUPEE (Legacy)',
    category: 'WALLET',
    typeLabel: 'Telecom PPI Settlement Bridge',
    status: 'DISCONTINUED',
    environment: 'HISTORIC',
    brandColor: '#0A3C78',
    isDiscontinued: true,
    operationalNote: 'Tata mRUPEE operations discontinued post telecom restructuring; preserved for ledger reconciliation.',
    supportedOperations: ['REFUNDS'],
  },
  citrus: {
    code: 'citrus',
    name: 'Citrus Pay Wallet (Acquired by PayU)',
    shortName: 'Citrus (Legacy)',
    category: 'WALLET',
    typeLabel: 'Prepaid Wallet & Checkout Express',
    status: 'DISCONTINUED',
    environment: 'HISTORIC',
    brandColor: '#F37023',
    isDiscontinued: true,
    operationalNote: 'Citrus Pay was merged into PayU India; historical transaction entries archived.',
    supportedOperations: ['REFUNDS'],
  },
  upi: {
    code: 'upi',
    name: 'Unified Payments Interface (NPCI National Switch)',
    shortName: 'UPI Core',
    category: 'UPI',
    typeLabel: 'NPCI National Financial Switch (NFS)',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#097939',
    officialWebsite: 'https://www.npci.org.in/',
    supportedOperations: ['PAYMENTS', 'REFUNDS', 'SETTLEMENTS'],
  },

  // ==================== PAYMENT GATEWAYS & FINANCIAL NETWORKS ====================
  razorpay: {
    code: 'razorpay',
    name: 'Razorpay Gateway & Payouts',
    shortName: 'Razorpay',
    category: 'GATEWAY',
    typeLabel: 'All-in-One PG, Smart Collect & RazorpayX Payouts',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#0C2340',
    officialWebsite: 'https://razorpay.com/',
    supportedOperations: ['PAYMENTS', 'PAYOUTS', 'REFUNDS', 'SETTLEMENTS', 'SUBSCRIPTIONS'],
  },
  cashfree: {
    code: 'cashfree',
    name: 'Cashfree Payments & Payouts',
    shortName: 'Cashfree',
    category: 'GATEWAY',
    typeLabel: 'Auto-Debit Pool, Instant IMPS & Escrow',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#1E0B38',
    officialWebsite: 'https://www.cashfree.com/',
    supportedOperations: ['PAYMENTS', 'PAYOUTS', 'REFUNDS', 'SETTLEMENTS'],
  },
  stripe: {
    code: 'stripe',
    name: 'Stripe Global Payments',
    shortName: 'Stripe',
    category: 'GATEWAY',
    typeLabel: 'Cross-Border Invoicing & Multi-Currency',
    status: 'CONNECTED',
    environment: 'SANDBOX',
    brandColor: '#635BFF',
    officialWebsite: 'https://stripe.com/',
    supportedOperations: ['PAYMENTS', 'REFUNDS', 'PAYOUTS', 'SUBSCRIPTIONS'],
  },
  paypal: {
    code: 'paypal',
    name: 'PayPal Merchant Commerce',
    shortName: 'PayPal',
    category: 'GATEWAY',
    typeLabel: 'Global Cross-Border Buyer Protection Rail',
    status: 'SANDBOX',
    environment: 'SANDBOX',
    brandColor: '#00457C',
    officialWebsite: 'https://www.paypal.com/in/business',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },

  // ==================== CARD NETWORKS & RAILS ====================
  visa: {
    code: 'visa',
    name: 'Visa International Network',
    shortName: 'Visa',
    category: 'CARD_NETWORK',
    typeLabel: 'Global Debit & Credit Card Clearing',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#1A1F71',
    officialWebsite: 'https://www.visa.co.in/',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },
  mastercard: {
    code: 'mastercard',
    name: 'Mastercard Worldwide Rail',
    shortName: 'Mastercard',
    category: 'CARD_NETWORK',
    typeLabel: 'EMV 3D-Secure 2.0 Card Vault',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#EB001B',
    officialWebsite: 'https://www.mastercard.co.in/',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },
  rupay: {
    code: 'rupay',
    name: 'RuPay National Card Rail (NPCI)',
    shortName: 'RuPay',
    category: 'CARD_NETWORK',
    typeLabel: 'Domestic Low-MDR Sovereign Card Switch',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#2B3990',
    officialWebsite: 'https://www.rupay.co.in/',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },
  amex: {
    code: 'amex',
    name: 'American Express Enterprise',
    shortName: 'Amex',
    category: 'CARD_NETWORK',
    typeLabel: 'Corporate Centurion Card Vault',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#006FCF',
    officialWebsite: 'https://www.americanexpress.com/in/',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },
  netbanking: {
    code: 'netbanking',
    name: 'Universal Net Banking Switch (58 Banks)',
    shortName: 'Net Banking',
    category: 'NET_BANKING',
    typeLabel: 'Direct Host-to-Host Corporate CMS',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#004C8F',
    supportedOperations: ['PAYMENTS', 'SETTLEMENTS'],
  },
  banktransfer: {
    code: 'banktransfer',
    name: 'Institutional RTGS / NEFT / IMPS',
    shortName: 'Bank Transfers',
    category: 'BANK',
    typeLabel: 'RBI Core Banking Host-to-Host',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#105B3A',
    supportedOperations: ['PAYOUTS', 'SETTLEMENTS'],
  },
  debitcards: {
    code: 'debitcards',
    name: 'Debit Cards (Direct Bank Interbank Clearing)',
    shortName: 'Debit Cards',
    category: 'CARD_NETWORK',
    typeLabel: 'EMV Contactless & PIN Settlement',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#183650',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },
  creditcards: {
    code: 'creditcards',
    name: 'Credit Cards (Tokenized Card Vault)',
    shortName: 'Credit Cards',
    category: 'CARD_NETWORK',
    typeLabel: 'Tokenized Vault & Split Invoicing',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#1E252B',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },

  // ==================== CORPORATE HOST-TO-HOST BANKS ====================
  hdfc_bank: {
    code: 'hdfc_bank',
    name: 'HDFC Corporate Direct Host-to-Host',
    shortName: 'HDFC Bank',
    category: 'BANK',
    typeLabel: 'RTGS/NEFT CMS Clearing & Primary Current A/C',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#004C8F',
    officialWebsite: 'https://www.hdfcbank.com/',
    supportedOperations: ['PAYMENTS', 'PAYOUTS', 'SETTLEMENTS'],
  },
  icici_bank: {
    code: 'icici_bank',
    name: 'ICICI Corporate CIB API',
    shortName: 'ICICI Bank',
    category: 'BANK',
    typeLabel: 'Corporate Internet Banking API',
    status: 'NEEDS_SETUP',
    environment: 'SANDBOX',
    brandColor: '#8C1824',
    officialWebsite: 'https://www.icicibank.com/business-banking.page',
    operationalNote: 'Requires Mutual TLS Client Certificate & Corporate Signatory approval.',
    supportedOperations: ['PAYOUTS'],
  },
  axis: {
    code: 'axis',
    name: 'Axis Bank Corporate CMS Host',
    shortName: 'Axis Bank',
    category: 'BANK',
    typeLabel: 'Axis H2H Corporate Treasury & Escrow',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#97144D',
    officialWebsite: 'https://www.axisbank.com/',
    supportedOperations: ['PAYOUTS', 'SETTLEMENTS'],
  },
  sbi: {
    code: 'sbi',
    name: 'State Bank of India Corporate YONO',
    shortName: 'SBI Corporate',
    category: 'BANK',
    typeLabel: 'SBI National Corporate Cash Management',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#0091DA',
    officialWebsite: 'https://yonobusiness.sbi/',
    supportedOperations: ['PAYOUTS', 'SETTLEMENTS'],
  },
  sbi_pay: {
    code: 'sbi_pay',
    name: 'BHIM SBI Pay (State Bank of India UPI)',
    shortName: 'BHIM SBI Pay',
    category: 'UPI',
    typeLabel: 'State Bank NPCI UPI Switch',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#0091DA',
    officialWebsite: 'https://sbi.co.in/web/personal-banking/digital/sbi-pay',
    supportedOperations: ['PAYMENTS', 'REFUNDS', 'SETTLEMENTS'],
  },
  fino: {
    code: 'fino',
    name: 'Fino Payments Bank Cash Point & Payouts',
    shortName: 'Fino Bank',
    category: 'BANK',
    typeLabel: 'Fino Escrow Clearing & AePS Rail',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#9C1A2E',
    officialWebsite: 'https://www.finobank.com/',
    supportedOperations: ['PAYMENTS', 'PAYOUTS', 'SETTLEMENTS'],
  },
  bob: {
    code: 'bob',
    name: 'BHIM Baroda Pay (Bank of Baroda UPI)',
    shortName: 'Baroda Pay',
    category: 'BANK',
    typeLabel: 'Bank of Baroda Merchant UPI Host',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#F26522',
    officialWebsite: 'https://www.bankofbaroda.in/digital-banking/digital-payment-services/baroda-pay',
    supportedOperations: ['PAYMENTS', 'REFUNDS', 'SETTLEMENTS'],
  },
  rbl: {
    code: 'rbl',
    name: 'RBL Bank BHIM Direct Switch',
    shortName: 'RBL Bank',
    category: 'BANK',
    typeLabel: 'RBL Bank Fintech Clearing & Host-to-Host',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#9B2779',
    officialWebsite: 'https://www.rblbank.com/',
    supportedOperations: ['PAYMENTS', 'PAYOUTS', 'SETTLEMENTS'],
  },
  paywiz: {
    code: 'paywiz',
    name: 'Canara PayWiz UPI Switch',
    shortName: 'Canara PayWiz',
    category: 'UPI',
    typeLabel: 'Canara Bank Interoperable UPI Switch',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#00875A',
    officialWebsite: 'https://canarabank.com/',
    supportedOperations: ['PAYMENTS', 'REFUNDS'],
  },
  kotak: {
    code: 'kotak',
    name: 'Kotak Mahindra Bank Corporate Direct',
    shortName: 'Kotak Bank',
    category: 'BANK',
    typeLabel: 'Corporate Direct API Banking & Escrow',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#EE1C25',
    officialWebsite: 'https://www.kotak.com/corporate-banking/',
    supportedOperations: ['PAYMENTS', 'PAYOUTS', 'SETTLEMENTS'],
  },
  pnb: {
    code: 'pnb',
    name: 'Punjab National Bank Corporate CMS',
    shortName: 'PNB Corporate',
    category: 'BANK',
    typeLabel: 'Corporate Internet Banking & NEFT/RTGS Host',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#A20034',
    officialWebsite: 'https://pnbindia.in/',
    supportedOperations: ['PAYMENTS', 'PAYOUTS', 'SETTLEMENTS'],
  },
  indusind: {
    code: 'indusind',
    name: 'IndusInd Bank Corporate Direct API',
    shortName: 'IndusInd Bank',
    category: 'BANK',
    typeLabel: 'Corporate Transaction Banking Rails',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#841A1C',
    officialWebsite: 'https://www.indusind.com/corporate-banking/',
    supportedOperations: ['PAYMENTS', 'PAYOUTS'],
  },
  yesbank: {
    code: 'yesbank',
    name: 'YES Bank API Banking Switch',
    shortName: 'YES Bank',
    category: 'BANK',
    typeLabel: 'Real-time Corporate API Banking Switch',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#002B49',
    officialWebsite: 'https://www.yesbank.in/corporate-banking',
    supportedOperations: ['PAYMENTS', 'PAYOUTS', 'SETTLEMENTS'],
  },
  idfc: {
    code: 'idfc',
    name: 'IDFC FIRST Bank Direct Corporate Rail',
    shortName: 'IDFC FIRST Bank',
    category: 'BANK',
    typeLabel: 'Corporate CMS & Instant Payouts Rail',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#991B1E',
    officialWebsite: 'https://www.idfcfirstbank.com/wholesale-banking',
    supportedOperations: ['PAYMENTS', 'PAYOUTS', 'SETTLEMENTS'],
  },
  federal: {
    code: 'federal',
    name: 'Federal Bank FedNet Corporate CMS',
    shortName: 'Federal Bank',
    category: 'BANK',
    typeLabel: 'FedNet Corporate Host-to-Host Rail',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#004B87',
    officialWebsite: 'https://www.federalbank.co.in/corporate-banking',
    supportedOperations: ['PAYMENTS', 'PAYOUTS'],
  },
};

/**
 * Normalizes input code/name to match registry keys
 */
export function normalizePaymentBrandCode(input: string): string {
  if (!input) return 'generic';
  const clean = input.toLowerCase().replace(/[-_\s]/g, '');

  if (clean.includes('bharatpe')) return 'bharatpe';
  if (clean.includes('phonepe') || clean === 'pe') return 'phonepe';
  if (clean.includes('gpay') || clean.includes('google')) return 'gpay';
  if (clean.includes('paytm') || clean === 'ptm') return 'paytm';
  if (clean.includes('bhim') && clean.includes('sbi')) return 'sbi_pay';
  if (clean.includes('bhim') && (clean.includes('baroda') || clean.includes('bob'))) return 'bob';
  if (clean.includes('bhim') && clean.includes('axis')) return 'axis';
  if (clean.includes('bhim') && clean.includes('rbl')) return 'rbl';
  if (clean.includes('bhim') || clean.includes('npci')) return 'bhim';
  if (clean.includes('upi')) return 'upi';
  if (clean.includes('amazon') || clean.includes('amzn')) return 'amazonpay';
  if (clean.includes('whatsapp') || clean.includes('wa')) return 'whatsapppay';
  if (clean.includes('cred')) return 'cred';

  if (clean.includes('freecharge')) return 'freecharge';
  if (clean.includes('mobikwik') || clean.includes('kwik')) return 'mobikwik';
  if (clean.includes('airtel')) return 'airtel';
  if (clean.includes('jiomoney') || clean === 'jio') return 'jiomoney';
  if (clean.includes('payzapp') || clean === 'pz') return 'payzapp';
  if (clean.includes('pockets')) return 'pockets';
  if (clean.includes('chillr')) return 'chillr';
  if (clean.includes('trupay')) return 'trupay';
  if (clean.includes('oxigen')) return 'oxigen';
  if (clean.includes('moneyonmobile') || clean.includes('mom')) return 'moneyonmobile';
  if (clean.includes('zipcash') || clean === 'zip') return 'zipcash';
  if (clean.includes('mpurse')) return 'mpurse';
  if (clean.includes('aadhaar') || clean.includes('aeps')) return 'aadhaar';
  if (clean.includes('itzcash') || clean.includes('itz')) return 'itzcash';
  if (clean.includes('quikwallet') || clean.includes('quik')) return 'quikwallet';
  if (clean.includes('buddy') || clean.includes('sbibuddy')) return 'sbi_buddy';
  if (clean.includes('mrupee')) return 'mrupee';
  if (clean.includes('citrus')) return 'citrus';
  if (clean.includes('paywiz')) return 'paywiz';
  if (clean.includes('fino')) return 'fino';
  if (clean.includes('baroda') || clean === 'bob') return 'bob';
  if (clean.includes('rbl')) return 'rbl';

  if (clean.includes('razorpay') || clean === 'rzp') return 'razorpay';
  if (clean.includes('cashfree') || clean === 'cf') return 'cashfree';
  if (clean.includes('stripe')) return 'stripe';
  if (clean.includes('paypal') || clean === 'pp') return 'paypal';

  if (clean.includes('visa')) return 'visa';
  if (clean.includes('mastercard') || clean === 'mc') return 'mastercard';
  if (clean.includes('rupay')) return 'rupay';
  if (clean.includes('amex') || clean.includes('americanexpress')) return 'amex';
  if (clean.includes('netbanking') || clean.includes('net_banking')) return 'netbanking';
  if (clean.includes('banktransfer') || clean.includes('bank_transfer') || clean.includes('imps') || clean.includes('neft') || clean.includes('rtgs')) return 'banktransfer';
  if (clean.includes('debitcard') || clean.includes('debit_card')) return 'debitcards';
  if (clean.includes('creditcard') || clean.includes('credit_card')) return 'creditcards';

  if (clean.includes('hdfc')) return 'hdfc_bank';
  if (clean.includes('icici')) return 'icici_bank';
  if (clean.includes('axis')) return 'axis';
  if (clean.includes('sbi')) return 'sbi';
  if (clean.includes('kotak')) return 'kotak';
  if (clean.includes('pnb') || clean.includes('punjab')) return 'pnb';
  if (clean.includes('indusind') || clean.includes('indus')) return 'indusind';
  if (clean.includes('yes') || clean.includes('yesbank')) return 'yesbank';
  if (clean.includes('idfc')) return 'idfc';
  if (clean.includes('federal')) return 'federal';

  return clean;
}

/**
 * Official asset path resolver pointing to verified public SVG files
 */
export const OFFICIAL_ASSET_MAP: Record<string, string> = {
  phonepe: '/assets/payments/phonepe.svg',
  gpay: '/assets/payments/google-pay.svg',
  paytm: '/assets/payments/paytm.svg',
  bharatpe: '/assets/payments/bharatpe.svg',
  bhim: '/assets/payments/bhim-upi.svg',
  amazonpay: '/assets/payments/amazon-pay.svg',
  whatsapppay: '/assets/payments/whatsapp-pay.svg',
  cred: '/assets/payments/cred.svg',
  freecharge: '/assets/payments/freecharge.svg',
  mobikwik: '/assets/payments/mobikwik.svg',
  airtel: '/assets/payments/airtel-payments-bank.svg',
  jiomoney: '/assets/payments/jiomoney.svg',
  payzapp: '/assets/payments/payzapp.svg',
  pockets: '/assets/payments/pockets.svg',
  chillr: '/assets/payments/chillr.svg',
  trupay: '/assets/payments/trupay.svg',
  oxigen: '/assets/payments/oxigen.svg',
  moneyonmobile: '/assets/payments/moneyonmobile.svg',
  zipcash: '/assets/payments/zipcash.svg',
  mpurse: '/assets/payments/mpurse.svg',
  aadhaar: '/assets/payments/aadhaar-pay.svg',
  itzcash: '/assets/payments/itzcash.svg',
  quikwallet: '/assets/payments/quikwallet.svg',
  sbi_buddy: '/assets/payments/sbi-buddy.svg',
  mrupee: '/assets/payments/mrupee.svg',
  citrus: '/assets/payments/citrus.svg',
  fino: '/assets/payments/fino-payments-bank.svg',
  bob: '/assets/payments/baroda-pay.svg',
  rbl: '/assets/payments/rbl-bank.svg',
  sbi_pay: '/assets/payments/sbi-pay.svg',
  paywiz: '/assets/payments/paywiz.svg',
  axis: '/assets/payments/axis-bank.svg',
  hdfc_bank: '/assets/payments/hdfc-bank.svg',
  icici_bank: '/assets/payments/icici-bank.svg',
  sbi: '/assets/payments/sbi-bank.svg',
  kotak: '/assets/payments/kotak-bank.svg',
  pnb: '/assets/payments/pnb-bank.svg',
  indusind: '/assets/payments/indusind-bank.svg',
  yesbank: '/assets/payments/yes-bank.svg',
  idfc: '/assets/payments/idfc-bank.svg',
  federal: '/assets/payments/federal-bank.svg',
  razorpay: '/assets/payments/razorpay.svg',
  cashfree: '/assets/payments/cashfree.svg',
  stripe: '/assets/payments/stripe.svg',
  paypal: '/assets/payments/paypal.svg',
  visa: '/assets/payments/visa.svg',
  mastercard: '/assets/payments/mastercard.svg',
  rupay: '/assets/payments/rupay.svg',
  amex: '/assets/payments/amex.svg',
  upi: '/assets/payments/upi.svg',
};

export function getBrandAssetPath(input: string): string {
  const code = normalizePaymentBrandCode(input);
  return OFFICIAL_ASSET_MAP[code] || '/assets/payments/upi.svg';
}

/**
 * Returns brand metadata with intelligent fallback
 */
export function getPaymentBrand(input: string): PaymentBrandMeta {
  const code = normalizePaymentBrandCode(input);
  if (PAYMENT_BRAND_REGISTRY[code]) {
    const meta = { ...PAYMENT_BRAND_REGISTRY[code] };
    meta.assetPath = OFFICIAL_ASSET_MAP[code];
    return meta;
  }

  // Fallback for custom or unknown providers
  return {
    code: input || 'generic',
    name: input ? input.replace(/_/g, ' ').toUpperCase() : 'Payment Rail',
    shortName: input || 'Rail',
    category: 'GATEWAY',
    typeLabel: 'Financial Rail',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    brandColor: '#303A31',
    assetPath: OFFICIAL_ASSET_MAP[code] || '/assets/payments/upi.svg',
    supportedOperations: ['PAYMENTS'],
  };
}
