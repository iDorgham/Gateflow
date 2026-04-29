'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Label,
  Button,
  Textarea,
  Switch,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@gateflow/ui';
import {
  Save,
  RefreshCw,
  Shield,
  Zap,
  Globe,
  Code,
  FileCode2,
  Search,
} from 'lucide-react';

export function CmsSettingsClient({
  initialSettings,
}: {
  initialSettings: any;
}) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Mock save delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    // Assume toast handles it or just simple alert if toast isn't imported correctly
    alert(t('cms:settings.saved', 'Settings saved successfully'));
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ds-text">
            {t('cms:settings.title', 'CMS Settings')}
          </h1>
          <p className="text-ds-text-subtle mt-1">
            {t(
              'cms:settings.subtitle',
              'Manage global settings for www.gateflow.site'
            )}
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2 bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90"
        >
          {isSaving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {t('cms:settings.save', 'Save Changes')}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start border-b border-ds-border rounded-none bg-transparent p-0 h-auto overflow-x-auto">
          <TabsTrigger
            value="general"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ds-border-selected data-[state=active]:text-ds-text-selected data-[state=active]:bg-transparent px-4 py-3"
          >
            <Globe className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('cms:settings.tabs.general', 'General')}
          </TabsTrigger>
          <TabsTrigger
            value="seo"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ds-border-selected data-[state=active]:text-ds-text-selected data-[state=active]:bg-transparent px-4 py-3"
          >
            <Search className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('cms:settings.tabs.seo', 'SEO')}
          </TabsTrigger>
          <TabsTrigger
            value="scripts"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ds-border-selected data-[state=active]:text-ds-text-selected data-[state=active]:bg-transparent px-4 py-3"
          >
            <Code className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('cms:settings.tabs.scripts', 'Header Scripts')}
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ds-border-selected data-[state=active]:text-ds-text-selected data-[state=active]:bg-transparent px-4 py-3"
          >
            <Shield className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('cms:settings.tabs.security', 'Security')}
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ds-border-selected data-[state=active]:text-ds-text-selected data-[state=active]:bg-transparent px-4 py-3"
          >
            <Zap className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('cms:settings.tabs.performance', 'Performance')}
          </TabsTrigger>
          <TabsTrigger
            value="cache"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-ds-border-selected data-[state=active]:text-ds-text-selected data-[state=active]:bg-transparent px-4 py-3"
          >
            <FileCode2 className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('cms:settings.tabs.cache', 'Cache')}
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent
            value="general"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <Card className="border-ds-border shadow-sm">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Basic site configuration and identity.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                    className="bg-ds-surface border-ds-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Site Description</Label>
                  <Textarea
                    value={settings.siteDescription}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        siteDescription: e.target.value,
                      })
                    }
                    className="bg-ds-surface border-ds-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Language</Label>
                    <Select
                      value={settings.defaultLanguage}
                      onValueChange={(v) =>
                        setSettings({ ...settings, defaultLanguage: v })
                      }
                    >
                      <SelectTrigger className="bg-ds-surface border-ds-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Input
                      value={settings.timezone}
                      onChange={(e) =>
                        setSettings({ ...settings, timezone: e.target.value })
                      }
                      className="bg-ds-surface border-ds-border"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="seo"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <Card className="border-ds-border shadow-sm">
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Search engine optimization templates and defaults.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Title Template</Label>
                  <Input
                    value={settings.seo.metaTitleTemplate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seo: {
                          ...settings.seo,
                          metaTitleTemplate: e.target.value,
                        },
                      })
                    }
                    className="bg-ds-surface border-ds-border"
                  />
                  <p className="text-xs text-ds-text-subtlest">
                    Use {'{page_title}'} to inject the current page title.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Open Graph Image URL</Label>
                  <Input
                    value={settings.seo.ogImageUrl}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seo: { ...settings.seo, ogImageUrl: e.target.value },
                      })
                    }
                    className="bg-ds-surface border-ds-border"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="scripts"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <Card className="border-ds-border shadow-sm">
              <CardHeader>
                <CardTitle>Header & Scripts</CardTitle>
                <CardDescription>
                  Analytics tags and custom scripts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Google Tag Manager ID</Label>
                    <Input
                      value={settings.headers.gtmId}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          headers: {
                            ...settings.headers,
                            gtmId: e.target.value,
                          },
                        })
                      }
                      className="bg-ds-surface border-ds-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Pixel ID</Label>
                    <Input
                      value={settings.headers.metaPixelId}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          headers: {
                            ...settings.headers,
                            metaPixelId: e.target.value,
                          },
                        })
                      }
                      className="bg-ds-surface border-ds-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Custom CSS</Label>
                  <Textarea
                    className="font-mono text-sm h-32 bg-ds-surface border-ds-border"
                    value={settings.headers.customCss}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        headers: {
                          ...settings.headers,
                          customCss: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="security"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <Card className="border-ds-border shadow-sm">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  HTTP headers and security policies.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enforce HTTPS</Label>
                    <p className="text-sm text-ds-text-subtle">
                      Redirect all HTTP traffic to HTTPS.
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.httpsEnforced}
                    onCheckedChange={(v) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, httpsEnforced: v },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Content Security Policy (CSP)</Label>
                    <p className="text-sm text-ds-text-subtle">
                      Enable strict CSP headers.
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.cspEnabled}
                    onCheckedChange={(v) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, cspEnabled: v },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="performance"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <Card className="border-ds-border shadow-sm">
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>
                  Optimization and asset delivery.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Image Optimization</Label>
                    <p className="text-sm text-ds-text-subtle">
                      Automatically compress and resize images.
                    </p>
                  </div>
                  <Switch
                    checked={settings.performance.imageOptimization}
                    onCheckedChange={(v) =>
                      setSettings({
                        ...settings,
                        performance: {
                          ...settings.performance,
                          imageOptimization: v,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Lazy Loading</Label>
                    <p className="text-sm text-ds-text-subtle">
                      Defer offscreen images and components.
                    </p>
                  </div>
                  <Switch
                    checked={settings.performance.lazyLoading}
                    onCheckedChange={(v) =>
                      setSettings({
                        ...settings,
                        performance: {
                          ...settings.performance,
                          lazyLoading: v,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>CDN URL</Label>
                  <Input
                    value={settings.performance.cdnUrl}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        performance: {
                          ...settings.performance,
                          cdnUrl: e.target.value,
                        },
                      })
                    }
                    placeholder="https://cdn.gateflow.site"
                    className="bg-ds-surface border-ds-border"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="cache"
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <Card className="border-ds-border shadow-sm">
              <CardHeader>
                <CardTitle>Cache Management</CardTitle>
                <CardDescription>
                  Manage application and API cache.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                  <Button
                    variant="destructive"
                    className="w-fit"
                    onClick={() => alert('Cache cleared successfully')}
                  >
                    Clear All Cache
                  </Button>
                  <div className="grid grid-cols-2 gap-4 mt-4 max-w-md">
                    <Button
                      variant="outline"
                      onClick={() => alert('Static assets cache cleared')}
                    >
                      Clear Static Assets
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => alert('API cache cleared')}
                    >
                      Clear API Cache
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
