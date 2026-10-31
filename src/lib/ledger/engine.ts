import {
  readDb,
  writeDb,
  FinovaDatabase,
} from '@/lib/db/database';
import {
  Transaction,
  LedgerEntry,
  Transfer,
  Refund,
  AuditLog,
  UserRole,
} from '@/types';

export class LedgerEngine {
  /**
   * Validates that total debits equal total credits for any journal batch
   */
  public static validateJournalBalance(entries: LedgerEntry[]): boolean {
    const debitSum = entries
      .filter(e => e.entry_type === 'DEBIT')
      .reduce((s, e) => s + e.amount_paise, 0);
    const creditSum = entries
      .filter(e => e.entry_type === 'CREDIT')
      .reduce((s, e) => s + e.amount_paise, 0);
    return debitSum === creditSum;
  }

  /**
   * Post a financial transaction with double-entry ledger entries and audit log
   */
  public static postTransaction(
    db: FinovaDatabase,
    txnData: Omit<Transaction, 'id' | 'is_demo' | 'initiated_at'> & { initiated_at?: string },
    actor: { name: string; role: UserRole }
  ): { transaction: Transaction; ledgerEntries: LedgerEntry[] } {
    // Check idempotency
    if (txnData.idempotency_key && db.processed_idempotency_keys[txnData.idempotency_key]) {
      const existing = db.transactions.find(t => t.id === db.processed_idempotency_keys[txnData.idempotency_key].resultId);
      if (existing) {
        return {
          transaction: existing,
          ledgerEntries: db.ledger_entries.filter(l => l.transaction_id === existing.id),
        };
      }
    }

    const txnId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const transaction: Transaction = {
      ...txnData,
      id: txnId,
      initiated_at: txnData.initiated_at || now,
      completed_at: txnData.status === 'COMPLETED' ? now : undefined,
      is_demo: true,
    };

    db.transactions.unshift(transaction);

    // Create Balanced Double-Entry Journal Entries
    const ledgerEntries: LedgerEntry[] = [];

    if (transaction.status === 'COMPLETED') {
      if (transaction.type === 'PAYMENT_CREDIT' || transaction.type === 'SETTLEMENT_CREDIT') {
        const entry: LedgerEntry = {
          id: `led_${Date.now()}_1`,
          transaction_id: txnId,
          entry_type: 'CREDIT',
          debit_account_id: transaction.account_id,
          credit_account_id: 'acc_customer_deposits',
          amount_paise: transaction.amount_paise,
          currency: transaction.currency,
          timestamp: now,
          description: `Credit: ${transaction.internal_ref} via ${transaction.payment_method}`,
          is_demo: true,
        };
        ledgerEntries.push(entry);
        db.ledger_entries.unshift(entry);
      } else if (transaction.type === 'TRANSFER_DEBIT' || transaction.type === 'REFUND_DEBIT') {
        const entry: LedgerEntry = {
          id: `led_${Date.now()}_2`,
          transaction_id: txnId,
          entry_type: 'DEBIT',
          debit_account_id: 'acc_clearing_disbursements',
          credit_account_id: transaction.account_id,
          amount_paise: transaction.amount_paise,
          currency: transaction.currency,
          timestamp: now,
          description: `Debit: ${transaction.internal_ref} to ${transaction.recipient_name || 'counterparty'}`,
          is_demo: true,
        };
        ledgerEntries.push(entry);
        db.ledger_entries.unshift(entry);
      }
    }

    // Record idempotency
    if (transaction.idempotency_key) {
      db.processed_idempotency_keys[transaction.idempotency_key] = {
        timestamp: now,
        resultId: txnId,
      };
    }

    // Add Audit Log
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'TRANSACTION_RECORDED',
      entity: 'Transaction',
      entity_id: txnId,
      amount_paise: transaction.amount_paise,
      currency: transaction.currency,
      new_status: transaction.status,
      reason: `Recorded ${transaction.type} ref ${transaction.internal_ref}`,
      ip_address: '127.0.0.1',
      timestamp: now,
      is_demo: true,
    };
    db.audit_logs.unshift(audit);

    return { transaction, ledgerEntries };
  }

  /**
   * Create fund transfer with dual approval enforcement
   */
  public static createTransfer(
    db: FinovaDatabase,
    transferData: {
      source_account_id: string;
      destination_account_id?: string;
      amount_paise: number;
      beneficiary_name: string;
      beneficiary_account: string;
      beneficiary_ifsc: string;
      notes?: string;
    },
    initiator: { id: string; name: string; role: UserRole }
  ): Transfer {
    const threshold = db.settings.dual_approval_threshold_paise;
    const requiresDual = transferData.amount_paise >= threshold;

    const sourceAcc = db.accounts.find(a => a.id === transferData.source_account_id);
    if (!sourceAcc) {
      throw new Error('Source account not found');
    }

    // Check account balance availability
    const accountTxns = db.transactions.filter(t => t.account_id === sourceAcc.id && t.status === 'COMPLETED');
    const credits = accountTxns
      .filter(t => t.type.includes('CREDIT'))
      .reduce((s, t) => s + t.amount_paise, 0);
    const debits = accountTxns
      .filter(t => t.type.includes('DEBIT'))
      .reduce((s, t) => s + t.amount_paise, 0);
    const currentBalance = sourceAcc.opening_balance_paise + credits - debits;

    const pendingDebits = db.transfers
      .filter(t => t.source_account_id === sourceAcc.id && (t.status === 'PENDING_APPROVAL' || t.status === 'PROCESSING'))
      .reduce((s, t) => s + t.amount_paise, 0);

    const available = currentBalance - pendingDebits;

    if (transferData.amount_paise > available) {
      throw new Error(`Insufficient available balance. Available: ₹${(available / 100).toLocaleString('en-IN')}`);
    }

    const trfId = `trf_${Date.now()}`;
    const ref = `TRF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const transfer: Transfer = {
      id: trfId,
      transfer_ref: ref,
      source_account_id: transferData.source_account_id,
      destination_account_id: transferData.destination_account_id,
      amount_paise: transferData.amount_paise,
      fee_paise: 1500, // standard IMPS/NEFT fee ₹15
      currency: sourceAcc.currency,
      status: 'PENDING_APPROVAL',
      initiator_id: initiator.id,
      initiator_name: initiator.name,
      beneficiary_name: transferData.beneficiary_name,
      beneficiary_account_masked: `•••• •••• ${transferData.beneficiary_account.slice(-4)}`,
      beneficiary_ifsc: transferData.beneficiary_ifsc.toUpperCase(),
      notes: transferData.notes,
      requires_dual_approval: requiresDual,
      created_at: now,
      is_demo: true,
    };

    db.transfers.unshift(transfer);

    // Audit log
    db.audit_logs.unshift({
      id: `aud_${Date.now()}`,
      actor_name: initiator.name,
      actor_role: initiator.role,
      action: 'TRANSFER_INITIATED',
      entity: 'Transfer',
      entity_id: trfId,
      amount_paise: transfer.amount_paise,
      currency: transfer.currency,
      previous_status: 'DRAFT',
      new_status: 'PENDING_APPROVAL',
      reason: `Transfer created: ${ref} to ${transfer.beneficiary_name}. Dual approval required: ${requiresDual}`,
      ip_address: '127.0.0.1',
      timestamp: now,
      is_demo: true,
    });

    return transfer;
  }

  /**
   * Approve a transfer
   */
  public static approveTransfer(
    db: FinovaDatabase,
    transferId: string,
    approver: { id: string; name: string; role: UserRole }
  ): Transfer {
    if (approver.role !== 'Super Admin' && approver.role !== 'Approver' && approver.role !== 'Finance Admin') {
      throw new Error('Unauthorized: Role lacks transfer approval permissions.');
    }

    const transfer = db.transfers.find(t => t.id === transferId);
    if (!transfer) throw new Error('Transfer not found');
    if (transfer.status !== 'PENDING_APPROVAL') {
      throw new Error(`Cannot approve transfer in ${transfer.status} state`);
    }

    // Dual approval check: Initiator cannot approve their own high-value transfer
    if (transfer.requires_dual_approval && transfer.initiator_id === approver.id) {
      throw new Error('Compliance Violation: Dual approval requires a distinct authorized approver.');
    }

    const now = new Date().toISOString();
    transfer.status = 'COMPLETED';
    transfer.approver_id = approver.id;
    transfer.approver_name = approver.name;
    transfer.approved_at = now;
    transfer.completed_at = now;

    // Create corresponding transaction and ledger entries
    const txn: Transaction = {
      id: `txn_${Date.now()}`,
      internal_ref: `FIN-TXN-${transfer.transfer_ref}`,
      external_ref: `bank_cms_${Date.now()}`,
      idempotency_key: `idem_${transfer.id}_exec`,
      account_id: transfer.source_account_id,
      provider_id: 'prov_hdfc',
      type: 'TRANSFER_DEBIT',
      amount_paise: transfer.amount_paise,
      fee_paise: transfer.fee_paise,
      tax_paise: Math.round(transfer.fee_paise * 0.18),
      net_paise: transfer.amount_paise + transfer.fee_paise + Math.round(transfer.fee_paise * 0.18),
      currency: transfer.currency,
      status: 'COMPLETED',
      payment_method: 'BANK_TRANSFER',
      initiated_at: transfer.created_at,
      completed_at: now,
      sender_name: 'FINOVA Disbursal Pool',
      recipient_name: transfer.beneficiary_name,
      recipient_reference: `${transfer.beneficiary_account_masked} (${transfer.beneficiary_ifsc})`,
      reconciliation_status: 'RECONCILED',
      metadata: { transfer_id: transfer.id },
      is_demo: true,
    };
    db.transactions.unshift(txn);

    // Ledger entry
    db.ledger_entries.unshift({
      id: `led_${Date.now()}`,
      transaction_id: txn.id,
      entry_type: 'DEBIT',
      debit_account_id: 'acc_vendor_expenses',
      credit_account_id: transfer.source_account_id,
      amount_paise: transfer.amount_paise,
      currency: transfer.currency,
      timestamp: now,
      description: `Transfer Payout Executed: ${transfer.transfer_ref} to ${transfer.beneficiary_name}`,
      is_demo: true,
    });

    // Audit log
    db.audit_logs.unshift({
      id: `aud_${Date.now()}`,
      actor_name: approver.name,
      actor_role: approver.role,
      action: 'TRANSFER_APPROVED',
      entity: 'Transfer',
      entity_id: transfer.id,
      amount_paise: transfer.amount_paise,
      currency: transfer.currency,
      previous_status: 'PENDING_APPROVAL',
      new_status: 'COMPLETED',
      reason: `Approved payout ${transfer.transfer_ref} to ${transfer.beneficiary_name}`,
      ip_address: '127.0.0.1',
      timestamp: now,
      is_demo: true,
    });

    return transfer;
  }

  /**
   * Reject a transfer
   */
  public static rejectTransfer(
    db: FinovaDatabase,
    transferId: string,
    reason: string,
    actor: { id: string; name: string; role: UserRole }
  ): Transfer {
    const transfer = db.transfers.find(t => t.id === transferId);
    if (!transfer) throw new Error('Transfer not found');
    if (transfer.status !== 'PENDING_APPROVAL') {
      throw new Error(`Cannot reject transfer in ${transfer.status} state`);
    }

    transfer.status = 'FAILED';
    transfer.failure_reason = reason;

    db.audit_logs.unshift({
      id: `aud_${Date.now()}`,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'TRANSFER_REJECTED',
      entity: 'Transfer',
      entity_id: transfer.id,
      amount_paise: transfer.amount_paise,
      currency: transfer.currency,
      previous_status: 'PENDING_APPROVAL',
      new_status: 'FAILED',
      reason: `Transfer rejected: ${reason}`,
      ip_address: '127.0.0.1',
      timestamp: new Date().toISOString(),
      is_demo: true,
    });

    return transfer;
  }

  /**
   * Controlled transaction refund
   */
  public static processRefund(
    db: FinovaDatabase,
    transactionId: string,
    amountPaise: number,
    reason: string,
    actor: { name: string; role: UserRole }
  ): Refund {
    const txn = db.transactions.find(t => t.id === transactionId);
    if (!txn) throw new Error('Original transaction not found');
    if (txn.status !== 'COMPLETED') throw new Error('Only completed transactions can be refunded');
    if (amountPaise > txn.amount_paise) throw new Error('Refund amount exceeds original transaction total');

    const refundRef = `RFND-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const refund: Refund = {
      id: `rfnd_${Date.now()}`,
      refund_ref: refundRef,
      original_transaction_id: txn.id,
      account_id: txn.account_id,
      provider_id: txn.provider_id,
      amount_paise: amountPaise,
      fee_refunded_paise: 0,
      reason,
      status: 'COMPLETED',
      initiator_name: actor.name,
      created_at: now,
      completed_at: now,
      is_demo: true,
    };

    db.refunds.unshift(refund);

    // Update original transaction status
    if (amountPaise === txn.amount_paise) {
      txn.status = 'REFUNDED';
    } else {
      txn.status = 'PARTIALLY_REFUNDED';
    }
    txn.related_refund_ref = refundRef;

    // Compensating double-entry ledger entry
    db.ledger_entries.unshift({
      id: `led_${Date.now()}`,
      transaction_id: txn.id,
      entry_type: 'DEBIT',
      debit_account_id: 'acc_refund_disbursements',
      credit_account_id: txn.account_id,
      amount_paise: amountPaise,
      currency: txn.currency,
      timestamp: now,
      description: `Refund debited: ${refundRef} against ${txn.internal_ref} - Reason: ${reason}`,
      is_demo: true,
    });

    // Audit log
    db.audit_logs.unshift({
      id: `aud_${Date.now()}`,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'REFUND_PROCESSED',
      entity: 'Refund',
      entity_id: refund.id,
      amount_paise: amountPaise,
      currency: txn.currency,
      previous_status: 'COMPLETED',
      new_status: txn.status,
      reason: `Processed refund ${refundRef} for ${txn.internal_ref}: ${reason}`,
      ip_address: '127.0.0.1',
      timestamp: now,
      is_demo: true,
    });

    return refund;
  }

  /**
   * Controlled reversal workflow
   */
  public static processReversal(
    db: FinovaDatabase,
    transactionId: string,
    reason: string,
    actor: { name: string; role: UserRole }
  ): Transaction {
    const txn = db.transactions.find(t => t.id === transactionId);
    if (!txn) throw new Error('Transaction not found');
    if (txn.status === 'REVERSED') throw new Error('Transaction is already reversed');

    const revRef = `REV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const oldStatus = txn.status;
    txn.status = 'REVERSED';
    txn.related_reversal_ref = revRef;

    // Compensating entry: opposite entry type
    const isCredit = txn.type.includes('CREDIT');
    db.ledger_entries.unshift({
      id: `led_${Date.now()}`,
      transaction_id: txn.id,
      entry_type: isCredit ? 'DEBIT' : 'CREDIT',
      debit_account_id: isCredit ? 'acc_reversal_clearing' : txn.account_id,
      credit_account_id: isCredit ? txn.account_id : 'acc_reversal_clearing',
      amount_paise: txn.amount_paise,
      currency: txn.currency,
      timestamp: now,
      description: `Reversal compensating entry: ${revRef} for ${txn.internal_ref} - ${reason}`,
      is_demo: true,
    });

    db.audit_logs.unshift({
      id: `aud_${Date.now()}`,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'TRANSACTION_REVERSED',
      entity: 'Transaction',
      entity_id: txn.id,
      amount_paise: txn.amount_paise,
      currency: txn.currency,
      previous_status: oldStatus,
      new_status: 'REVERSED',
      reason: `Reversal ${revRef}: ${reason}`,
      ip_address: '127.0.0.1',
      timestamp: now,
      is_demo: true,
    });

    return txn;
  }

  /**
   * Manual financial adjustment with mandatory reason and server-side validation
   */
  public static manualAdjustment(
    db: FinovaDatabase,
    params: {
      account_id: string;
      adjustment_type: 'CREDIT' | 'DEBIT';
      amount_paise: number;
      reason: string;
    },
    actor: { name: string; role: UserRole }
  ): Transaction {
    if (actor.role !== 'Super Admin' && actor.role !== 'Finance Admin') {
      throw new Error('Unauthorized: Manual adjustments require Super Admin or Finance Admin privileges.');
    }

    if (!params.reason || params.reason.trim().length < 10) {
      throw new Error('Mandatory audit compliance: Detailed justification (min 10 chars) required for manual adjustment.');
    }

    const account = db.accounts.find(a => a.id === params.account_id);
    if (!account) throw new Error('Account not found');

    const now = new Date().toISOString();
    const adjRef = `ADJ-${Date.now().toString().slice(-6)}`;

    const txn: Transaction = {
      id: `txn_adj_${Date.now()}`,
      internal_ref: `FIN-${adjRef}`,
      external_ref: `MANUAL_ADJ_${Date.now()}`,
      idempotency_key: `idem_adj_${Date.now()}`,
      account_id: account.id,
      provider_id: account.provider_id || 'prov_hdfc',
      type: params.adjustment_type === 'CREDIT' ? 'ADJUSTMENT_CREDIT' : 'ADJUSTMENT_DEBIT',
      amount_paise: params.amount_paise,
      fee_paise: 0,
      tax_paise: 0,
      net_paise: params.amount_paise,
      currency: account.currency,
      status: 'COMPLETED',
      payment_method: 'BANK_TRANSFER',
      initiated_at: now,
      completed_at: now,
      sender_name: params.adjustment_type === 'CREDIT' ? 'FINOVA General Ledger Adjustment' : account.name,
      recipient_name: params.adjustment_type === 'CREDIT' ? account.name : 'FINOVA General Ledger Adjustment',
      reconciliation_status: 'RECONCILED',
      metadata: { reason: params.reason, adjusted_by: actor.name },
      is_demo: true,
    };

    db.transactions.unshift(txn);

    // Double entry journal
    db.ledger_entries.unshift({
      id: `led_${Date.now()}`,
      transaction_id: txn.id,
      entry_type: params.adjustment_type,
      debit_account_id: params.adjustment_type === 'CREDIT' ? account.id : 'acc_gl_adjustment_pool',
      credit_account_id: params.adjustment_type === 'CREDIT' ? 'acc_gl_adjustment_pool' : account.id,
      amount_paise: params.amount_paise,
      currency: account.currency,
      timestamp: now,
      description: `Manual Ledger Adjustment (${adjRef}): ${params.reason}`,
      is_demo: true,
    });

    db.audit_logs.unshift({
      id: `aud_${Date.now()}`,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'MANUAL_ADJUSTMENT',
      entity: 'Account',
      entity_id: account.id,
      amount_paise: params.amount_paise,
      currency: account.currency,
      new_status: 'COMPLETED',
      reason: `Manual ${params.adjustment_type} Adjustment: ${params.reason}`,
      ip_address: '127.0.0.1',
      timestamp: now,
      is_demo: true,
    });

    return txn;
  }
}

