'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  Calendar,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function ReportsPage() {
  const { currentUser } = useAuth();
  const [reportType, setReportType] = useState('summary');
  const [selectedFormat, setSelectedFormat] = useState('csv');

  // Statement import state
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ count?: number; error?: string } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const sampleCsvTemplate = `external_ref,date,amount,direction,counterparty
EXT_STMT_901,2026-10-30T10:00:00Z,45000.00,credit,Flipkart Internet Pvt Ltd
EXT_STMT_902,2026-10-30T11:30:00Z,12500.00,debit,Server Hosting Facilities`;

  const handleSimulatedImport = async () => {
    setIsImporting(true);
    setImportStatus(null);
    try {
      const lines = (importText || sampleCsvTemplate).trim().split('\n');
      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 4) {
          rows.push({
            external_ref: parts[0]?.trim(),
            date: parts[1]?.trim(),
            amount: parts[2]?.trim(),
            direction: parts[3]?.trim(),
            counterparty: parts[4]?.trim() || 'Counterparty',
          });
        }
      }

      const res = await fetch('/api/imports/statements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({
          provider_id: 'prov_hdfc',
          account_id: 'acc_hdfc_primary',
          rows,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');

      setImportStatus({ count: data.imported_count });
    } catch (err: any) {
      setImportStatus({ error: err.message });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Financial Reports & Exports
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              Audited Standards
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Generate authoritative P&L ledger reports, fee schedules, tax returns, and import external bank statements.
          </p>
        </div>
      </div>

      {/* Available Report Packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold mb-3">
              <FileSpreadsheet size={18} />
            </div>
            <h3 className="font-bold text-sm text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Consolidated Balance Sheet & Control Summary
            </h3>
            <p className="text-xs text-[#A0ACA1] mt-1 leading-relaxed">
              Account-by-account breakdown of opening, posted credits, debits, fees, and closing ledger balances.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-[#303A31]">
            <a
              href="/api/export/csv?type=summary"
              download
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-primary text-black font-bold text-xs hover:bg-brand-accent transition-colors shadow-xs"
            >
              <Download size={14} />
              <span>Download Summary CSV</span>
            </a>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-3">
              <FileSpreadsheet size={18} />
            </div>
            <h3 className="font-bold text-sm text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              All Transactions Master Ledger
            </h3>
            <p className="text-xs text-[#A0ACA1] mt-1 leading-relaxed">
              Complete chronological audit trail with internal refs, external IDs, payer references, and fees.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-[#303A31]">
            <a
              href="/api/export/csv?type=transactions"
              download
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-primary text-black font-bold text-xs hover:bg-brand-accent transition-colors shadow-xs"
            >
              <Download size={14} />
              <span>Export Transactions CSV</span>
            </a>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-3">
              <FileSpreadsheet size={18} />
            </div>
            <h3 className="font-bold text-sm text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              GST & Input Tax Credit Schedule
            </h3>
            <p className="text-xs text-[#A0ACA1] mt-1 leading-relaxed">
              Deductions of 18% GST across Razorpay, Cashfree, and banking charges for filing compliance.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-[#303A31]">
            <a
              href="/api/export/csv?type=summary"
              download
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-primary text-black font-bold text-xs hover:bg-brand-accent transition-colors shadow-xs"
            >
              <Download size={14} />
              <span>Download Tax Schedule</span>
            </a>
          </div>
        </div>
      </div>

      {/* CSV Statement Ingestion Engine */}
      <div className="p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Upload size={20} className="text-brand-primary" />
            <div>
              <h2 className="text-sm font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                Bank Statement CSV Ingestion Engine
              </h2>
              <p className="text-xs text-[#A0ACA1]">
                Upload or paste external statement rows. The system verifies formatting, skips duplicates, and posts double-entry journals.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#A0ACA1] mb-1.5">
            CSV Statement Content (or use sample template below)
          </label>
          <textarea
            rows={5}
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder={sampleCsvTemplate}
            className="w-full p-3 rounded-xl bg-[#131814] border border-[#303A31] text-xs font-mono text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
          />
        </div>

        {importStatus && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              importStatus.error
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            }`}
          >
            {importStatus.error ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>
              {importStatus.error
                ? `Error: ${importStatus.error}`
                : `Successfully imported ${importStatus.count} transaction records into HDFC Primary ledger!`}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-[#A0ACA1]">
            Source: Auto-deduplicated against external reference IDs.
          </span>
          <button
            onClick={handleSimulatedImport}
            disabled={isImporting}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent transition-colors disabled:opacity-50 shadow-xs"
          >
            {isImporting ? 'Ingesting...' : 'Import Statement Rows'}
          </button>
        </div>
      </div>
    </div>
  );
}

