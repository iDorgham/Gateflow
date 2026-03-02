import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gate-access/ui';

export default function TeamSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Settings</CardTitle>
        <CardDescription>Manage team members and invitations.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">Phase 5: Implementation of team roster and invitation flow.</p>
      </CardContent>
    </Card>
  );
}
