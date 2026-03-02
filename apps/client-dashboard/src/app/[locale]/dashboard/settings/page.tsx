import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gate-access/ui';

export default function GeneralSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage your profile and general workspace preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">Phase 2: Implementation of settings fields and forms.</p>
      </CardContent>
    </Card>
  );
}
