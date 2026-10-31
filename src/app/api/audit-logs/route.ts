import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db/database';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const db = readDb();
    let logs = [...db.audit_logs];

    const entity = searchParams.get('entity');
    if (entity && entity !== 'all') {
      logs = logs.filter(l => l.entity === entity);
    }

    const role = searchParams.get('role');
    if (role && role !== 'all') {
      logs = logs.filter(l => l.actor_role === role);
    }

    return NextResponse.json(logs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

