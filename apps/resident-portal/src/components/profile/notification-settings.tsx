'use client';

import * as React from 'react';
import { Bell, Mail, Shield } from 'lucide-react';

type NotificationState = {
  pushVisitorArrival: boolean;
  pushSecurityAlerts: boolean;
  emailWeeklySummary: boolean;
};

const DEFAULT_STATE: NotificationState = {
  pushVisitorArrival: true,
  pushSecurityAlerts: true,
  emailWeeklySummary: false,
};

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${checked ? 'right-1' : 'left-1'}`}
      />
    </button>
  );
}

export function NotificationSettings() {
  const [state, setState] = React.useState<NotificationState>(DEFAULT_STATE);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/resident/notifications', {
          cache: 'no-store',
        });
        if (!res.ok) return;
        const json = await res.json();
        if (json?.success && json?.data)
          setState(json.data as NotificationState);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const patch = async (partial: Partial<NotificationState>) => {
    setSaving(true);
    const next = { ...state, ...partial };
    setState(next);
    try {
      await fetch('/api/resident/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Push Notifications</h2>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Visitor Arrival
                </p>
                <p className="text-xs text-slate-500">
                  When a visitor scans at gate
                </p>
              </div>
            </div>
            <Toggle
              checked={state.pushVisitorArrival}
              onChange={() =>
                patch({ pushVisitorArrival: !state.pushVisitorArrival })
              }
            />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Security Alerts
                </p>
                <p className="text-xs text-slate-500">
                  Important security notifications
                </p>
              </div>
            </div>
            <Toggle
              checked={state.pushSecurityAlerts}
              onChange={() =>
                patch({ pushSecurityAlerts: !state.pushSecurityAlerts })
              }
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Email Notifications</h2>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-700">
                Weekly Summary
              </p>
              <p className="text-xs text-slate-500">Visitor activity summary</p>
            </div>
          </div>
          <Toggle
            checked={state.emailWeeklySummary}
            onChange={() =>
              patch({ emailWeeklySummary: !state.emailWeeklySummary })
            }
          />
        </div>
      </div>

      {(loading || saving) && (
        <p className="text-xs text-slate-500">
          {loading ? 'Loading preferences...' : 'Saving...'}
        </p>
      )}
    </div>
  );
}
