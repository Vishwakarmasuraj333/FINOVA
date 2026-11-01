'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Mail,
  Lock,
  User as UserIcon,
  ShieldCheck,
  ArrowRight,
  FileText,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Briefcase,
  Hash,
} from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { useAuth } from '@/lib/auth/AuthContext';
import { UserRole } from '@/types';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [orgName, setOrgName] = useState('');
  const [entityType, setEntityType] = useState('PVT_LTD');
  const [pan, setPan] = useState('');
  const [gstin, setGstin] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Finance Admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError('Please accept the FINOVA Master Services Agreement and RBI compliance terms.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await signup({
        name,
        email,
        role,
        orgName,
        pan,
        gstin,
      });

      if (res.success) {
        router.push('/dashboard');
      } else {
        setError(res.error || 'Failed to register entity.');
      }
    } catch (err: any) {
      setError(err?.message || 'Onboarding error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D100E] text-[#F4F7F1] flex flex-col justify-between selection:bg-brand-primary selection:text-black">
      {/* Top Bar */}
      <header className="border-b border-[#303A31]/70 px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <BrandLogo size="md" showTagline />
        </Link>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-[#A0ACA1] hidden sm:inline">Already registered?</span>
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-lg border border-[#303A31] text-[#F4F7F1] hover:border-brand-primary/50 hover:text-brand-primary transition-all font-semibold"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
          <div className="p-6 sm:p-10 rounded-2xl bg-[#131814] border border-[#303A31] shadow-2xl relative">
            <div className="mb-8 space-y-2 border-b border-[#303A31] pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                <ShieldCheck size={14} />
                <span>Corporate Onboarding Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F7F1]">
                Register New Enterprise Entity
              </h1>
              <p className="text-xs sm:text-sm text-[#A0ACA1]">
                Set up your treasury accounts, UPI switch gateways, and role-based access control.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION 1: ENTITY INFO */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={14} />
                  <span>Corporate Entity Information</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A0ACA1]">Legal Entity Name</label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={e => setOrgName(e.target.value)}
                      placeholder="Registered corporate legal entity name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:border-brand-primary focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A0ACA1]">Constitution of Business</label>
                    <select
                      value={entityType}
                      onChange={e => setEntityType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:border-brand-primary focus:outline-hidden"
                    >
                      <option value="PVT_LTD">Private Limited Company</option>
                      <option value="PUBLIC_LTD">Public Limited Company</option>
                      <option value="LLP">Limited Liability Partnership (LLP)</option>
                      <option value="FINTECH">Regulated FinTech / NBFC</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A0ACA1]">Corporate PAN</label>
                    <div className="relative">
                      <Hash size={14} className="absolute left-3.5 top-3 text-[#A0ACA1]" />
                      <input
                        type="text"
                        required
                        value={pan}
                        onChange={e => setPan(e.target.value.toUpperCase())}
                        maxLength={10}
                        placeholder="ABCDE1234F"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs font-mono uppercase text-[#F4F7F1] focus:border-brand-primary focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A0ACA1]">GSTIN (State Registered)</label>
                    <div className="relative">
                      <Hash size={14} className="absolute left-3.5 top-3 text-[#A0ACA1]" />
                      <input
                        type="text"
                        required
                        value={gstin}
                        onChange={e => setGstin(e.target.value.toUpperCase())}
                        maxLength={15}
                        placeholder="27ABCDE1234F1Z5"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs font-mono uppercase text-[#F4F7F1] focus:border-brand-primary focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PRIMARY SIGNATORY */}
              <div className="space-y-4 pt-4 border-t border-[#303A31]">
                <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider flex items-center gap-2">
                  <UserIcon size={14} />
                  <span>Primary Signatory / Treasury Controller</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A0ACA1]">Signatory Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Authorized signatory full legal name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:border-brand-primary focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A0ACA1]">Corporate Email</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-3 text-[#A0ACA1]" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="corporate.signatory@company.com"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:border-brand-primary focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A0ACA1]">Initial Administrative Tier</label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as UserRole)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:border-brand-primary focus:outline-hidden"
                    >
                      <option value="Super Admin">Super Admin (Full Administrative Authority)</option>
                      <option value="Finance Admin">Finance Admin (Treasury & Reconciliations)</option>
                      <option value="Approver">Approver (Dual Signatory Authorizer)</option>
                      <option value="Finance Operator">Finance Operator (Transfers & Billing)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A0ACA1]">Security Password</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-3 text-[#A0ACA1]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Create strong corporate password"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:border-brand-primary focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-[#A0ACA1] hover:text-[#F4F7F1]"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4].map(level => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            strength >= level ? 'bg-brand-primary' : 'bg-[#303A31]'
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-[#A0ACA1] pl-1">
                        {strength <= 1 ? 'Weak' : strength <= 3 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: COMPLIANCE CHECK */}
              <div className="p-4 rounded-xl bg-[#1A211B] border border-[#303A31] space-y-3">
                <label className="flex items-start gap-3 cursor-pointer text-xs text-[#A0ACA1] hover:text-[#F4F7F1]">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={e => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded-sm bg-[#131814] border-[#303A31] text-brand-primary focus:ring-0"
                  />
                  <span>
                    I certify that I am an authorized corporate signatory for <strong>{orgName.trim() || 'your corporate entity'}</strong> and accept the FINOVA Master Services Agreement, Data Privacy Policy, and RBI Payout & Settlement Guidelines.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-primary text-black font-extrabold text-sm hover:bg-brand-accent transition-all shadow-lg shadow-brand-primary/15 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Provisioning Corporate Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Onboarding & Launch Dashboard</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#303A31]/70 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A0ACA1] gap-2">
        <p>© 2026 FINOVA Financial Technologies Ltd. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>RBI Licensed Payment Switch Gateway</span>
          <span>•</span>
          <span>ISO/IEC 27001:2022 Certified</span>
        </div>
      </footer>
    </div>
  );
}
