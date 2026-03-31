import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  backHref?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, backHref, action }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          {backHref ? (
            <Link href={backHref} className="rounded-full p-2 transition-colors hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
          ) : null}
          <h1 className="truncate text-xl font-bold text-slate-900">{title}</h1>
        </div>
        {action ? <div className="ms-3">{action}</div> : null}
      </div>
    </header>
  );
}
