'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, AlertCircle } from 'lucide-react';
import { 
  Button, 
  Input, 
  Label, 
  Tabs,
  TabsList,
  TabsTrigger,
} from '@gate-access/ui';

export function VisitorForm({ unitId }: { unitId: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const [formData, setFormData] = React.useState({
    visitorName: '',
    visitorPhone: '',
    visitorEmail: '',
    accessType: 'ONETIME' as 'ONETIME' | 'DATERANGE' | 'RECURRING',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '00:00',
    endTime: '23:59',
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
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create visitor');
      }

      router.push(`/visitors/${data.id}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
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
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Visitor Details</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="visitorName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="visitorName"
                placeholder="e.g. John Doe"
                className="pl-9"
                required
                value={formData.visitorName}
                onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="visitorPhone">Phone (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="visitorPhone"
                  placeholder="+971..."
                  className="pl-9"
                  value={formData.visitorPhone}
                  onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="visitorEmail">Email (Optional)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="visitorEmail"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-9"
                  value={formData.visitorEmail}
                  onChange={(e) => setFormData({ ...formData, visitorEmail: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Access Rules</h3>
        <Tabs 
          value={formData.accessType} 
          onValueChange={(val) => setFormData({ ...formData, accessType: val as 'ONETIME' | 'DATERANGE' | 'RECURRING' })}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="ONETIME">One-time</TabsTrigger>
            <TabsTrigger value="DATERANGE">Range</TabsTrigger>
            <TabsTrigger value="RECURRING">Daily</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{formData.accessType === 'DATERANGE' ? 'Start Date' : 'Date'}</Label>
                <Input 
                  type="date" 
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              {formData.accessType === 'DATERANGE' && (
                <div className="space-y-1.5">
                  <Label>End Date</Label>
                  <Input 
                    type="date" 
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start Time</Label>
                <Input 
                  type="time" 
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>End Time</Label>
                <Input 
                  type="time" 
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>
        </Tabs>
      </div>

      <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
        {loading ? 'Generating QR...' : 'Create Visitor Pass'}
      </Button>
    </form>
  );
}
