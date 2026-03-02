import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gate-access/ui';

export default function RBACSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles & Permissions</CardTitle>
        <CardDescription>Configure granular access control for your team.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">Phase 5: Implementation of permission matrix and session management.</p>
      </CardContent>
    </Card>
  );
}
