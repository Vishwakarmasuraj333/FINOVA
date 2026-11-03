import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  Account,
  PaymentProvider,
  Transaction,
  LedgerEntry,
  Transfer,
  ChargeFee,
  Refund,
  Settlement,
  ReconciliationRun,
  ReconciliationDiscrepancy,
  Customer,
  AuditLog,
  SystemSettings,
  ConsolidatedFinancialSummary,
  AccountFinancialBreakdown,
  User,
  Currency,
} from '@/types';

export interface FinovaDatabase {
  users: User[];
  settings: SystemSettings;
  providers: PaymentProvider[];
  accounts: Account[];
  transactions: Transaction[];
  ledger_entries: LedgerEntry[];
  transfers: Transfer[];
  charges: ChargeFee[];
  refunds: Refund[];
  settlements: Settlement[];
  reconciliation_runs: ReconciliationRun[];
  reconciliation_discrepancies: ReconciliationDiscrepancy[];
  customers: Customer[];
  audit_logs: AuditLog[];
  processed_idempotency_keys: Record<string, { timestamp: string; resultId: string }>;
}

// Global memory cache across serverless warm invocations
declare global {
  var __finova_memory_db: FinovaDatabase | undefined;
}

const BUNDLED_DB_FILE = path.join(process.cwd(), 'data', 'finova-store.json');

function getWritableDbFile(): string {
  // If running in Vercel / AWS Lambda environment where root is read-only
  if (
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.cwd().startsWith('/var/task') ||
    process.cwd().startsWith('/var/runtime')
  ) {
    return path.join(os.tmpdir(), 'finova-store.json');
  }
  return BUNDLED_DB_FILE;
}

function ensureDataDir(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  }
}

export function getInitialSeedData(): FinovaDatabase {
  const now = new Date();
  const isoNow = now.toISOString();
  const dMinus1 = new Date(now.getTime() - 86400000).toISOString();
  const dMinus2 = new Date(now.getTime() - 2 * 86400000).toISOString();
  const dMinus5 = new Date(now.getTime() - 5 * 86400000).toISOString();
  const dMinus10 = new Date(now.getTime() - 10 * 86400000).toISOString();

  // Initial Users
  const users: User[] = [
    {
      id: 'usr_super_01',
      name: 'Aditya Kashyap',
      email: 'aditya.kashyap@finova.internal',
      role: 'Super Admin',
      status: 'ACTIVE',
      last_login: isoNow,
    },
    {
      id: 'usr_fin_admin_01',
      name: 'Priyanka Sharma',
      email: 'priyanka.sharma@finova.internal',
      role: 'Finance Admin',
      status: 'ACTIVE',
      last_login: dMinus1,
    },
    {
      id: 'usr_approver_01',
      name: 'Vikramaditya Singhania',
      email: 'vikram.singhania@finova.internal',
      role: 'Approver',
      status: 'ACTIVE',
      last_login: dMinus1,
    },
    {
      id: 'usr_operator_01',
      name: 'Sneha Deshmukh',
      email: 'sneha.deshmukh@finova.internal',
      role: 'Finance Operator',
      status: 'ACTIVE',
      last_login: dMinus2,
    },
    {
      id: 'usr_auditor_01',
      name: 'Rohan Mehta',
      email: 'rohan.mehta@external-audit.com',
      role: 'Read-only Auditor',
      status: 'ACTIVE',
      last_login: dMinus5,
    },
  ];

  const settings: SystemSettings = {
    organization_name: 'FINOVA Enterprise Technologies Ltd.',
    legal_entity: 'Finova Financial Services Pvt Ltd',
    pan: 'AABCF9821K',
    gstin: '27AABCF9821K1ZM',
    base_currency: 'INR',
    dual_approval_threshold_paise: 50000000, // ₹5,00,000 threshold for dual approval
    webhook_secret: 'whsec_finova_live_9a7d3c0f2a4e6b8d',
    notification_email: 'finance-ops@finova.internal',
    theme_preference: 'dark',
    data_freshness_interval_sec: 30,
    is_sandbox: true,
  };

  // Supported Payment Providers
  const providers: PaymentProvider[] = [
    {
      id: 'prov_razorpay',
      name: 'Razorpay Gateway & Payouts',
      code: 'razorpay',
      category: 'GATEWAY',
      status: 'CONNECTED',
      environment: 'SANDBOX',
      supported_operations: ['PAYMENTS', 'PAYOUTS', 'REFUNDS', 'SETTLEMENTS', 'SUBSCRIPTIONS'],
      last_synced_at: isoNow,
      last_sync_status: 'SUCCESS',
      webhook_url: 'https://api.finova.internal/webhooks/razorpay',
      webhook_events: ['payment.authorized', 'payment.captured', 'payment.failed', 'refund.processed', 'settlement.processed'],
      health_score: 99,
      merchant_id_masked: 'rzp_test_••••9812',
      is_demo: true,
    },
    {
      id: 'prov_cashfree',
      name: 'Cashfree Payments & Payouts',
      code: 'cashfree',
      category: 'GATEWAY',
      status: 'CONNECTED',
      environment: 'SANDBOX',
      supported_operations: ['PAYMENTS', 'PAYOUTS', 'REFUNDS', 'SETTLEMENTS'],
      last_synced_at: dMinus1,
      last_sync_status: 'SUCCESS',
      webhook_url: 'https://api.finova.internal/webhooks/cashfree',
      webhook_events: ['TRANSFER_SUCCESS', 'PAYMENT_SUCCESS_WEBHOOK', 'SETTLEMENT_WEBHOOK'],
      health_score: 97,
      merchant_id_masked: 'CF_MERCH_••••3341',
      is_demo: true,
    },
    {
      id: 'prov_phonepe',
      name: 'PhonePe Payment Gateway & UPI',
      code: 'phonepe',
      category: 'UPI',
      status: 'CONNECTED',
      environment: 'SANDBOX',
      supported_operations: ['PAYMENTS', 'REFUNDS', 'SETTLEMENTS'],
      last_synced_at: isoNow,
      last_sync_status: 'SUCCESS',
      webhook_url: 'https://api.finova.internal/webhooks/phonepe',
      webhook_events: ['PAYMENT_SUCCESS', 'PAYMENT_ERROR', 'REFUND_SUCCESS'],
      health_score: 98,
      merchant_id_masked: 'PHONEPE_M••••4829',
      is_demo: true,
    },
    {
      id: 'prov_paytm',
      name: 'Paytm for Business (Merchant PG)',
      code: 'paytm',
      category: 'GATEWAY',
      status: 'CONNECTED',
      environment: 'SANDBOX',
      supported_operations: ['PAYMENTS', 'REFUNDS', 'SETTLEMENTS'],
      last_synced_at: dMinus1,
      last_sync_status: 'SUCCESS',
      webhook_url: 'https://api.finova.internal/webhooks/paytm',
      webhook_events: ['Txn_Success', 'Txn_Failure', 'Refund_Success'],
      health_score: 95,
      merchant_id_masked: 'PAYTM_MID_••••5019',
      is_demo: true,
    },
    {
      id: 'prov_gpay',
      name: 'Google Pay for Business',
      code: 'gpay',
      category: 'UPI',
      status: 'CONNECTED',
      environment: 'SANDBOX',
      supported_operations: ['PAYMENTS', 'REFUNDS'],
      last_synced_at: dMinus1,
      last_sync_status: 'SUCCESS',
      webhook_url: 'https://api.finova.internal/webhooks/gpay',
      webhook_events: ['PAYMENT_RECEIVED', 'REFUND_UPDATE'],
      health_score: 99,
      merchant_id_masked: 'gpay_biz_••••8821',
      is_demo: true,
    },
    {
      id: 'prov_bhim',
      name: 'BHIM UPI Direct NPCI Switch',
      code: 'bhim',
      category: 'UPI',
      status: 'CONNECTED',
      environment: 'SANDBOX',
      supported_operations: ['PAYMENTS', 'REFUNDS'],
      last_synced_at: dMinus2,
      last_sync_status: 'SUCCESS',
      webhook_url: 'https://api.finova.internal/webhooks/bhim',
      webhook_events: ['UPI_COLLECT_SUCCESS', 'UPI_PAY_CONFIRM'],
      health_score: 96,
      merchant_id_masked: 'bhim.finova@npci',
      is_demo: true,
    },
    {
      id: 'prov_stripe',
      name: 'Stripe Global Payments',
      code: 'stripe',
      category: 'GATEWAY',
      status: 'CONNECTED',
      environment: 'SANDBOX',
      supported_operations: ['PAYMENTS', 'REFUNDS', 'PAYOUTS', 'SUBSCRIPTIONS'],
      last_synced_at: isoNow,
      last_sync_status: 'SUCCESS',
      webhook_url: 'https://api.finova.internal/webhooks/stripe',
      webhook_events: ['charge.succeeded', 'payout.paid', 'charge.refunded'],
      health_score: 100,
      merchant_id_masked: 'acct_••••8932',
      is_demo: true,
    },
    {
      id: 'prov_hdfc',
      name: 'HDFC Corporate Direct Banking (Host-to-Host)',
      code: 'hdfc_bank',
      category: 'BANK',
      status: 'CONNECTED',
      environment: 'SANDBOX',
      supported_operations: ['PAYOUTS', 'SETTLEMENTS'],
      last_synced_at: isoNow,
      last_sync_status: 'SUCCESS',
      webhook_url: 'https://api.finova.internal/webhooks/hdfc',
      webhook_events: ['NEFT_CREDIT', 'RTGS_DEBIT', 'CMS_SETTLEMENT'],
      health_score: 99,
      merchant_id_masked: 'HDFC_CMS_••••0012',
      is_demo: true,
    },
    {
      id: 'prov_icici',
      name: 'ICICI Corporate CIB API',
      code: 'icici_bank',
      category: 'BANK',
      status: 'NOT_CONNECTED',
      environment: 'SANDBOX',
      supported_operations: ['PAYOUTS'],
      last_synced_at: dMinus10,
      last_sync_status: 'FAILED',
      last_error: 'Certificate handshake timeout. Missing mutual TLS client cert.',
      webhook_url: 'https://api.finova.internal/webhooks/icici',
      webhook_events: ['IMPS_OUTWARD_STATUS'],
      health_score: 42,
      merchant_id_masked: 'CORP_ICICI_••••9941',
      is_demo: true,
    },
  ];

  // Bank & Settlement Accounts
  // Amounts in Integer Paise (e.g., ₹25,00,000 = 250000000 paise)
  const accounts: Account[] = [
    {
      id: 'acc_hdfc_primary',
      name: 'HDFC Primary Current Account',
      account_number_masked: '50200049281923',
      ifsc_or_routing: 'HDFC0000060',
      type: 'BANK_ACCOUNT',
      provider_id: 'prov_hdfc',
      currency: 'INR',
      opening_balance_paise: 250000000, // ₹25,00,000.00
      provider_reported_balance_paise: 284500000, // ₹28,45,000.00 (verified by bank statement)
      status: 'ACTIVE',
      last_synced_at: isoNow,
      is_demo: true,
    },
    {
      id: 'acc_razorpay_escrow',
      name: 'Razorpay Nodal / Clearing Escrow',
      account_number_masked: '91802938471201',
      ifsc_or_routing: 'KKBK0000958',
      type: 'GATEWAY_CLEARING',
      provider_id: 'prov_razorpay',
      currency: 'INR',
      opening_balance_paise: 120000000, // ₹12,00,000.00
      provider_reported_balance_paise: 147850000, // ₹14,78,500.00
      status: 'ACTIVE',
      last_synced_at: isoNow,
      is_demo: true,
    },
    {
      id: 'acc_cashfree_payout',
      name: 'Cashfree Payouts Auto-Debit Pool',
      account_number_masked: '82910394819283',
      ifsc_or_routing: 'YESB0000018',
      type: 'WALLET_CLEARING',
      provider_id: 'prov_cashfree',
      currency: 'INR',
      opening_balance_paise: 85000000, // ₹8,50,000.00
      provider_reported_balance_paise: 74200000, // ₹7,42,000.00
      status: 'ACTIVE',
      last_synced_at: dMinus1,
      is_demo: true,
    },
    {
      id: 'acc_phonepe_upi',
      name: 'PhonePe UPI Collections Pool',
      account_number_masked: '73910293847192',
      ifsc_or_routing: 'ICIC0000104',
      type: 'UPI_CLEARING',
      provider_id: 'prov_phonepe',
      currency: 'INR',
      opening_balance_paise: 95000000, // ₹9,50,000.00
      provider_reported_balance_paise: 112400000, // ₹11,24,000.00
      status: 'ACTIVE',
      last_synced_at: isoNow,
      is_demo: true,
    },
    {
      id: 'acc_reserve_tax',
      name: 'Corporate Tax & GST Reserve Pool',
      account_number_masked: '64910293848190',
      ifsc_or_routing: 'HDFC0000060',
      type: 'EXPENSE_RESERVE',
      provider_id: 'prov_hdfc',
      currency: 'INR',
      opening_balance_paise: 45000000, // ₹4,50,000.00
      provider_reported_balance_paise: 45000000,
      status: 'ACTIVE',
      last_synced_at: dMinus1,
      is_demo: true,
    },
  ];

  // Customers
  const customers: Customer[] = [
    {
      id: 'cust_01',
      name: 'Zomato Media Pvt Ltd',
      email: 'billing@zomato.example',
      phone: '+91 98200 11223',
      vpa: 'zomato.corp@hdfcbank',
      kyc_status: 'VERIFIED',
      total_volume_paise: 125000000,
      transaction_count: 48,
      created_at: dMinus10,
      is_demo: true,
    },
    {
      id: 'cust_02',
      name: 'Swiggy Bundl Technologies',
      email: 'settlements@swiggy.example',
      phone: '+91 98300 44556',
      vpa: 'swiggy.ops@icici',
      kyc_status: 'VERIFIED',
      total_volume_paise: 98000000,
      transaction_count: 35,
      created_at: dMinus10,
      is_demo: true,
    },
    {
      id: 'cust_03',
      name: 'Urban Company India Ltd',
      email: 'finance@urbancompany.example',
      phone: '+91 98111 77889',
      vpa: 'urbancompany@yesbank',
      kyc_status: 'VERIFIED',
      total_volume_paise: 45000000,
      transaction_count: 22,
      created_at: dMinus5,
      is_demo: true,
    },
    {
      id: 'cust_04',
      name: 'Zepto Quick Logistics',
      email: 'accounts@zepto.example',
      phone: '+91 98450 99887',
      vpa: 'zepto.ops@axl',
      kyc_status: 'VERIFIED',
      total_volume_paise: 67500000,
      transaction_count: 19,
      created_at: dMinus5,
      is_demo: true,
    },
  ];

  // Verified Transactions (Amounts in minor units Paise)
  // Let's create realistic transaction records spanning credits, debits, refunds, transfers, charges
  const transactions: Transaction[] = [
    {
      id: 'txn_c_001',
      internal_ref: 'FIN-TXN-2026-8910',
      external_ref: 'pay_rzp_LiveTest_89101',
      idempotency_key: 'idem_rzp_89101_init',
      account_id: 'acc_razorpay_escrow',
      provider_id: 'prov_razorpay',
      customer_id: 'cust_01',
      type: 'PAYMENT_CREDIT',
      amount_paise: 25000000, // ₹2,50,000.00
      fee_paise: 450000,      // ₹4,500.00 (1.8% gateway fee)
      tax_paise: 81000,       // ₹810.00 (18% GST on fee)
      net_paise: 24469000,    // ₹2,44,690.00
      currency: 'INR',
      status: 'COMPLETED',
      payment_method: 'NET_BANKING',
      initiated_at: dMinus1,
      completed_at: dMinus1,
      sender_name: 'Zomato Media Pvt Ltd',
      sender_reference: 'zomato.corp@hdfcbank',
      recipient_name: 'FINOVA Enterprise Tech',
      recipient_reference: 'acc_razorpay_escrow',
      reconciliation_status: 'RECONCILED',
      metadata: { order_id: 'ORD-9821-B', invoice_id: 'INV-2026-102' },
      is_demo: true,
    },
    {
      id: 'txn_c_002',
      internal_ref: 'FIN-TXN-2026-8911',
      external_ref: 'ppe_upi_99210293',
      idempotency_key: 'idem_ppe_99210293_init',
      account_id: 'acc_phonepe_upi',
      provider_id: 'prov_phonepe',
      customer_id: 'cust_02',
      type: 'PAYMENT_CREDIT',
      amount_paise: 18000000, // ₹1,80,000.00
      fee_paise: 0,           // ₹0.00 (UPI zero MDR)
      tax_paise: 0,
      net_paise: 18000000,
      currency: 'INR',
      status: 'COMPLETED',
      payment_method: 'UPI',
      initiated_at: dMinus1,
      completed_at: dMinus1,
      sender_name: 'Swiggy Bundl Technologies',
      sender_reference: 'swiggy.ops@icici',
      recipient_name: 'FINOVA Enterprise Tech',
      recipient_reference: 'phonepe.finova@ybl',
      reconciliation_status: 'RECONCILED',
      metadata: { upi_txn_id: 'UPI-77182901928' },
      is_demo: true,
    },
    {
      id: 'txn_c_003',
      internal_ref: 'FIN-TXN-2026-8912',
      external_ref: 'hdfc_cms_cr_1029',
      idempotency_key: 'idem_hdfc_cr_1029_init',
      account_id: 'acc_hdfc_primary',
      provider_id: 'prov_hdfc',
      customer_id: 'cust_03',
      type: 'PAYMENT_CREDIT',
      amount_paise: 35000000, // ₹3,50,000.00
      fee_paise: 25000,       // ₹250.00 RTGS/NEFT inward charge
      tax_paise: 4500,        // ₹45.00 GST
      net_paise: 34970500,
      currency: 'INR',
      status: 'COMPLETED',
      payment_method: 'BANK_TRANSFER',
      initiated_at: dMinus2,
      completed_at: dMinus2,
      sender_name: 'Urban Company India Ltd',
      sender_reference: 'HDFC0000060-CMS-UC',
      recipient_name: 'FINOVA Current A/C',
      recipient_reference: '50200049281923',
      reconciliation_status: 'RECONCILED',
      is_demo: true,
    },
    {
      id: 'txn_d_001',
      internal_ref: 'FIN-TXN-2026-8913',
      external_ref: 'cf_pout_981203',
      idempotency_key: 'idem_cf_pout_981203',
      account_id: 'acc_cashfree_payout',
      provider_id: 'prov_cashfree',
      type: 'TRANSFER_DEBIT',
      amount_paise: 11000000, // ₹1,10,000.00
      fee_paise: 1500,        // ₹15.00 IMPS payout fee
      tax_paise: 270,         // ₹2.70 GST
      net_paise: 1101770,     // Total deducted from cashfree pool: 1,10,017.70
      currency: 'INR',
      status: 'COMPLETED',
      payment_method: 'BANK_TRANSFER',
      initiated_at: dMinus1,
      completed_at: dMinus1,
      sender_name: 'FINOVA Cashfree Pool',
      sender_reference: '82910394819283',
      recipient_name: 'Vendor Cloud Infrastructure Ltd',
      recipient_reference: '•••• •••• 9921 (SBIN000182)',
      reconciliation_status: 'RECONCILED',
      is_demo: true,
    },
    {
      id: 'txn_ref_001',
      internal_ref: 'FIN-TXN-2026-8914',
      external_ref: 'rfnd_rzp_771928',
      idempotency_key: 'idem_rfnd_rzp_771928',
      account_id: 'acc_razorpay_escrow',
      provider_id: 'prov_razorpay',
      customer_id: 'cust_01',
      type: 'REFUND_DEBIT',
      amount_paise: 3000000,  // ₹30,000.00 refund
      fee_paise: 0,
      tax_paise: 0,
      net_paise: 3000000,
      currency: 'INR',
      status: 'COMPLETED',
      payment_method: 'NET_BANKING',
      initiated_at: dMinus1,
      completed_at: dMinus1,
      sender_name: 'FINOVA Escrow',
      sender_reference: 'acc_razorpay_escrow',
      recipient_name: 'Zomato Media Pvt Ltd',
      recipient_reference: 'zomato.corp@hdfcbank',
      related_refund_ref: 'RFND-2026-001',
      reconciliation_status: 'RECONCILED',
      is_demo: true,
    },
    {
      id: 'txn_fail_001',
      internal_ref: 'FIN-TXN-2026-8915',
      external_ref: 'gpay_fail_661928',
      idempotency_key: 'idem_gpay_fail_661928',
      account_id: 'acc_phonepe_upi',
      provider_id: 'prov_gpay',
      customer_id: 'cust_04',
      type: 'PAYMENT_CREDIT',
      amount_paise: 5000000,  // ₹50,000.00
      fee_paise: 0,
      tax_paise: 0,
      net_paise: 0,
      currency: 'INR',
      status: 'FAILED',
      payment_method: 'UPI',
      initiated_at: dMinus1,
      failure_code: 'U30_EXCEED_LIMIT',
      safe_error_message: 'Payer UPI issuing bank declined: Daily customer transaction limit exceeded.',
      sender_name: 'Zepto Quick Logistics',
      sender_reference: 'zepto.ops@axl',
      recipient_name: 'FINOVA UPI Pool',
      reconciliation_status: 'RECONCILED',
      is_demo: true,
    },
    {
      id: 'txn_pend_001',
      internal_ref: 'FIN-TXN-2026-8916',
      external_ref: 'rzp_pend_102938',
      idempotency_key: 'idem_rzp_pend_102938',
      account_id: 'acc_razorpay_escrow',
      provider_id: 'prov_razorpay',
      customer_id: 'cust_04',
      type: 'PAYMENT_CREDIT',
      amount_paise: 12500000, // ₹1,25,000.00
      fee_paise: 225000,      // ₹2,250.00
      tax_paise: 40500,       // ₹405.00
      net_paise: 12234500,
      currency: 'INR',
      status: 'PENDING',
      payment_method: 'CARDS',
      initiated_at: isoNow,
      sender_name: 'Zepto Quick Logistics',
      sender_reference: 'Corporate Credit Card ending 8812',
      recipient_name: 'FINOVA Escrow',
      reconciliation_status: 'UNRECONCILED',
      is_demo: true,
    },
    {
      id: 'txn_rev_001',
      internal_ref: 'FIN-TXN-2026-8917',
      external_ref: 'cf_rev_449102',
      idempotency_key: 'idem_cf_rev_449102',
      account_id: 'acc_cashfree_payout',
      provider_id: 'prov_cashfree',
      type: 'REVERSAL_CREDIT',
      amount_paise: 200000,   // ₹2,000.00 reversal of erroneous charge
      fee_paise: 0,
      tax_paise: 0,
      net_paise: 200000,
      currency: 'INR',
      status: 'REVERSED',
      payment_method: 'BANK_TRANSFER',
      initiated_at: dMinus2,
      completed_at: dMinus1,
      sender_name: 'Cashfree Clearing Operations',
      sender_reference: 'REV-CORR-4491',
      recipient_name: 'FINOVA Cashfree Pool',
      related_reversal_ref: 'REV-2026-004',
      reconciliation_status: 'RECONCILED',
      is_demo: true,
    },
  ];

  // Double-Entry Ledger Entries (Every Entry Balances: Debits = Credits)
  const ledger_entries: LedgerEntry[] = [
    // Opening balance equity journals
    {
      id: 'led_op_001',
      entry_type: 'CREDIT',
      debit_account_id: 'acc_hdfc_primary',
      credit_account_id: 'acc_equity_opening',
      amount_paise: 250000000,
      currency: 'INR',
      timestamp: dMinus10,
      description: 'Opening Balance for HDFC Primary Current Account',
      is_demo: true,
    },
    {
      id: 'led_op_002',
      entry_type: 'CREDIT',
      debit_account_id: 'acc_razorpay_escrow',
      credit_account_id: 'acc_equity_opening',
      amount_paise: 120000000,
      currency: 'INR',
      timestamp: dMinus10,
      description: 'Opening Balance for Razorpay Nodal Escrow',
      is_demo: true,
    },
    {
      id: 'led_op_003',
      entry_type: 'CREDIT',
      debit_account_id: 'acc_cashfree_payout',
      credit_account_id: 'acc_equity_opening',
      amount_paise: 85000000,
      currency: 'INR',
      timestamp: dMinus10,
      description: 'Opening Balance for Cashfree Payouts Pool',
      is_demo: true,
    },
    {
      id: 'led_op_004',
      entry_type: 'CREDIT',
      debit_account_id: 'acc_phonepe_upi',
      credit_account_id: 'acc_equity_opening',
      amount_paise: 95000000,
      currency: 'INR',
      timestamp: dMinus10,
      description: 'Opening Balance for PhonePe UPI Pool',
      is_demo: true,
    },
    {
      id: 'led_op_005',
      entry_type: 'CREDIT',
      debit_account_id: 'acc_reserve_tax',
      credit_account_id: 'acc_equity_opening',
      amount_paise: 45000000,
      currency: 'INR',
      timestamp: dMinus10,
      description: 'Opening Balance for Corporate Tax Reserve',
      is_demo: true,
    },
    // Transaction txn_c_001: ₹2,50,000 credit into razorpay escrow
    {
      id: 'led_txn_001',
      transaction_id: 'txn_c_001',
      entry_type: 'CREDIT',
      debit_account_id: 'acc_razorpay_escrow',
      credit_account_id: 'acc_customer_deposits',
      amount_paise: 25000000,
      currency: 'INR',
      timestamp: dMinus1,
      description: 'Customer payment credited to Razorpay Escrow (FIN-TXN-2026-8910)',
      is_demo: true,
    },
    // Transaction txn_c_002: ₹1,80,000 credit into phonepe upi pool
    {
      id: 'led_txn_002',
      transaction_id: 'txn_c_002',
      entry_type: 'CREDIT',
      debit_account_id: 'acc_phonepe_upi',
      credit_account_id: 'acc_customer_deposits',
      amount_paise: 18000000,
      currency: 'INR',
      timestamp: dMinus1,
      description: 'UPI collection credited to PhonePe Pool (FIN-TXN-2026-8911)',
      is_demo: true,
    },
    // Transaction txn_c_003: ₹3,50,000 credit into hdfc primary
    {
      id: 'led_txn_003',
      transaction_id: 'txn_c_003',
      entry_type: 'CREDIT',
      debit_account_id: 'acc_hdfc_primary',
      credit_account_id: 'acc_customer_deposits',
      amount_paise: 35000000,
      currency: 'INR',
      timestamp: dMinus2,
      description: 'Corporate CMS collection into HDFC Current Account (FIN-TXN-2026-8912)',
      is_demo: true,
    },
    // Transaction txn_d_001: ₹1,10,000 debit from cashfree pool
    {
      id: 'led_txn_004',
      transaction_id: 'txn_d_001',
      entry_type: 'DEBIT',
      debit_account_id: 'acc_vendor_expenses',
      credit_account_id: 'acc_cashfree_payout',
      amount_paise: 11000000,
      currency: 'INR',
      timestamp: dMinus1,
      description: 'Vendor infrastructure payout via Cashfree (FIN-TXN-2026-8913)',
      is_demo: true,
    },
    // Transaction txn_ref_001: ₹30,000 refund from razorpay escrow
    {
      id: 'led_txn_005',
      transaction_id: 'txn_ref_001',
      entry_type: 'DEBIT',
      debit_account_id: 'acc_refund_disbursements',
      credit_account_id: 'acc_razorpay_escrow',
      amount_paise: 3000000,
      currency: 'INR',
      timestamp: dMinus1,
      description: 'Customer refund debited from Razorpay Escrow (FIN-TXN-2026-8914)',
      is_demo: true,
    },
    // Transaction txn_rev_001: ₹2,000 reversal credited to cashfree pool
    {
      id: 'led_txn_006',
      transaction_id: 'txn_rev_001',
      entry_type: 'CREDIT',
      debit_account_id: 'acc_cashfree_payout',
      credit_account_id: 'acc_provider_discrepancy_clearing',
      amount_paise: 200000,
      currency: 'INR',
      timestamp: dMinus1,
      description: 'Erroneous fee charge reversal to Cashfree Pool (FIN-TXN-2026-8917)',
      is_demo: true,
    },
  ];

  // Transfers
  const transfers: Transfer[] = [
    {
      id: 'trf_001',
      transfer_ref: 'TRF-2026-0091',
      source_account_id: 'acc_cashfree_payout',
      destination_account_id: 'acc_hdfc_primary',
      amount_paise: 11000000, // ₹1,10,000.00
      fee_paise: 1500,
      currency: 'INR',
      status: 'COMPLETED',
      initiator_id: 'usr_operator_01',
      initiator_name: 'Sneha Deshmukh',
      approver_id: 'usr_approver_01',
      approver_name: 'Vikramaditya Singhania',
      beneficiary_name: 'Vendor Cloud Infrastructure Ltd',
      beneficiary_account_masked: '•••• •••• 9921',
      beneficiary_ifsc: 'SBIN000182',
      notes: 'Monthly AWS / Cloud Infrastructure Invoice Payout',
      requires_dual_approval: false,
      created_at: dMinus1,
      approved_at: dMinus1,
      completed_at: dMinus1,
      is_demo: true,
    },
    {
      id: 'trf_002',
      transfer_ref: 'TRF-2026-0092',
      source_account_id: 'acc_hdfc_primary',
      amount_paise: 75000000, // ₹7,50,000.00 (High-value dual approval required)
      fee_paise: 4500,
      currency: 'INR',
      status: 'PENDING_APPROVAL',
      initiator_id: 'usr_fin_admin_01',
      initiator_name: 'Priyanka Sharma',
      beneficiary_name: 'Equinix Data Centers India',
      beneficiary_account_masked: '•••• •••• 4410',
      beneficiary_ifsc: 'HDFC0000120',
      notes: 'Quarterly Co-Location Server Lease Payment (Dual Authorization Needed)',
      requires_dual_approval: true,
      created_at: isoNow,
      is_demo: true,
    },
    {
      id: 'trf_003',
      transfer_ref: 'TRF-2026-0093',
      source_account_id: 'acc_hdfc_primary',
      amount_paise: 15000000, // ₹1,50,000.00
      fee_paise: 1000,
      currency: 'INR',
      status: 'DRAFT',
      initiator_id: 'usr_operator_01',
      initiator_name: 'Sneha Deshmukh',
      beneficiary_name: 'Paytm Legal Counsel LLP',
      beneficiary_account_masked: '•••• •••• 3012',
      beneficiary_ifsc: 'UTIB0000045',
      notes: 'Legal Compliance & Filing Retainer Q4',
      requires_dual_approval: false,
      created_at: isoNow,
      is_demo: true,
    },
  ];

  // Charges & Fees
  const charges: ChargeFee[] = [
    {
      id: 'chg_001',
      charge_ref: 'CHG-2026-781',
      transaction_id: 'txn_c_001',
      provider_id: 'prov_razorpay',
      account_id: 'acc_razorpay_escrow',
      fee_type: 'PAYMENT_PROCESSING',
      amount_paise: 450000, // ₹4,500.00
      tax_paise: 81000,     // ₹810.00
      rate_rule: '1.80% Net Banking MDR + 18% GST',
      is_estimated: false,
      currency: 'INR',
      created_at: dMinus1,
      is_demo: true,
    },
    {
      id: 'chg_002',
      charge_ref: 'CHG-2026-782',
      transaction_id: 'txn_c_003',
      provider_id: 'prov_hdfc',
      account_id: 'acc_hdfc_primary',
      fee_type: 'GATEWAY_SERVICE',
      amount_paise: 25000,  // ₹250.00
      tax_paise: 4500,      // ₹45.00
      rate_rule: 'HDFC Corporate CMS Inward Handling Flat Fee',
      is_estimated: false,
      currency: 'INR',
      created_at: dMinus2,
      is_demo: true,
    },
    {
      id: 'chg_003',
      charge_ref: 'CHG-2026-783',
      transaction_id: 'txn_d_001',
      provider_id: 'prov_cashfree',
      account_id: 'acc_cashfree_payout',
      fee_type: 'TRANSFER_PAYOUT',
      amount_paise: 1500,   // ₹15.00
      tax_paise: 270,       // ₹2.70
      rate_rule: 'Cashfree IMPS Payout Slab 1 (₹10 - ₹2L)',
      is_estimated: false,
      currency: 'INR',
      created_at: dMinus1,
      is_demo: true,
    },
  ];

  // Refunds
  const refunds: Refund[] = [
    {
      id: 'rfnd_001',
      refund_ref: 'RFND-2026-001',
      original_transaction_id: 'txn_c_001',
      account_id: 'acc_razorpay_escrow',
      provider_id: 'prov_razorpay',
      amount_paise: 3000000, // ₹30,000.00
      fee_refunded_paise: 0,
      reason: 'Customer initiated return of partial order items - approved by ops',
      status: 'COMPLETED',
      initiator_name: 'Priyanka Sharma',
      created_at: dMinus1,
      completed_at: dMinus1,
      is_demo: true,
    },
    {
      id: 'rfnd_002',
      refund_ref: 'RFND-2026-002',
      original_transaction_id: 'txn_c_002',
      account_id: 'acc_phonepe_upi',
      provider_id: 'prov_phonepe',
      amount_paise: 1500000, // ₹15,000.00
      fee_refunded_paise: 0,
      reason: 'Duplicate payment submitted by customer app integration',
      status: 'PENDING_APPROVAL',
      initiator_name: 'Sneha Deshmukh',
      created_at: isoNow,
      is_demo: true,
    },
  ];

  // Settlements
  const settlements: Settlement[] = [
    {
      id: 'set_001',
      settlement_ref: 'SET-RZP-2026-1049',
      provider_id: 'prov_razorpay',
      destination_account_id: 'acc_hdfc_primary',
      gross_amount_paise: 25000000, // ₹2,50,000.00
      fee_deducted_paise: 450000,
      tax_deducted_paise: 81000,
      net_amount_paise: 24469000,   // ₹2,44,690.00 settled to HDFC Bank
      currency: 'INR',
      status: 'SETTLED',
      period_start: dMinus5,
      period_end: dMinus1,
      utr_number: 'HDFCR52026102901928',
      settled_at: dMinus1,
      is_demo: true,
    },
    {
      id: 'set_002',
      settlement_ref: 'SET-PPE-2026-8812',
      provider_id: 'prov_phonepe',
      destination_account_id: 'acc_hdfc_primary',
      gross_amount_paise: 18000000, // ₹1,80,000.00
      fee_deducted_paise: 0,
      tax_deducted_paise: 0,
      net_amount_paise: 18000000,
      currency: 'INR',
      status: 'IN_TRANSIT',
      period_start: dMinus2,
      period_end: isoNow,
      utr_number: 'CMSPPE9910291029',
      is_demo: true,
    },
  ];

  // Reconciliation Runs & Discrepancies
  const reconciliation_runs: ReconciliationRun[] = [
    {
      id: 'rec_run_001',
      run_ref: 'REC-2026-W43-RZP',
      provider_id: 'prov_razorpay',
      account_id: 'acc_razorpay_escrow',
      period_start: dMinus5,
      period_end: dMinus1,
      total_transactions_checked: 142,
      matched_count: 140,
      discrepancy_count: 2,
      total_discrepancy_paise: 250000, // ₹2,500.00
      status: 'COMPLETED',
      created_at: dMinus1,
      is_demo: true,
    },
  ];

  const reconciliation_discrepancies: ReconciliationDiscrepancy[] = [
    {
      id: 'disc_001',
      run_id: 'rec_run_001',
      external_ref: 'pay_rzp_LiveTest_89101',
      discrepancy_type: 'AMOUNT_MISMATCH',
      ledger_amount_paise: 25000000,
      provider_amount_paise: 24998000,
      difference_paise: 2000, // ₹20.00 round-off discrepancy
      status: 'RESOLVED',
      resolution_notes: 'Provider adjusted rounding fee difference. Ledger entry reconciled with credit note.',
      resolved_by: 'Priyanka Sharma',
      resolved_at: dMinus1,
      created_at: dMinus1,
    },
    {
      id: 'disc_002',
      run_id: 'rec_run_001',
      external_ref: 'rzp_delayed_capture_481',
      discrepancy_type: 'MISSING_IN_LEDGER',
      ledger_amount_paise: 0,
      provider_amount_paise: 248000, // ₹2,480.00
      difference_paise: 248000,
      status: 'PENDING',
      created_at: dMinus1,
    },
  ];

  // Audit Logs
  const audit_logs: AuditLog[] = [
    {
      id: 'aud_001',
      actor_name: 'Aditya Kashyap',
      actor_role: 'Super Admin',
      action: 'SYSTEM_SETTINGS_UPDATE',
      entity: 'SystemSettings',
      entity_id: 'global',
      reason: 'Configured dual-approval threshold to INR 5,00,000 for compliance',
      ip_address: '10.0.12.44',
      timestamp: dMinus5,
      is_demo: true,
    },
    {
      id: 'aud_002',
      actor_name: 'Priyanka Sharma',
      actor_role: 'Finance Admin',
      action: 'RECONCILIATION_EXECUTION',
      entity: 'ReconciliationRun',
      entity_id: 'rec_run_001',
      reason: 'Executed weekly Razorpay automated ledger reconciliation',
      ip_address: '10.0.12.82',
      timestamp: dMinus1,
      is_demo: true,
    },
    {
      id: 'aud_003',
      actor_name: 'Vikramaditya Singhania',
      actor_role: 'Approver',
      action: 'TRANSFER_APPROVAL',
      entity: 'Transfer',
      entity_id: 'trf_001',
      amount_paise: 11000000,
      currency: 'INR',
      previous_status: 'PENDING_APPROVAL',
      new_status: 'COMPLETED',
      reason: 'Approved monthly cloud infrastructure payment to vendor',
      ip_address: '10.0.14.19',
      timestamp: dMinus1,
      is_demo: true,
    },
    {
      id: 'aud_004',
      actor_name: 'Sneha Deshmukh',
      actor_role: 'Finance Operator',
      action: 'TRANSFER_CREATION',
      entity: 'Transfer',
      entity_id: 'trf_002',
      amount_paise: 75000000,
      currency: 'INR',
      previous_status: 'DRAFT',
      new_status: 'PENDING_APPROVAL',
      reason: 'Submitted high-value co-location lease payment for dual approval',
      ip_address: '10.0.12.95',
      timestamp: isoNow,
      is_demo: true,
    },
  ];

  return {
    users,
    settings,
    providers,
    accounts,
    transactions,
    ledger_entries,
    transfers,
    charges,
    refunds,
    settlements,
    reconciliation_runs,
    reconciliation_discrepancies,
    customers,
    audit_logs,
    processed_idempotency_keys: {
      'idem_rzp_89101_init': { timestamp: dMinus1, resultId: 'txn_c_001' },
      'idem_ppe_99210293_init': { timestamp: dMinus1, resultId: 'txn_c_002' },
      'idem_hdfc_cr_1029_init': { timestamp: dMinus2, resultId: 'txn_c_003' },
    },
  };
}

export function readDb(): FinovaDatabase {
  // 1. Fast in-memory cache across serverless warm invocations
  if (globalThis.__finova_memory_db) {
    return globalThis.__finova_memory_db;
  }

  const writableFile = getWritableDbFile();

  // 2. Check if writable file exists in /tmp (or local)
  if (writableFile !== BUNDLED_DB_FILE && fs.existsSync(writableFile)) {
    try {
      const raw = fs.readFileSync(writableFile, 'utf-8');
      const parsed = JSON.parse(raw) as FinovaDatabase;
      if (parsed && Array.isArray(parsed.providers) && parsed.providers.length > 0) {
        globalThis.__finova_memory_db = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('Could not read from writable file, falling back to bundled data');
    }
  }

  // 3. Fallback to bundled finova-store.json
  if (fs.existsSync(BUNDLED_DB_FILE)) {
    try {
      const raw = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as FinovaDatabase;
      globalThis.__finova_memory_db = parsed;
      return parsed;
    } catch (err) {
      console.error('Error reading bundled finova-store.json:', err);
    }
  }

  // 4. Initial seed fallback
  const seed = getInitialSeedData();
  globalThis.__finova_memory_db = seed;
  try {
    writeDb(seed);
  } catch {}
  return seed;
}

export function writeDb(db: FinovaDatabase): void {
  // 1. Always update authoritative in-memory state first
  globalThis.__finova_memory_db = db;

  const targetFile = getWritableDbFile();
  ensureDataDir(targetFile);

  // 2. Atomic write with comprehensive EROFS serverless fallback
  const tempFile = `${targetFile}.${Date.now()}.tmp`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, targetFile);
  } catch (err: any) {
    // Clean up temporary file if left behind
    if (fs.existsSync(tempFile)) {
      try {
        fs.unlinkSync(tempFile);
      } catch {}
    }

    // In read-only serverless environment (/var/task), redirect to /tmp
    if (err && (err.code === 'EROFS' || err.message?.includes('read-only'))) {
      const serverlessTmp = path.join(os.tmpdir(), 'finova-store.json');
      try {
        fs.writeFileSync(serverlessTmp, JSON.stringify(db, null, 2), 'utf-8');
        return;
      } catch (tmpErr) {
        console.warn('Serverless storage fallback write notice (in-memory remains authoritative):', tmpErr);
      }
    } else {
      console.warn('Write warning (in-memory store remains authoritative):', err.message);
    }
  }
}

export function runInTransaction<T>(callback: (db: FinovaDatabase) => { db: FinovaDatabase; result: T }): T {
  const db = readDb();
  const { db: updatedDb, result } = callback(db);
  writeDb(updatedDb);
  return result;
}

// Balance and Consolidated Financial Metrics Calculation
export function calculateConsolidatedSummary(db: FinovaDatabase, filterCurrency: Currency = 'INR'): ConsolidatedFinancialSummary {
  const filteredAccounts = db.accounts.filter(a => a.currency === filterCurrency);
  const accountIds = new Set(filteredAccounts.map(a => a.id));

  // Immutable double-entry calculations per account
  const breakdown: AccountFinancialBreakdown[] = filteredAccounts.map(acc => {
    const provider = db.providers.find(p => p.id === acc.provider_id);

    // Sum posted ledger credits where this account was credited or debited
    // In our double-entry model for asset accounts:
    // When money flows into an asset account, it is DEBITED in classic accounting (or CREDITED from customer perspective).
    // In Finova:
    // `posted_credits`: Total customer payments, incoming transfers, reversals deposited into this account
    // `posted_debits`: Total payouts, refunds, and charges paid out of this account
    
    const accountTxns = db.transactions.filter(t => t.account_id === acc.id && t.currency === filterCurrency);
    
    const postedCredits = accountTxns
      .filter(t => (t.type === 'PAYMENT_CREDIT' || t.type === 'SETTLEMENT_CREDIT' || t.type === 'ADJUSTMENT_CREDIT' || t.type === 'REVERSAL_CREDIT') && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount_paise, 0);

    const postedDebits = accountTxns
      .filter(t => (t.type === 'TRANSFER_DEBIT' || t.type === 'REFUND_DEBIT' || t.type === 'FEE_DEBIT' || t.type === 'ADJUSTMENT_DEBIT') && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount_paise, 0);

    const accountCharges = db.charges.filter(c => c.account_id === acc.id && c.currency === filterCurrency);
    const fees = accountCharges.reduce((sum, c) => sum + c.amount_paise, 0);
    const taxes = accountCharges.reduce((sum, c) => sum + c.tax_paise, 0);

    const accountRefunds = db.refunds.filter(r => r.account_id === acc.id && r.status === 'COMPLETED');
    const refunds = accountRefunds.reduce((sum, r) => sum + r.amount_paise, 0);

    // Explicit Rule: Closing Ledger Balance = Opening Balance + Posted Credits - Posted Debits
    const closingLedgerBalance = acc.opening_balance_paise + postedCredits - postedDebits;
    
    const providerBalance = acc.provider_reported_balance_paise ?? null;
    const diff = providerBalance !== null ? Math.abs(providerBalance - closingLedgerBalance) : 0;
    
    let reconStatus: 'BALANCED' | 'DISCREPANCY' | 'PENDING_SYNC' = 'BALANCED';
    if (providerBalance === null) {
      reconStatus = 'PENDING_SYNC';
    } else if (diff > 0) {
      reconStatus = 'DISCREPANCY';
    }

    return {
      account_id: acc.id,
      account_name: acc.name,
      account_number_masked: acc.account_number_masked,
      provider_name: provider ? provider.name : 'Direct Bank Host-to-Host',
      currency: acc.currency,
      opening_balance_paise: acc.opening_balance_paise,
      posted_credits_paise: postedCredits,
      posted_debits_paise: postedDebits,
      fees_paise: fees,
      taxes_paise: taxes,
      refunds_paise: refunds,
      closing_ledger_balance_paise: closingLedgerBalance,
      provider_reported_balance_paise: providerBalance,
      difference_paise: diff,
      reconciliation_status: reconStatus,
    };
  });

  const totalOpening = breakdown.reduce((sum, a) => sum + a.opening_balance_paise, 0);
  const totalCredits = breakdown.reduce((sum, a) => sum + a.posted_credits_paise, 0);
  const totalDebits = breakdown.reduce((sum, a) => sum + a.posted_debits_paise, 0);
  const totalClosingLedger = breakdown.reduce((sum, a) => sum + a.closing_ledger_balance_paise, 0);

  // Pending transfers and transactions
  const pendingTxns = db.transactions.filter(t => t.status === 'PENDING' && t.currency === filterCurrency);
  const totalPendingCredits = pendingTxns
    .filter(t => t.type === 'PAYMENT_CREDIT' || t.type === 'SETTLEMENT_CREDIT')
    .reduce((sum, t) => sum + t.amount_paise, 0);
  
  const pendingTransfers = db.transfers.filter(tr => (tr.status === 'PENDING_APPROVAL' || tr.status === 'PROCESSING') && tr.currency === filterCurrency);
  const totalPendingDebits = pendingTransfers.reduce((sum, tr) => sum + tr.amount_paise, 0);

  // Available Balance = Closing Ledger Balance - Pending Debits
  const totalAvailable = Math.max(0, totalClosingLedger - totalPendingDebits);

  const totalFees = breakdown.reduce((sum, a) => sum + a.fees_paise, 0);
  const totalTaxes = breakdown.reduce((sum, a) => sum + a.taxes_paise, 0);
  const totalRefunds = breakdown.reduce((sum, a) => sum + a.refunds_paise, 0);

  const completedSettlements = db.settlements.filter(s => s.status === 'SETTLED' && s.currency === filterCurrency);
  const totalCompletedSettlements = completedSettlements.reduce((sum, s) => sum + s.net_amount_paise, 0);

  const inTransitSettlements = db.settlements.filter(s => (s.status === 'IN_TRANSIT' || s.status === 'SCHEDULED') && s.currency === filterCurrency);
  const totalOutstandingSettlements = inTransitSettlements.reduce((sum, s) => sum + s.net_amount_paise, 0);

  const failedTxns = db.transactions.filter(t => t.status === 'FAILED' && t.currency === filterCurrency);
  const reversedTxns = db.transactions.filter(t => t.status === 'REVERSED' && t.currency === filterCurrency);

  const unreconciledTxns = db.transactions.filter(t => t.reconciliation_status === 'UNRECONCILED' && t.currency === filterCurrency);
  const unreconciledValue = unreconciledTxns.reduce((sum, t) => sum + t.amount_paise, 0);

  const totalDiff = breakdown.reduce((sum, a) => sum + a.difference_paise, 0);

  return {
    reporting_currency: filterCurrency,
    data_freshness_timestamp: new Date().toISOString(),
    is_sandbox: db.settings.is_sandbox,
    total_opening_balance_paise: totalOpening,
    total_posted_credits_paise: totalCredits,
    total_posted_debits_paise: totalDebits,
    total_closing_ledger_balance_paise: totalClosingLedger,
    total_pending_credits_paise: totalPendingCredits,
    total_pending_debits_paise: totalPendingDebits,
    total_available_balance_paise: totalAvailable,
    total_processing_charges_paise: totalFees,
    total_transfer_charges_paise: db.transfers.filter(tr => tr.status === 'COMPLETED').reduce((s, tr) => s + tr.fee_paise, 0),
    total_taxes_paise: totalTaxes,
    total_refunds_paise: totalRefunds,
    total_completed_settlements_paise: totalCompletedSettlements,
    total_outstanding_settlements_paise: totalOutstandingSettlements,
    total_failed_transactions_count: failedTxns.length,
    total_reversed_transactions_count: reversedTxns.length,
    unreconciled_transactions_count: unreconciledTxns.length,
    unreconciled_transactions_value_paise: unreconciledValue,
    provider_vs_ledger_difference_paise: totalDiff,
    account_breakdown: breakdown,
  };
}

