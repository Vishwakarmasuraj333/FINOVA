import { NextResponse } from 'next/server';
import { readDb, runInTransaction } from '@/lib/db/database';
import { Settlement, UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.settlements);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const actorRole = (request.headers.get('x-user-role') as UserRole) || 'Finance Admin';
    const actorName = request.headers.get('x-user-name') || 'Authorized Staff';

    const result = runInTransaction(db => {
      const now = new Date().toISOString();
      const ref = `SET-BATCH-${Date.now().toString().slice(-6)}`;

      const settlement: Settlement = {
        id: `set_${Date.now()}`,
        settlement_ref: ref,
        provider_id: body.provider_id,
        destination_account_id: body.destination_account_id,
        gross_amount_paise: body.gross_amount_paise,
        fee_deducted_paise: body.fee_deducted_paise || 0,
        tax_deducted_paise: body.tax_deducted_paise || 0,
        net_amount_paise: body.gross_amount_paise - (body.fee_deducted_paise || 0) - (body.tax_deducted_paise || 0),
        currency: body.currency || 'INR',
        status: 'SETTLED',
        period_start: body.period_start || now,
        period_end: now,
        utr_number: `UTR${Date.now()}`,
        settled_at: now,
        is_demo: true,
      };

      db.settlements.unshift(settlement);

      // Create settlement credit transaction
      db.transactions.unshift({
        id: `txn_set_${Date.now()}`,
        internal_ref: `FIN-${ref}`,
        external_ref: settlement.utr_number || `UTR_${Date.now()}`,
        idempotency_key: `idem_${settlement.id}`,
        account_id: settlement.destination_account_id,
        provider_id: settlement.provider_id,
        type: 'SETTLEMENT_CREDIT',
        amount_paise: settlement.net_amount_paise,
        fee_paise: settlement.fee_deducted_paise,
        tax_paise: settlement.tax_deducted_paise,
        net_paise: settlement.net_amount_paise,
        currency: settlement.currency,
        status: 'COMPLETED',
        payment_method: 'BANK_TRANSFER',
        initiated_at: now,
        completed_at: now,
        sender_name: 'Provider Settlement Rails',
        recipient_name: 'FINOVA Bank Current Account',
        reconciliation_status: 'RECONCILED',
        is_demo: true,
      });

      db.audit_logs.unshift({
        id: `aud_${Date.now()}`,
        actor_name: actorName,
        actor_role: actorRole,
        action: 'SETTLEMENT_PROCESSED',
        entity: 'Settlement',
        entity_id: settlement.id,
        amount_paise: settlement.net_amount_paise,
        currency: settlement.currency,
        previous_status: 'IN_TRANSIT',
        new_status: 'SETTLED',
        reason: `Settlement payout batch ${ref} credited to destination account`,
        ip_address: '127.0.0.1',
        timestamp: now,
        is_demo: true,
      });

      return { db, result: settlement };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

