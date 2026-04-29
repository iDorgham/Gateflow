'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Input,
  Card,
  CardContent,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@gateflow/ui';
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Eye,
  Copy,
  Trash2,
  Rocket,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';

export function CmsLandingPagesClient({
  initialPages,
}: {
  initialPages: any[];
}) {
  const { t } = useTranslation();
  const [pages, setPages] = useState(initialPages);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.campaign.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ds-text">
            {t('cms:landing_pages.title', 'Landing Pages')}
          </h1>
          <p className="text-ds-text-subtle mt-1">
            {t(
              'cms:landing_pages.subtitle',
              'Build and manage high-converting campaign pages.'
            )}
          </p>
        </div>
        <Button className="gap-2 bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90">
          <Plus className="h-4 w-4" />
          {t('cms:landing_pages.create', 'Create Landing Page')}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-ds-surface-subtle p-4 rounded-2xl border border-ds-border">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-icon-subtle" />
          <Input
            placeholder={t(
              'cms:landing_pages.search',
              'Search campaigns or titles...'
            )}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ltr:pl-9 rtl:pr-9 bg-ds-surface border-ds-border"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px] bg-ds-surface border-ds-border">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPages.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-ds-text-subtle border border-dashed border-ds-border rounded-2xl">
            <Rocket className="h-10 w-10 text-ds-icon-subtlest mb-3" />
            <p>No landing pages found.</p>
          </div>
        ) : (
          filteredPages.map((page) => (
            <Card
              key={page.id}
              className="overflow-hidden border-ds-border shadow-sm group hover:border-ds-border-selected transition-colors"
            >
              <div className="aspect-[16/9] w-full relative bg-ds-surface-sunken border-b border-ds-border flex items-center justify-center overflow-hidden">
                {/* Placeholder for thumbnail */}
                {page.thumbnail ? (
                  <img
                    src={page.thumbnail}
                    alt={page.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-ds-background-neutral to-ds-background-neutral-subtle flex items-center justify-center">
                    <Rocket className="h-8 w-8 text-ds-icon-subtlest opacity-50" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  {page.status === 'published' && (
                    <Badge className="bg-ds-background-success-bold text-ds-text-inverse font-bold shadow-sm">
                      Active
                    </Badge>
                  )}
                  {page.status === 'draft' && (
                    <Badge className="bg-ds-surface-raised text-ds-text font-bold shadow-sm border border-ds-border">
                      Draft
                    </Badge>
                  )}
                  {page.status === 'archived' && (
                    <Badge className="bg-ds-background-neutral text-ds-text-subtle font-bold shadow-sm">
                      Archived
                    </Badge>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 shadow-md"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 shadow-md"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <h3
                      className="font-bold text-ds-text truncate"
                      title={page.title}
                    >
                      {page.title}
                    </h3>
                    <p className="text-xs text-ds-text-subtle truncate mt-1">
                      Campaign: {page.campaign}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mt-1 -mr-2 text-ds-icon-subtle hover:text-ds-icon"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-[160px] border-ds-border shadow-md"
                    >
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Edit className="h-4 w-4 text-ds-icon-subtle" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Eye className="h-4 w-4 text-ds-icon-subtle" /> View
                        Live
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Copy className="h-4 w-4 text-ds-icon-subtle" />{' '}
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-ds-border" />
                      <DropdownMenuItem className="gap-2 cursor-pointer text-ds-text-danger focus:text-ds-text-danger focus:bg-ds-background-danger">
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-4 pt-4 border-t border-ds-border/50 flex items-center justify-between text-xs text-ds-text-subtlest">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(page.updatedAt), 'MMM d, yyyy')}
                  </span>
                  <span className="font-medium">
                    {page.visits.toLocaleString()} views
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
