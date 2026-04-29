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
import { Plus, Edit, Menu as MenuIcon, Check } from 'lucide-react';
import { format } from 'date-fns';

export function CmsMenusClient({ initialMenus }: { initialMenus: any[] }) {
  const { t } = useTranslation();
  const [menus, setMenus] = useState(initialMenus);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  const handleEdit = (menu: any) => {
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
                      {format(new Date(menu.updatedAt), 'MMM d, yyyy')}
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
        <DialogContent className="sm:max-w-xl border-ds-border bg-ds-surface shadow-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedMenu?.id ? 'Edit Menu' : 'Create Menu'}
            </DialogTitle>
            <DialogDescription>
              Drag and drop navigation items to build your menu structure.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <Label>Menu Name</Label>
              <Input
                defaultValue={selectedMenu?.title}
                className="bg-ds-surface border-ds-border"
              />
            </div>

            <div className="p-8 border border-dashed border-ds-border rounded-xl bg-ds-surface-subtle text-center flex flex-col items-center justify-center">
              <MenuIcon className="h-8 w-8 text-ds-icon-subtlest mb-2" />
              <p className="text-ds-text-subtle font-medium text-sm">
                Menu Builder Canvas
              </p>
              <p className="text-ds-text-subtlest text-xs mt-1">
                This will be implemented in Phase 3.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBuilderOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => setIsBuilderOpen(false)}
              className="bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90"
            >
              <Check className="h-4 w-4 mr-2" /> Save Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
