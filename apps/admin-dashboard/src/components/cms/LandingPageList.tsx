'use client';

import * as React from 'react';
import { 
  Monitor, 
  Plus, 
  Search, 
  MoreHorizontal, 
  ExternalLink, 
  Eye, 
  Trash2,
  Rocket,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  Button,
  Input,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn
} from '@gate-access/ui';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface LandingPage {
  id: string;
  slug: string;
  titleEn: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED';
  updatedAt: string;
}

interface LandingPageListProps {
  initialPages: LandingPage[];
  locale: string;
  orgId: string;
}

export function LandingPageList({ initialPages, locale, orgId }: LandingPageListProps) {
  const [search, setSearch] = React.useState('');
  
  const filteredPages = initialPages.filter(p => 
    p.titleEn.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <Monitor className="w-6 h-6 text-blue-500" />
            Landing Pages
          </h2>
          <p className="text-sm text-ds-text-subtle">
            Manage your organization's high-conversion marketing pages.
          </p>
        </div>
        <Link href={`/${locale}/organizations/${orgId}/cms/pages/new`}>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 gap-2 h-11 px-6 font-bold uppercase tracking-wider text-xs">
            <Plus className="w-4 h-4" />
            Create with AI
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-text-subtle" />
          <Input 
            placeholder="Search pages by title or slug..."
            className="pl-10 h-11 bg-white border-ds-border/40"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.map((page) => (
          <Card key={page.id} className="group border-ds-border/40 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all overflow-hidden bg-white">
            <div className="h-32 bg-slate-50 border-b border-ds-border/40 relative flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10" />
               <Monitor className="w-12 h-12 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute top-3 right-3">
                 <Badge 
                   className={cn(
                     "text-[9px] font-black uppercase tracking-widest px-2 py-0.5",
                     page.status === 'PUBLISHED' ? "bg-green-500/10 text-green-600 border-green-500/20" :
                     page.status === 'IN_REVIEW' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                     "bg-slate-500/10 text-slate-600 border-slate-500/20"
                   )}
                 >
                   {page.status}
                 </Badge>
               </div>
            </div>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-sm mb-1 group-hover:text-blue-600 transition-colors">{page.titleEn}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-ds-text-subtle font-mono">
                    <ExternalLink className="w-3 h-3" />
                    /{page.slug}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="gap-2">
                      <Eye className="w-4 h-4" /> View Live
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Rocket className="w-4 h-4 text-green-500" /> Publish
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-red-600">
                      <Trash2 className="w-4 h-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-ds-border/40">
                <div className="flex items-center gap-1.5 text-[10px] text-ds-text-subtle">
                  <Clock className="w-3 h-3" />
                  {new Date(page.updatedAt).toLocaleDateString()}
                </div>
                <Link href={`/${locale}/organizations/${orgId}/cms/pages/${page.id}`}>
                  <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest border-ds-border/40 hover:bg-slate-50">
                    Edit Page
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPages.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 bg-slate-50/50 rounded-3xl border-2 border-dashed border-ds-border/40">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-ds-border/40 flex items-center justify-center mx-auto">
              <Monitor className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <h3 className="font-bold">No landing pages found</h3>
              <p className="text-sm text-ds-text-subtle max-w-xs mx-auto">
                Get started by creating your first AI-generated landing page to drive more leads.
              </p>
            </div>
            <Link href={`/${locale}/organizations/${orgId}/cms/pages/new`}>
              <Button variant="outline" className="gap-2 border-ds-border/40">
                <Plus className="w-4 h-4" />
                Create New Page
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
