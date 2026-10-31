'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { formatPaise, formatDateTime } from '@/lib/utils/format';
import { Refund } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProviderBadge } from '@/components/shared/ProviderBadge';

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/refunds');
      const data = await res.json();
      setRefunds(data);
    } catch (err) {
      console.error('Error fetching refunds:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const totalRefunded = refunds
    .filter(r => r.status === 'COMPLETED')
    .reduce((s, r) => s + r.amount_paise, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Refund Requests & Disbursals
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              {formatPaise(totalRefunded)} Settled
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Auditable customer return requests linked explicitly to original payment transactions with compensating ledger entries.
          </p>
        </div>

        <Link
          href="/transactions"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-primary text-black font-bold text-xs hover:bg-brand-accent transition-colors self-start sm:self-auto shadow-xs"
        >
          <span>Find Transaction to Refund</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Refunds Table */}
      <div className="rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-brand-primary" />
            <span className="text-xs text-[#A0ACA1]">Loading refund records...</span>
          </div>
        ) : refunds.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#A0ACA1]">
            No refunds processed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131814] border-b border-[#303A31] text-[10px] font-bold text-[#A0ACA1] uppercase">
                <tr>
                  <th className="py-3 px-4">Refund Ref</th>
                  <th className="py-3 px-4">Provider Rail</th>
                  <th className="py-3 px-4">Original Txn ID</th>
                  <th className="py-3 px-4">Reason & Justification</th>
                  <th className="py-3 px-4">Initiator</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Amount (INR)</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303A31]/50">
                {refunds.map(rfnd => (
                  <tr
                    key={rfnd.id}
                    className="hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                      {rfnd.refund_ref}
                    </td>

                    <td className="py-3.5 px-4">
                      <ProviderBadge code={rfnd.provider_id.replace('prov_', '')} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 font-mono text-brand-primary">
                      <Link href={`/transactions?search=${rfnd.original_transaction_id}`} className="hover:underline flex items-center gap-1">
                        <span>{rfnd.original_transaction_id}</span>
                        <ExternalLink size={12} />
                      </Link>
                    </td>

                    <td className="py-3.5 px-4 text-[#A0ACA1] max-w-[240px] truncate">
                      {rfnd.reason}
                    </td>

                    <td className="py-3.5 px-4 text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                      {rfnd.initiator_name}
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-[#A0ACA1] whitespace-nowrap">
                      {formatDateTime(rfnd.created_at)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold tabular-nums text-rose-400">
                      -{formatPaise(rfnd.amount_paise)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <StatusBadge status={rfnd.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

