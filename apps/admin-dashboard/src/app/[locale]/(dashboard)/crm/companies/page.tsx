'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Plus,
  Globe,
  MapPin,
  Users,
  TrendingUp,
  MoreVertical,
  Briefcase,
  ChevronRight,
  ExternalLink,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  Badge,
  Skeleton,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@gateflow/ui';

interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  size: string;
  website: string;
  activeDeals: number;
  totalValue: string;
  logo?: string;
  health: 'STABLE' | 'GROWING' | 'AT_RISK';
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock fetch for companies
    setTimeout(() => {
      setCompanies([
        {
          id: '1',
          name: 'Al Rimal Developments',
          industry: 'Real Estate',
          location: 'Dubai, UAE',
          size: '500-1000',
          website: 'rimal.ae',
          activeDeals: 3,
          totalValue: '$1.2M',
          health: 'GROWING',
        },
        {
          id: '2',
          name: 'Global Tech Solutions',
          industry: 'Technology',
          location: 'London, UK',
          size: '1000+',
          website: 'globaltech.com',
          activeDeals: 1,
          totalValue: '$450K',
          health: 'STABLE',
        },
        {
          id: '3',
          name: 'Dubai Holding',
          industry: 'Investment',
          location: 'Dubai, UAE',
          size: '5000+',
          website: 'dubaiholding.com',
          activeDeals: 5,
          totalValue: '$4.8M',
          health: 'GROWING',
        },
        {
          id: '4',
          name: 'Rossi Luxury Villas',
          industry: 'Hospitality',
          location: 'Milan, Italy',
          size: '50-200',
          website: 'villas.it',
          activeDeals: 2,
          totalValue: '$820K',
          health: 'AT_RISK',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <Building2 className="h-8 w-8 text-ds-icon-brand" />
            Organizations
          </h1>
          <p className="text-xs font-bold text-ds-text-subtler uppercase tracking-widest mt-1">
            Structural entities and enterprise nodes within the regional cluster
          </p>
        </div>

        <Button className="h-11 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2 px-6 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Register Organization
        </Button>
      </div>

      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtler" />
        <Input
          placeholder="Search by organization name or vertical..."
          className="pl-10 h-11 text-xs font-bold border-ds-border bg-card/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))
        ) : filteredCompanies.length === 0 ? (
          <div className="col-span-full p-20 text-center opacity-30">
            <Building2 className="h-16 w-16 mx-auto mb-4" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">
              Zero structural nodes matching query
            </p>
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <Card
              key={company.id}
              className="border-ds-border bg-card/40 backdrop-blur-md group hover:border-ds-border-brand/40 transition-all duration-300 relative overflow-hidden border-dashed"
            >
              <div
                className={cn(
                  'absolute top-0 left-0 w-1.5 h-full',
                  company.health === 'GROWING'
                    ? 'bg-emerald-500'
                    : company.health === 'STABLE'
                      ? 'bg-ds-background-brand-bold'
                      : 'bg-rose-500'
                )}
              />

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 rounded-xl border border-border/30">
                      <AvatarFallback className="bg-muted text-ds-text font-black text-sm">
                        {company.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-black uppercase tracking-tight group-hover:text-ds-text-brand transition-colors">
                        {company.name}
                      </h3>
                      <p className="text-[10px] font-bold text-ds-text-subtler uppercase tracking-widest">
                        {company.industry}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-ds-text-subtler"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 border-ds-border shadow-xl"
                    >
                      <DropdownMenuItem className="gap-2 font-bold text-xs uppercase tracking-tight py-2.5">
                        <Briefcase className="h-3.5 w-3.5" /> Manage Deals
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 font-bold text-xs uppercase tracking-tight py-2.5">
                        <Users className="h-3.5 w-3.5" /> View Team
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 font-bold text-xs uppercase tracking-tight py-2.5">
                        <Globe className="h-3.5 w-3.5" /> Visit Site
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-ds-text-subtler uppercase tracking-widest opacity-60">
                      Location
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                      <MapPin className="h-3 w-3 text-ds-text-brand" />{' '}
                      {company.location}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-ds-text-subtler uppercase tracking-widest opacity-60">
                      Enterprise Size
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Users className="h-3 w-3 text-ds-text-brand" />{' '}
                      {company.size}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/30 border border-border/20 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-ds-text-subtler uppercase tracking-widest opacity-60 flex items-center gap-1">
                      <Target className="h-3 w-3" /> Pipeline Value
                    </p>
                    <p className="text-lg font-black">{company.totalValue}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] uppercase tracking-widest px-2 h-5">
                    {company.activeDeals} Active Deals
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        company.health === 'GROWING'
                          ? 'bg-emerald-500 animate-pulse'
                          : company.health === 'STABLE'
                            ? 'bg-ds-background-brand-bold'
                            : 'bg-rose-500'
                      )}
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                      {company.health.replace('_', ' ')}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    className="h-8 gap-1.5 text-[10px] font-black uppercase tracking-widest group-hover:bg-ds-background-brand-subtle group-hover:text-ds-text-brand transition-all"
                  >
                    Entity Specs <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
