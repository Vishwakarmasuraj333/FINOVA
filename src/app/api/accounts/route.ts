import { NextResponse } from 'next/server';
import { readDb, runInTransaction } from '@/lib/db/database';
import { Account, UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = readDb();
    
    // Enrich accounts with calculated ledger balances
    const enriched = db.accounts.map(acc => {
      const accountTxns = db.transactions.filter(t => t.account_id === acc.id && t.status === 'COMPLETED');
      const postedCredits = accountTxns
        .filter(t => t.type.includes('CREDIT'))
        .reduce((s, t) => s + t.amount_paise, 0);
      const postedDebits = accountTxns
        .filter(t => t.type.includes('DEBIT'))
        .reduce((s, t) => s + t.amount_paise, 0);

      const pendingDebits = db.transfers
        .filter(t => t.source_account_id === acc.id && (t.status === 'PENDING_APPROVAL' || t.status === 'PROCESSING'))
        .reduce((s, t) => s + t.amount_paise, 0);

      const closingLedgerBalance = acc.opening_balance_paise + postedCredits - postedDebits;
      const availableBalance = Math.max(0, closingLedgerBalance - pendingDebits);

      return {
        ...acc,
        posted_credits_paise: postedCredits,
        posted_debits_paise: postedDebits,
        pending_debits_paise: pendingDebits,
        closing_ledger_balance_paise: closingLedgerBalance,
        available_balance_paise: availableBalance,
      };
    });

    return NextResponse.json(enriched);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const actorRole = (request.headers.get('x-user-role') as UserRole) || 'Finance Admin';
    const actorName = request.headers.get('x-user-name') || 'Authorized Staff';

    if (actorRole !== 'Super Admin' && actorRole !== 'Finance Admin') {
      return NextResponse.json({ error: 'Unauthorized to create financial accounts' }, { status: 403 });
    }

    const result = runInTransaction(db => {
      const accId = `acc_${Date.now()}`;
      const now = new Date().toISOString();

      const newAccount: Account = {
        id: accId,
        name: body.name,
        account_number_masked: body.account_number_masked || `•••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
        ifsc_or_routing: body.ifsc_or_routing,
        type: body.type || 'BANK_ACCOUNT',
        provider_id: body.provider_id,
        currency: body.currency || 'INR',
        opening_balance_paise: body.opening_balance_paise || 0,
        provider_reported_balance_paise: body.opening_balance_paise || 0,
        status: 'ACTIVE',
        last_synced_at: now,
        is_demo: true,
      };

      db.accounts.push(newAccount);

      // Create initial opening balance journal entry if balance > 0
      if (newAccount.opening_balance_paise > 0) {
        db.ledger_entries.push({
          id: `led_op_${Date.now()}`,
          entry_type: 'CREDIT',
          debit_account_id: newAccount.id,
          credit_account_id: 'acc_equity_opening',
          amount_paise: newAccount.opening_balance_paise,
          currency: newAccount.currency,
          timestamp: now,
          description: `Opening Balance for ${newAccount.name}`,
          is_demo: true,
        });
      }

      db.audit_logs.unshift({
        id: `aud_${Date.now()}`,
        actor_name: actorName,
        actor_role: actorRole,
        action: 'ACCOUNT_CREATED',
        entity: 'Account',
        entity_id: newAccount.id,
        amount_paise: newAccount.opening_balance_paise,
        currency: newAccount.currency,
        new_status: 'ACTIVE',
        reason: `Created account ${newAccount.name}`,
        ip_address: '127.0.0.1',
        timestamp: now,
        is_demo: true,
      });

      return { db, result: newAccount };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

