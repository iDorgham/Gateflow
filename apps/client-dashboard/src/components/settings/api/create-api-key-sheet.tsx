'use client';

import { useState, useTransition } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  Button,
  Input,
  Label,
  Checkbox,
} from '@gate-access/ui';
import { Plus, Key, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';

const SCOPES = [
  { id: 'QR_CREATE', label: 'QR: Create', description: 'Generate new access QR codes' },
  { id: 'QR_READ', label: 'QR: Read', description: 'List and retrieve QR codes' },
  { id: 'QR_VALIDATE', label: 'QR: Validate', description: 'Validate scanned QR codes' },
  { id: 'SCANS_READ', label: 'Scans: Read', description: 'Access scan history and logs' },
  { id: 'ANALYTICS_READ', label: 'Analytics: Read', description: 'Retrieve analytics data' },
  { id: 'WEBHOOK_WRITE', label: 'Webhook: Write', description: 'Manage webhook configurations' },
];

interface CreateApiKeySheetProps {
  onSuccess: () => void;
}

export function CreateApiKeySheet({ onSuccess }: CreateApiKeySheetProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [expiresAt, setExpiresAt] = useState('');
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setName('');
    setSelectedScopes([]);
    setExpiresAt('');
    setRevealedKey(null);
    setCopied(false);
  };

  const toggleScope = (id: string) =>
    setSelectedScopes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Key name is required');
    if (selectedScopes.length === 0) return toast.error('Select at least one scope');

    startTransition(async () => {
      const body: Record<string, unknown> = { name: name.trim(), scopes: selectedScopes };
      if (expiresAt) body.expiresAt = new Date(expiresAt).toISOString();

      const res = await csrfFetch('/api/api-keys', { method: 'POST', body: JSON.stringify(body) });
      const data = (await res.json()) as { key?: string; error?: string };
      if (res.ok && data.key) {
        setRevealedKey(data.key);
        onSuccess();
      } else {
        toast.error(data.error ?? 'Failed to create API key');
      }
    });
  };

  const handleCopy = async () => {
    if (!revealedKey) return;
    await navigator.clipboard.writeText(revealedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <SheetTrigger asChild>
        <Button className="gap-2 rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[11px]">
          <Plus className="h-4 w-4" />
          Generate Key
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-8 bg-primary/5 shrink-0">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <Key className="h-6 w-6 text-primary" />
          </div>
          <SheetTitle className="text-xl font-black uppercase tracking-tight">
            {revealedKey ? 'Key Generated — Save It Now' : 'Generate API Key'}
          </SheetTitle>
          <SheetDescription>
            {revealedKey
              ? 'This is the only time the full key will be shown. Copy it to a secure location.'
              : 'API keys grant programmatic access scoped to specific actions.'}
          </SheetDescription>
        </SheetHeader>

        {revealedKey ? (
          <div className="flex flex-col p-8 gap-6 flex-1">
            <div className="p-4 rounded-2xl border border-warning/30 bg-warning/5 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-warning leading-relaxed">
                This key will not be shown again. Store it securely — treat it like a password.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Your API Key
              </Label>
              <div className="relative">
                <code className="block w-full font-mono text-xs bg-muted/50 border border-border rounded-xl px-4 py-4 pr-14 break-all leading-relaxed">
                  {revealedKey}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="absolute top-3 right-3 h-8 w-8 rounded-lg"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <SheetFooter className="mt-auto">
              <Button
                onClick={() => { setOpen(false); reset(); }}
                className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px]"
              >
                Done — I&apos;ve Saved the Key
              </Button>
            </SheetFooter>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="flex flex-col flex-1 overflow-y-auto">
            <div className="p-8 space-y-6 flex-1">
              <div className="space-y-2">
                <Label htmlFor="key-name" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Key Name *
                </Label>
                <Input
                  id="key-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Scanner App Production"
                  className="h-11 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Scopes *
                </Label>
                <div className="space-y-2">
                  {SCOPES.map((scope) => (
                    <div
                      key={scope.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedScopes.includes(scope.id)
                          ? 'bg-primary/5 border-primary/20'
                          : 'border-border hover:bg-muted/30'
                      }`}
                      onClick={() => toggleScope(scope.id)}
                    >
                      <Checkbox
                        checked={selectedScopes.includes(scope.id)}
                        onChange={() => toggleScope(scope.id)}
                        className="mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-black uppercase tracking-tight">{scope.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{scope.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-expiry" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Expiry Date (optional)
                </Label>
                <Input
                  id="key-expiry"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <SheetFooter className="p-8 pt-0 border-t border-border">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px]"
              >
                {isPending ? 'Generating...' : 'Generate API Key'}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
