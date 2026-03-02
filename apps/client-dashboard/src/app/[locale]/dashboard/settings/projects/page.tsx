import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gate-access/ui';

export default function ProjectsSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects Settings</CardTitle>
        <CardDescription>Manage projects and gate assignments.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">Phase 3: Implementation of project CRUD and resource mapping.</p>
      </CardContent>
    </Card>
  );
}
