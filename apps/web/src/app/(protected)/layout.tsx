'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { FullScreenLoader } from '@/components/layout/full-screen-loader';

/**
 * Route guard: every screen under this layout requires an authenticated user.
 * Consent and masking are enforced server-side too; this guard only affects UX.
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <FullScreenLoader />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
