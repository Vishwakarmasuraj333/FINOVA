import { NextResponse } from 'next/server';
import { readDb, writeDb, runInTransaction } from '@/lib/db/database';
import { LedgerEngine } from '@/lib/ledger/engine';
import { UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const db = readDb();

    let txns = [...db.transactions];

    const search = searchParams.get('search');
    if (search) {
      const q = search.toLowerCase();
      txns = txns.filter(
        t =>
          t.internal_ref.toLowerCase().includes(q) ||
          t.external_ref.toLowerCase().includes(q) ||
          (t.sender_name && t.sender_name.toLowerCase().includes(q)) ||
          (t.recipient_name && t.recipient_name.toLowerCase().includes(q)) ||
          (t.safe_error_message && t.safe_error_message.toLowerCase().includes(q))
      );
    }

    const providerId = searchParams.get('provider_id');
    if (providerId && providerId !== 'all') {
      txns = txns.filter(t => t.provider_id === providerId);
    }

    const accountId = searchParams.get('account_id');
    if (accountId && accountId !== 'all') {
      txns = txns.filter(t => t.account_id === accountId);
    }

    const status = searchParams.get('status');
    if (status && status !== 'all') {
      txns = txns.filter(t => t.status === status);
    }

    const type = searchParams.get('type');
    if (type && type !== 'all') {
      txns = txns.filter(t => t.type === type);
    }

    const direction = searchParams.get('direction');
    if (direction === 'credit') {
      txns = txns.filter(t => t.type.includes('CREDIT'));
    } else if (direction === 'debit') {
      txns = txns.filter(t => t.type.includes('DEBIT'));
    }

    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const total = txns.length;
    const paginated = txns.slice(offset, offset + limit);

    return NextResponse.json({
      total,
      limit,
      offset,
      data: paginated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const actorRole = (request.headers.get('x-user-role') as UserRole) || 'Super Admin';
    const actorName = request.headers.get('x-user-name') || 'Authorized Staff';

    const result = runInTransaction(db => {
      const res = LedgerEngine.postTransaction(
        db,
        body,
        { name: actorName, role: actorRole }
      );
      return { db, result: res };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

