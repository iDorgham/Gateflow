import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gate-access/ui';

export default function ResidentsSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Units & Residents Settings</CardTitle>
        <CardDescription>Configure unit types and resident quotas.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">Phase 4: Implementation of quota management and resident defaults.</p>
      </CardContent>
    </Card>
  );
}
