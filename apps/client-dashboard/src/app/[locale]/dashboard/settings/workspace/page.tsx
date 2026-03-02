import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gate-access/ui';

export default function WorkspaceSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace Settings</CardTitle>
        <CardDescription>Configure workspace branding and basic information.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">Phase 2: Implementation of workspace branding and organization API integration.</p>
      </CardContent>
    </Card>
  );
}
