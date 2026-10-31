'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
} from 'lucide-react';
import { formatDateTime, formatPaise } from '@/lib/utils/format';
import { AuditLog } from '@/types';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = selectedEntity !== 'all' ? `/api/audit-logs?entity=${selectedEntity}` : '/api/audit-logs';
      const res = await fetch(url);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedEntity]);

  const filtered = logs.filter(log => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.actor_name.toLowerCase().includes(q) ||
      (log.reason && log.reason.toLowerCase().includes(q)) ||
      log.entity.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Administrative Activity & Audit Trail
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              Immutable History
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Complete compliance trail capturing every manual adjustment, transfer approval, provider test, and role change.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs font-semibold text-[#A0ACA1] hover:text-[#F4F7F1]"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Audit Stream</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0ACA1]" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, reason, or entity ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] placeholder-[#A0ACA1] focus:outline-none focus:border-brand-primary"
          />
        </div>

        <select
          value={selectedEntity}
          onChange={e => setSelectedEntity(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none w-full sm:w-auto"
        >
          <option value="all">All Entities</option>
          <option value="Transfer">Transfers</option>
          <option value="Transaction">Transactions</option>
          <option value="PaymentProvider">Payment Providers</option>
          <option value="Account">Accounts</option>
          <option value="SystemSettings">System Settings</option>
          <option value="User">Users</option>
          <option value="ReconciliationRun">Reconciliation Runs</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-brand-primary" />
            <span className="text-xs text-[#A0ACA1]">Loading audit log records...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#A0ACA1]">
            No matching audit events found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131814] border-b border-[#303A31] text-[10px] font-bold text-[#A0ACA1] uppercase">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Justification & Compliance Notes</th>
                  <th className="py-3 px-4 text-right">Amount Impact</th>
                  <th className="py-3 px-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303A31]/50">
                {filtered.map(log => (
                  <tr
                    key={log.id}
                    className="hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] transition-colors"
                  >
                    <td className="py-3.5 px-4 text-[11px] text-[#A0ACA1] whitespace-nowrap">
                      {formatDateTime(log.timestamp)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {log.actor_name}
                      </div>
                      <div className="text-[10px] text-brand-primary">
                        {log.actor_role}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                      {log.action}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#131814] border border-[#303A31] text-[#A0ACA1]">
                        {log.entity}
                      </span>
                      <div className="text-[10px] text-[#A0ACA1] font-mono mt-0.5">
                        {log.entity_id}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#A0ACA1] max-w-xs leading-snug">
                      {log.reason || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold tabular-nums text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                      {log.amount_paise ? formatPaise(log.amount_paise) : '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#A0ACA1]">
                      {log.ip_address}
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

