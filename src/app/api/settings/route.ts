import { NextResponse } from 'next/server';
import { readDb, runInTransaction } from '@/lib/db/database';
import { SystemSettings, UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.settings);
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
      return NextResponse.json({ error: 'Unauthorized to modify system settings' }, { status: 403 });
    }

    const result = runInTransaction(db => {
      db.settings = {
        ...db.settings,
        ...body,
      };

      db.audit_logs.unshift({
        id: `aud_${Date.now()}`,
        actor_name: actorName,
        actor_role: actorRole,
        action: 'SYSTEM_SETTINGS_UPDATE',
        entity: 'SystemSettings',
        entity_id: 'global',
        reason: 'Updated system security and operational parameters',
        ip_address: '127.0.0.1',
        timestamp: new Date().toISOString(),
        is_demo: true,
      });

      return { db, result: db.settings };
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

