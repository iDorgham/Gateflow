import { redirect } from 'next/navigation';

export default function WorkspaceSettingsRedirect() {
  redirect('/dashboard/settings?tab=workspace');
}
