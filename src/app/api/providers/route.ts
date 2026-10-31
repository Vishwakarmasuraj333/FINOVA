import { NextResponse } from 'next/server';
import { readDb, runInTransaction } from '@/lib/db/database';
import { PaymentProvider, UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.providers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const actorRole = (request.headers.get('x-user-role') as UserRole) || 'Super Admin';
    const actorName = request.headers.get('x-user-name') || 'Authorized Staff';

    if (actorRole !== 'Super Admin' && actorRole !== 'Finance Admin') {
      return NextResponse.json({ error: 'Unauthorized to configure providers' }, { status: 403 });
    }

    const result = runInTransaction(db => {
      let provider = db.providers.find(p => p.id === body.id);
      const now = new Date().toISOString();

      if (provider) {
        // Update existing provider
        provider.status = body.status || provider.status;
        provider.environment = body.environment || provider.environment;
        provider.webhook_url = body.webhook_url || provider.webhook_url;
        provider.supported_operations = body.supported_operations || provider.supported_operations;
      } else {
        // Create new provider
        provider = {
          id: body.id || `prov_${Date.now()}`,
          name: body.name,
          code: body.code,
          category: body.category || 'GATEWAY',
          status: 'CONNECTED',
          environment: body.environment || 'SANDBOX',
          supported_operations: body.supported_operations || ['PAYMENTS'],
          last_synced_at: now,
          last_sync_status: 'SUCCESS',
          webhook_url: body.webhook_url || `https://api.finova.internal/webhooks/${body.code}`,
          webhook_events: ['payment.success', 'settlement.processed'],
          health_score: 98,
          merchant_id_masked: `MID_••••${Math.floor(1000 + Math.random() * 9000)}`,
          is_demo: true,
        };
        db.providers.push(provider);
      }

      db.audit_logs.unshift({
        id: `aud_${Date.now()}`,
        actor_name: actorName,
        actor_role: actorRole,
        action: 'PROVIDER_CONFIG_UPDATED',
        entity: 'PaymentProvider',
        entity_id: provider.id,
        reason: `Updated configuration for ${provider.name}`,
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

