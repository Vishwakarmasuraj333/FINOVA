import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { Shell } from '@/components/layout/Shell';

export const metadata: Metadata = {
  title: 'ONEPAY — Unified Payments & Financial Operations',
  description: 'All Your Payments. One Clear View. Enterprise-grade unified payment management and financial control center.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased selection:bg-brand-primary selection:text-black">
        <ThemeProvider>
          <AuthProvider>
            <Shell>{children}</Shell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

