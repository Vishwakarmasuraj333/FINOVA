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
    const { reason } = await request.json();
    const actorRole = (request.headers.get('x-user-role') as UserRole) || 'Approver';
    const actorName = request.headers.get('x-user-name') || 'Vikramaditya Singhania';
    const actorId = request.headers.get('x-user-id') || 'usr_approver_01';

    const result = runInTransaction(db => {
      const transfer = LedgerEngine.rejectTransfer(
        db,
        params.id,
        reason || 'Rejected by authorized approver.',
        { id: actorId, name: actorName, role: actorRole }
      );
      return { db, result: transfer };
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

