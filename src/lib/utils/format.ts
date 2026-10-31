export function formatPaise(
  paise: number | undefined | null,
  currency: string = 'INR',
  options: { showSymbol?: boolean; showSign?: boolean; compact?: boolean } = {}
): string {
  if (paise === undefined || paise === null || isNaN(paise)) {
    return '—';
  }

  const { showSymbol = true, showSign = false, compact = false } = options;
  const isNegative = paise < 0;
  const absPaise = Math.abs(paise);
  const rupees = absPaise / 100;

  if (compact && absPaise >= 1000000000) {
    const crores = (rupees / 10000000).toFixed(2);
    const symbol = showSymbol ? (currency === 'INR' ? '₹' : currency + ' ') : '';
    const sign = isNegative ? '-' : (showSign ? '+' : '');
    return `${sign}${symbol}${crores} Cr`;
  }
  if (compact && absPaise >= 10000000) {
    const lakhs = (rupees / 100000).toFixed(2);
    const symbol = showSymbol ? (currency === 'INR' ? '₹' : currency + ' ') : '';
    const sign = isNegative ? '-' : (showSign ? '+' : '');
    return `${sign}${symbol}${lakhs} L`;
  }

  // Format with Indian Numbering System for INR (en-IN) or en-US for others
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  const formattedNumber = rupees.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const symbol = showSymbol ? (currency === 'INR' ? '₹' : currency + ' ') : '';
  const sign = isNegative ? '-' : (showSign ? '+' : '');

  return `${sign}${symbol}${formattedNumber}`;
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function formatDateOnly(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function maskAccountNumber(acc?: string): string {
  if (!acc) return '••••';
  const clean = acc.replace(/\s+/g, '');
  if (clean.length <= 4) return clean;
  return `•••• •••• ${clean.slice(-4)}`;
}

export function maskVpa(vpa?: string): string {
  if (!vpa) return '—';
  const parts = vpa.split('@');
  if (parts.length < 2) return vpa;
  const user = parts[0];
  const handle = parts[1];
  if (user.length <= 2) return `${user}***@${handle}`;
  return `${user.slice(0, 2)}***${user.slice(-1)}@${handle}`;
}

