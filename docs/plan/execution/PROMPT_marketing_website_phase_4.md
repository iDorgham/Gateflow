# Phase 4: Contact Form Backend (Resend)

## Primary role
BACKEND

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/marketing`
- **Refs**:
  - `apps/marketing/app/[locale]/contact/page.tsx` — existing contact form UI
  - `apps/marketing/components/contact-form.tsx` — existing form component
  - `apps/marketing/locales/en/contact.json` — contact page translations
  - `apps/client-dashboard/src/lib/rate-limit.ts` — rate limiting reference (uses Upstash; marketing uses in-memory)

## Goal
Wire the existing contact form to a working email backend using the Resend API. Add rate limiting, honeypot spam protection, auto-reply to submitter, and a notification email to the team inbox.

## Scope (in)

**New dependency**:
- `resend` — run `pnpm add resend --filter=marketing`

**`app/api/contact/route.ts`** — POST handler:

Request body schema:
```ts
{
  name: string           // required, min 2 chars
  email: string          // required, valid email
  company: string        // required
  phone?: string         // optional
  message: string        // required, min 10 chars
  planInterest: 'starter' | 'pro' | 'enterprise' | 'unsure'
  website?: string       // honeypot — reject if filled
}
```

Logic:
1. **Honeypot check**: if `website` is non-empty → return `{ ok: true }` (silent reject, no email)
2. **Rate limiting** (in-memory, per-IP): max 3 submissions per IP per 60 minutes
   - Use a `Map<string, { count, resetAt }>` in module scope
   - Return 429 if limit exceeded
3. **Validation**: check required fields; return 400 with field errors if invalid
4. **Send notification email** to `process.env.CONTACT_NOTIFY_EMAIL`:
   - Subject: `New GateFlow contact: {name} from {company}`
   - Body (HTML): all form fields formatted
5. **Send auto-reply** to submitter's email:
   - Subject: `We received your message — GateFlow`
   - Body: warm confirmation, expected response time (1–2 business days), contact@gateflow.io fallback
6. **Graceful degradation**: if `RESEND_API_KEY` is not set → return `{ ok: false, fallback: 'contact@gateflow.io' }` with status 503

**Environment variables** — add to `apps/marketing/.env.example`:
```
RESEND_API_KEY=re_...
CONTACT_NOTIFY_EMAIL=team@gateflow.io
CONTACT_FROM_EMAIL=noreply@gateflow.io
```

**Update `components/contact-form.tsx`**:
- Change to client component (`'use client'`)
- On submit: `fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })`
- Show loading state during request
- Success state: "Thanks, {name}! We'll be in touch within 1–2 business days."
- Error state: show error message; if 503 + fallback email, show "Email us directly at contact@gateflow.io"
- Add hidden `<input name="website" tabIndex={-1} />` honeypot field (aria-hidden, visually hidden with CSS)
- Add plan interest dropdown: Starter / Pro / Enterprise / Not sure yet

**Update contact form translations** (`locales/en/contact.json`):
- Add keys for plan interest options, success message, error states, loading state

## Steps (ordered)
1. Run `pnpm add resend --filter=marketing`.
2. Add env vars to `apps/marketing/.env.example`.
3. Create `apps/marketing/app/api/contact/route.ts` with full logic.
4. Update `apps/marketing/components/contact-form.tsx` — client component, fetch, states, honeypot, plan dropdown.
5. Update `locales/en/contact.json` with new translation keys.
6. Update `locales/ar-EG/contact.json` with same keys (Arabic strings).
7. Test manually: submit form → check Resend dashboard for sent emails.
8. Test honeypot: fill `website` field → verify no email sent, 200 returned.
9. Test rate limit: submit 4 times rapidly → verify 4th returns 429.
10. Run `pnpm turbo typecheck --filter=marketing`.
11. Run `pnpm turbo build --filter=marketing`.
12. Commit: `feat(marketing): contact form backend — Resend API, rate limiting, honeypot (phase 4)`.

## Scope (out)
- OG images (Phase 5)
- Marketing Intelligence Suite (future initiative)

## Acceptance criteria
- [ ] Form submits and team notification email arrives in Resend sandbox
- [ ] Auto-reply sent to submitter email
- [ ] Honeypot: filled `website` field returns 200, sends no email
- [ ] Rate limiter: 4th submission in window returns 429 with "too many requests" message
- [ ] Missing `RESEND_API_KEY`: form returns 503 with fallback email address shown in UI
- [ ] All form states (loading, success, error) visible and translated
- [ ] `pnpm turbo typecheck --filter=marketing` passes
- [ ] `pnpm turbo build --filter=marketing` passes

## Files likely touched
- `apps/marketing/package.json`
- `apps/marketing/.env.example`
- `apps/marketing/app/api/contact/route.ts` (new)
- `apps/marketing/components/contact-form.tsx` (updated)
- `apps/marketing/locales/en/contact.json`
- `apps/marketing/locales/ar-EG/contact.json`

## Git commit
```
feat(marketing): contact form backend — Resend API, rate limiting, honeypot (phase 4)
```
