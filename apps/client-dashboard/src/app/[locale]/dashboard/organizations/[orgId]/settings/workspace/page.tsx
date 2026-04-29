import { requireAuth } from '@/lib/dashboard-auth';
import { WorkspaceSettingsForm } from '@/components/settings/workspace-form';

export default async function WorkspaceSettings() {
  const { org } = await requireAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <WorkspaceSettingsForm 
        initialData={org ? {
          id: org.id,
          name: org.name,
          adminEmail: org.email,
        } : undefined} 
      />
    </div>
  );
}

