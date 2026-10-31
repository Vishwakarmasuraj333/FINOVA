import { NextResponse } from 'next/server';
import { runInTransaction } from '@/lib/db/database';
import { LedgerEngine } from '@/lib/ledger/engine';
import { UserRole, Transaction } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { provider_id, account_id, rows } = await request.json();
    const actorRole = (request.headers.get('x-user-role') as UserRole) || 'Finance Admin';
    const actorName = request.headers.get('x-user-name') || 'Authorized Staff';

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No statement rows provided for import' }, { status: 400 });
    }

    const result = runInTransaction(db => {
      let importedCount = 0;
      let duplicateCount = 0;
      const batchId = `IMP-${Date.now().toString().slice(-6)}`;
      const now = new Date().toISOString();

      for (const row of rows) {
        // Validate external reference
        const externalRef = row.external_ref || `IMP_EXT_${Date.now()}_${Math.random()}`;
        
        // Check duplicate
        const exists = db.transactions.some(t => t.external_ref === externalRef);
        if (exists) {
          duplicateCount++;
          continue;
        }

        const amountPaise = Math.round(parseFloat(row.amount || '0') * 100);
        if (amountPaise <= 0) continue;

        const isCredit = (row.direction || 'credit').toLowerCase() === 'credit';
        const txnType = isCredit ? 'PAYMENT_CREDIT' : 'TRANSFER_DEBIT';

        LedgerEngine.postTransaction(
          db,
          {
            internal_ref: `FIN-IMP-${batchId}-${importedCount + 1}`,
            external_ref: externalRef,
            idempotency_key: `idem_imp_${externalRef}`,
            account_id: account_id || 'acc_hdfc_primary',
            provider_id: provider_id || 'prov_hdfc',
            type: txnType,
            amount_paise: amountPaise,
            fee_paise: 0,
            tax_paise: 0,
            net_paise: amountPaise,
            currency: 'INR',
            status: 'COMPLETED',
            payment_method: 'BANK_TRANSFER',
            initiated_at: row.date || now,
            completed_at: row.date || now,
            sender_name: isCredit ? row.counterparty : 'ONEPAY Internal',
            recipient_name: isCredit ? 'ONEPAY Internal' : row.counterparty,
            reconciliation_status: 'RECONCILED',
            metadata: { batch_id: batchId, import_source: 'CSV_STATEMENT' },
          },
          { name: actorName, role: actorRole }
        );

        importedCount++;
      }

      db.audit_logs.unshift({
        id: `aud_${Date.now()}`,
        actor_name: actorName,
        actor_role: actorRole,
        action: 'STATEMENT_BATCH_IMPORTED',
        entity: 'ImportBatch',
        entity_id: batchId,
        reason: `Imported ${importedCount} records from provider statement (${duplicateCount} duplicates skipped)`,
        ip_address: '127.0.0.1',
        timestamp: now,
        is_demo: true,
      });

      return {
        db,
        result: {
          batch_id: batchId,
          imported_count: importedCount,
          duplicate_count: duplicateCount,
          status: 'SUCCESS',
        },
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

