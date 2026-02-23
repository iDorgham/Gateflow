import { redirect } from 'next/navigation';

// Root → always redirect to the protected dashboard
export default function Home() {
  redirect('/dashboard');
}
