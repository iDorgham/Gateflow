'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  Button,
  Input,
  NativeSelect,
  ScrollArea,
} from '@gate-access/ui';
import {
  Loader2,
  X,
  UserPlus,
  ShieldCheck,
  User,
  Mail,
  Building,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

interface AddUserSheetProps {
  open: boolean;
  onClose: () => void;
}

interface OrgOption {
  id: string;
  name: string;
}

interface RoleOption {
  id: string;
  name: string;
}

export function AddUserSheet({ open, onClose }: AddUserSheetProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [orgs, setOrgs] = useState<OrgOption[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    organizationId: '',
  });

  useEffect(() => {
    if (open) {
      setLoadingOptions(true);
      Promise.all([
        fetch('/api/admin/organizations?limit=100').then((r) => r.json()),
        fetch('/api/admin/roles').then((r) => r.json()),
      ])
        .then(([orgsRes, rolesRes]) => {
          if (orgsRes.success) setOrgs(orgsRes.data);
          if (rolesRes.success) {
            const filteredRoles = rolesRes.data.filter(
              (r: RoleOption) => r.name !== 'ADMIN'
            );
            setRoles(filteredRoles);
            if (filteredRoles.length > 0) {
              setFormData((prev) => ({ ...prev, roleId: filteredRoles[0].id }));
            }
          }
        })
        .finally(() => setLoadingOptions(false));
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.roleId) {
      return toast.error('Please fill in all required fields');
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (data.success) {
          toast.success('User created successfully');
          router.refresh();
          onClose();
          setFormData({
            name: '',
            email: '',
            password: '',
            roleId: roles[0]?.id || '',
            organizationId: '',
          });
        } else {
          toast.error(data.message || 'Failed to create user');
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full bg-ds-background-default border-l border-ds-border shadow-2xl">
        {/* Header Section */}
        <div className="p-6 border-b border-ds-border bg-ds-background-neutral-subtle/30 shrink-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ds-background-brand-bold text-ds-text-inverse font-black text-lg shadow-lg shadow-ds-background-brand-bold/20">
                <UserPlus className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-ds-text text-xl font-black uppercase tracking-tight truncate leading-tight">
                  New User Account
                </h2>
                <p className="text-[10px] font-bold text-ds-text-subtle uppercase tracking-tighter flex items-center gap-1 mt-1">
                  <ShieldCheck className="h-3 w-3 text-ds-text-success" />{' '}
                  IDENTITY MANAGEMENT
                </p>
              </div>
            </div>
            <Button
              variant="subtle"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-8">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <User className="h-3.5 w-3.5 text-ds-text-subtle" />
                      <label className="text-[11px] font-black text-ds-text-subtle uppercase tracking-widest">
                        Full Name
                      </label>
                    </div>
                    <Input
                      placeholder="e.g. John Doe"
                      className="h-11 rounded-xl bg-ds-background-neutral-subtle border-ds-border focus:bg-ds-background-default transition-all"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Mail className="h-3.5 w-3.5 text-ds-text-subtle" />
                      <label className="text-[11px] font-black text-ds-text-subtle uppercase tracking-widest">
                        Email Address
                      </label>
                    </div>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="h-11 rounded-xl bg-ds-background-neutral-subtle border-ds-border focus:bg-ds-background-default transition-all"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Access Config */}
                <div className="p-5 rounded-2xl bg-ds-background-neutral-subtle/50 border border-ds-border-subtle space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-ds-text-brand" />
                    <h3 className="text-[11px] font-black text-ds-text uppercase tracking-widest">
                      Access Control
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-ds-text-subtlest uppercase tracking-tight ml-1">
                        Assign Role
                      </label>
                      <NativeSelect
                        className="h-10 rounded-xl bg-ds-background-default border-ds-border"
                        value={formData.roleId}
                        onChange={(e) =>
                          setFormData({ ...formData, roleId: e.target.value })
                        }
                        disabled={loadingOptions}
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name.replace('_', ' ')}
                          </option>
                        ))}
                      </NativeSelect>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-ds-text-subtlest uppercase tracking-tight ml-1">
                        Organization (Optional)
                      </label>
                      <NativeSelect
                        className="h-10 rounded-xl bg-ds-background-default border-ds-border"
                        value={formData.organizationId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            organizationId: e.target.value,
                          })
                        }
                        disabled={loadingOptions}
                      >
                        <option value="">
                          No Organization (Platform Level)
                        </option>
                        {orgs.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.name}
                          </option>
                        ))}
                      </NativeSelect>
                    </div>
                  </div>
                </div>

                {/* Password Notice */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-ds-background-warning-subtle/30 border border-ds-border-warning/10">
                  <div className="h-5 w-5 rounded-full bg-ds-background-warning-bold text-ds-text-inverse flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-black">!</span>
                  </div>
                  <p className="text-[10px] font-bold text-ds-text-warning uppercase tracking-tight leading-relaxed">
                    A temporary password will be generated and sent to the
                    provided email address upon creation.
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="p-6 border-t border-ds-border bg-ds-background-default shrink-0 space-y-3">
            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-black bg-ds-background-brand-bold hover:bg-ds-background-brand-bold-hovered text-ds-text-inverse shadow-lg shadow-ds-background-brand-bold/20"
              disabled={isPending || loadingOptions}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              Create User Account
            </Button>
            <Button
              type="button"
              variant="subtle"
              className="w-full h-10 rounded-xl text-ds-text-subtle font-bold"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
