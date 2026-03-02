import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gate-access/ui';

export default function DangerSettings() {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>High-stakes actions for your workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">Phase 9: Implementation of workspace deletion and bulk reset flows.</p>
      </CardContent>
    </Card>
  );
}
