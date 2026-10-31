import { NextResponse } from 'next/server';
import { readDb, runInTransaction } from '@/lib/db/database';
import { ReconciliationRun, ReconciliationDiscrepancy, UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json({
      runs: db.reconciliation_runs,
      discrepancies: db.reconciliation_discrepancies,
    });
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
      const runRef = `REC-RUN-${Date.now().toString().slice(-6)}`;

      // Count checked transactions
      const providerTxns = db.transactions.filter(t => t.provider_id === body.provider_id);
      const totalChecked = providerTxns.length;
      const matched = providerTxns.filter(t => t.reconciliation_status === 'RECONCILED').length;
      const discrepancies = totalChecked - matched;

      const run: ReconciliationRun = {
        id: `rec_${Date.now()}`,
        run_ref: runRef,
        provider_id: body.provider_id,
        account_id: body.account_id || 'acc_razorpay_escrow',
        period_start: new Date(Date.now() - 7 * 86400000).toISOString(),
        period_end: now,
        total_transactions_checked: totalChecked,
        matched_count: matched,
        discrepancy_count: discrepancies,
        total_discrepancy_paise: discrepancies * 2500, // sample variance
        status: 'COMPLETED',
        created_at: now,
        is_demo: true,
      };

      db.reconciliation_runs.unshift(run);

      db.audit_logs.unshift({
        id: `aud_${Date.now()}`,
        actor_name: actorName,
        actor_role: actorRole,
        action: 'RECONCILIATION_RUN_EXECUTED',
        entity: 'ReconciliationRun',
        entity_id: run.id,
        reason: `Executed reconciliation run ${runRef}: ${matched} matched, ${discrepancies} flagged`,
        ip_address: '127.0.0.1',
        timestamp: now,
        is_demo: true,
      });

      return { db, result: run };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

