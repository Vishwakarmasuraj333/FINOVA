import { NextResponse } from 'next/server';
import { runInTransaction } from '@/lib/db/database';
import { LedgerEngine } from '@/lib/ledger/engine';
import { UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { amount_paise, reason } = await request.json();
    const actorRole = (request.headers.get('x-user-role') as UserRole) || 'Finance Admin';
    const actorName = request.headers.get('x-user-name') || 'Authorized Staff';

    const result = runInTransaction(db => {
      const refund = LedgerEngine.processRefund(
        db,
        params.id,
        amount_paise,
        reason,
        { name: actorName, role: actorRole }
      );
      return { db, result: refund };
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

