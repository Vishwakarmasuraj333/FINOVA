import { NextResponse } from 'next/server';
import { readDb, calculateConsolidatedSummary } from '@/lib/db/database';
import { UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'transactions';
    const db = readDb();

    if (type === 'transactions') {
      const headers = [
        'Internal Ref',
        'External Ref',
        'Provider',
        'Account',
        'Type',
        'Amount (INR)',
        'Fee (INR)',
        'Tax (INR)',
        'Net (INR)',
        'Status',
        'Payment Method',
        'Sender / Counterparty',
        'Timestamp',
        'Reconciliation Status',
      ];

      const rows = db.transactions.map(t => [
        t.internal_ref,
        t.external_ref,
        t.provider_id,
        t.account_id,
        t.type,
        (t.amount_paise / 100).toFixed(2),
        (t.fee_paise / 100).toFixed(2),
        (t.tax_paise / 100).toFixed(2),
        (t.net_paise / 100).toFixed(2),
        t.status,
        t.payment_method,
        `"${t.sender_name || t.recipient_name || ''}"`,
        t.initiated_at,
        t.reconciliation_status,
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="finova_transactions_${Date.now()}.csv"`,
        },
      });
    }

    if (type === 'summary') {
      const summary = calculateConsolidatedSummary(db, 'INR');
      const headers = [
        'Account Name',
        'Account Number Masked',
        'Provider',
        'Opening Balance (INR)',
        'Posted Credits (INR)',
        'Posted Debits (INR)',
        'Fees (INR)',
        'Taxes (INR)',
        'Refunds (INR)',
        'Closing Ledger Balance (INR)',
        'Provider Balance (INR)',
        'Variance (INR)',
        'Reconciliation Status',
      ];

      const rows = summary.account_breakdown.map(a => [
        `"${a.account_name}"`,
        `"${a.account_number_masked}"`,
        `"${a.provider_name}"`,
        (a.opening_balance_paise / 100).toFixed(2),
        (a.posted_credits_paise / 100).toFixed(2),
        (a.posted_debits_paise / 100).toFixed(2),
        (a.fees_paise / 100).toFixed(2),
        (a.taxes_paise / 100).toFixed(2),
        (a.refunds_paise / 100).toFixed(2),
        (a.closing_ledger_balance_paise / 100).toFixed(2),
        a.provider_reported_balance_paise !== null ? (a.provider_reported_balance_paise / 100).toFixed(2) : 'N/A',
        (a.difference_paise / 100).toFixed(2),
        a.reconciliation_status,
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="finova_consolidated_summary_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: 'Unknown export type' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

