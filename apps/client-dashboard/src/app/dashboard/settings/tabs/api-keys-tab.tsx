'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Table,
} from '@gate-access/ui';
import { KeyRound, Plus, Trash2, Copy, Check, Clock, ShieldCheck, User, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';

export interface ApiKeyRow {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  createdBy: string;
}

export function ApiKeysTab({ initialKeys }: { initialKeys: ApiKeyRow[] }) {
  const [keys, setKeys] = useState<ApiKeyRow[]>(initialKeys);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{ key: string; name: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async () => {
    const name = prompt('Enter a name for this API key:');
    if (!name) return;

    setIsCreating(true);
    try {
      const res = await csrfFetch('/api/keys', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewKeyData({ key: data.key, name: data.apiKey.name });
        setKeys([
          {
            ...data.apiKey,
            createdAt: data.apiKey.createdAt,
            lastUsedAt: null,
            expiresAt: null,
          },
          ...keys,
        ]);
        toast.success('API key generated successfully');
      } else {
        toast.error(data.message ?? 'Failed to create API key');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? Applications using it will immediately lose access.')) return;
    setDeletingId(id);
    try {
      const res = await csrfFetch(`/api/keys/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setKeys(keys.filter((k) => k.id !== id));
        toast.success('API key revoked');
      } else {
        toast.error('Failed to revoke API key');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">API Authentication</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Manage programmable access tokens for your workspace integrations.</p>
        </div>
        <Button onClick={handleCreate} disabled={isCreating} className="w-full sm:w-auto gap-2 rounded-xl bg-primary font-black uppercase tracking-widest text-[10px] h-10 px-6 shadow-lg shadow-primary/10">
          {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Generate Secure Key
        </Button>
      </div>

      {newKeyData && (
        <Card className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-500/10 shadow-lg animate-in slide-in-from-top-4 duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black uppercase text-sm tracking-widest">
              <ShieldCheck className="h-5 w-5" />
              New Key Generated
            </CardTitle>
            <CardDescription className="text-emerald-600/80 font-medium">
              Copy this key now. For security reasons, it will not be shown again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 shadow-inner">
              <code className="flex-1 font-mono text-sm break-all font-bold text-slate-900 dark:text-emerald-50 select-all border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 pb-2 sm:pb-0 sm:pr-4">
                {newKeyData.key}
              </code>
              <Button size="sm" onClick={() => copyToClipboard(newKeyData.key)} className="w-full sm:w-auto gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-bold uppercase text-[10px] tracking-widest">
                <Copy className="h-3.5 w-3.5" />
                Copy Secret
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600/60">
                <AlertCircle className="h-3 w-3" />
                Store this key in a secure vault like AWS Secrets Manager or HashiCorp Vault.
            </div>
            <Button variant="ghost" size="sm" onClick={() => setNewKeyData(null)} className="mt-4 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 tracking-widest">
              Dismiss Notification
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden bg-white dark:bg-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity / Name</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Key Prefix</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Capabilities</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Last Activity</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {keys.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-sm text-slate-400 font-medium italic">
                      No active API integrations detected. Generate a key to begin.
                    </td>
                  </tr>
                ) : (
                  keys.map((k) => (
                    <tr key={k.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">{k.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            Registered {new Date(k.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs font-mono font-black text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          {k.keyPrefix}••••
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {k.scopes.map((s) => (
                            <Badge key={s} variant="outline" className="text-[9px] font-black uppercase border-slate-200 dark:border-white/10 dark:text-slate-400 bg-slate-50 dark:bg-white/5 py-0 px-2 tracking-widest">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {k.lastUsedAt ? (
                          <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-slate-300 font-bold">{new Date(k.lastUsedAt).toLocaleDateString()}</span>
                            <span className="text-[10px] uppercase font-black text-emerald-500 tracking-widest">Active</span>
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 italic">Never used</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={deletingId === k.id}
                          className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95"
                          onClick={() => handleDelete(k.id)}
                        >
                          {deletingId === k.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
