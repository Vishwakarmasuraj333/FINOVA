'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  Landmark,
  ArrowLeftRight,
  CreditCard,
  FileSpreadsheet,
  X,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNavItems = [
    { label: 'Financial Operations Overview', href: '/dashboard', category: 'Executive', icon: Sparkles },
    { label: 'Financial Control Center (Consolidated)', href: '/admin/financial-summary', category: 'Executive', icon: Sparkles },
    { label: 'Treasury Analytics & Payment Topology', href: '/analytics', category: 'Executive', icon: Sparkles },
    { label: 'Unified Transactions Ledger', href: '/transactions', category: 'Operations', icon: ArrowLeftRight },
    { label: 'Fund Transfers & Dual Approval', href: '/transfers', category: 'Operations', icon: ArrowRight },
    { label: 'Refunds & Returns Management', href: '/refunds', category: 'Operations', icon: ArrowLeftRight },
    { label: 'Settlements & Payout Tracking', href: '/settlements', category: 'Operations', icon: ArrowRight },
    { label: 'Payment Providers & Rails (41 Rails)', href: '/providers', category: 'Rails', icon: CreditCard },
    { label: 'Bank & Settlement Accounts', href: '/accounts', category: 'Treasury', icon: Landmark },
    { label: 'Charges, Fees & Statutory GST', href: '/charges', category: 'Treasury', icon: Landmark },
    { label: 'Statement Reconciliation & Ledger Matching', href: '/reconciliation', category: 'Audit', icon: FileSpreadsheet },
    { label: 'Customer Directory & Accounts', href: '/customers', category: 'Management', icon: UserCheck },
    { label: 'Financial Audit Logs & Trail', href: '/audit-logs', category: 'Audit', icon: FileSpreadsheet },
    { label: 'Staff & Role-Based Permissions', href: '/users', category: 'Admin', icon: UserCheck },
    { label: 'Corporate Settings & Security', href: '/settings', category: 'Admin', icon: Landmark },
  ];

  const filtered = quickNavItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const navigateTo = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] shadow-2xl overflow-hidden animate-slide-up">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
          <Search size={20} className="text-[#A0ACA1] shrink-0" />
          <input
            type="text"
            placeholder="Search transactions, accounts, providers, or jump to page... (ESC to close)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] placeholder-[#A0ACA1] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#A0ACA1] hover:text-[#F4F7F1] dark:hover:text-[#F4F7F1] light:hover:text-[#192219]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results / Navigation */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-[#A0ACA1]">
            Navigation & Actions
          </div>
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#A0ACA1]">
              No matching pages or records found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigateTo(item.href)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-[#131814] dark:bg-[#131814] light:bg-[#E1E8DF]/50 text-brand-primary dark:text-brand-primary light:text-brand-primary-light">
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="font-medium">{item.label}</span>
                      <span className="ml-2 text-[10px] text-[#A0ACA1]">
                        in {item.category}
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-[#A0ACA1] group-hover:text-brand-primary transition-transform group-hover:translate-x-1"
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#131814] dark:bg-[#131814] light:bg-[#F8FAF7] border-t border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF] text-[10px] text-[#A0ACA1]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#1A211B] border border-[#303A31] font-mono">↵</kbd> Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#1A211B] border border-[#303A31] font-mono">ESC</kbd> Close
            </span>
          </div>
          <span className="font-semibold text-brand-primary dark:text-brand-primary light:text-brand-primary-light">
            FINOVA Unified Search
          </span>
        </div>
      </div>
    </div>
  );
}

