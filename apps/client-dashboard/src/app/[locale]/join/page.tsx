import { validateInvitation } from './actions';
import { JoinClient } from './join-client';
import { notFound } from 'next/navigation';

interface JoinPageProps {
  params: { locale: string };
  searchParams: { token?: string };
}

export default async function JoinPage({
  params,
  searchParams,
}: JoinPageProps) {
  const { token } = searchParams;
  if (!token) return notFound();

  const result = await validateInvitation(token);
  if (!result.success || !result.data) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-black uppercase tracking-tight text-destructive">
          Invalid Link
        </h1>
        <p className="mt-2 text-muted-foreground">
          {result.error || 'This invitation link is invalid or has expired.'}
        </p>
        <a
          href="/login"
          className="mt-6 text-sm font-bold text-primary hover:underline"
        >
          Back to Login
        </a>
      </div>
    );
  }

  return (
    <JoinClient
      token={token}
      email={result.data.email}
      orgName={result.data.orgName}
      locale={params.locale}
    />
  );
}
