import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gate-access/ui';

export default function IntegrationsSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>Connect with external services and marketing pixels.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">Phase 7: Implementation of integration cards and pixel configuration.</p>
      </CardContent>
    </Card>
  );
}
