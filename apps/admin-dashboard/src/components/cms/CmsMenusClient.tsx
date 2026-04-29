'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  Label,
} from '@gateflow/ui';
import { Plus, Edit, Menu as MenuIcon, Check, Globe, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { MenuBuilder } from './menus/menu-builder';
import { MenuPreview } from './menus/menu-preview';
import { MenuItem } from './menus/menu-item-row';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@gateflow/ui';

interface MenuData {
  id?: string;
  title: string;
  locations: string[];
  items: number;
  updatedAt?: string;
}

export function CmsMenusClient({ initialMenus }: { initialMenus: MenuData[] }) {
  const { t } = useTranslation();
  const [menus, setMenus] = useState(initialMenus);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuData | null>(null);

  const handleEdit = (menu: MenuData) => {
    setSelectedMenu(menu);
    setIsBuilderOpen(true);
  };

  const handleCreate = () => {
    setSelectedMenu({ title: 'New Menu', locations: [], items: 0 });
    setIsBuilderOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ds-text">
            {t('cms:menus.title', 'Navigation Menus')}
          </h1>
          <p className="text-ds-text-subtle mt-1">
            {t(
              'cms:menus.subtitle',
              'Manage navigation links across your website.'
            )}
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="gap-2 bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90"
        >
          <Plus className="h-4 w-4" />
          {t('cms:menus.create', 'Create Menu')}
        </Button>
      </div>

      <Card className="border-ds-border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-ds-surface-subtle">
              <TableRow className="border-ds-border hover:bg-transparent">
                <TableHead className="w-[300px]">Menu Name</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menus.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-ds-text-subtle"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <MenuIcon className="h-8 w-8 text-ds-icon-subtlest" />
                      <p>No menus found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                menus.map((menu) => (
                  <TableRow key={menu.id} className="border-ds-border group">
                    <TableCell className="font-medium">{menu.title}</TableCell>
                    <TableCell>
                      <div className="flex gap-1.5 flex-wrap">
                        {menu.locations.map((loc: string) => (
                          <Badge
                            key={loc}
                            variant="outline"
                            className="bg-ds-surface border-ds-border text-ds-text-subtle font-medium px-2 py-0"
                          >
                            {loc}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-ds-text-subtle font-medium">
                      {menu.items} links
                    </TableCell>
                    <TableCell className="text-ds-text-subtle text-sm">
                      {format(
                        new Date(menu.updatedAt as string),
                        'MMM d, yyyy'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(menu)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
        <DialogContent className="sm:max-w-7xl border-ds-border bg-ds-surface shadow-2xl h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-ds-border shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                  {selectedMenu?.id
                    ? `Edit: ${selectedMenu.title}`
                    : 'Create Navigation Menu'}
                </DialogTitle>
                <DialogDescription>
                  Architect your website navigation with multi-language support
                  and live preview.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-ds-background-brand-subtle text-ds-text-brand border border-ds-border-brand/30 rounded-md text-xs font-bold uppercase tracking-widest">
                <Globe className="h-3 w-3" /> Navigation Core
              </div>
            </div>
          </DialogHeader>

          <Tabs
            defaultValue="builder"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-6 border-b border-ds-border bg-ds-surface-subtle/50">
              <TabsList className="bg-transparent border-0 gap-4">
                <TabsTrigger
                  value="builder"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-ds-border-brand rounded-none px-0 pb-2 text-xs font-bold uppercase tracking-wider"
                >
                  <MenuIcon className="h-4 w-4 mr-2" /> Builder
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-ds-border-brand rounded-none px-0 pb-2 text-xs font-bold uppercase tracking-wider"
                >
                  <Eye className="h-4 w-4 mr-2" /> Live Preview
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent
                value="builder"
                className="h-full m-0 p-6 overflow-y-auto bg-ds-surface-sunken/30"
              >
                <div className="max-w-4xl mx-auto">
                  <div className="mb-6 space-y-2">
                    <Label className="text-xs font-bold uppercase text-ds-text-subtle">
                      Menu Label
                    </Label>
                    <Input
                      defaultValue={selectedMenu?.title}
                      placeholder="e.g. Main Navigation"
                      className="bg-ds-surface border-ds-border h-10 font-medium"
                    />
                  </div>
                  <MenuBuilder
                    initialItems={[]} // In real app, load from menu items
                    onSave={async (items) => {
                      console.log('Saving items:', items);
                      setIsBuilderOpen(false);
                    }}
                  />
                </div>
              </TabsContent>
              <TabsContent
                value="preview"
                className="h-full m-0 p-6 overflow-y-auto bg-ds-surface-sunken"
              >
                <div className="max-w-6xl mx-auto">
                  <MenuPreview items={[]} />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="p-6 border-t border-ds-border bg-ds-surface shrink-0">
            <Button variant="outline" onClick={() => setIsBuilderOpen(false)}>
              Discard Changes
            </Button>
            <Button
              onClick={() => setIsBuilderOpen(false)}
              className="bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90 px-8"
            >
              <Check className="h-4 w-4 mr-2" /> Finalize Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
