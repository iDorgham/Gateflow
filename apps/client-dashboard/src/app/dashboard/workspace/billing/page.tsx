import { redirect } from 'next/navigation';

export default function BillingRedirect() {
  redirect('/dashboard/settings?tab=billing');
}
