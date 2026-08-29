'use client';

import { useAuth } from '@/providers/auth-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ConsumerDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user?.displayName}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your verified identity summary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Name:</span>{' '}
            {user?.displayName}
          </p>
          <p>
            <span className="text-muted-foreground">Email:</span>{' '}
            {user?.maskedEmail}
          </p>
          <p>
            <span className="text-muted-foreground">Role:</span> {user?.role}
          </p>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Sprint 1 is live: register, login, and session state via GET /me. The
        remaining portal screens build out over the next sprints.
      </p>
    </div>
  );
}
