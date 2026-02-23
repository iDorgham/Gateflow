import { redirect } from 'next/navigation';

export default function ProjectsRedirect() {
  redirect('/dashboard/settings?tab=projects');
}
