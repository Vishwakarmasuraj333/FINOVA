'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  CreditCard,
  SendHorizontal,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  RotateCcw,
  BadgePercent,
  Scale,
  Users2,
  FileSpreadsheet,
  ShieldAlert,
  UserCog,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  Network,
  GitFork,
  LineChart,
  X,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navGroups = [
    {
      group: 'EXECUTIVE & CONTROL',
      items: [
        { label: 'Financial Overview', href: '/dashboard', icon: LayoutDashboard },
        { 
          label: 'Real Analytics & Flows', 
          href: '/analytics', 
          icon: LineChart,
          badge: 'LIVE FLOW',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        },
        { 
          label: 'Financial Summary', 
          href: '/admin/financial-summary', 
          icon: Sparkles, 
          badge: 'CONSOLIDATED',
          badgeColor: 'bg-brand-primary/20 text-brand-primary border-brand-primary/30' 
        },
      ],
    },
    {
      group: 'TRANSACTIONS & OPERATIONS',
      items: [
        { label: 'Unified Transactions', href: '/transactions', icon: ArrowLeftRight },
        { label: 'Fund Transfers', href: '/transfers', icon: SendHorizontal },
        { label: 'Refunds & Returns', href: '/refunds', icon: RotateCcw },
        { label: 'Settlements', href: '/settlements', icon: Receipt },
      ],
    },
    {
      group: 'RAILS & TREASURY',
      items: [
        { label: 'Payment Providers', href: '/providers', icon: CreditCard },
        { label: 'Bank & Accounts', href: '/accounts', icon: Landmark },
        { label: 'Charges & Taxes', href: '/charges', icon: BadgePercent },
        { label: 'Reconciliation', href: '/reconciliation', icon: Scale },
      ],
    },
    {
      group: 'MANAGEMENT & AUDIT',
      items: [
        { label: 'Customers', href: '/customers', icon: Users2 },
        { label: 'Financial Reports', href: '/reports', icon: FileSpreadsheet },
        { label: 'Audit Logs', href: '/audit-logs', icon: ShieldAlert },
        { label: 'Staff & Roles', href: '/users', icon: UserCog },
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out border-r
          bg-[#131814] border-[#303A31] dark:bg-[#131814] dark:border-[#303A31]
          light:bg-[#FFFFFF] light:border-[#E1E8DF]
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
          {!isCollapsed ? (
            <BrandLogo size="md" href="/dashboard" />
          ) : (
            <div className="mx-auto">
              <BrandLogo size="sm" href="/dashboard" className="justify-center" />
            </div>
          )}

          <div className="flex items-center gap-1">
            {/* Desktop collapse toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#1A211B] dark:hover:bg-[#1A211B] light:hover:bg-[#F0F4EE] transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Mobile Close X button */}
            <button
              onClick={onMobileClose}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#1A211B] transition-colors"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold tracking-wider text-[#A0ACA1]/70 uppercase mb-1">
                  {group.group}
                </p>
              )}
              {group.items.map(item => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-primary text-black font-semibold shadow-xs'
                        : 'text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#1A211B] dark:hover:bg-[#1A211B] dark:text-[#A0ACA1] dark:hover:text-[#F4F7F1] light:text-[#687568] light:hover:text-[#192219] light:hover:bg-[#F0F4EE]'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      size={18}
                      className={`shrink-0 ${
                        isActive
                          ? 'text-black'
                          : 'text-[#A0ACA1] group-hover:text-brand-primary dark:text-[#A0ACA1] dark:group-hover:text-brand-primary light:group-hover:text-brand-primary-light'
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase border ${
                          isActive
                            ? 'bg-black/20 text-black border-black/30'
                            : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info: Live Switch Engine */}
        <div className="p-3 border-t border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
          {!isCollapsed ? (
            <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-[#0D100E] border border-[#303A31] dark:bg-[#0D100E] dark:border-[#303A31] light:bg-[#F6F8F4] light:border-[#E1E8DF]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE SWITCH ACTIVE
                </span>
                <span className="text-[10px] text-[#A0ACA1] font-mono">FINOVA v3.0</span>
              </div>
              <p className="text-[10px] text-[#A0ACA1] leading-tight">
                Production multi-rail routing. Double-entry ledger verified.
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="FINOVA Live Switch Active" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
