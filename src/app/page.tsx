'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Lock,
  ExternalLink,
  Menu,
  X,
  CreditCard,
  Landmark,
  Scale,
  FileSpreadsheet,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { ProviderBadge } from '@/components/shared/ProviderBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'upi' | 'gateways' | 'banks'>('all');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const providerEcosystem = [
    {
      code: 'razorpay',
      name: 'Razorpay Gateway & Payouts',
      category: 'gateways',
      status: 'CONNECTED',
      capability: 'Payments, Payouts, Refunds & Settlements',
      lastSync: 'Live (2m ago)',
      href: '/providers',
    },
    {
      code: 'phonepe',
      name: 'PhonePe for Business',
      category: 'upi',
      status: 'CONNECTED',
      capability: 'Merchant UPI QR, Collect & Dynamic Invoicing',
      lastSync: 'Live (4m ago)',
      href: '/providers',
    },
    {
      code: 'cashfree',
      name: 'Cashfree Payments & Payouts',
      category: 'gateways',
      status: 'CONNECTED',
      capability: 'Auto-Debit Pool, Instant IMPS & Escrow',
      lastSync: 'Live (12m ago)',
      href: '/providers',
    },
    {
      code: 'gpay',
      name: 'Google Pay for Business',
      category: 'upi',
      status: 'CONNECTED',
      capability: 'Spot Payments & Authorized Merchant UPI',
      lastSync: 'Live (8m ago)',
      href: '/providers',
    },
    {
      code: 'paytm',
      name: 'Paytm Business PG',
      category: 'gateways',
      status: 'CONNECTED',
      capability: 'Merchant Settlement Rail & Wallet Clearing',
      lastSync: 'Live (15m ago)',
      href: '/providers',
    },
    {
      code: 'bhim',
      name: 'BHIM UPI NPCI Direct Switch',
      category: 'upi',
      status: 'CONNECTED',
      capability: 'Unified UPI 2.0 Settlement & Direct Debits',
      lastSync: 'Live (25m ago)',
      href: '/providers',
    },
    {
      code: 'stripe',
      name: 'Stripe Global Payments',
      category: 'gateways',
      status: 'CONNECTED',
      capability: 'Cross-Border Invoicing & Multi-Currency',
      lastSync: 'Live (5m ago)',
      href: '/providers',
    },
    {
      code: 'hdfc_bank',
      name: 'HDFC Corporate Direct Host-to-Host',
      category: 'banks',
      status: 'CONNECTED',
      capability: 'RTGS/NEFT CMS Clearing & Primary Current A/C',
      lastSync: 'Live (Just now)',
      href: '/providers',
    },
    {
      code: 'payu',
      name: 'PayU Enterprise PG',
      category: 'gateways',
      status: 'SANDBOX',
      capability: 'Card Vault & Split Settlements',
      lastSync: 'Sandbox Ready',
      href: '/providers',
    },
    {
      code: 'ccavenue',
      name: 'CCAvenue Multi-Bank Rail',
      category: 'gateways',
      status: 'SANDBOX',
      capability: 'Net-Banking Multi-Rail Aggregation',
      lastSync: 'Sandbox Ready',
      href: '/providers',
    },
    {
      code: 'paypal',
      name: 'PayPal Merchant Commerce',
      category: 'gateways',
      status: 'SANDBOX',
      capability: 'Global Buyer Protection & International Rail',
      lastSync: 'Sandbox Ready',
      href: '/providers',
    },
    {
      code: 'icici_bank',
      name: 'ICICI Corporate CIB API',
      category: 'banks',
      status: 'NOT_CONNECTED',
      capability: 'mTLS Corporate Banking Payout Host',
      lastSync: 'Requires Client Cert',
      href: '/providers',
    },
  ];

  const filteredProviders = activeTab === 'all' 
    ? providerEcosystem 
    : providerEcosystem.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-[#0D100E] text-[#F4F7F1] selection:bg-brand-primary selection:text-black overflow-x-hidden">
      {/* Sticky Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0D100E]/95 backdrop-blur-md border-b border-[#303A31] py-3.5 shadow-xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <BrandLogo size="md" showTagline />

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-medium text-[#A0ACA1]">
            <a href="#product" className="hover:text-brand-primary transition-colors">Product</a>
            <a href="#integrations" className="hover:text-brand-primary transition-colors">Integrations</a>
            <a href="#features" className="hover:text-brand-primary transition-colors">Features</a>
            <a href="#security" className="hover:text-brand-primary transition-colors">Security</a>
            <a href="#documentation" className="hover:text-brand-primary transition-colors">Documentation</a>
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#F4F7F1] hover:text-brand-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent transition-all shadow-xs"
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#A0ACA1] hover:text-[#F4F7F1]"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-4 pb-6 bg-[#131814] border-b border-[#303A31] space-y-3">
            <a
              href="#product"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#A0ACA1] hover:text-brand-primary"
            >
              Product
            </a>
            <a
              href="#integrations"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#A0ACA1] hover:text-brand-primary"
            >
              Integrations
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#A0ACA1] hover:text-brand-primary"
            >
              Features
            </a>
            <a
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#A0ACA1] hover:text-brand-primary"
            >
              Security
            </a>
            <div className="pt-3 border-t border-[#303A31] flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="w-full py-2.5 text-center text-xs font-bold rounded-xl bg-brand-primary text-black"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section (Split Screen) */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern">
        {/* Subtle ambient light */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6">
              {/* Category Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-xs font-semibold text-brand-primary">
                <Sparkles size={13} />
                <span>UNIFIED PAYMENT OPERATIONS</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F4F7F1] leading-[1.08]">
                Every Payment Platform.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[#B5F36D] to-brand-secondary">
                  One Powerful View.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-[#A0ACA1] leading-relaxed max-w-xl">
                Bring your payment records, account activity, transaction fees, refunds, and settlements together in one clear, secure financial workspace.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-extrabold bg-brand-primary text-black hover:bg-brand-accent transition-all shadow-lg hover:shadow-brand-primary/20"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/providers"
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold bg-[#1A211B] border border-[#303A31] text-[#F4F7F1] hover:border-brand-primary/40 hover:bg-[#222B23] transition-all"
                >
                  <Layers size={16} className="text-brand-primary" />
                  <span>Explore Integrations</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#303A31]/60 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs font-bold text-[#F4F7F1]">Official APIs</div>
                  <div className="text-[11px] text-[#A0ACA1] mt-0.5">Authorized business rails only</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F4F7F1]">Immutable Ledger</div>
                  <div className="text-[11px] text-[#A0ACA1] mt-0.5">Balanced double-entry math</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F4F7F1]">Zero Credential Risk</div>
                  <div className="text-[11px] text-[#A0ACA1] mt-0.5">No UPI PINs or OTPs stored</div>
                </div>
              </div>
            </div>

            {/* Right Hero Product Interface Preview */}
            <div className="lg:col-span-6 relative">
              {/* Product Preview Card */}
              <div className="relative rounded-2xl bg-[#131814] border border-[#303A31] p-5 shadow-2xl overflow-hidden animate-slide-up">
                {/* Window Chrome */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#303A31]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-[11px] font-mono text-[#A0ACA1]">
                      onepay.internal/dashboard
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-[10px] font-bold text-brand-primary">SANDBOX ACTIVE</span>
                  </div>
                </div>

                {/* Dashboard Metrics Header Preview */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3.5 rounded-xl bg-[#1A211B] border border-[#303A31]">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#A0ACA1]">
                      Total Closing Ledger
                    </span>
                    <div className="text-xl font-black text-[#F4F7F1] tabular-nums mt-1">
                      ₹59,94,830.00
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-brand-primary">
                      <TrendingUp size={12} />
                      <span>All 5 internal accounts balanced</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1A211B] border border-[#303A31]">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#A0ACA1]">
                      Inflows vs Outflows
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-emerald-400">
                        +₹7.80 L
                      </span>
                      <span className="text-xs text-[#A0ACA1]">/</span>
                      <span className="text-sm font-bold text-rose-400">
                        -₹1.40 L
                      </span>
                    </div>
                    <div className="text-[10px] text-[#A0ACA1] mt-1">
                      Net positive cash flow
                    </div>
                  </div>
                </div>

                {/* Mini Connected Rails Preview */}
                <div className="p-3 rounded-xl bg-[#1A211B] border border-[#303A31] mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#A0ACA1]">
                      Active Rails Ingestion
                    </span>
                    <span className="text-[10px] text-brand-primary font-mono">100% HEALTHY</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <ProviderBadge code="razorpay" name="Razorpay" size="sm" />
                    <ProviderBadge code="phonepe" name="PhonePe UPI" size="sm" />
                    <ProviderBadge code="hdfc_bank" name="HDFC CMS" size="sm" />
                    <ProviderBadge code="cashfree" name="Cashfree" size="sm" />
                  </div>
                </div>

                {/* Recent Transactions List Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#A0ACA1] px-1">
                    <span>Recent Live Activity</span>
                    <span>Direction & Status</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1A211B]/80 border border-[#303A31] text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                        <ArrowDownLeft size={14} />
                      </div>
                      <div>
                        <div className="font-semibold text-[#F4F7F1]">Zomato Media Pvt Ltd</div>
                        <div className="text-[10px] text-[#A0ACA1]">FIN-TXN-2026-8910 • Net Banking</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400 tabular-nums">+₹2,50,000.00</div>
                      <StatusBadge status="COMPLETED" size="sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1A211B]/80 border border-[#303A31] text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                        <ArrowDownLeft size={14} />
                      </div>
                      <div>
                        <div className="font-semibold text-[#F4F7F1]">Swiggy Bundl Tech</div>
                        <div className="text-[10px] text-[#A0ACA1]">FIN-TXN-2026-8911 • PhonePe UPI</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400 tabular-nums">+₹1,80,000.00</div>
                      <StatusBadge status="COMPLETED" size="sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1A211B]/80 border border-[#303A31] text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-md bg-rose-500/10 text-rose-400">
                        <ArrowUpRight size={14} />
                      </div>
                      <div>
                        <div className="font-semibold text-[#F4F7F1]">Vendor Cloud Infrastructure</div>
                        <div className="text-[10px] text-[#A0ACA1]">TRF-2026-0091 • Cashfree Payout</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-rose-400 tabular-nums">-₹1,10,000.00</div>
                      <StatusBadge status="COMPLETED" size="sm" />
                    </div>
                  </div>
                </div>

                {/* Footnote on preview */}
                <div className="mt-4 pt-3 border-t border-[#303A31] flex items-center justify-between text-[10px] text-[#A0ACA1]">
                  <span>Source: Authoritative Ingestion Engine</span>
                  <Link href="/transactions" className="text-brand-primary font-semibold hover:underline">
                    View Full 17-Route Suite →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Integrations Section */}
      <section id="integrations" className="py-20 border-t border-[#303A31] bg-[#131814]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                PAYMENT ECOSYSTEM
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F7F1] mt-1 tracking-tight">
                Your Payment Ecosystem. Connected.
              </h2>
              <p className="text-sm text-[#A0ACA1] mt-2 max-w-xl">
                Unified synchronization across official Indian UPI rails, enterprise payment gateways, and direct host-to-host banking pipes.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs font-semibold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'all' ? 'bg-brand-primary text-black' : 'text-[#A0ACA1] hover:text-[#F4F7F1]'
                }`}
              >
                All (12)
              </button>
              <button
                onClick={() => setActiveTab('upi')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'upi' ? 'bg-brand-primary text-black' : 'text-[#A0ACA1] hover:text-[#F4F7F1]'
                }`}
              >
                UPI Rails
              </button>
              <button
                onClick={() => setActiveTab('gateways')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'gateways' ? 'bg-brand-primary text-black' : 'text-[#A0ACA1] hover:text-[#F4F7F1]'
                }`}
              >
                Gateways
              </button>
              <button
                onClick={() => setActiveTab('banks')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'banks' ? 'bg-brand-primary text-black' : 'text-[#A0ACA1] hover:text-[#F4F7F1]'
                }`}
              >
                Banking
              </button>
            </div>
          </div>

          {/* Provider Tiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProviders.map(provider => (
              <div
                key={provider.code}
                className="p-5 rounded-2xl bg-[#1A211B] border border-[#303A31] hover:border-brand-primary/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <ProviderBadge code={provider.code} name={provider.name} />
                    <StatusBadge status={provider.status} size="sm" />
                  </div>
                  <p className="text-xs text-[#A0ACA1] leading-relaxed mb-4">
                    {provider.capability}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#303A31]/70 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#A0ACA1] font-mono">
                    {provider.lastSync}
                  </span>
                  <Link
                    href={provider.href}
                    className="inline-flex items-center gap-1 font-semibold text-brand-primary group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Integration</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Features Section */}
      <section id="features" className="py-24 border-t border-[#303A31]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
              OPERATIONAL WORKSPACE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F7F1] mt-1 tracking-tight">
              Built for Serious Financial Operations
            </h2>
            <p className="text-sm text-[#A0ACA1] mt-2">
              Every tool modern treasury teams need to reconcile statements, audit adjustments, verify transfers, and generate accurate financial summaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#131814] border border-[#303A31] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center font-bold">
                <CreditCard size={20} />
              </div>
              <h3 className="text-base font-bold text-[#F4F7F1]">Unified Transactions</h3>
              <p className="text-xs text-[#A0ACA1] leading-relaxed">
                View authorized transactions from all payment gateways, bank accounts, and UPI switches in one searchable ledger.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131814] border border-[#303A31] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center font-bold">
                <Landmark size={20} />
              </div>
              <h3 className="text-base font-bold text-[#F4F7F1]">Account Overview</h3>
              <p className="text-xs text-[#A0ACA1] leading-relaxed">
                Compare provider-reported bank balances with immutable internal ledger balances in real time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131814] border border-[#303A31] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center font-bold">
                <Scale size={20} />
              </div>
              <h3 className="text-base font-bold text-[#F4F7F1]">Statement Reconciliation</h3>
              <p className="text-xs text-[#A0ACA1] leading-relaxed">
                Automated matching engine flags missing ledger entries, rounding discrepancies, and settlement variances.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131814] border border-[#303A31] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center font-bold">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="text-base font-bold text-[#F4F7F1]">Financial Control Center</h3>
              <p className="text-xs text-[#A0ACA1] leading-relaxed">
                Consolidated balance sheet, breakdown tables, fee analysis, and audited CSV exports at /admin/financial-summary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Traceability Section */}
      <section id="security" className="py-20 border-t border-[#303A31] bg-[#131814]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 md:p-12 rounded-3xl bg-[#1A211B] border border-[#303A31] relative overflow-hidden">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 mb-4">
                <ShieldCheck size={14} />
                <span>BANK-GRADE INTEGRITY</span>
              </div>
              <h2 className="text-3xl font-extrabold text-[#F4F7F1] tracking-tight">
                Built For Compliance, Auditability & Financial Peace of Mind
              </h2>
              <p className="text-sm text-[#A0ACA1] mt-3 leading-relaxed">
                ONEPAY strictly adheres to official merchant APIs, dual-approval authorization for high-value payouts, and an immutable double-entry journal. We never store consumer wallet PINs, UPI secrets, or bank passwords.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-brand-primary shrink-0 mt-0.5" />
                  <span className="text-xs text-[#F4F7F1]">Dual authorization for transfers exceeding ₹5,00,000</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-brand-primary shrink-0 mt-0.5" />
                  <span className="text-xs text-[#F4F7F1]">5 RBAC Roles: Super Admin down to Read-only Auditor</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-brand-primary shrink-0 mt-0.5" />
                  <span className="text-xs text-[#F4F7F1]">Immutable audit trail on all adjustments and reversals</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-brand-primary shrink-0 mt-0.5" />
                  <span className="text-xs text-[#F4F7F1]">Integer paise arithmetic prevents decimal rounding bugs</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#303A31] flex flex-wrap items-center gap-4">
                <Link
                  href="/admin/financial-summary"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent transition-colors"
                >
                  Enter Master Summary
                </Link>
                <Link
                  href="/audit-logs"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#131814] border border-[#303A31] text-[#A0ACA1] hover:text-[#F4F7F1]"
                >
                  Review Audit Logs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#303A31] bg-[#0D100E] text-xs text-[#A0ACA1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandLogo size="sm" showTagline />

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/dashboard" className="hover:text-brand-primary">Dashboard</Link>
            <Link href="/transactions" className="hover:text-brand-primary">Transactions</Link>
            <Link href="/providers" className="hover:text-brand-primary">Providers</Link>
            <Link href="/accounts" className="hover:text-brand-primary">Accounts</Link>
            <Link href="/admin/financial-summary" className="hover:text-brand-primary">Financial Summary</Link>
            <Link href="/settings" className="hover:text-brand-primary">Settings</Link>
          </div>

          <div className="text-[11px] text-[#A0ACA1]/70">
            © {new Date().getFullYear()} ONEPAY Technologies Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

