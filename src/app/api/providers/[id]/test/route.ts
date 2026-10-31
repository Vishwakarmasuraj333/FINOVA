import { NextResponse } from 'next/server';
import { runInTransaction } from '@/lib/db/database';
import { UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const actorRole = (request.headers.get('x-user-role') as UserRole) || 'Super Admin';
    const actorName = request.headers.get('x-user-name') || 'Authorized Staff';

    const result = runInTransaction(db => {
      const provider = db.providers.find(p => p.id === params.id);
      if (!provider) throw new Error('Provider not found');

      const now = new Date().toISOString();

      if (provider.status === 'NOT_CONNECTED') {
        // Test fails if not connected or missing credentials
        provider.last_synced_at = now;
        provider.last_sync_status = 'FAILED';
        provider.last_error = 'Connection rejected: Invalid or missing API credentials / client certificate.';
        provider.health_score = 30;
      } else {
        provider.last_synced_at = now;
        provider.last_sync_status = 'SUCCESS';
        provider.last_error = undefined;
        provider.health_score = Math.min(100, Math.floor(95 + Math.random() * 5));
      }

      db.audit_logs.unshift({
        id: `aud_${Date.now()}`,
        actor_name: actorName,
        actor_role: actorRole,
        action: 'PROVIDER_CONNECTION_TEST',
        entity: 'PaymentProvider',
        entity_id: provider.id,
        reason: `Initiated automated handshake test for ${provider.name}. Result: ${provider.last_sync_status}`,
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

