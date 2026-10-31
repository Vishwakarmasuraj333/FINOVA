'use client';

import React, { useState, useEffect } from 'react';
import {
  Scale,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  Search,
} from 'lucide-react';
import { formatPaise, formatDateTime } from '@/lib/utils/format';
import { ReconciliationRun, ReconciliationDiscrepancy, PaymentProvider, Account } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProviderBadge } from '@/components/shared/ProviderBadge';
import { useAuth } from '@/lib/auth/AuthContext';

export default function ReconciliationPage() {
  const { currentUser } = useAuth();
  const [runs, setRuns] = useState<ReconciliationRun[]>([]);
  const [discrepancies, setDiscrepancies] = useState<ReconciliationDiscrepancy[]>([]);
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // New Run modal
  const [isRunOpen, setIsRunOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [running, setRunning] = useState(false);

  // Resolve Discrepancy modal
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [resolveNotes, setResolveNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  const fetchReconciliationData = async () => {
    setLoading(true);
    try {
      const [recRes, provRes, accRes] = await Promise.all([
        fetch('/api/reconciliation'),
        fetch('/api/providers'),
        fetch('/api/accounts'),
      ]);
      const [recData, provData, accData] = await Promise.all([
        recRes.json(),
        provRes.json(),
        accRes.json(),
      ]);

      setRuns(recData.runs || []);
      setDiscrepancies(recData.discrepancies || []);
      setProviders(provData || []);
      setAccounts(accData || []);
      if (provData.length > 0) setSelectedProviderId(provData[0].id);
      if (accData.length > 0) setSelectedAccountId(accData[0].id);
    } catch (err) {
      console.error('Error fetching reconciliation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReconciliationData();
  }, []);

  const handleTriggerRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setRunning(true);
    try {
      const res = await fetch('/api/reconciliation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({
          provider_id: selectedProviderId,
          account_id: selectedAccountId,
        }),
      });

      if (!res.ok) throw new Error('Reconciliation execution failed');
      setIsRunOpen(false);
      fetchReconciliationData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRunning(false);
    }
  };

  const handleResolveDiscrepancy = async () => {
    if (!resolveId) return;
    setResolving(true);
    try {
      const res = await fetch(`/api/reconciliation/${resolveId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({ notes: resolveNotes }),
      });

      if (!res.ok) throw new Error('Failed to resolve discrepancy');
      setResolveId(null);
      setResolveNotes('');
      fetchReconciliationData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setResolving(false);
    }
  };

  const pendingDiscrepancies = discrepancies.filter(d => d.status === 'PENDING');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Statement & Ledger Reconciliation
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
              {pendingDiscrepancies.length} Action Needed
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Automated statement matching engine detects amount variances, missing ledger entries, and rounding discrepancies.
          </p>
        </div>

        <button
          onClick={() => setIsRunOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-primary text-black font-bold text-xs hover:bg-brand-accent transition-colors self-start sm:self-auto shadow-xs"
        >
          <Play size={14} />
          <span>Execute Reconciliation Run</span>
        </button>
      </div>

      {/* Discrepancies Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
          Detected Variances & Discrepancies
        </h2>
        <div className="rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] overflow-hidden">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <RefreshCw size={24} className="animate-spin text-brand-primary" />
              <span className="text-xs text-[#A0ACA1]">Matching statements against ledger...</span>
            </div>
          ) : discrepancies.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#A0ACA1]">
              Zero discrepancies detected! All provider statements perfectly balance with ledger.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#131814] border-b border-[#303A31] text-[10px] font-bold text-[#A0ACA1] uppercase">
                  <tr>
                    <th className="py-3 px-4">Discrepancy Ref</th>
                    <th className="py-3 px-4">Classification</th>
                    <th className="py-3 px-4 text-right">Ledger Amount</th>
                    <th className="py-3 px-4 text-right">Provider Statement</th>
                    <th className="py-3 px-4 text-right">Variance</th>
                    <th className="py-3 px-4 text-right">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#303A31]/50">
                  {discrepancies.map(disc => (
                    <tr
                      key={disc.id}
                      className="hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {disc.external_ref}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-xs text-purple-400">
                          {disc.discrepancy_type.replace('_', ' ')}
                        </span>
                        {disc.resolution_notes && (
                          <div className="text-[10px] text-[#A0ACA1] max-w-[200px] truncate">
                            {disc.resolution_notes}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums text-[#A0ACA1]">
                        {formatPaise(disc.ledger_amount_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {formatPaise(disc.provider_amount_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-black tabular-nums text-rose-400">
                        {formatPaise(disc.difference_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <StatusBadge status={disc.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {disc.status === 'PENDING' ? (
                          <button
                            onClick={() => setResolveId(disc.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent transition-colors"
                          >
                            Resolve
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            Resolved by {disc.resolved_by || 'Admin'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Historical Reconciliation Runs */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
          Historical Reconciliation Executions
        </h2>
        <div className="rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131814] border-b border-[#303A31] text-[10px] font-bold text-[#A0ACA1] uppercase">
                <tr>
                  <th className="py-3 px-4">Run Reference</th>
                  <th className="py-3 px-4">Provider Rail</th>
                  <th className="py-3 px-4">Execution Date</th>
                  <th className="py-3 px-4 text-right">Checked</th>
                  <th className="py-3 px-4 text-right">Matched</th>
                  <th className="py-3 px-4 text-right">Variances</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303A31]/50">
                {runs.map(run => {
                  const prov = providers.find(p => p.id === run.provider_id);
                  return (
                    <tr key={run.id}>
                      <td className="py-3 px-4 font-mono font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {run.run_ref}
                      </td>
                      <td className="py-3 px-4">
                        <ProviderBadge code={prov ? prov.code : 'bank'} name={prov ? prov.name : 'Rail'} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-[#A0ACA1]">
                        {formatDateTime(run.created_at)}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-[#F4F7F1] font-semibold">
                        {run.total_transactions_checked}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-emerald-400 font-bold">
                        {run.matched_count}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-rose-400 font-bold">
                        {run.discrepancy_count}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <StatusBadge status={run.status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trigger Run Modal */}
      {isRunOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={handleTriggerRun}
            className="w-full max-w-md p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] space-y-4 animate-slide-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#303A31]">
              <h3 className="text-base font-bold text-[#F4F7F1]">
                Execute Reconciliation Run
              </h3>
              <button
                type="button"
                onClick={() => setIsRunOpen(false)}
                className="p-1 rounded-md text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Provider Rail</label>
              <select
                value={selectedProviderId}
                onChange={e => setSelectedProviderId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
              >
                {providers.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Corresponding Ledger Account</label>
              <select
                value={selectedAccountId}
                onChange={e => setSelectedAccountId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsRunOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={running}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent transition-colors disabled:opacity-50"
              >
                {running ? 'Comparing...' : 'Run Automated Matching'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resolve Discrepancy Modal */}
      {resolveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] space-y-4 animate-slide-up">
            <h3 className="text-base font-bold text-[#F4F7F1]">
              Resolve Reconciliation Variance
            </h3>
            <p className="text-xs text-[#A0ACA1]">
              Enter authorized resolution justification and ledger reconciliation notes.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                Resolution Notes
              </label>
              <textarea
                rows={3}
                required
                value={resolveNotes}
                onChange={e => setResolveNotes(e.target.value)}
                placeholder="e.g. Bank adjusted rounding difference in statement credit note."
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setResolveId(null)}
                className="px-4 py-2 text-xs font-medium text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveDiscrepancy}
                disabled={resolving || !resolveNotes}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent transition-colors disabled:opacity-50"
              >
                {resolving ? 'Resolving...' : 'Confirm Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

