import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';

export const metadata: Metadata = {
  title: {
    default: 'CrediPass Nigeria',
    template: '%s — CrediPass Nigeria',
  },
  description:
    'Consent-first Credit Passport for Nigerian consumers and SMEs. Identity verification, cashflow analysis, and explainable risk decision support.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
