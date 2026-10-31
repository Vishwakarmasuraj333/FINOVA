'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Ban,
  ShieldCheck,
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  const getStyle = () => {
    switch (normalized) {
      case 'COMPLETED':
      case 'SETTLED':
      case 'CONNECTED':
      case 'RECONCILED':
      case 'BALANCED':
      case 'ACTIVE':
      case 'VERIFIED':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200',
          icon: CheckCircle2,
          label: normalized,
        };
      case 'PENDING':
      case 'PENDING_APPROVAL':
      case 'PROCESSING':
      case 'SCHEDULED':
      case 'IN_TRANSIT':
      case 'DRAFT':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 light:bg-amber-50 light:text-amber-700 light:border-amber-200',
          icon: Clock,
          label: normalized.replace('_', ' '),
        };
      case 'FAILED':
      case 'REJECTED':
      case 'NOT_CONNECTED':
      case 'FROZEN':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400 light:bg-rose-50 light:text-rose-700 light:border-rose-200',
          icon: XCircle,
          label: normalized.replace('_', ' '),
        };
      case 'REVERSED':
      case 'REFUNDED':
      case 'PARTIALLY_REFUNDED':
        return {
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400 light:bg-blue-50 light:text-blue-700 light:border-blue-200',
          icon: RefreshCw,
          label: normalized.replace('_', ' '),
        };
      case 'DISCREPANCY':
      case 'UNRECONCILED':
      case 'DEGRADED':
        return {
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-400 light:bg-purple-50 light:text-purple-700 light:border-purple-200',
          icon: AlertTriangle,
          label: normalized.replace('_', ' '),
        };
      default:
        return {
          bg: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/30',
          icon: ShieldCheck,
          label: normalized,
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold tracking-wider uppercase rounded-full border ${style.bg} ${sizeClasses}`}
    >
      <Icon size={size === 'sm' ? 11 : 13} className="shrink-0" />
      <span>{style.label}</span>
    </span>
  );
}

