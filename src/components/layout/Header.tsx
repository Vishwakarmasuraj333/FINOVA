'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Laptop,
  Shield,
  ChevronDown,
  RefreshCw,
  CheckCircle2,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/lib/auth/AuthContext';
import { UserRole } from '@/types';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
}

export function Header({ onOpenMobileSidebar, onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { currentUser, allUsers, switchRole, logout } = useAuth();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTimestamp, setSyncTimestamp] = useState('Just now');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncTimestamp('Just now');
    }, 700);
  };

  // Generate breadcrumb title
  const getBreadcrumbTitle = () => {
    if (pathname === '/dashboard') return 'Financial Overview';
    if (pathname === '/analytics') return 'Analytics & Fund Flows';
    if (pathname === '/admin/financial-summary') return 'Financial Summary';
    if (pathname === '/transactions') return 'All Transactions Ledger';
    if (pathname === '/providers') return 'Payment Providers & Rails';
    if (pathname === '/payment-methods') return 'Payment Methods & Integrations';
    if (pathname === '/accounts') return 'Bank & Settlement Accounts';
    if (pathname === '/transfers') return 'Fund Transfer Management';
    if (pathname === '/credits') return 'Incoming Credits & Inflows';
    if (pathname === '/debits') return 'Outgoing Debits & Payouts';
    if (pathname === '/charges') return 'Fees, Rates & GST Taxes';
    if (pathname === '/refunds') return 'Refund Requests & Status';
    if (pathname === '/settlements') return 'Provider Settlements & Payouts';
    if (pathname === '/reconciliation') return 'Ledger & Statement Reconciliation';
    if (pathname === '/customers') return 'Customer Directory & KYC';
    if (pathname === '/reports') return 'Financial Reports & Exports';
    if (pathname === '/audit-logs') return 'Administrative Activity History';
    if (pathname === '/users') return 'Staff & Role Permissions';
    if (pathname === '/settings') return 'Application & Security Settings';
    return 'Console';
  };

  const availableRoles: UserRole[] = [
    'Super Admin',
    'Finance Admin',
    'Finance Operator',
    'Approver',
    'Read-only Auditor',
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF] bg-[#0D100E]/90 dark:bg-[#0D100E]/90 light:bg-[#FFFFFF]/90 backdrop-blur-md">
      {/* Left Area: Mobile Trigger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#1A211B] dark:hover:bg-[#1A211B] light:hover:bg-[#F0F4EE]"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-xs font-semibold text-brand-primary">FINOVA</span>
          <span className="hidden sm:inline-block text-[#303A31] dark:text-[#303A31] light:text-[#E1E8DF]">/</span>
          <h1 className="text-sm font-semibold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] truncate">
            {getBreadcrumbTitle()}
          </h1>
        </div>
      </div>

      {/* Right Area: Search, Sync, Role Switcher, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Command / Quick Search Bar */}
        <button
          onClick={onOpenSearch}
          className="flex items-center justify-between w-36 sm:w-56 md:w-68 lg:w-80 px-3.5 py-2 rounded-xl bg-[#141A15] border border-[#303A31] dark:bg-[#141A15] dark:border-[#303A31] light:bg-[#F4F8F3] light:border-[#D5DFD3] text-xs text-[#A0ACA1] hover:text-[#F4F7F1] dark:hover:text-[#F4F7F1] light:hover:text-[#192219] hover:border-brand-primary/50 transition-all shadow-xs group"
          title="Global Financial Search (⌘K)"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search size={15} className="text-[#A0ACA1] group-hover:text-brand-primary transition-colors shrink-0" />
            <span className="truncate text-xs font-medium">Search txns, accounts, UTR...</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded-md bg-[#1C251E] dark:bg-[#1C251E] light:bg-white border border-[#303A31] dark:border-[#303A31] light:border-[#D5DFD3] text-[#A0ACA1] shadow-2xs font-semibold">
              ⌘K
            </kbd>
          </div>
        </button>

        {/* Manual Data Sync Trigger */}
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="p-1.5 rounded-lg text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#1A211B] dark:hover:bg-[#1A211B] light:hover:bg-[#F0F4EE] transition-colors"
          title={`Data Freshness: ${syncTimestamp}. Click to sync.`}
        >
          <RefreshCw size={16} className={isSyncing ? 'animate-spin text-brand-primary' : ''} />
        </button>

        {/* Role Switcher Dropdown (Allows instant switching to verify RBAC) */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-[#F8FAF7] light:border-[#E1E8DF] text-xs font-medium text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] hover:border-brand-primary/40 transition-colors"
          >
            <Shield size={13} className="text-brand-primary shrink-0" />
            <span className="hidden lg:inline">{currentUser.role}</span>
            <ChevronDown size={12} className="text-[#A0ACA1]" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] shadow-xl py-1.5 z-50">
              <div className="px-3 py-1.5 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF] text-[10px] font-bold text-[#A0ACA1] uppercase">
                Switch Active Role
              </div>
              {availableRoles.map(role => (
                <button
                  key={role}
                  onClick={() => {
                    switchRole(role);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                    currentUser.role === role
                      ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                      : 'text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] light:text-[#192219]'
                  }`}
                >
                  <span>{role}</span>
                  {currentUser.role === role && <CheckCircle2 size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            className="p-2 rounded-lg text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#1A211B] dark:hover:bg-[#1A211B] light:hover:bg-[#F0F4EE] transition-colors"
            title="Theme settings"
          >
            {resolvedTheme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {isThemeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 rounded-xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] shadow-xl py-1 z-50">
              <button
                onClick={() => {
                  setTheme('dark');
                  setIsThemeDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs ${
                  theme === 'dark' ? 'text-brand-primary font-semibold' : 'text-[#A0ACA1] hover:text-[#F4F7F1]'
                }`}
              >
                <Moon size={14} /> Dark
              </button>
              <button
                onClick={() => {
                  setTheme('light');
                  setIsThemeDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs ${
                  theme === 'light' ? 'text-brand-primary font-semibold' : 'text-[#A0ACA1] hover:text-[#F4F7F1]'
                }`}
              >
                <Sun size={14} /> Light
              </button>
              <button
                onClick={() => {
                  setTheme('system');
                  setIsThemeDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs ${
                  theme === 'system' ? 'text-brand-primary font-semibold' : 'text-[#A0ACA1] hover:text-[#F4F7F1]'
                }`}
              >
                <Laptop size={14} /> System
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-lg text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#1A211B] dark:hover:bg-[#1A211B] light:hover:bg-[#F0F4EE] transition-colors"
            title="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-primary" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
                <span className="text-xs font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">Notifications</span>
                <span className="text-[10px] text-brand-primary font-semibold">2 New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-[#131814] dark:bg-[#131814] light:bg-[#F8FAF7]">
                  <p className="font-semibold text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">High-Value Transfer Pending</p>
                  <p className="text-[11px] text-[#A0ACA1] mt-0.5">TRF-2026-0092 (₹7,50,000) awaits dual approval.</p>
                </div>
                <div className="p-2 rounded-lg bg-[#131814] dark:bg-[#131814] light:bg-[#F8FAF7]">
                  <p className="font-semibold text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">Weekly Reconciliation Complete</p>
                  <p className="text-[11px] text-[#A0ACA1] mt-0.5">140 transactions matched across Razorpay Escrow.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Sign Out Dropdown */}
        <div className="relative pl-2 border-l border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#1A211B] dark:hover:bg-[#1A211B] light:hover:bg-[#F0F4EE] transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary font-bold text-xs border border-brand-primary/40">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[#A0ACA1] leading-tight flex items-center gap-1">
                {currentUser.role}
                <ChevronDown size={10} />
              </span>
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] shadow-2xl py-2 z-50">
              <div className="px-4 py-2.5 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
                <p className="text-xs font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-[#A0ACA1] truncate">{currentUser.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                  <Shield size={10} />
                  <span>{currentUser.role}</span>
                </div>
              </div>

              <div className="p-1 space-y-0.5">
                <a
                  href="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] rounded-lg transition-colors"
                >
                  <SettingsIcon size={14} />
                  <span>Corporate Settings & Security</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors text-left font-semibold"
                >
                  <LogOut size={14} />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

