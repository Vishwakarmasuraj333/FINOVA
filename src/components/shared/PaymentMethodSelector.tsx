'use client';

import React, { useState, useMemo } from 'react';
import {
  PAYMENT_BRAND_REGISTRY,
  PaymentBrandMeta,
  PaymentCategory,
} from '@/lib/branding/PaymentBrandRegistry';
import { PaymentBrandIcon } from './PaymentBrandIcon';
import { IntegrationStatusBadge } from './IntegrationStatusBadge';
import { Search, ChevronDown, Check } from 'lucide-react';

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (brandCode: string) => void;
  filterCategory?: PaymentCategory;
  includeDiscontinued?: boolean;
  className?: string;
}

export function PaymentMethodSelector({
  value,
  onChange,
  filterCategory,
  includeDiscontinued = false,
  className = '',
}: PaymentMethodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(filterCategory || 'ALL');

  const allBrands = useMemo(() => {
    return Object.values(PAYMENT_BRAND_REGISTRY).filter((b) => {
      if (!includeDiscontinued && b.status === 'DISCONTINUED') return false;
      return true;
    });
  }, [includeDiscontinued]);

  const filteredBrands = useMemo(() => {
    return allBrands.filter((brand) => {
      const matchesSearch =
        brand.name.toLowerCase().includes(search.toLowerCase()) ||
        brand.shortName.toLowerCase().includes(search.toLowerCase()) ||
        brand.code.toLowerCase().includes(search.toLowerCase());

      const matchesCat = activeCategory === 'ALL' || brand.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [allBrands, search, activeCategory]);

  const selectedBrand = PAYMENT_BRAND_REGISTRY[value] || allBrands[0];

  return (
    <div className={`relative ${className}`}>
      {/* Selected trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#141A15] border border-[#303A31] hover:border-brand-primary/40 text-left transition-colors"
      >
        <div className="flex items-center gap-2.5">
          {selectedBrand && <PaymentBrandIcon code={selectedBrand.code} size="sm" />}
          <div>
            <div className="text-xs font-semibold text-[#F4F7F1]">
              {selectedBrand?.shortName || 'Select Payment Rail'}
            </div>
            <div className="text-[10px] text-[#A0ACA1]">
              {selectedBrand?.typeLabel || 'Routing Switch'}
            </div>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-[#A0ACA1] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 p-3 rounded-xl bg-[#0D100E] border border-[#303A31] shadow-2xl backdrop-blur-xl max-h-96 flex flex-col">
          {/* Search bar */}
          <div className="relative mb-2">
            <Search size={14} className="absolute left-2.5 top-2.5 text-[#687568]" />
            <input
              type="text"
              placeholder="Search UPI, Wallets, Banks, Cards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#141A15] border border-[#303A31] text-xs text-[#F4F7F1] placeholder-[#687568] focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* Category Tabs */}
          {!filterCategory && (
            <div className="flex gap-1 overflow-x-auto pb-2 mb-2 border-b border-[#303A31]/60 scrollbar-none">
              {['ALL', 'UPI', 'WALLET', 'GATEWAY', 'BANK', 'CARD_NETWORK'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/40'
                      : 'text-[#A0ACA1] hover:text-[#F4F7F1]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* List of brands */}
          <div className="overflow-y-auto space-y-1 pr-1 flex-1">
            {filteredBrands.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#687568]">No payment rails found</div>
            ) : (
              filteredBrands.map((brand) => {
                const isSelected = brand.code === value;
                return (
                  <button
                    key={brand.code}
                    type="button"
                    onClick={() => {
                      onChange(brand.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-brand-primary/10 border border-brand-primary/30'
                        : 'hover:bg-[#1A211B]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <PaymentBrandIcon code={brand.code} size="sm" />
                      <div className="text-left">
                        <div className="text-xs font-medium text-[#F4F7F1] flex items-center gap-1.5">
                          {brand.shortName}
                          <span className="text-[9px] font-mono text-[#687568]">
                            {brand.category}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#A0ACA1] line-clamp-1">
                          {brand.typeLabel}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <IntegrationStatusBadge status={brand.status} size="xs" />
                      {isSelected && <Check size={14} className="text-brand-primary" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
