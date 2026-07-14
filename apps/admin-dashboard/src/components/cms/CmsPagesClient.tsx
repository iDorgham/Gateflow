'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Input,
  Card,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@gateflow/ui';
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  Copy,
  Trash2,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { TemplatePicker } from './templates/template-picker';
import { useRouter } from 'next/navigation';
import { PageTemplate } from './templates/page-templates';

export function CmsPagesClient({
  initialPages,
}: {
  initialPages: {
    id: string;
    title: string;
    slug: string;
    status: string;
    author: { name: string };
    updatedAt: string;
  }[];
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [pages, setPages] = useState(initialPages);
  const [search, setSearch] = useState('');
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);

  const handleSelectTemplate = (template: PageTemplate) => {
    setIsTemplatePickerOpen(false);
    // In a real app, this would call an API to create the page
    // For now, we redirect to the editor with template info
    router.push(`/en/cms/pages/new?template=${template.id}`);
  };

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ds-text">
            {t('cms:pages.title', 'Pages')}
          </h1>
          <p className="text-ds-text-subtle mt-1">
            {t(
              'cms:pages.subtitle',
              'Manage your website pages and content structure.'
            )}
          </p>
        </div>
        <Button
          onClick={() => setIsTemplatePickerOpen(true)}
          className="gap-2 bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90"
        >
          <Plus className="h-4 w-4" />
          {t('cms:pages.create', 'Create New Page')}
        </Button>
      </div>

      <TemplatePicker
        isOpen={isTemplatePickerOpen}
        onClose={() => setIsTemplatePickerOpen(false)}
        onSelect={handleSelectTemplate}
      />

      <Card className="border-ds-border shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-ds-border flex items-center justify-between bg-ds-surface-subtle">
            <div className="relative w-full max-w-sm">
              <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-icon-subtle" />
              <Input
                placeholder={t('cms:pages.search', 'Search pages...')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ltr:pl-9 rtl:pr-9 bg-ds-surface border-ds-border"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-ds-text-subtle font-medium">
              <span>{filteredPages.length} Pages</span>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-ds-surface-subtle">
              <TableRow className="border-ds-border hover:bg-transparent">
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-ds-text-subtle"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="h-8 w-8 text-ds-icon-subtlest" />
                      <p>No pages found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPages.map((page) => (
                  <TableRow key={page.id} className="border-ds-border group">
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell className="text-ds-text-subtle text-sm">
                      {page.slug}
                    </TableCell>
                    <TableCell>
                      {page.status === 'published' ? (
                        <Badge
                          variant="default"
                          className="bg-ds-background-success text-ds-text-success font-bold px-2.5 py-0.5 rounded-md"
                        >
                          Published
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-ds-background-neutral text-ds-text-subtle font-bold px-2.5 py-0.5 rounded-md"
                        >
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-ds-text-subtle text-sm">
                      {page.author.name}
                    </TableCell>
                    <TableCell className="text-ds-text-subtle text-sm">
                      {format(new Date(page.updatedAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[160px] border-ds-border shadow-md"
                        >
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Edit className="h-4 w-4 text-ds-icon-subtle" />{' '}
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Eye className="h-4 w-4 text-ds-icon-subtle" />{' '}
                            Preview
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
