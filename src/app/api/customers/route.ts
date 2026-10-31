import { NextResponse } from 'next/server';
import { readDb, runInTransaction } from '@/lib/db/database';
import { Customer, UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.customers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const actorRole = (request.headers.get('x-user-role') as UserRole) || 'Finance Admin';
    const actorName = request.headers.get('x-user-name') || 'Authorized Staff';

    const result = runInTransaction(db => {
      const customer: Customer = {
        id: `cust_${Date.now()}`,
        name: body.name,
        email: body.email,
        phone: body.phone,
        vpa: body.vpa,
        kyc_status: body.kyc_status || 'VERIFIED',
        total_volume_paise: 0,
        transaction_count: 0,
        created_at: new Date().toISOString(),
        is_demo: true,
      };

      db.customers.unshift(customer);

      db.audit_logs.unshift({
        id: `aud_${Date.now()}`,
        actor_name: actorName,
        actor_role: actorRole,
        action: 'CUSTOMER_CREATED',
        entity: 'Customer',
        entity_id: customer.id,
        reason: `Created customer profile for ${customer.name}`,
        ip_address: '127.0.0.1',
        timestamp: new Date().toISOString(),
        is_demo: true,
      });

      return { db, result: customer };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

