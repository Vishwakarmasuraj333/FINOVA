export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export type UserRole = 
  | 'Super Admin' 
  | 'Finance Admin' 
  | 'Finance Operator' 
  | 'Approver' 
  | 'Read-only Auditor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
  last_login?: string;
}

export type AccountType = 
  | 'BANK_ACCOUNT' 
  | 'GATEWAY_CLEARING' 
  | 'WALLET_CLEARING' 
  | 'UPI_CLEARING' 
  | 'ESCROW_ACCOUNT'
  | 'EXPENSE_RESERVE';

export interface Account {
  id: string;
  name: string;
  account_number_masked: string;
  ifsc_or_routing?: string;
  type: AccountType;
  provider_id?: string;
  currency: Currency;
  opening_balance_paise: number;
  provider_reported_balance_paise?: number; // Authoritative provider balance
  status: 'ACTIVE' | 'DORMANT' | 'FROZEN';
  last_synced_at?: string;
  is_demo: boolean;
}

export type ProviderCode = 
  | 'gpay' 
  | 'paytm' 
  | 'phonepe' 
  | 'bhim' 
  | 'razorpay' 
  | 'cashfree' 
  | 'stripe' 
  | 'hdfc_bank' 
  | 'icici_bank'
  | 'freecharge'
  | 'oxigen'
  | 'moneyonmobile'
  | 'airtel'
  | 'citrus'
  | 'zipcash'
  | 'mobikwik'
  | 'jiomoney'
  | 'pockets'
  | 'chillr'
  | 'payzapp'
  | 'trupay'
  | 'mpurse'
  | 'axis'
  | 'aadhaar'
  | 'sbi'
  | 'itzcash'
  | 'mrupee'
  | 'quikwallet'
  | 'payu'
  | 'ccavenue'
  | 'paypal'
  | string;

export interface PaymentProvider {
  id: string;
  name: string;
  code: ProviderCode;
  category: 'UPI' | 'GATEWAY' | 'BANK' | 'WALLET';
  status: 'CONNECTED' | 'NOT_CONNECTED' | 'DEGRADED';
  environment: 'SANDBOX' | 'PRODUCTION';
  supported_operations: ('PAYMENTS' | 'PAYOUTS' | 'REFUNDS' | 'SETTLEMENTS' | 'SUBSCRIPTIONS')[];
  last_synced_at?: string;
  last_sync_status?: 'SUCCESS' | 'FAILED';
  last_error?: string;
  webhook_url: string;
  webhook_events: string[];
  health_score: number; // 0 - 100
  merchant_id_masked: string;
  is_demo: boolean;
}

export type TransactionType = 
  | 'PAYMENT_CREDIT' 
  | 'TRANSFER_DEBIT' 
  | 'SETTLEMENT_CREDIT' 
  | 'REFUND_DEBIT' 
  | 'FEE_DEBIT' 
  | 'ADJUSTMENT_CREDIT' 
  | 'ADJUSTMENT_DEBIT'
  | 'REVERSAL_CREDIT';

export type TransactionStatus = 
  | 'PENDING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'REVERSED' 
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type PaymentMethodType = 'UPI' | 'NET_BANKING' | 'CARDS' | 'BANK_TRANSFER' | 'WALLET';

export interface Transaction {
  id: string;
  internal_ref: string;
  external_ref: string;
  idempotency_key: string;
  account_id: string;
  provider_id: string;
  customer_id?: string;
  type: TransactionType;
  amount_paise: number;
  fee_paise: number;
  tax_paise: number;
  net_paise: number;
  currency: Currency;
  status: TransactionStatus;
  payment_method: PaymentMethodType;
  initiated_at: string;
  completed_at?: string;
  sender_name?: string;
  sender_reference?: string;
  recipient_name?: string;
  recipient_reference?: string;
  failure_code?: string;
  safe_error_message?: string;
  reconciliation_status: 'RECONCILED' | 'UNRECONCILED' | 'DISCREPANCY';
  related_refund_ref?: string;
  related_reversal_ref?: string;
  metadata?: Record<string, any>;
  is_demo: boolean;
}

export interface LedgerEntry {
  id: string;
  transaction_id?: string;
  entry_type: 'CREDIT' | 'DEBIT';
  debit_account_id: string;
  credit_account_id: string;
  amount_paise: number;
  currency: Currency;
  timestamp: string;
  description: string;
  is_demo: boolean;
}

export type TransferStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REVERSED';

export interface Transfer {
  id: string;
  transfer_ref: string;
  source_account_id: string;
  destination_account_id?: string;
  amount_paise: number;
  fee_paise: number;
  currency: Currency;
  status: TransferStatus;
  initiator_id: string;
  initiator_name: string;
  approver_id?: string;
  approver_name?: string;
  beneficiary_name: string;
  beneficiary_account_masked: string;
  beneficiary_ifsc: string;
  notes?: string;
  requires_dual_approval: boolean;
  created_at: string;
  approved_at?: string;
  completed_at?: string;
  failure_reason?: string;
  is_demo: boolean;
}

export interface ChargeFee {
  id: string;
  charge_ref: string;
  transaction_id: string;
  provider_id: string;
  account_id: string;
  fee_type: 'PAYMENT_PROCESSING' | 'TRANSFER_PAYOUT' | 'GATEWAY_SERVICE' | 'GST_TAX';
  amount_paise: number;
  tax_paise: number;
  rate_rule: string;
  is_estimated: boolean;
  currency: Currency;
  created_at: string;
  is_demo: boolean;
}

export interface Refund {
  id: string;
  refund_ref: string;
  original_transaction_id: string;
  account_id: string;
  provider_id: string;
  amount_paise: number;
  fee_refunded_paise: number;
  reason: string;
  status: 'PENDING_APPROVAL' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  initiator_name: string;
  created_at: string;
  completed_at?: string;
  is_demo: boolean;
}

export interface Settlement {
  id: string;
  settlement_ref: string;
  provider_id: string;
  destination_account_id: string;
  gross_amount_paise: number;
  fee_deducted_paise: number;
  tax_deducted_paise: number;
  net_amount_paise: number;
  currency: Currency;
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'SETTLED' | 'ON_HOLD';
  period_start: string;
  period_end: string;
  utr_number?: string;
  settled_at?: string;
  is_demo: boolean;
}

export interface ReconciliationRun {
  id: string;
  run_ref: string;
  provider_id: string;
  account_id: string;
  period_start: string;
  period_end: string;
  total_transactions_checked: number;
  matched_count: number;
  discrepancy_count: number;
  total_discrepancy_paise: number;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  created_at: string;
  is_demo: boolean;
}

export interface ReconciliationDiscrepancy {
  id: string;
  run_id: string;
  transaction_id?: string;
  external_ref: string;
  discrepancy_type: 'AMOUNT_MISMATCH' | 'MISSING_IN_LEDGER' | 'MISSING_AT_PROVIDER' | 'STATUS_MISMATCH';
  ledger_amount_paise: number;
  provider_amount_paise: number;
  difference_paise: number;
  status: 'PENDING' | 'RESOLVED' | 'WAIVED';
  resolution_notes?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  vpa?: string;
  kyc_status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  total_volume_paise: number;
  transaction_count: number;
  created_at: string;
  is_demo: boolean;
}

export interface AuditLog {
  id: string;
  actor_name: string;
  actor_role: UserRole;
  action: string;
  entity: string;
  entity_id: string;
  amount_paise?: number;
  currency?: Currency;
  previous_status?: string;
  new_status?: string;
  reason?: string;
  ip_address: string;
  timestamp: string;
  is_demo: boolean;
}

export interface SystemSettings {
  organization_name: string;
  legal_entity: string;
  pan: string;
  gstin: string;
  base_currency: Currency;
  dual_approval_threshold_paise: number;
  webhook_secret: string;
  notification_email: string;
  theme_preference: 'dark' | 'light' | 'system';
  data_freshness_interval_sec: number;
  is_sandbox: boolean;
}

// Consolidated Financial Control Center summary types
export interface AccountFinancialBreakdown {
  account_id: string;
  account_name: string;
  account_number_masked: string;
  provider_name: string;
  currency: Currency;
  opening_balance_paise: number;
  posted_credits_paise: number;
  posted_debits_paise: number;
  fees_paise: number;
  taxes_paise: number;
  refunds_paise: number;
  closing_ledger_balance_paise: number;
  provider_reported_balance_paise: number | null;
  difference_paise: number;
  reconciliation_status: 'BALANCED' | 'DISCREPANCY' | 'PENDING_SYNC';
}

export interface ConsolidatedFinancialSummary {
  reporting_currency: Currency;
  data_freshness_timestamp: string;
  is_sandbox: boolean;
  total_opening_balance_paise: number;
  total_posted_credits_paise: number;
  total_posted_debits_paise: number;
  total_closing_ledger_balance_paise: number;
  total_pending_credits_paise: number;
  total_pending_debits_paise: number;
  total_available_balance_paise: number;
  total_processing_charges_paise: number;
  total_transfer_charges_paise: number;
  total_taxes_paise: number;
  total_refunds_paise: number;
  total_completed_settlements_paise: number;
  total_outstanding_settlements_paise: number;
  total_failed_transactions_count: number;
  total_reversed_transactions_count: number;
  unreconciled_transactions_count: number;
  unreconciled_transactions_value_paise: number;
  provider_vs_ledger_difference_paise: number;
  account_breakdown: AccountFinancialBreakdown[];
}

