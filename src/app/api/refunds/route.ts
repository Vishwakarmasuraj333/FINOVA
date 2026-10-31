import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.refunds);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

