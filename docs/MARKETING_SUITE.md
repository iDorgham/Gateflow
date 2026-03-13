# Marketing Suite — Complete Implementation

**Status:** ✅ Complete  
**Completed:** 2026-03-13  
**Duration:** ~2 hours

---

## 📋 Overview

The Marketing Suite provides comprehensive tracking and attribution capabilities for GateFlow, enabling organizations to measure the effectiveness of their marketing campaigns and integrate with external CRM systems.

---

## 🎯 Features Implemented

### 1. Meta Pixel Integration ✅

**File:** `apps/marketing/src/components/MarketingScripts.tsx`

- Automatic Meta Pixel initialization
- PageView tracking on all pages
- Custom event tracking (QR scans, contact creation)
- Configurable via `NEXT_PUBLIC_META_PIXEL_ID` environment variable

**Events Tracked:**
- `PageView` - Automatic on every page
- `QRScan` - When visitor scans QR code
- `Lead` - When contact is created

### 2. Google Analytics 4 (GA4) Integration ✅

**File:** `apps/marketing/src/components/MarketingScripts.tsx`

- Automatic GA4 initialization
- Page view tracking
- Custom event tracking
- Configurable via `NEXT_PUBLIC_GA4_MEASUREMENT_ID` environment variable

**Events Tracked:**
- Automatic page views
- `qr_scan` - QR code scans with attribution
- `generate_lead` - Contact creation with attribution

### 3. UTM Parameter Tracking ✅

**Files:**
- `apps/client-dashboard/src/lib/marketing-tracking.ts` - Utilities
- `apps/client-dashboard/src/app/api/marketing/utm-track/route.ts` - API endpoint

**Features:**
- Automatic UTM parameter extraction from URLs
- SessionStorage persistence for attribution
- QR code attribution (utm_source, utm_campaign)
- Contact attribution tracking

**Supported Parameters:**
- `utm_source` - Traffic source (e.g., "facebook", "google")
- `utm_medium` - Marketing medium (e.g., "cpc", "email")
- `utm_campaign` - Campaign name
- `utm_term` - Paid search keywords
- `utm_content` - Ad variation

### 4. CRM Webhook Integration ✅

**File:** `apps/client-dashboard/src/lib/crm-webhooks.ts`

**Features:**
- Automatic webhook triggers on marketing events
- HMAC-SHA256 signature for security
- Parallel webhook delivery
- Delivery status logging
- Failure retry tracking

**Webhook Events:**
- `contact.created` - New contact with attribution data
- `qr.scanned` - QR scan with attribution
- `visitor.arrived` - Guest arrival notification

**Payload Structure:**
```json
{
  "event": "contact.created",
  "data": {
    "contact": {
      "id": "...",
      "firstName": "...",
      "lastName": "...",
      "email": "...",
      "phone": "...",
      "source": "..."
    },
    "attribution": {
      "utm_source": "facebook",
      "utm_campaign": "summer_2026",
      "utm_medium": "cpc"
    }
  },
  "timestamp": "2026-03-13T04:00:00.000Z",
  "organizationId": "..."
}
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Marketing Suite Flow                          │
│                                                                  │
│  1. Visitor arrives with UTM params                              │
│     https://gateflow.site?utm_source=facebook&utm_campaign=...    │
│                                                                  │
│  2. UTM params stored in sessionStorage                          │
│     extractUTMParams() → storeUTMParams()                        │
│                                                                  │
│  3. Visitor scans QR code                                        │
│     QR landing page → /api/marketing/utm-track                   │
│                                                                  │
│  4. QRCode updated with attribution                              │
│     UPDATE QRCode SET utmSource=..., utmCampaign=...            │
│                                                                  │
│  5. Tracking pixels fired                                        │
│     trackPixelEvent('QRScan', {...})                             │
│     trackGA4Event('qr_scan', {...})                              │
│                                                                  │
│  6. Contact created (if new visitor)                             │
│     POST /api/contacts                                           │
│                                                                  │
│  7. CRM webhooks triggered                                       │
│     triggerContactCreatedWebhook(...)                            │
│     → External CRM receives event                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

UTM fields already exist in the `QRCode` model:

```prisma
model QRCode {
  // ... other fields
  utmCampaign  String?
  utmSource    String?
  // ...
}
```

No migration required - schema was already prepared for marketing suite.

---

## 🔧 Configuration

### Environment Variables

**Marketing Site** (`apps/marketing/.env.local`):
```bash
# Optional - leave empty to disable tracking
NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id_here
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Client Dashboard** (uses existing webhook configuration):
- Webhooks configured via UI at `/dashboard/settings/integrations`
- No additional environment variables needed

### Setup Steps

1. **Enable Meta Pixel:**
   ```bash
   # In apps/marketing/.env.local
   NEXT_PUBLIC_META_PIXEL_ID=123456789012345
   ```

2. **Enable GA4:**
   ```bash
   # In apps/marketing/.env.local
   NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Configure CRM Webhooks:**
   - Navigate to Client Dashboard → Settings → Integrations
   - Add webhook URL
   - Select events: `contact.created`, `qr.scanned`
   - Save webhook secret for signature verification

---

## 🎯 Usage Examples

### Track QR Scan with Attribution

```typescript
import { trackQRScan, getStoredUTMParams } from '@/lib/marketing-tracking';

// When QR is scanned
const utmParams = getStoredUTMParams();
trackQRScan(qrCode, utmParams);
```

### Track Contact Creation

```typescript
import { trackContactCreation } from '@/lib/marketing-tracking';

// After contact is created
trackContactCreation(contactId, utmParams);
```

### Verify Webhook Signature (CRM side)

```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === expectedSignature;
}

// In your webhook handler
const signature = request.headers['x-gateflow-signature'];
const isValid = verifyWebhookSignature(
  JSON.stringify(payload),
  signature,
  webhookSecret
);
```

---

## 📈 Analytics & Reporting

### Meta Pixel Events

View in Facebook Events Manager:
- **PageView** - All page visits
- **QRScan** - QR code scans with attribution
- **Lead** - Contact creations

### GA4 Events

View in Google Analytics:
- **page_view** - Automatic page tracking
- **qr_scan** - QR scans with custom parameters
- **generate_lead** - Lead generation events

### UTM Attribution Reports

Query QRCode table for attribution analysis:

```sql
SELECT 
  utmSource,
  utmCampaign,
  COUNT(*) as qr_scans,
  COUNT(DISTINCT contactId) as unique_contacts
FROM QRCode
WHERE utmSource IS NOT NULL
GROUP BY utmSource, utmCampaign
ORDER BY qr_scans DESC;
```

---

## 🔐 Security

### Webhook Security

- **HMAC-SHA256 signatures** on all webhook payloads
- **Signature verification** required on CRM side
- **Delivery logging** for audit trail
- **Failure tracking** for debugging

### Data Privacy

- UTM parameters stored only for attribution
- No PII in tracking pixels (IDs only)
- Webhook payloads include only necessary data
- GDPR-compliant (user consent via cookie banner)

---

## ✅ Testing

### Manual Testing Checklist

- [x] Meta Pixel loads on marketing site
- [x] GA4 loads on marketing site
- [x] UTM parameters captured from URL
- [x] UTM parameters stored in sessionStorage
- [x] QR scan triggers pixel events
- [x] Contact creation triggers pixel events
- [x] Webhooks deliver successfully
- [x] Webhook signatures verify correctly
- [x] Delivery status logged in audit log

### Test URLs

**With UTM parameters:**
```
https://gateflow.site?utm_source=facebook&utm_campaign=summer_2026&utm_medium=cpc
```

**QR landing page:**
```
https://gateflow.site/s/abc123?utm_source=email&utm_campaign=newsletter
```

---

## 📊 Impact

### Business Value

- **Attribution tracking** - Know which campaigns drive visitors
- **ROI measurement** - Calculate cost per visitor/contact
- **CRM integration** - Automatic lead sync to external systems
- **Retargeting** - Build audiences from physical visits
- **Campaign optimization** - Data-driven marketing decisions

### Technical Benefits

- **Zero breaking changes** - All features optional
- **Minimal performance impact** - Scripts load async
- **Privacy-compliant** - Respects cookie consent
- **Extensible** - Easy to add more tracking providers

---

## 📁 Files Created/Modified

### Created
- `apps/client-dashboard/src/lib/marketing-tracking.ts` (120 lines)
- `apps/client-dashboard/src/lib/crm-webhooks.ts` (180 lines)
- `apps/client-dashboard/src/app/api/marketing/utm-track/route.ts` (60 lines)
- `apps/marketing/src/components/MarketingScripts.tsx` (80 lines)

### Modified
- `apps/marketing/app/[locale]/layout.tsx` (added MarketingScripts)
- `apps/marketing/.env.example` (added tracking env vars)
- `apps/client-dashboard/src/app/api/contacts/route.ts` (added webhook trigger)

### Total Lines
- **Added:** ~440 lines
- **Modified:** ~10 lines

---

## 🚀 Next Steps (Optional Enhancements)

### Future Improvements

1. **WhatsApp Integration**
   - Send QR codes via WhatsApp Business API
   - Track delivery and open rates

2. **SMS Delivery**
   - Send QR codes via SMS (Twilio)
   - Track delivery status

3. **Advanced Attribution**
   - Multi-touch attribution models
   - Conversion funnel tracking
   - Cohort analysis

4. **More Tracking Providers**
   - LinkedIn Insight Tag
   - TikTok Pixel
   - Twitter Conversion Tracking

---

## 📝 Notes

- All tracking is **optional** - works without env vars
- **Privacy-first** - respects cookie consent banner
- **Performance-optimized** - scripts load after interactive
- **Production-ready** - tested and verified
- **No database migrations** - uses existing schema

---

**Marketing Suite Status:** ✅ **COMPLETE AND PRODUCTION-READY**

**MVP Completion:** 100% 🎉
