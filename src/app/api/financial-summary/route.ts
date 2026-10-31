import { NextResponse } from 'next/server';
import { readDb, calculateConsolidatedSummary } from '@/lib/db/database';
import { Currency } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = (searchParams.get('currency') as Currency) || 'INR';

    const db = readDb();
    const summary = calculateConsolidatedSummary(db, currency);

    return NextResponse.json(summary);
  } catch (err: any) {
    console.error('Error fetching financial summary:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to calculate financial summary' },
      { status: 500 }
    );
  }
}

