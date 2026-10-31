import { NextResponse } from 'next/server';
import { readDb, runInTransaction } from '@/lib/db/database';
import { User, UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const actorRole = (request.headers.get('x-user-role') as UserRole) || 'Super Admin';
    const actorName = request.headers.get('x-user-name') || 'Authorized Staff';

    if (actorRole !== 'Super Admin') {
      return NextResponse.json({ error: 'Unauthorized: Only Super Admin can manage staff' }, { status: 403 });
    }

    const result = runInTransaction(db => {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: body.name,
        email: body.email,
        role: body.role || 'Finance Operator',
        status: 'ACTIVE',
        last_login: new Date().toISOString(),
      };

      db.users.push(newUser);

      db.audit_logs.unshift({
        id: `aud_${Date.now()}`,
        actor_name: actorName,
        actor_role: actorRole,
        action: 'USER_CREATED',
        entity: 'User',
        entity_id: newUser.id,
        reason: `Created user ${newUser.name} with role ${newUser.role}`,
        ip_address: '127.0.0.1',
        timestamp: new Date().toISOString(),
        is_demo: true,
      });

      return { db, result: newUser };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const actorRole = (request.headers.get('x-user-role') as UserRole) || 'Super Admin';
    const actorName = request.headers.get('x-user-name') || 'Authorized Staff';

    if (actorRole !== 'Super Admin') {
      return NextResponse.json({ error: 'Unauthorized: Only Super Admin can modify roles' }, { status: 403 });
    }

    const result = runInTransaction(db => {
      const user = db.users.find(u => u.id === body.id);
      if (!user) throw new Error('User not found');

      const oldRole = user.role;
      user.role = body.role;

      db.audit_logs.unshift({
        id: `aud_${Date.now()}`,
        actor_name: actorName,
        actor_role: actorRole,
        action: 'USER_ROLE_MODIFIED',
        entity: 'User',
        entity_id: user.id,
        previous_status: oldRole,
        new_status: user.role,
        reason: `Changed role from ${oldRole} to ${user.role}`,
        ip_address: '127.0.0.1',
        timestamp: new Date().toISOString(),
        is_demo: true,
      });

      return { db, result: user };
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

