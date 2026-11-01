'use client';

import React, { useState, useEffect } from 'react';
import {
  SendHorizontal,
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { formatPaise, formatDateTime } from '@/lib/utils/format';
import { Transfer, Account } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProviderBadge } from '@/components/shared/ProviderBadge';
import { useAuth } from '@/lib/auth/AuthContext';

export default function TransfersPage() {
  const { currentUser } = useAuth();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // New Transfer Modal
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [sourceAccId, setSourceAccId] = useState('');
  const [amountRupees, setAmountRupees] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryAcc, setBeneficiaryAcc] = useState('');
  const [beneficiaryIfsc, setBeneficiaryIfsc] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reject Modal
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const [trfRes, accRes] = await Promise.all([
        fetch('/api/transfers'),
        fetch('/api/accounts'),
      ]);
      const [trfData, accData] = await Promise.all([
        trfRes.json(),
        accRes.json(),
      ]);
      setTransfers(trfData);
      setAccounts(accData);
      if (accData.length > 0) setSourceAccId(accData[0].id);
    } catch (err) {
      console.error('Error fetching transfers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const amountPaise = Math.round(parseFloat(amountRupees || '0') * 100);
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify({
          source_account_id: sourceAccId,
          amount_paise: amountPaise,
          beneficiary_name: beneficiaryName,
          beneficiary_account: beneficiaryAcc,
          beneficiary_ifsc: beneficiaryIfsc,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Transfer failed');

      setIsNewOpen(false);
      setAmountRupees('');
      setBeneficiaryName('');
      setBeneficiaryAcc('');
      setBeneficiaryIfsc('');
      setNotes('');
      fetchTransfers();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (transferId: string) => {
    try {
      const res = await fetch(`/api/transfers/${transferId}/approve`, {
        method: 'POST',
        headers: {
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
          'x-user-id': currentUser.id,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Approval failed');
      fetchTransfers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    try {
      const res = await fetch(`/api/transfers/${rejectId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rejection failed');
      setRejectId(null);
      setRejectReason('');
      fetchTransfers();
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
              Fund Transfer Management
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              Dual Approval Active
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Compliant payout workflows: Draft → Pending Approval → Processing → Completed. Real-time balance checks.
          </p>
        </div>

        <button
          onClick={() => setIsNewOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-primary text-black font-bold text-xs hover:bg-brand-accent transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus size={15} />
          <span>Initiate Payout Transfer</span>
        </button>
      </div>

      {/* Dual Authorization Policy Banner */}
      <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] flex items-start gap-3">
        <ShieldCheck size={20} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
            Dual-Signatory Rule for Payouts Exceeding ₹5,00,000.00
          </div>
          <p className="text-[#A0ACA1] leading-relaxed">
            In compliance with RBI Master Directions and corporate governance policies, high-value transfers require approval by an independent authorized signatory. The initiator is blocked by server validation from approving their own draft.
          </p>
        </div>
      </div>

      {/* Transfers Table */}
      <div className="rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-brand-primary" />
            <span className="text-xs text-[#A0ACA1]">Loading transfer lifecycle records...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131814] border-b border-[#303A31] text-[10px] font-bold text-[#A0ACA1] uppercase">
                <tr>
                  <th className="py-3 px-4">Transfer Ref</th>
                  <th className="py-3 px-4">Beneficiary</th>
                  <th className="py-3 px-4">Source Pool</th>
                  <th className="py-3 px-4">Initiator / Approver</th>
                  <th className="py-3 px-4 text-right">Fee</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303A31]/50">
                {transfers.map(trf => {
                  const source = accounts.find(a => a.id === trf.source_account_id);
                  const isPending = trf.status === 'PENDING_APPROVAL';

                  return (
                    <tr
                      key={trf.id}
                      className="hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                          {trf.transfer_ref}
                        </div>
                        <div className="text-[10px] text-[#A0ACA1]">
                          {formatDateTime(trf.created_at)}
                        </div>
                        {trf.requires_dual_approval && (
                          <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            Dual Auth Required
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                          {trf.beneficiary_name}
                        </div>
                        <div className="text-[10px] text-[#A0ACA1] font-mono">
                          {trf.beneficiary_account_masked} • {trf.beneficiary_ifsc}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <ProviderBadge code={source ? (source.provider_id || source.name) : 'bank'} name={source ? source.name : 'Primary Disbursal Pool'} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <div className="text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                          Init: <span className="font-medium">{trf.initiator_name}</span>
                        </div>
                        {trf.approver_name && (
                          <div className="text-[10px] text-emerald-400">
                            Appr: {trf.approver_name}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums text-[#A0ACA1]">
                        {formatPaise(trf.fee_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-black tabular-nums text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {formatPaise(trf.amount_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <StatusBadge status={trf.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApprove(trf.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent transition-colors shadow-xs"
                              title="Approve and disburse payout"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectId(trf.id)}
                              className="px-2 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#A0ACA1]">Settled</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Transfer Modal */}
      {isNewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={handleCreateTransfer}
            className="w-full max-w-lg p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] space-y-4 animate-slide-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#303A31]">
              <h3 className="text-base font-bold text-[#F4F7F1]">
                Initiate Fund Transfer
              </h3>
              <button
                type="button"
                onClick={() => setIsNewOpen(false)}
                className="p-1 rounded-md text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                Source Disbursal Account
              </label>
              <select
                value={sourceAccId}
                onChange={e => setSourceAccId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.account_number_masked})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  required
                  value={beneficiaryName}
                  onChange={e => setBeneficiaryName(e.target.value)}
                  placeholder="e.g. AWS Cloud Services Pvt Ltd"
                  className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                  Transfer Amount (INR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amountRupees}
                  onChange={e => setAmountRupees(e.target.value)}
                  placeholder="150000.00"
                  className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                  Beneficiary Account Number
                </label>
                <input
                  type="text"
                  required
                  value={beneficiaryAcc}
                  onChange={e => setBeneficiaryAcc(e.target.value)}
                  placeholder="918029381928"
                  className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  required
                  value={beneficiaryIfsc}
                  onChange={e => setBeneficiaryIfsc(e.target.value.toUpperCase())}
                  placeholder="SBIN000182"
                  className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                Payment Purpose / Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Invoice reference, vendor contract ID, etc."
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsNewOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Validating...' : 'Submit Transfer Draft'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reject Modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] space-y-4 animate-slide-up">
            <h3 className="text-base font-bold text-[#F4F7F1]">
              Reject Payout Transfer
            </h3>
            <p className="text-xs text-[#A0ACA1]">
              Provide a compliance reason for rejecting this transfer draft.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                Rejection Reason
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Reason for audit log..."
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectId(null)}
                className="px-4 py-2 text-xs font-medium text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

