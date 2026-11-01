'use client';

import React from 'react';
import { IntegrationStatusType } from '@/lib/branding/PaymentBrandRegistry';

interface IntegrationStatusBadgeProps {
  status: IntegrationStatusType | string;
  size?: 'xs' | 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export function IntegrationStatusBadge({
  status,
  size = 'sm',
  showDot = true,
  className = '',
}: IntegrationStatusBadgeProps) {
  const normalized = (status || '').toUpperCase();

  const config: Record<
    string,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    CONNECTED: {
      label: 'Verified Live',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400',
    },
    CONFIGURED_NOT_VERIFIED: {
      label: 'Configured — Unverified',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      dot: 'bg-amber-400',
    },
    SANDBOX: {
      label: 'Sandbox Active',
      bg: 'bg-sky-500/10',
      text: 'text-sky-400',
      border: 'border-sky-500/30',
      dot: 'bg-sky-400',
    },
    NEEDS_SETUP: {
      label: 'Needs Setup',
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      dot: 'bg-orange-400',
    },
    TEMPORARILY_UNAVAILABLE: {
      label: 'Degraded / Maint',
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      dot: 'bg-rose-400',
    },
    DISCONTINUED: {
      label: 'Discontinued / Historic',
      bg: 'bg-zinc-700/20',
      text: 'text-zinc-400',
      border: 'border-zinc-700/40',
      dot: 'bg-zinc-500',
    },
    NOT_SUPPORTED: {
      label: 'Not Supported',
      bg: 'bg-zinc-800/20',
      text: 'text-zinc-500',
      border: 'border-zinc-800/40',
      dot: 'bg-zinc-600',
    },
  };

  const current = config[normalized] || {
    label: normalized.replace(/_/g, ' '),
    bg: 'bg-zinc-700/20',
    text: 'text-zinc-400',
    border: 'border-zinc-700/40',
    dot: 'bg-zinc-500',
  };

  const sizeClass =
    size === 'xs'
      ? 'text-[9px] px-1.5 py-0.5'
      : size === 'sm'
      ? 'text-[10px] px-2 py-0.5'
      : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${current.bg} ${current.text} ${current.border} ${sizeClass} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${current.dot} ${
            normalized === 'CONNECTED' ? 'animate-pulse' : ''
          }`}
        />
      )}
      <span>{current.label}</span>
    </span>
  );
}
