import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gate-access/ui';

export default function GatesSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gates & Scanners</CardTitle>
        <CardDescription>Manage gate locations and scanner rules.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">Phase 6: Implementation of gate management and scanner rule syncing.</p>
      </CardContent>
    </Card>
  );
}
