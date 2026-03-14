'use client';

import { useState, useTransition, useRef } from 'react';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Textarea,
  NativeSelect,
} from '@gate-access/ui';
import { updateProfile, changePassword } from '../../profile/actions';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Lock,
  Save,
  Shield,
  User,
  Mail,
  AtSign,
  Fingerprint,
  Upload,
  Phone,
  Languages,
  Clock,
  Globe,
} from 'lucide-react';

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt: string;
  phone?: string | null;
  company?: string | null;
  website?: string | null;
  socialLinks?: string | null;
}

export function ProfileTab({ user: initialUser }: { user: ProfileUser }) {
  const { t } = useTranslation('dashboard');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lifted from UpdateProfileCard
  const [name, setName] = useState(initialUser.name);
  const [bio, setBio] = useState(initialUser.bio || '');
  const [phone, setPhone] = useState(initialUser.phone ?? '');
  const [company, setCompany] = useState(initialUser.company ?? '');
  const [website, setWebsite] = useState(initialUser.website ?? '');
  const [socialLinks, setSocialLinks] = useState(initialUser.socialLinks ?? '');
  const [isPending, startTransition] = useTransition();

  const hasChanges =
    name.trim() !== initialUser.name ||
    (bio.trim() || null) !== (initialUser.bio || null) ||
    (phone.trim() || null) !== (initialUser.phone || null) ||
    (company.trim() || null) !== (initialUser.company || null) ||
    (website.trim() || null) !== (initialUser.website || null) ||
    (socialLinks.trim() || null) !== (initialUser.socialLinks || null);

  function submit() {
    if (!name.trim()) return toast.error(t('settings.profile.errors.nameRequired', 'Name is required.'));
    startTransition(async () => {
      const result = await updateProfile(initialUser.id, {
        name: name.trim(),
        bio: bio.trim() || null,
        phone: phone.trim() || null,
        company: company.trim() || null,
        website: website.trim() || null,
        socialLinks: socialLinks.trim() || null,
      });
      if (result?.success) {
        toast.success(t('settings.profile.success.profileUpdated', 'Profile telemetry updated.'));
      } else {
        toast.error(result?.error || t('settings.profile.errors.updateFailed', 'Update failed.'));
      }
    });
  }

  const initials = (initialUser.name || 'User')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload
      setTimeout(() => {
        toast.success(t('settings.profile.success.photoSimulated', 'Photo upload simulated! Interface updated.'));
        setIsUploading(false);
      }, 1500);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-border/50">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
              <Avatar className="h-full w-full rounded-none">
                <AvatarImage src={initialUser.avatarUrl || undefined} className="object-cover" />
                <AvatarFallback className="bg-transparent text-muted-foreground text-3xl font-black group-hover:text-primary transition-colors">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <button
              onClick={handlePhotoClick}
              disabled={isUploading}
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {isUploading ? <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Upload className="h-3.5 w-3.5" />}
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">{initialUser.name}</h1>
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1 uppercase text-[10px] tracking-widest">
                <Shield className="h-3 w-3 mr-1.5" />
                {t(`settings.profile.roleLabels.${initialUser.role}`, initialUser.role)}
              </Badge>
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5">
                <Mail className="h-3 w-3" />
                {initialUser.email}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" onClick={submit} disabled={isPending || !hasChanges} className="px-8 h-11 rounded-xl bg-primary shadow-lg shadow-primary/10 hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-widest gap-2">
            {isPending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save className="h-4 w-4" />}
            {t('common.save', 'Save')}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* General Info */}
          <UpdateProfileCard
            user={initialUser}
            name={name}
            setName={setName}
            bio={bio}
            setBio={setBio}
          />

          {/* Contact & links */}
          <Card className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden">
            <CardHeader className="pb-4 pt-6 px-8 border-b border-border/50 bg-muted/5">
              <CardTitle className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                {t('settings.profile.contactAndLinks', 'Contact & links')}
              </CardTitle>
              <CardDescription className="text-xs">
                {t('settings.profile.contactAndLinksDesc', 'Phone, company, website and social links.')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="profile-phone" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    {t('settings.profile.phone', 'Phone')}
                  </Label>
                  <Input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('settings.profile.phonePlaceholder', 'Your phone number')}
                    className="h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="profile-company" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    {t('settings.profile.company', 'Company')}
                  </Label>
                  <Input
                    id="profile-company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={t('settings.profile.companyPlaceholder', 'Company or organization')}
                    className="h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="profile-website" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                  {t('settings.profile.website', 'Website')}
                </Label>
                <Input
                  id="profile-website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://"
                  className="h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="profile-social" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                  {t('settings.profile.socialLinks', 'Social / profile links')}
                </Label>
                <Input
                  id="profile-social"
                  type="url"
                  value={socialLinks}
                  onChange={(e) => setSocialLinks(e.target.value)}
                  placeholder={t('settings.profile.socialPlaceholder', 'LinkedIn, Twitter, etc.')}
                  className="h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Regional & Language (merged from old GeneralTab) */}
          <Card className="rounded-2xl border border-border shadow-sm overflow-hidden bg-card">
            <CardHeader className="pb-4 pt-6 px-8 border-b border-border/50 bg-muted/5">
              <CardTitle className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
                <Languages className="h-4 w-4 text-primary" />
                {t('settings.general.sections.localization', 'Regional & Language')}
              </CardTitle>
              <CardDescription className="text-xs">{t('settings.general.localizationDesc', 'Configure how dates, times, and languages are displayed.')}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t('settings.general.language', 'Preferred Language')}</Label>
                  <div className="relative group text-foreground">
                    <Languages className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                    <NativeSelect
                      defaultValue="en-US"
                      className="pl-11 h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20"
                    >
                      <option value="en-US">English (United States)</option>
                      <option value="ar-EG">العربية (Egypt)</option>
                    </NativeSelect>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t('settings.general.timezone', 'System Timezone')}</Label>
                  <div className="relative group text-foreground">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                    <NativeSelect
                      defaultValue="UTC+2"
                      className="pl-11 h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20"
                    >
                      <option value="UTC">UTC (London)</option>
                      <option value="UTC+2">UTC+2 (Cairo)</option>
                      <option value="UTC+3">UTC+3 (Riyadh)</option>
                      <option value="UTC-5">UTC-5 (New York)</option>
                    </NativeSelect>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden">
            <CardHeader className="pb-4 pt-6 px-8 border-b border-border/50 bg-muted/5">
              <CardTitle className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                {t('settings.profile.security', 'Security & Authentication')}
              </CardTitle>
              <CardDescription className="text-xs">{t('settings.profile.securityDesc', 'Manage your access credentials and protect your node.')}</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <ChangePasswordCard />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <Fingerprint className="h-3.5 w-3.5" />
                {t('settings.profile.accountMetadata', 'Account Metadata')}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-5">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase text-muted-foreground/50 tracking-widest">System UID</span>
                  <code className="text-[10px] font-mono text-muted-foreground bg-background px-2 py-0.5 rounded border border-border/50">{initialUser.id.slice(0, 12)}...</code>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/20">
                  <span className="text-[9px] font-bold uppercase text-muted-foreground/50 tracking-widest">Primary Alias</span>
                  <span className="text-[10px] font-bold text-foreground truncate max-w-[120px]">@{initialUser.email.split('@')[0]}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group">
                  <AtSign className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Active Sessions</span>
                    <span className="text-[9px] text-muted-foreground/60 uppercase font-black">2 Connected Devices</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group">
                  <Shield className="h-4 w-4 text-muted-foreground/40 group-hover:text-success transition-colors" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">2FA Status</span>
                    <span className="text-[9px] text-success uppercase font-black">Secured via HMAC</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full rounded-xl border-border h-12 font-bold uppercase tracking-widest text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
            {t('settings.profile.exportData', 'Export Personal Cloud Data')}
          </Button>
        </div>
      </div>
    </div>
  );
}

function UpdateProfileCard({
  user,
  name,
  setName,
  bio,
  setBio
}: {
  user: ProfileUser;
  name: string;
  setName: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
}) {
  const { t } = useTranslation('dashboard');

  return (
    <Card className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden">
      <CardHeader className="pb-4 pt-6 px-8 border-b border-border/50 bg-muted/5">
        <CardTitle className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          {t('settings.profile.generalInfo', 'Basic Identity')}
        </CardTitle>
        <CardDescription className="text-xs">{t('settings.profile.generalInfoDesc', 'Update your public persona and system-wide identifiers.')}</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="displayName" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t('settings.profile.legalName', 'Full Identity')}</Label>
            <Input
              id="displayName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-3 opacity-50 cursor-not-allowed">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t('settings.profile.email', 'Email Address')}</Label>
            <Input
              value={user.email}
              disabled
              className="h-11 rounded-xl border-border/50 bg-muted/50 font-medium"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="bio" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t('settings.profile.bio', 'Personnel Bio')}</Label>
          <Textarea
            id="bio"
            placeholder={t('settings.profile.bioPlaceholder', 'Brief descriptions for your team members...')}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="min-h-[120px] rounded-xl border-border/50 bg-background/50 focus:ring-primary/20 resize-none p-4"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ChangePasswordCard() {
  const { t } = useTranslation('dashboard');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!current || !next || !confirm) return toast.error(t('common.errors.required', 'All fields required.'));
    if (next.length < 8) return toast.error(t('common.errors.passwordLength', 'Min 8 characters required.'));
    if (next !== confirm) return toast.error(t('common.errors.passwordMismatch', 'Passwords do not match.'));

    startTransition(async () => {
      const result = await changePassword(current, next);
      if (result?.success) {
        toast.success(t('settings.profile.success.passwordUpdated', 'Authentication key rotation successful.'));
        setCurrent('');
        setNext('');
        setConfirm('');
      } else {
        toast.error(result?.error || t('common.errors.generic', 'Operation failed.'));
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: 'curr', label: t('settings.profile.currentPwd', 'Current Key'), val: current, set: setCurrent },
          { id: 'new', label: t('settings.profile.newPwd', 'New Key'), val: next, set: setNext },
          { id: 'conf', label: t('settings.profile.confirmPwd', 'Verify Key'), val: confirm, set: setConfirm },
        ].map((item) => (
          <div key={item.id} className="space-y-3">
            <Label htmlFor={item.id} className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{item.label}</Label>
            <Input
              id={item.id}
              type="password"
              value={item.val}
              onChange={(e) => item.set(e.target.value)}
              className="h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <Button
          onClick={submit}
          disabled={isPending || !current || !next}
          className="px-8 h-11 rounded-xl bg-primary shadow-lg shadow-primary/10 hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-widest gap-2"
        >
          {isPending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {t('settings.profile.rotateKeys', 'Rotate Auth Keys')}
        </Button>
      </div>
    </div>
  );
}
