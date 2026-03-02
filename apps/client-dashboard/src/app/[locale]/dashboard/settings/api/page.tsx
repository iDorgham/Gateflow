import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gate-access/ui';

export default function APISettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API & Webhooks</CardTitle>
        <CardDescription>Manage API keys and outgoing webhooks.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">Phase 7: Implementation of API key management and webhook setup.</p>
      </CardContent>
    </Card>
  );
}
