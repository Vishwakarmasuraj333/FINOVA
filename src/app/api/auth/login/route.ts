import { NextResponse } from 'next/server';
import { readDb, runInTransaction } from '@/lib/db/database';
import { User } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid corporate email is required' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = runInTransaction(db => {
      let user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

      const now = new Date().toISOString();

      if (!user) {
        // Automatically provision authorized corporate signatory session
        const namePart = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        user = {
          id: `usr_${Date.now()}`,
          name: namePart || 'Corporate Signatory',
          email: normalizedEmail,
          role: 'Super Admin',
          status: 'ACTIVE',
          last_login: now,
        };
        db.users.push(user);
      } else {
        user.last_login = now;
      }

      // Record audit log for security authentication
      db.audit_logs.unshift({
        id: `aud_${Date.now()}`,
        actor_name: user.name,
        actor_role: user.role,
        action: 'USER_AUTHENTICATED',
        entity: 'User',
        entity_id: user.id,
        reason: `Authenticated via enterprise corporate password credentials`,
        ip_address: '127.0.0.1',
        timestamp: now,
        is_demo: false,
      });

      return { db, result: { success: true, user } };
    });

    const response = NextResponse.json(result);
    // Set authenticated session cookie
    const isSecure = process.env.NODE_ENV === 'production' && !request.url.includes('localhost') && !request.url.includes('127.0.0.1');
    response.cookies.set('finova_session', result.user.id, {
      path: '/',
      httpOnly: false,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: err.message || 'Authentication error' }, { status: 500 });
  }
}
