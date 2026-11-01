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

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navGroups: NavGroup[] = [
    {
      group: 'EXECUTIVE & CONTROL',
      items: [
        { label: 'Financial Overview', href: '/dashboard', icon: LayoutDashboard },
        { 
          label: 'Analytics', 
          href: '/analytics', 
          icon: LineChart,
        },
        { 
          label: 'Financial Summary', 
          href: '/admin/financial-summary', 
          icon: Sparkles, 
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
        <div className={`flex items-center h-16 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF] ${isCollapsed ? 'justify-center px-2 relative' : 'justify-between px-4'}`}>
          {!isCollapsed ? (
            <BrandLogo size="md" href="/dashboard" />
          ) : (
            <BrandLogo size="sm" href="/dashboard" iconOnly className="justify-center" />
          )}

          <div className="flex items-center gap-1">
            {/* Desktop collapse toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`${isCollapsed ? 'absolute -right-3 top-5 w-6 h-6 rounded-full bg-[#1A211B] border border-[#303A31] text-[#A0ACA1] hover:text-brand-primary z-20 flex items-center justify-center shadow-md' : 'hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#1A211B] dark:hover:bg-[#1A211B] light:hover:bg-[#F0F4EE] transition-colors'}`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={16} />}
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
              {!isCollapsed ? (
                <p className="px-3 text-[10px] font-bold tracking-wider text-[#A0ACA1]/70 uppercase mb-1">
                  {group.group}
                </p>
              ) : (
                <div className="w-6 h-px bg-[#303A31]/60 mx-auto my-2" />
              )}
              {group.items.map(item => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`group flex items-center transition-all ${
                      isCollapsed
                        ? 'justify-center w-10 h-10 mx-auto rounded-xl'
                        : 'gap-3 px-3 py-2 rounded-xl text-xs font-medium'
                    } ${
                      isActive
                        ? 'bg-brand-primary text-black font-semibold shadow-xs'
                        : 'text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#1A211B] dark:hover:bg-[#1A211B] dark:text-[#A0ACA1] dark:hover:text-[#F4F7F1] light:text-[#687568] light:hover:text-[#192219] light:hover:bg-[#F0F4EE]'
                    }`}
                    title={item.label}
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

        {/* Clean Minimalist Footer */}
        <div className="px-4 py-3 border-t border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF] flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center justify-between w-full text-[11px] text-[#A0ACA1]">
              <span className="font-medium text-[#F4F7F1]">FINOVA Enterprise</span>
              <span className="font-mono text-[10px] text-[#687568]">v3.0</span>
            </div>
          ) : (
            <button
              onClick={() => setIsCollapsed(false)}
              className="mx-auto w-7 h-7 rounded-lg flex items-center justify-center text-[#A0ACA1] hover:text-brand-primary hover:bg-[#1A211B] transition-colors"
              title="Expand FINOVA Sidebar"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
