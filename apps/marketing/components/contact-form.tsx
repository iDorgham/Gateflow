'use client';

import { useState } from 'react';
import { Button, Input, Label, Textarea } from '@gate-access/ui';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

export function ContactForm({ dict }: { dict: any }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <div className="bg-success/5 border border-success/20 rounded-3xl p-12 text-center animate-in">
        <CheckCircle2 className="mx-auto h-16 w-16 text-success mb-6" />
        <h2 className="text-2xl font-black mb-4">{dict.form.status.successTitle}</h2>
        <p className="text-muted-foreground mb-8">
          {dict.form.status.successDesc}
        </p>
        <Button onClick={() => setStatus('idle')} variant="outline">{dict.form.status.sendAnother}</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border rounded-3xl p-8 lg:p-10 shadow-2xl shadow-primary/5">
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <Label htmlFor="name">{dict.form.labels.name}</Label>
          <Input id="name" placeholder={dict.form.placeholders.name} required className="h-12 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{dict.form.labels.email}</Label>
          <Input id="email" type="email" placeholder={dict.form.placeholders.email} required className="h-12 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{dict.form.labels.phone}</Label>
          <Input id="phone" placeholder="+20 100 000 0000" className="h-12 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="org">{dict.form.labels.org}</Label>
          <Input id="org" placeholder={dict.form.placeholders.company} className="h-12 rounded-xl" />
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="type">{dict.form.labels.facilityType}</Label>
          <select id="type" className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
             <option>{dict.form.options.compound}</option>
             <option>{dict.form.options.school}</option>
             <option>{dict.form.options.event}</option>
             <option>{dict.form.options.club}</option>
             <option>{dict.form.options.other}</option>
          </select>
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="message">{dict.form.labels.message}</Label>
          <Textarea id="message" placeholder={dict.form.placeholders.message} className="min-h-[120px] rounded-xl" required />
        </div>
      </div>

      <Button size="lg" className="w-full h-14 rounded-xl font-bold text-base group" disabled={status === 'sending'}>
        {status === 'sending' ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {dict.form.status.sendingText}
          </>
        ) : (
          <>
            {dict.form.status.sendText}
            <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </Button>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {dict.form.privacyPrefix} <a href="#" className="underline">{dict.form.privacyLink}</a>.
      </p>
    </form>
  );
}
