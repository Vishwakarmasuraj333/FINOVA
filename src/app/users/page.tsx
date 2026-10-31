'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCog,
  Plus,
  RefreshCw,
  Shield,
  CheckCircle2,
  Lock,
  UserCheck,
} from 'lucide-react';
import { User, UserRole } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useAuth } from '@/lib/auth/AuthContext';
import { formatDateTime } from '@/lib/utils/format';

export default function UsersPage() {
  const { currentUser, switchRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Add User Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Finance Operator');
  const [submitting, setSubmitting] = useState(false);

  const availableRoles: UserRole[] = [
    'Super Admin',
    'Finance Admin',
    'Finance Operator',
    'Approver',
    'Read-only Auditor',
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({ name, email, role }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create user');
      }

      setIsAddOpen(false);
      setName('');
      setEmail('');
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({ id: userId, role: newRole }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update user role');
      }
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Staff Management & Role Permissions
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              5 RBAC Tiers
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Enforce least privilege access across transfers, provider credentials, reconciliation runs, and exports.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-primary text-black font-bold text-xs hover:bg-brand-accent transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus size={15} />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Role Permission Matrix Card */}
      <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
          RBAC Permission Boundaries
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#131814] border border-[#303A31]">
            <span className="font-bold text-brand-primary block">Super Admin</span>
            <p className="text-[11px] text-[#A0ACA1] mt-1">
              Full system control, provider secrets, user roles, manual adjustments, and audit overrides.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#131814] border border-[#303A31]">
            <span className="font-bold text-emerald-400 block">Finance Admin</span>
            <p className="text-[11px] text-[#A0ACA1] mt-1">
              Account configuration, reconciliation runs, settlement synchronization, and adjustments.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#131814] border border-[#303A31]">
            <span className="font-bold text-blue-400 block">Finance Operator</span>
            <p className="text-[11px] text-[#A0ACA1] mt-1">
              Transfer draft creation, transaction recording, customer profiles, and data exports.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#131814] border border-[#303A31]">
            <span className="font-bold text-amber-400 block">Approver</span>
            <p className="text-[11px] text-[#A0ACA1] mt-1">
              Dedicated authority for reviewing, approving, or rejecting high-value transfers.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#131814] border border-[#303A31]">
            <span className="font-bold text-purple-400 block">Read-only Auditor</span>
            <p className="text-[11px] text-[#A0ACA1] mt-1">
              Comprehensive read access across ledgers, reports, and audit logs. Zero mutation rights.
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-brand-primary" />
            <span className="text-xs text-[#A0ACA1]">Loading staff profiles...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131814] border-b border-[#303A31] text-[10px] font-bold text-[#A0ACA1] uppercase">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Active Role</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4 text-right">Status</th>
                  <th className="py-3 px-4 text-right">Manage Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303A31]/50">
                {users.map(u => (
                  <tr
                    key={u.id}
                    className="hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {u.name}
                      </div>
                      <div className="text-[10px] text-[#A0ACA1] font-mono">
                        {u.id}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] font-mono">
                      {u.email}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-xs text-brand-primary">
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-[#A0ACA1] whitespace-nowrap">
                      {formatDateTime(u.last_login)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <StatusBadge status={u.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={u.role}
                        onChange={e => handleUpdateRole(u.id, e.target.value as UserRole)}
                        className="px-2.5 py-1 rounded-lg bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
                      >
                        {availableRoles.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={handleCreateUser}
            className="w-full max-w-md p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] space-y-4 animate-slide-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#303A31]">
              <h3 className="text-base font-bold text-[#F4F7F1]">
                Invite Staff Member
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-md text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Ananya Roy"
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Corporate Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ananya.roy@finova.internal"
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Assigned Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
              >
                {availableRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent transition-colors disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

