import { NextResponse } from 'next/server';
import { runInTransaction } from '@/lib/db/database';
import { UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const actorRole = (request.headers.get('x-user-role') as UserRole) || 'Finance Admin';
    const actorName = request.headers.get('x-user-name') || 'Authorized Staff';

    const result = runInTransaction(db => {
      const provider = db.providers.find(p => p.id === params.id);
      if (!provider) throw new Error('Provider not found');
      if (provider.status === 'NOT_CONNECTED') {
        throw new Error('Cannot synchronize disconnected provider. Please connect and configure credentials first.');
      }

      const now = new Date().toISOString();
      provider.last_synced_at = now;
      provider.last_sync_status = 'SUCCESS';
      provider.last_error = undefined;

      // Update associated account sync timestamp
      const acc = db.accounts.find(a => a.provider_id === provider.id);
      if (acc) {
        acc.last_synced_at = now;
      }

      db.audit_logs.unshift({
        id: `aud_${Date.now()}`,
        actor_name: actorName,
        actor_role: actorRole,
        action: 'PROVIDER_SYNCHRONIZATION',
        entity: 'PaymentProvider',
        entity_id: provider.id,
        reason: `Synchronized transaction and settlement records for ${provider.name}`,
        ip_address: '127.0.0.1',
        timestamp: now,
        is_demo: true,
      });

      return { db, result: provider };
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

