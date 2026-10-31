import { NextResponse } from 'next/server';
import { readDb, runInTransaction } from '@/lib/db/database';
import { LedgerEngine } from '@/lib/ledger/engine';
import { UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.transfers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const actorRole = (request.headers.get('x-user-role') as UserRole) || 'Finance Operator';
    const actorName = request.headers.get('x-user-name') || 'Authorized Staff';
    const actorId = request.headers.get('x-user-id') || 'usr_operator_01';

    const result = runInTransaction(db => {
      const transfer = LedgerEngine.createTransfer(
        db,
        body,
        { id: actorId, name: actorName, role: actorRole }
      );
      return { db, result: transfer };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

