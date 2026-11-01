'use client';

import React from 'react';
import { PaymentBrandMeta } from '@/lib/branding/PaymentBrandRegistry';
import { PaymentBrandIcon } from './PaymentBrandIcon';
import { IntegrationStatusBadge } from './IntegrationStatusBadge';
import { ExternalLink, Play, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface PaymentMethodCardProps {
  brand: PaymentBrandMeta;
  onSelect?: (brand: PaymentBrandMeta) => void;
  onTestPayment?: (brand: PaymentBrandMeta) => void;
  className?: string;
}

export function PaymentMethodCard({
  brand,
  onSelect,
  onTestPayment,
  className = '',
}: PaymentMethodCardProps) {
  const isDiscontinued = brand.status === 'DISCONTINUED' || brand.isDiscontinued;

  return (
    <div
      onClick={() => onSelect?.(brand)}
      className={`group relative flex flex-col justify-between p-4 rounded-xl bg-[#141A15] border border-[#303A31] hover:border-brand-primary/50 transition-all duration-200 shadow-sm ${
        isDiscontinued ? 'opacity-70 bg-[#101411]' : ''
      } ${className}`}
    >
      <div>
        {/* Top Header: Logo + Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <PaymentBrandIcon code={brand.code} size="lg" />
            <div>
              <h4 className="text-sm font-semibold text-[#F4F7F1] group-hover:text-brand-primary transition-colors flex items-center gap-1.5">
                {brand.shortName}
                {brand.officialWebsite && (
                  <a
                    href={brand.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#687568] hover:text-[#A0ACA1] transition-colors"
                    title="Official Merchant Portal"
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
              </h4>
              <p className="text-[11px] text-[#A0ACA1] line-clamp-1">{brand.typeLabel}</p>
            </div>
          </div>
          <IntegrationStatusBadge status={brand.status} size="xs" />
        </div>

        {/* Operational Note if legacy or unverified */}
        {brand.operationalNote && (
          <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-[#1A211B] border border-[#303A31] text-[10px] text-[#A0ACA1] flex items-start gap-1.5 leading-relaxed">
            {isDiscontinued ? (
              <ShieldAlert size={12} className="text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 size={12} className="text-brand-primary shrink-0 mt-0.5" />
            )}
            <span>{brand.operationalNote}</span>
          </div>
        )}

        {/* Supported operations tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {brand.supportedOperations.map((op) => (
            <span
              key={op}
              className="px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider bg-[#1A211B] border border-[#303A31] text-[#A0ACA1]"
            >
              {op}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Action */}
      <div className="pt-2 border-t border-[#303A31]/50 flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#687568] uppercase tracking-wider">
          {brand.category} • {brand.environment}
        </span>
        {!isDiscontinued && onTestPayment && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTestPayment(brand);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold text-brand-primary hover:bg-brand-primary/10 border border-brand-primary/30 transition-colors"
          >
            <Play size={10} className="fill-current" />
            Test Rail
          </button>
        )}
      </div>
    </div>
  );
}
