import { NextResponse } from 'next/server';
import { readDb, runInTransaction } from '@/lib/db/database';
import { ChargeFee, UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.charges);
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
      const charge: ChargeFee = {
        id: `chg_${Date.now()}`,
        charge_ref: `CHG-2026-${Math.floor(100 + Math.random() * 900)}`,
        transaction_id: body.transaction_id || `txn_${Date.now()}`,
        provider_id: body.provider_id,
        account_id: body.account_id,
        fee_type: body.fee_type || 'PAYMENT_PROCESSING',
        amount_paise: body.amount_paise,
        tax_paise: body.tax_paise || Math.round(body.amount_paise * 0.18),
        rate_rule: body.rate_rule || 'Custom Standard Fee Rule',
        is_estimated: Boolean(body.is_estimated),
        currency: body.currency || 'INR',
        created_at: new Date().toISOString(),
        is_demo: true,
      };

      db.charges.unshift(charge);

      db.audit_logs.unshift({
        id: `aud_${Date.now()}`,
        actor_name: actorName,
        actor_role: actorRole,
        action: 'CHARGE_FEE_RECORDED',
        entity: 'ChargeFee',
        entity_id: charge.id,
        amount_paise: charge.amount_paise,
        currency: charge.currency,
        reason: `Applied fee rule: ${charge.rate_rule}`,
        ip_address: '127.0.0.1',
        timestamp: new Date().toISOString(),
        is_demo: true,
      });

      return { db, result: charge };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

