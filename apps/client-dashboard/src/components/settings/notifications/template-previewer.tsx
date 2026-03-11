'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Badge,
} from '@gate-access/ui';
import { Mail, Eye } from 'lucide-react';

interface Template {
  id: string;
  label: string;
  subject: string;
  body: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'scan_failed',
    label: 'Scan Denied Alert',
    subject: 'Access Denied at {{gate_name}} — {{timestamp}}',
    body: `Hi {{admin_name}},

A scan attempt was denied at **{{gate_name}}** in **{{project_name}}**.

**Details:**
- Visitor: {{visitor_name}}
- Time: {{timestamp}}
- Reason: {{denial_reason}}

Please review the scan log for more context.

— GateFlow Security`,
  },
  {
    id: 'qr_expired',
    label: 'QR Code Expired',
    subject: 'QR Code Expired — {{visitor_name}}',
    body: `Hi {{admin_name}},

The access QR code for **{{visitor_name}}** has expired.

**Details:**
- Gate: {{gate_name}}
- Expired at: {{timestamp}}
- Original issuer: {{issuer_name}}

You can regenerate a new code from the QR Codes dashboard.

— GateFlow`,
  },
  {
    id: 'new_member',
    label: 'New Team Member',
    subject: 'Welcome to {{org_name}}, {{member_name}}!',
    body: `Hi {{member_name}},

You have been added to **{{org_name}}** on GateFlow with the role **{{role_name}}**.

Click the link below to set up your password and access the dashboard:
{{activation_link}}

This link expires in 7 days.

— GateFlow Team`,
  },
  {
    id: 'system_alert',
    label: 'System Alert',
    subject: 'GateFlow System Notice — {{alert_type}}',
    body: `Hi {{admin_name}},

This is an automated system notice from GateFlow.

**Alert:** {{alert_message}}
**Severity:** {{severity}}
**Time:** {{timestamp}}

No action is required unless specified in the alert.

— GateFlow Platform`,
  },
];

const PLACEHOLDER_VALUES: Record<string, string> = {
  admin_name: 'Ahmed Al-Rashid',
  member_name: 'Sarah Johnson',
  org_name: 'Palm Heights Compound',
  gate_name: 'North Entrance Gate',
  project_name: 'Block A Residences',
  visitor_name: 'John Smith',
  timestamp: new Date().toLocaleString(),
  denial_reason: 'QR code expired',
  issuer_name: 'Maria García',
  role_name: 'Gate Operator',
  activation_link: 'https://app.gateflow.io/activate/abc123',
  alert_type: 'Maintenance Window',
  alert_message: 'Scheduled maintenance on Sunday 02:00–04:00 UTC.',
  severity: 'Low',
};

function renderTemplate(text: string): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => PLACEHOLDER_VALUES[key] ?? `{{${key}}}`);
}

export function TemplatePreviewer() {
  const [selectedId, setSelectedId] = useState(TEMPLATES[0].id);
  const template = TEMPLATES.find((t) => t.id === selectedId) ?? TEMPLATES[0];

  return (
    <Card className="rounded-2xl border-border shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Template Preview
            </CardTitle>
            <CardDescription>Preview notification emails with sample data.</CardDescription>
          </div>
          <Badge variant="outline" className="text-[10px] font-black uppercase text-muted-foreground/60 border-dashed">
            Read-only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="h-10 rounded-xl" aria-label="Select notification template">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {TEMPLATES.map((t) => (
              <SelectItem key={t.id} value={t.id} className="rounded-lg text-xs font-bold">
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Email preview */}
        <div className="rounded-2xl border border-border overflow-hidden">
          {/* Email header */}
          <div className="bg-muted/50 px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subject</p>
                <p className="text-sm font-bold text-foreground truncate">
                  {renderTemplate(template.subject)}
                </p>
              </div>
            </div>
          </div>

          {/* Email body */}
          <div className="p-6 bg-background">
            <pre className="text-xs text-foreground/80 leading-relaxed font-sans whitespace-pre-wrap">
              {renderTemplate(template.body)}
            </pre>
          </div>

          {/* Placeholder legend */}
          <div className="px-5 py-3 bg-muted/20 border-t border-border">
            <p className="text-[10px] text-muted-foreground font-medium">
              <span className="font-black text-primary">{'{{placeholders}}'}</span> are replaced with real data at send time.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
