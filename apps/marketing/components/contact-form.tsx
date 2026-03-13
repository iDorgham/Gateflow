'use client';

import { useState } from 'react';
import { Button, Input, Label, Textarea } from '@gate-access/ui';
import { CheckCircle2, Loader2, Send, AlertCircle } from 'lucide-react';

export function ContactForm({ dict }: { dict: any }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedName, setSubmittedName] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string) ?? '';
    const data = {
      name,
      email: formData.get('email'),
      phone: formData.get('phone') || undefined,
      company: formData.get('company') || undefined,
      message: formData.get('message'),
      planInterest: formData.get('planInterest') || undefined,
      website: formData.get('website') || undefined,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (json.ok) {
        setSubmittedName(name);
        setStatus('sent');
      } else if (json.fallback) {
        setStatus('error');
        setErrorMessage(
          `${dict.form.status.fallbackPrefix ?? 'Please email us directly at'} ${json.fallback}`
        );
      } else {
        setStatus('error');
        setErrorMessage(json.message || dict.form.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setErrorMessage(dict.form.error || 'Network error. Please try again.');
    }
  }

  if (status === 'error') {
    return (
      <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-12 text-center animate-in">
        <AlertCircle className="mx-auto h-16 w-16 text-destructive mb-6" />
        <h2 className="text-2xl font-black mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-8">
          {errorMessage || 'Please try again later.'}
        </p>
        <Button onClick={() => setStatus('idle')} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (status === 'sent') {
    return (
      <div className="bg-success/5 border border-success/20 rounded-3xl p-12 text-center animate-in">
        <CheckCircle2 className="mx-auto h-16 w-16 text-success mb-6" />
        <h2 className="text-2xl font-black mb-4">
          {dict.form.status.successTitle}
        </h2>
        <p className="text-muted-foreground mb-8">
          {submittedName
            ? `${dict.form.status.successDesc} ${submittedName}!`
            : dict.form.status.successDesc}
        </p>
        <Button onClick={() => setStatus('idle')} variant="outline">
          {dict.form.status.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border rounded-3xl p-8 lg:p-10 shadow-2xl shadow-primary/5"
    >
      {/* Honeypot — hidden from real users, catches bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
      />

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <Label htmlFor="name">{dict.form.labels.name}</Label>
          <Input
            id="name"
            name="name"
            placeholder={dict.form.placeholders.name}
            required
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{dict.form.labels.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={dict.form.placeholders.email}
            required
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{dict.form.labels.phone}</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+20 100 000 0000"
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">{dict.form.labels.org}</Label>
          <Input
            id="company"
            name="company"
            placeholder={dict.form.placeholders.company}
            required
            className="h-12 rounded-xl"
          />
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="planInterest">{dict.form.labels.planInterest}</Label>
          <select
            id="planInterest"
            name="planInterest"
            className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="starter">{dict.form.options.starter}</option>
            <option value="pro">{dict.form.options.pro}</option>
            <option value="enterprise">{dict.form.options.enterprise}</option>
            <option value="unsure">{dict.form.options.unsure}</option>
          </select>
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="message">{dict.form.labels.message}</Label>
          <Textarea
            id="message"
            name="message"
            placeholder={dict.form.placeholders.message}
            className="min-h-[120px] rounded-xl"
            required
          />
        </div>
      </div>

      <Button
        size="lg"
        className="w-full h-14 rounded-xl font-bold text-base group"
        disabled={status === 'sending'}
      >
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
        {dict.form.privacyPrefix}{' '}
        <a href="#" className="underline">
          {dict.form.privacyLink}
        </a>
        .
      </p>
    </form>
  );
}
