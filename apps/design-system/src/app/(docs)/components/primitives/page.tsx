'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { useLocale } from '../../../../components/providers/LocaleProvider';
import { translations } from '../../../../lib/translations';
import {
  Button,
  Input,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Switch,
  Label,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Skeleton,
} from '@gateflow/ui';
import { GalleryItem } from '../../../../components/gallery/GalleryItem';
import { Mail, Settings, Search, Plus, CheckCircle2 } from 'lucide-react';

export default function PrimitivesPage() {
  const { locale, isRTL } = useLocale();
  const t = translations[locale as keyof typeof translations].pages.components;

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title={isRTL ? 'العناصر الأساسية' : 'Primitives'}
        subtitle={
          isRTL ? 'عناصر واجهة المستخدم الأساسية من @gateflow/ui.' : t.subtitle
        }
        packageName="@gateflow/ui"
        breadcrumbs={[
          { label: isRTL ? 'التوثيق' : 'Documentation', href: '/' },
          { label: isRTL ? 'المكونات' : 'Components', href: '/components' },
          { label: isRTL ? 'العناصر الأساسية' : 'Primitives' },
        ]}
      />

      <section className="flex flex-col gap-4">
        <GalleryItem
          title="Button"
          description="Interactive buttons for triggers and actions. Supports multiple variants and sizes."
          packageName="@gateflow/ui"
          code={`import { Button } from '@gateflow/ui';
import { Mail } from 'lucide-react';

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
      <Button variant="default" size="sm">Small</Button>
      <Button variant="default" size="lg" className="gap-2">
        <Mail size={16} /> Icon Button
      </Button>
    </div>
  );
}`}
          properties={[
            {
              name: 'variant',
              type: "'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'",
              default: 'default',
              description: 'Visual style of the button.',
            },
            {
              name: 'size',
              type: "'default' | 'sm' | 'lg' | 'icon' | 'icon-sm'",
              default: 'default',
              description: 'Padding and font-size variant.',
            },
            {
              name: 'loading',
              type: 'boolean',
              default: 'false',
              description: 'Shows a loading spinner.',
            },
            {
              name: 'asChild',
              type: 'boolean',
              default: 'false',
              description:
                'Change the default rendered element for the one passed as a child.',
            },
          ]}
        >
          <div className="flex flex-wrap gap-4 justify-center items-center max-w-xl">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button variant="default" size="sm">
              Small
            </Button>
            <Button
              variant="default"
              size="lg"
              className="rounded-xl gap-2 font-black uppercase tracking-tight h-12 px-6"
            >
              <Mail size={16} /> Icon Button
            </Button>
          </div>
        </GalleryItem>

        <GalleryItem
          title="Input"
          description="A standard text input field for form data. Optimized for high contrast and accessibility."
          packageName="@gateflow/ui"
          code={`import { Input } from '@gateflow/ui';
import { Search } from 'lucide-react';

export default function Demo() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <Input placeholder="Enter your email" />
      <div className="relative group">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search records..." className="pl-9" />
      </div>
      <Input disabled placeholder="Disabled state" />
    </div>
  );
}`}
        >
          <div className="w-full max-w-sm flex flex-col gap-4">
            <Input
              placeholder="Enter your email"
              className="rounded-xl border-[var(--ds-border-subtle)] bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-glass)] h-11"
            />
            <div className="relative group">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ds-text-subtlest)]"
              />
              <Input
                placeholder="Search records..."
                className="pl-10 rounded-xl border-[var(--ds-border-subtle)] bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-glass)] h-11"
              />
            </div>
            <Input
              disabled
              placeholder="Disabled state"
              className="rounded-xl border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)] h-11"
            />
          </div>
        </GalleryItem>

        <GalleryItem
          title="Badge"
          description="Small status indicators and tags. Used for labels, counts, and statuses."
          packageName="@gateflow/ui"
          code={`import { Badge } from '@gateflow/ui';

export default function Demo() {
  return (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  );
}`}
          properties={[
            {
              name: 'variant',
              type: "'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info'",
              default: 'default',
              description: 'Visual status variant.',
            },
          ]}
        >
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge className="rounded-lg uppercase font-black tracking-tight text-[10px] px-2 py-1">
              New Feature
            </Badge>
            <Badge
              variant="secondary"
              className="rounded-lg uppercase font-black tracking-tight text-[10px] px-2 py-1"
            >
              Beta
            </Badge>
            <Badge
              variant="outline"
              className="rounded-lg uppercase font-black tracking-tight text-[10px] px-2 py-1 border-[var(--ds-border-subtle)] text-[var(--ds-text-subtle)]"
            >
              v1.2.0
            </Badge>
            <Badge className="rounded-lg uppercase font-black tracking-tight text-[10px] px-2 py-1 bg-[var(--ds-background-information-subtle)] text-[var(--ds-text-information)] border-none">
              Informational
            </Badge>
            <div className="flex items-center gap-1 bg-green-500/10 text-green-500 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight">
              <CheckCircle2 size={10} /> Live
            </div>
          </div>
        </GalleryItem>

        <GalleryItem
          title="Card"
          description="Containers for related content and actions. Flexible layout with header, content, and footer."
          packageName="@gateflow/ui"
          code={`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from '@gateflow/ui';

export default function Demo() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>Deploy your new gate monitor project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-20 bg-muted rounded-xl border-2 border-dashed flex items-center justify-center">
          Project Config UI
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}`}
        >
          <Card className="w-[350px] rounded-3xl border-[var(--ds-border-subtle)] bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-glass)] shadow-xl overflow-hidden backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-[var(--ds-background-brand-bold)] flex items-center justify-center text-white">
                  <Plus size={16} />
                </div>
                <CardTitle className="text-lg font-black uppercase tracking-tight leading-none pt-1">
                  Create Project
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-[var(--ds-text-subtle)]">
                Deploy your new gate monitor project in one-click. Automated
                environment setup.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="h-24 bg-[var(--ds-background-neutral-subtle)] rounded-2xl border border-dashed border-[var(--ds-border-brand)] flex flex-col items-center justify-center gap-2">
                <Settings
                  size={20}
                  className="text-[var(--ds-text-subtlest)]"
                />
                <span className="text-[10px] uppercase font-black tracking-widest text-[var(--ds-text-subtlest)]">
                  Initializing Engine...
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-[var(--ds-background-neutral-subtle)] border-t border-[var(--ds-border-subtle)] p-4">
              <Button
                variant="ghost"
                className="rounded-lg text-[10px] font-black uppercase"
              >
                Cancel
              </Button>
              <Button className="rounded-lg text-[10px] font-black uppercase bg-[var(--ds-background-brand-bold)] h-9">
                Deploy Project
              </Button>
            </CardFooter>
          </Card>
        </GalleryItem>

        <GalleryItem
          title="Avatar"
          description="Visual representation of users or entities. Supports images and automatic fallback initials."
          packageName="@gateflow/ui"
          code={`import { Avatar, AvatarImage, AvatarFallback } from '@gateflow/ui';

export default function Demo() {
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
         <AvatarFallback className="bg-brand text-brand-foreground">GF</AvatarFallback>
      </Avatar>
    </div>
  );
}`}
        >
          <div className="flex gap-6 items-center">
            <Avatar className="h-16 w-16 border-2 border-[var(--ds-border-brand)] ring-4 ring-[var(--ds-background-neutral-subtle)]">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12 border border-[var(--ds-border-subtle)]">
              <AvatarImage src="https://github.com/microsoft.png" />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            <Avatar className="h-10 w-10 bg-[var(--ds-background-brand-bold)]">
              <AvatarFallback className="text-white font-black text-xs uppercase pt-0.5">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex -space-x-3">
              <Avatar className="h-8 w-8 border-2 border-white dark:border-[oklch(12%_0.012_250)] ring-2 ring-white dark:ring-[oklch(12%_0.012_250)]">
                <AvatarFallback className="text-[10px] font-bold bg-blue-500 text-white">
                  A
                </AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-white dark:border-[oklch(12%_0.012_250)] ring-2 ring-white dark:ring-[oklch(12%_0.012_250)]">
                <AvatarFallback className="text-[10px] font-bold bg-indigo-500 text-white">
                  B
                </AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-white dark:border-[oklch(12%_0.012_250)] ring-2 ring-white dark:ring-[oklch(12%_0.012_250)]">
                <AvatarFallback className="text-[10px] font-bold bg-purple-500 text-white">
                  +5
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </GalleryItem>

        <GalleryItem
          title="Tabs"
          description="Segmented navigation within a view. Used to organize related content into distinguishable groups."
          packageName="@gateflow/ui"
          code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from '@gateflow/ui';

export default function Demo() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Account settings logic here.
      </TabsContent>
      <TabsContent value="password">
        Password change logic here.
      </TabsContent>
    </Tabs>
  );
}`}
        >
          <Tabs defaultValue="overview" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3 bg-[var(--ds-background-neutral-subtle)] p-1 rounded-xl h-11 border border-[var(--ds-border-subtle)]">
              <TabsTrigger
                value="overview"
                className="rounded-lg text-[10px] font-black uppercase tracking-tight data-[state=active]:bg-[var(--ds-surface-raised)] dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-lg text-[10px] font-black uppercase tracking-tight data-[state=active]:bg-[var(--ds-surface-raised)] dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="rounded-lg text-[10px] font-black uppercase tracking-tight data-[state=active]:bg-[var(--ds-surface-raised)] dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm"
              >
                Security
              </TabsTrigger>
            </TabsList>
            <div className="mt-4 p-6 rounded-2xl bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-glass)] border border-[var(--ds-border-subtle)] min-h-[100px] flex items-center justify-center text-center backdrop-blur-sm">
              <TabsContent value="overview">
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs font-bold text-[var(--ds-text)]">
                    System Health: 99.9%
                  </span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-green-500">
                    All Nodes Active
                  </span>
                </div>
              </TabsContent>
              <TabsContent value="analytics">
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs font-bold text-[var(--ds-text)]">
                    Traffic: +12% vs last week
                  </span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-blue-500">
                    Live Forecast
                  </span>
                </div>
              </TabsContent>
              <TabsContent value="security">
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs font-bold text-[var(--ds-text)]">
                    Auth Requests: 1.2k
                  </span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-[var(--ds-text-subtlest)]">
                    Ready for MFA
                  </span>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </GalleryItem>

        <GalleryItem
          title="Select"
          description="A form control for picking one option from a list. Supports scrolling, grouping, and label management."
          packageName="@gateflow/ui"
          code={`import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@gateflow/ui';

export default function Demo() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  );
}`}
        >
          <div className="flex flex-col gap-2 w-[180px]">
            <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtlest)] px-1">
              Region
            </Label>
            <Select defaultValue="middle-east">
              <SelectTrigger className="w-full rounded-xl border-[var(--ds-border-subtle)] h-11 bg-[var(--ds-surface-raised)] focus:ring-[var(--ds-border-brand)] dark:bg-[rgba(255,255,255,0.05)]">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[var(--ds-border-subtle)] shadow-xl p-1">
                <SelectItem
                  value="middle-east"
                  className="rounded-lg text-sm focus:bg-[var(--ds-background-neutral-subtle)] py-2.5"
                >
                  Middle East
                </SelectItem>
                <SelectItem
                  value="europe"
                  className="rounded-lg text-sm focus:bg-[var(--ds-background-neutral-subtle)] py-2.5"
                >
                  Europe
                </SelectItem>
                <SelectItem
                  value="north-america"
                  className="rounded-lg text-sm focus:bg-[var(--ds-background-neutral-subtle)] py-2.5"
                >
                  North America
                </SelectItem>
                <SelectItem
                  value="asia-pacific"
                  className="rounded-lg text-sm focus:bg-[var(--ds-background-neutral-subtle)] py-2.5"
                >
                  Asia Pacific
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </GalleryItem>

        <GalleryItem
          title="Skeleton"
          description="Loading state visuals for content that is not yet ready. Used to reduce perceived latency."
          packageName="@gateflow/ui"
          code={`import { Skeleton } from '@gateflow/ui';

export default function Demo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}`}
        >
          <div className="flex flex-col gap-6 p-6 bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-glass)] border border-[var(--ds-border-subtle)] rounded-3xl w-full max-w-sm shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-2xl bg-[var(--ds-background-neutral-subtle)]" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-3/4 rounded-lg bg-[var(--ds-background-neutral-subtle)]" />
                <Skeleton className="h-3 w-1/2 rounded-lg bg-[var(--ds-background-neutral-subtle)]" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton className="h-20 w-full rounded-2xl bg-[var(--ds-background-neutral-subtle)] animate-pulse" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-20 rounded-lg bg-[var(--ds-background-neutral-subtle)]" />
                <Skeleton className="h-8 w-24 rounded-lg bg-[var(--ds-background-neutral-subtle)]" />
              </div>
            </div>
          </div>
        </GalleryItem>

        <GalleryItem
          title="Switch"
          description="A toggle control for binary operations (on/off). Ideal for settings and feature flags."
          packageName="@gateflow/ui"
          code={`import { Switch, Label } from '@gateflow/ui';

export default function Demo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  );
}`}
        >
          <div className="flex flex-col gap-4 p-6 bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-glass)] border border-[var(--ds-border-subtle)] rounded-3xl w-full max-w-xs shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--ds-text)]">
                  Biometric Security
                </span>
                <span className="text-[10px] text-[var(--ds-text-subtle)]">
                  Enable FaceID / TouchID
                </span>
              </div>
              <Switch
                defaultChecked
                className="data-[state=checked]:bg-[var(--ds-background-brand-bold)]"
              />
            </div>
            <div className="border-t border-dashed border-[var(--ds-border-subtle)] pt-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--ds-text)]">
                  Stealth Scan
                </span>
                <span className="text-[10px] text-[var(--ds-text-subtle)]">
                  Silent QR processing
                </span>
              </div>
              <Switch className="data-[state=checked]:bg-[var(--ds-background-brand-bold)]" />
            </div>
          </div>
        </GalleryItem>
      </section>
    </div>
  );
}
