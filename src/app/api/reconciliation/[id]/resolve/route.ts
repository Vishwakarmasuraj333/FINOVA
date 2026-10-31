import { NextResponse } from 'next/server';
import { runInTransaction } from '@/lib/db/database';
import { UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { notes } = await request.json();
    const actorRole = (request.headers.get('x-user-role') as UserRole) || 'Finance Admin';
    const actorName = request.headers.get('x-user-name') || 'Authorized Staff';

    const result = runInTransaction(db => {
      const disc = db.reconciliation_discrepancies.find(d => d.id === params.id);
      if (!disc) throw new Error('Discrepancy record not found');

      const now = new Date().toISOString();
      disc.status = 'RESOLVED';
      disc.resolution_notes = notes || 'Manually reconciled by authorized finance admin.';
      disc.resolved_by = actorName;
      disc.resolved_at = now;

      db.audit_logs.unshift({
        id: `aud_${Date.now()}`,
        actor_name: actorName,
        actor_role: actorRole,
        action: 'RECONCILIATION_DISCREPANCY_RESOLVED',
        entity: 'ReconciliationDiscrepancy',
        entity_id: disc.id,
        amount_paise: disc.difference_paise,
        previous_status: 'PENDING',
        new_status: 'RESOLVED',
        reason: `Discrepancy ${disc.external_ref} resolved: ${notes}`,
        ip_address: '127.0.0.1',
        timestamp: now,
        is_demo: true,
      });

      return { db, result: disc };
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

