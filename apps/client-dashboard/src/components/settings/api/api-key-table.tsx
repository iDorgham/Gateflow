'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  EmptyState,
} from '@gateflow/ui';
import { Trash2, Key, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';
import { CreateApiKeySheet } from './create-api-key-sheet';
import { SettingsSectionHeader } from '@/components/settings/settings-section-header';

export interface ApiKeyRow {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

interface ApiKeyTableProps {
  apiKeys: ApiKeyRow[];
}

export function ApiKeyTable({ apiKeys: initial }: ApiKeyTableProps) {
  const router = useRouter();
  const [keys, setKeys] = useState(initial);
  const [isPending, startTransition] = useTransition();

  const refresh = () => startTransition(() => router.refresh());

  const handleRevoke = async (id: string, name: string) => {
    if (!confirm(`Revoke API key "${name}"? This cannot be undone.`)) return;

    const res = await csrfFetch(`/api/api-keys/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setKeys((prev) => prev.filter((k) => k.id !== id));
      toast.success('API key revoked');
      refresh();
    } else {
      toast.error('Failed to revoke key');
    }
  };

  const isExpired = (expiresAt: string | null) =>
    expiresAt != null && new Date(expiresAt) < new Date();

  return (
    <div className="space-y-4">
      <SettingsSectionHeader
        title="API keys"
        description="Secrets are shown only once after creation."
        action={<CreateApiKeySheet onSuccess={refresh} />}
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {keys.length === 0 ? (
          <EmptyState
            icon={Key}
            title="No API keys yet"
            description="Generate one to get started."
            className="min-h-[240px]"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Prefix</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow
                  key={key.id}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Key className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                      <span className="font-bold text-foreground text-sm">
                        {key.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded-lg border border-border">
                      {key.keyPrefix}…
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {key.scopes.map((scope) => (
                        <Badge
                          key={scope}
                          variant="outline"
                          className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0 bg-primary/5 border-primary/20 text-primary"
                        >
                          {scope.replace('_', ':')}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {key.lastUsedAt ? (
                      new Date(key.lastUsedAt).toLocaleDateString()
                    ) : (
                      <span className="italic opacity-50">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {key.expiresAt ? (
                      <div
                        className={`flex items-center gap-1 text-xs font-bold ${isExpired(key.expiresAt) ? 'text-destructive' : 'text-muted-foreground'}`}
                      >
                        <Clock className="h-3 w-3" />
                        {isExpired(key.expiresAt)
                          ? 'Expired'
                          : new Date(key.expiresAt).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/50 italic">
                        Never
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      onClick={() => handleRevoke(key.id, key.name)}
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
