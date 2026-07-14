'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MoreVertical,
  Mail,
  Phone,
  Building2,
  Sparkles,
  ChevronRight,
  ArrowUpDown,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  Button,
  Input,
  Card,
  CardContent,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@gateflow/ui';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'LEAD' | 'QUALIFIED' | 'CUSTOMER' | 'ARCHIVED';
  score: number;
  avatar?: string;
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Mock fetch for contacts
    setTimeout(() => {
      setContacts([
        {
          id: '1',
          name: 'Ahmed Mansour',
          email: 'ahmed@rimal.ae',
          company: 'Al Rimal Developments',
          status: 'QUALIFIED',
          score: 92,
          createdAt: '2026-04-20T10:00:00Z',
        },
        {
          id: '2',
          name: 'Sarah Jenkins',
          email: 'sarah@globaltech.com',
          company: 'Global Tech Solutions',
          status: 'LEAD',
          score: 45,
          createdAt: '2026-04-25T14:30:00Z',
        },
        {
          id: '3',
          name: 'Omar Khalid',
          email: 'omar@dubaiholding.com',
          company: 'Dubai Holding',
          status: 'CUSTOMER',
          score: 100,
          createdAt: '2025-11-12T09:15:00Z',
        },
        {
          id: '4',
          name: 'Elena Rossi',
          email: 'elena@villas.it',
          company: 'Rossi Luxury Villas',
          status: 'LEAD',
          score: 78,
          createdAt: '2026-04-28T16:45:00Z',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === 'all' || c.status.toLowerCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-ds-icon-brand" />
            CRM Contacts
          </h1>
          <p className="text-xs font-bold text-ds-text-subtler uppercase tracking-widest mt-1">
            Managing neural relationship nodes across the GateFlow ecosystem
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="h-11 border-ds-border gap-2 text-[10px] font-black uppercase tracking-widest px-4"
          >
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button
            variant="outline"
            className="h-11 border-ds-border gap-2 text-[10px] font-black uppercase tracking-widest px-4"
          >
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="h-11 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2 px-6 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> Add Contact
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-muted/50 border border-border/50 p-1 h-11">
            <TabsTrigger
              value="all"
              className="px-4 text-[10px] font-black uppercase tracking-widest"
            >
              All Nodes
            </TabsTrigger>
            <TabsTrigger
              value="lead"
              className="px-4 text-[10px] font-black uppercase tracking-widest"
            >
              Leads
            </TabsTrigger>
            <TabsTrigger
              value="qualified"
              className="px-4 text-[10px] font-black uppercase tracking-widest text-emerald-500"
            >
              Qualified
            </TabsTrigger>
            <TabsTrigger
              value="customer"
              className="px-4 text-[10px] font-black uppercase tracking-widest text-primary"
            >
              Customers
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtler" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10 h-11 text-xs font-bold border-ds-border bg-card/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-ds-border bg-card/40 backdrop-blur-md overflow-hidden border-dashed">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/30 bg-muted/20">
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtler">
                  <div className="flex items-center gap-2">
                    Contact <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtler">
                  Organization
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtler">
                  Status
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtler text-center">
                  AI Score
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtler">
                  Lifecycle
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtler"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {isLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="p-4">
                        <Skeleton className="h-12 w-full rounded-xl" />
                      </td>
                    </tr>
                  ))
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center opacity-40">
                    <Users className="h-12 w-12 mx-auto mb-4 text-ds-icon-disabled" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                      No synchronization nodes found
                    </p>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="group hover:bg-ds-background-brand-subtle/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border/30 shadow-sm">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback className="bg-ds-background-brand-bold text-ds-icon-inverse font-black text-xs">
                            {contact.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black text-ds-text group-hover:text-ds-text-brand transition-colors truncate">
                            {contact.name}
                          </span>
                          <span className="text-[10px] font-bold text-ds-text-subtler truncate">
                            {contact.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-ds-text-subtle">
                        <Building2 className="h-3.5 w-3.5 opacity-40" />
                        {contact.company || 'Private Node'}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[8px] font-black uppercase tracking-widest px-2 h-5 border-none',
                          contact.status === 'QUALIFIED'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : contact.status === 'CUSTOMER'
                              ? 'bg-ds-background-brand-subtle text-ds-text-brand'
                              : 'bg-muted/50 text-ds-text-subtler'
                        )}
                      >
                        {contact.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-noise border border-border/30 shadow-sm">
                        <Sparkles
                          className={cn(
                            'h-3 w-3',
                            contact.score > 80
                              ? 'text-amber-500'
                              : 'text-ds-icon-disabled'
                          )}
                        />
                        <span className="text-xs font-black">
                          {contact.score}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-ds-text-subtle">
                          <Clock className="h-3 w-3 opacity-40" />
                          Joined{' '}
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </div>
                        <Progress
                          value={contact.score}
                          className="h-1 bg-muted"
                        />
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-ds-text-subtler hover:text-ds-text"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 border-ds-border shadow-xl"
                        >
                          <DropdownMenuItem className="gap-2 font-bold text-xs uppercase tracking-tight py-2.5">
                            <ChevronRight className="h-3.5 w-3.5 text-ds-text-brand" />{' '}
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 font-bold text-xs uppercase tracking-tight py-2.5">
                            <Mail className="h-3.5 w-3.5 text-ds-text-subtler" />{' '}
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 font-bold text-xs uppercase tracking-tight py-2.5 text-rose-500">
                            <XCircle className="h-3.5 w-3.5" /> Archive Node
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('w-full h-2 rounded-full overflow-hidden', className)}>
      <div
        className="h-full bg-ds-background-brand-bold transition-all duration-1000"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function XCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
