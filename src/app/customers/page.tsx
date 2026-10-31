'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users2,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { formatPaise, formatDateTime, maskVpa } from '@/lib/utils/format';
import { Customer } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useAuth } from '@/lib/auth/AuthContext';

export default function CustomersPage() {
  const { currentUser } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add customer modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vpa, setVpa] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({ name, email, phone, vpa, kyc_status: 'VERIFIED' }),
      });
      if (!res.ok) throw new Error('Failed to create customer profile');

      setIsAddOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setVpa('');
      fetchCustomers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = customers.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.vpa && c.vpa.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Customer Directory & KYC Profiles
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              {customers.length} Corporate Customers
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Verified enterprise counterparties, KYC compliance status, and linked UPI virtual payment handles.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-primary text-black font-bold text-xs hover:bg-brand-accent transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus size={15} />
          <span>Add Customer Profile</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3.5 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] flex items-center gap-3">
        <Search size={16} className="text-[#A0ACA1]" />
        <input
          type="text"
          placeholder="Filter customers by corporate legal name, email address, or UPI VPA handle..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] placeholder-[#A0ACA1] focus:outline-none"
        />
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-brand-primary" />
            <span className="text-xs text-[#A0ACA1]">Loading customer entities...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131814] border-b border-[#303A31] text-[10px] font-bold text-[#A0ACA1] uppercase">
                <tr>
                  <th className="py-3 px-4">Customer Entity</th>
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4">Linked UPI VPA</th>
                  <th className="py-3 px-4 text-right">Transactions</th>
                  <th className="py-3 px-4 text-right">Lifetime Volume</th>
                  <th className="py-3 px-4 text-right">KYC Status</th>
                  <th className="py-3 px-4 text-right">History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303A31]/50">
                {filtered.map(cust => (
                  <tr
                    key={cust.id}
                    className="hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {cust.name}
                      </div>
                      <div className="text-[10px] text-[#A0ACA1] font-mono">
                        {cust.id}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                      <div>{cust.email}</div>
                      <div className="text-[10px] text-[#A0ACA1]">{cust.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-brand-primary">
                      {cust.vpa ? maskVpa(cust.vpa) : '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold tabular-nums text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                      {cust.transaction_count}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black tabular-nums text-emerald-400">
                      {formatPaise(cust.total_volume_paise)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <StatusBadge status={cust.kyc_status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/transactions?search=${encodeURIComponent(cust.name)}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
                      >
                        <span>Ledger</span>
                        <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={handleCreateCustomer}
            className="w-full max-w-md p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] space-y-4 animate-slide-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#303A31]">
              <h3 className="text-base font-bold text-[#F4F7F1]">
                Register Corporate Counterparty
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
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Company / Counterparty Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Reliance Retail Ventures"
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Accounts Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="billing@company.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98000 12345"
                  className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Default UPI VPA Handle</label>
              <input
                type="text"
                value={vpa}
                onChange={e => setVpa(e.target.value)}
                placeholder="company.ops@hdfcbank"
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary font-mono"
              />
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
                {submitting ? 'Registering...' : 'Register Profile'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

