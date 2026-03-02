import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gate-access/ui';

export default function NotificationsSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Configure your notification preferences and templates.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">Phase 8: Implementation of notification preferences and template previews.</p>
      </CardContent>
    </Card>
  );
}
