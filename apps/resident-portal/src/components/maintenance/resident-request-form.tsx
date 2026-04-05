'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Wrench,
  Droplets,
  Zap,
  Thermometer,
  Brush,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Button, Input, Label, Textarea, cn } from '@gateflow/ui';
import { toast } from 'sonner';

/** Category Options */
const categories = [
  {
    id: 'PLUMBING',
    label: 'Plumbing',
    icon: Droplets,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    id: 'ELECTRICAL',
    label: 'Electrical',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    id: 'HVAC',
    label: 'A/C & Heating',
    icon: Thermometer,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    id: 'JANITORIAL',
    label: 'Cleaning',
    icon: Brush,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    id: 'HARDWARE',
    label: 'Hardware',
    icon: Lock,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    id: 'GENERAL',
    label: 'General',
    icon: Wrench,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
  },
];

export function ResidentRequestForm() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    category: 'GENERAL' as string,
    title: '',
    description: '',
    priority: 'MEDIUM' as string,
  });

  const nextStep = () => {
    if (step === 1 && !formData.category) return;
    if (step === 2 && !formData.title.trim()) {
      setError('Please provide a title for your request');
      return;
    }
    setError(null);
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/resident/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit request');
      }

      toast.success('Maintenance request submitted successfully');
      router.push('/maintenance');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between px-2">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                step === s
                  ? 'bg-blue-600 text-white'
                  : step > s
                    ? 'bg-green-100 text-green-600'
                    : 'bg-slate-100 text-slate-400'
              )}
            >
              {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
            </div>
            {s < 3 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 bg-slate-100',
                  step > s && 'bg-green-100'
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
        {step === 1 && (
          <div className="p-6 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              What&apos;s the issue?
            </h3>
            <p className="text-sm text-slate-500 mb-6 font-arabic">
              ما هي المشكلة؟ اختر الفئة المناسبة
            </p>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const active = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, category: cat.id })
                    }
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all active:scale-95',
                      active
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                    )}
                  >
                    <div
                      className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center',
                        active ? 'bg-white/20' : cat.bg
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-6 w-6',
                          active ? 'text-white' : cat.color
                        )}
                      />
                    </div>
                    <span className="font-semibold text-xs tracking-wide uppercase">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-6 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Describe the problem
            </h3>
            <p className="text-sm text-slate-500 mb-6 font-arabic">
              يرجى وصف المشكلة بالتفصيل
            </p>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm mb-4">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title / Subject</Label>
                <Input
                  id="title"
                  placeholder="e.g. Leaking kitchen faucet"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setError(null);
                  }}
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Details (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us more about the issue... (e.g. When did it start?)"
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-6 flex-1 animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Review & Submit
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Confirm your request details
            </p>

            <div className="w-full bg-slate-50 rounded-xl p-4 text-left space-y-3 mb-6">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  Category
                </span>
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">
                  {formData.category}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-1">
                  Title
                </span>
                <p className="text-slate-900 font-medium">{formData.title}</p>
              </div>
              {formData.description && (
                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-1">
                    Description
                  </span>
                  <p className="text-sm text-slate-600">
                    {formData.description}
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 italic">
              Our team will review your request and get back to you shortly.
            </p>
          </div>
        )}

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={prevStep}
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}

          {step < 3 ? (
            <Button className="flex-[2] h-12 rounded-xl" onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="flex-[2] h-12 rounded-xl bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Confirm & Submit'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
