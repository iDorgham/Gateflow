'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, Shield, AlertCircle, Info } from 'lucide-react';
import { 
  Button, 
  Input, 
  Label, 
  Card, 
  Switch,
} from '@gate-access/ui';

export function OpenQRForm({ unitId }: { unitId: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const [formData, setFormData] = React.useState({
    isOpenQR: true,
    maxUses: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '22:00',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/resident/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId,
          isOpenQR: true,
          visitorName: 'Open Access Pass',
          accessType: 'DATERANGE',
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create Open QR');
      }

      router.push(`/visitors/${data.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Usage Limit</h3>
        <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-xl">
          <div className="space-y-1.5">
            <Label htmlFor="maxUses">Max Visitors Allowed</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="maxUses"
                type="number"
                min="1"
                max="50"
                className="pl-9"
                required
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) })}
              />
            </div>
            <p className="text-[11px] text-slate-500 flex items-start gap-1 mt-1">
              <Info className="h-3 w-3 mt-0.5 shrink-0" />
              Total number of successful entries allowed with this single QR code.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Time Constraints</h3>
        <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-xl">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Input 
                type="date" 
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>End Date</Label>
              <Input 
                type="date" 
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Entry From</Label>
              <Input 
                type="time" 
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Entry Until</Label>
              <Input 
                type="time" 
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
        <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-900">Security Warning</p>
          <p className="text-xs text-amber-700 leading-tight mt-1">
            Open QRs do not track individual visitor identities. Use them only for trusted groups or public events.
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-base font-semibold bg-slate-900 hover:bg-slate-800" disabled={loading}>
        {loading ? 'Generating QR...' : 'Create Open QR'}
      </Button>
    </form>
  );
}
