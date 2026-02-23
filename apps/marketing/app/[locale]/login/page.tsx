import type { Metadata } from 'next';
import { Button } from '@gate-access/ui';
import { Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '../../../i18n-config';

export const metadata: Metadata = {
  title: 'Sign In | GateFlow',
  description: 'Access the GateFlow administration dashboard.',
};

export default function LoginPage({ params: { locale } }: { params: { locale: Locale } }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center container px-6 text-center">
      <div className="bg-primary/10 text-primary p-4 rounded-3xl mb-8">
        <Shield size={48} />
      </div>
      
      <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-6">
        Ready to <span className="text-primary italic">Authorize</span>?
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-md mx-auto mb-10">
        You are being redirected to our secure administration portal. 
        Please have your organization access key ready.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="h-14 px-8 rounded-xl font-bold bg-slate-900 text-white hover:bg-black" asChild>
          <Link href="https://app.gateflow.com/login">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="h-14 px-8 rounded-xl font-semibold" asChild>
          <Link href={`/${locale}/contact`}>Need Help?</Link>
        </Button>
      </div>
      
      <p className="mt-12 text-sm text-muted-foreground">
        © {new Date().getFullYear()} GateFlow Enterprise Access. <br />
        Secure SSO integration available for port-level partners.
      </p>
    </div>
  );
}
