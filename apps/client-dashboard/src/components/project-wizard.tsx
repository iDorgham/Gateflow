'use client';

import React, { useState, useTransition, useCallback } from 'react';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
  Button, Input, Label, Textarea 
} from '@gate-access/ui';
import { Check, ArrowRight, ArrowLeft, ImageIcon, Link2, MapPin, Trash2, Plus, UploadCloud, Building2, UsersRound, Loader2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';

interface ProjectWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const parseCSV = (text: string) => {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || '';
    });
    return obj;
  });
  return rows;
};

export function ProjectWizard({ open, onOpenChange, onSuccess }: ProjectWizardProps) {
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();

  // Step 1 State
  const [details, setDetails] = useState({ name: '', description: '', location: '', logoUrl: '', coverUrl: '', website: '' });
  
  // Step 2 State
  const [gates, setGates] = useState([{ id: 'default-1', name: 'Main Gate', location: '' }]);
  
  // Step 3 & 4 State
  const [units, setUnits] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const addGate = () => {
    setGates([...gates, { id: Math.random().toString(), name: `Gate ${gates.length + 1}`, location: '' }]);
  };

  const removeGate = (id: string) => {
    if (gates.length <= 1) return toast.error("A project must have at least one gate.");
    setGates(gates.filter(g => g.id !== id));
  };

  const updateGate = (id: string, field: 'name' | 'location', value: string) => {
    setGates(gates.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'units' | 'contacts') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      if (type === 'units') {
        const mapped = parsed.map(p => ({
          name: p.name || `Unit-${Math.floor(Math.random() * 1000)}`,
          type: (p.type || 'STUDIO').toUpperCase(),
          qrQuota: parseInt(p.quota || p.qrquota || '5', 10)
        }));
        setUnits(mapped);
        toast.success(`Loaded ${mapped.length} units`);
      } else {
        const mapped = parsed.map(p => ({
          firstName: p.firstname || p['first name'] || 'Unknown',
          lastName: p.lastname || p['last name'] || '',
          email: p.email || '',
          phone: p.phone || '',
          company: p.company || ''
        }));
        setContacts(mapped);
        toast.success(`Loaded ${mapped.length} contacts`);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  const handleSubmit = async () => {
    if (!details.name.trim()) {
      setStep(0);
      return toast.error("Project name is required.");
    }

    startTransition(async () => {
      try {
        const payload = {
          ...details,
          gates: gates.map(g => ({ name: g.name, location: g.location })),
          units: units,
          contacts: contacts
        };

        const res = await csrfFetch('/api/projects/wizard', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
          toast.success("Project setup complete!");
          onOpenChange(false);
          // reset state
          setStep(0);
          setDetails({ name: '', description: '', location: '', logoUrl: '', coverUrl: '', website: '' });
          setGates([{ id: 'default-1', name: 'Main Gate', location: '' }]);
          setUnits([]);
          setContacts([]);
          if (onSuccess) onSuccess();
        } else {
          toast.error(data.details || data.error || "Failed to finalize project setup.");
        }
      } catch (e) {
        toast.error("Network error during setup.");
      }
    });
  };

  const steps = [
    { title: "Details", subtitle: "Core Identity", icon: Building2 },
    { title: "Gates", subtitle: "Access Points", icon: KeyRound },
    { title: "Units", subtitle: "Properties", icon: MapPin },
    { title: "Contacts", subtitle: "Residents", icon: UsersRound },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl sm:rounded-2xl p-0 overflow-hidden bg-background border-border">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/5 via-transparent to-background p-6 border-b border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground">Project Wizard</DialogTitle>
            <DialogDescription className="text-base font-medium text-muted-foreground">
              Define the structure, resources, and access parameters of your new project.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center justify-between px-8 py-4 bg-muted/10 border-b border-border/50 overflow-x-auto">
          {steps.map((s, i) => {
            const isActive = i === step;
            const isCompleted = i < step;
            const Icon = s.icon;
            
            return (
              <div key={s.title} className="flex items-center">
                <div className={`flex items-center gap-3 ${isActive ? 'opacity-100' : 'opacity-40 grayscale'} transition-all`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${isActive ? 'bg-primary text-primary-foreground shadow-md' : isCompleted ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold text-foreground leading-none">{s.title}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{s.subtitle}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-px mx-4 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic Content */}
        <div className="p-6 h-[500px] overflow-y-auto w-full">
          {step === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Project Name <span className="text-destructive">*</span></Label>
                  <Input value={details.name} onChange={e => setDetails({...details, name: e.target.value})} placeholder="e.g. Marina Bay Residences" className="h-11 rounded-xl bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location</Label>
                  <Input value={details.location} onChange={e => setDetails({...details, location: e.target.value})} placeholder="City, Region or Full Address" className="h-11 rounded-xl bg-muted/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                <Textarea value={details.description} onChange={e => setDetails({...details, description: e.target.value})} placeholder="Brief overview..." className="min-h-[80px] resize-none rounded-xl bg-muted/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><ImageIcon className="h-3 w-3"/> Logo URL</Label>
                  <Input type="url" value={details.logoUrl} onChange={e => setDetails({...details, logoUrl: e.target.value})} placeholder="https://..." className="h-11 rounded-xl bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><ImageIcon className="h-3 w-3"/> Cover URL</Label>
                  <Input type="url" value={details.coverUrl} onChange={e => setDetails({...details, coverUrl: e.target.value})} placeholder="https://..." className="h-11 rounded-xl bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Link2 className="h-3 w-3"/> Website</Label>
                  <Input type="url" value={details.website} onChange={e => setDetails({...details, website: e.target.value})} placeholder="https://..." className="h-11 rounded-xl bg-muted/50" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Access Gates</h3>
                  <p className="text-sm text-muted-foreground">Define physical checkpoints for this project.</p>
                </div>
                <Button onClick={addGate} variant="secondary" size="sm" className="gap-2 rounded-xl font-bold bg-primary/10 text-primary hover:bg-primary/20">
                  <Plus className="h-4 w-4" /> Add Gate
                </Button>
              </div>
              <div className="space-y-3">
                {gates.map((g, idx) => (
                  <div key={g.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl border border-border/50 bg-muted/20">
                    <div className="w-full space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Gate Name</Label>
                      <Input value={g.name} onChange={e => updateGate(g.id, 'name', e.target.value)} className="h-10 rounded-xl bg-background" />
                    </div>
                    <div className="w-full space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Specific Location</Label>
                      <Input value={g.location} onChange={e => updateGate(g.id, 'location', e.target.value)} placeholder="e.g. North Entrance" className="h-10 rounded-xl bg-background" />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeGate(g.id)} className="mt-5 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Units Mapping (Optional)</h3>
                  <p className="text-sm text-muted-foreground">Upload a CSV to bulk-create properties or offices.</p>
                </div>
              </div>
              
              <div className="relative flex-1 rounded-2xl border-2 border-dashed border-border/60 bg-muted/10 hover:bg-muted/30 transition-colors flex flex-col items-center justify-center p-6 text-center group overflow-hidden">
                <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, 'units')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                {units.length > 0 ? (
                  <div className="absolute inset-0 overflow-y-auto p-4 bg-background/95 backdrop-blur-sm z-20">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-bold text-primary">{units.length} Units Parsed Ready</p>
                      <Button size="sm" variant="outline" onClick={() => setUnits([])} className="h-8 rounded-lg text-xs font-bold">Clear Mappings</Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-left">
                      {units.slice(0, 50).map((u, i) => (
                        <div key={i} className="p-2 border border-border/50 rounded-lg bg-muted/20 text-xs">
                          <span className="font-bold">{u.name}</span> <span className="text-muted-foreground block text-[10px]">{u.type} • {u.qrQuota} QR/mo</span>
                        </div>
                      ))}
                      {units.length > 50 && <div className="p-2 flex items-center justify-center text-xs font-bold text-muted-foreground">+{units.length - 50} more...</div>}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold text-foreground mb-1">Drag & Drop CSV File</h4>
                    <p className="text-sm text-muted-foreground max-w-[280px]">Ensure columns match: <br/><code className="text-xs bg-muted p-1 rounded font-mono">name, type, quota</code></p>
                    <Button type="button" variant="secondary" className="mt-6 rounded-xl font-bold z-0 pointer-events-none">Browse Files</Button>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Resident Contacts (Optional)</h3>
                  <p className="text-sm text-muted-foreground">Upload a CSV to bulk-create residents or staff.</p>
                </div>
              </div>
              
              <div className="relative flex-1 rounded-2xl border-2 border-dashed border-border/60 bg-muted/10 hover:bg-muted/30 transition-colors flex flex-col items-center justify-center p-6 text-center group overflow-hidden">
                <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, 'contacts')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                {contacts.length > 0 ? (
                  <div className="absolute inset-0 overflow-y-auto p-4 bg-background/95 backdrop-blur-sm z-20">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-bold text-primary">{contacts.length} Contacts Parsed Ready</p>
                      <Button size="sm" variant="outline" onClick={() => setContacts([])} className="h-8 rounded-lg text-xs font-bold">Clear Mappings</Button>
                    </div>
                    <div className="space-y-2 text-left">
                      {contacts.slice(0, 10).map((c, i) => (
                        <div key={i} className="px-3 py-2 border border-border/50 rounded-lg bg-muted/20 text-sm flex justify-between items-center">
                          <span className="font-bold">{c.firstName} {c.lastName}</span>
                          <span className="text-muted-foreground text-xs">{c.email || c.phone}</span>
                        </div>
                      ))}
                      {contacts.length > 10 && <div className="text-center text-xs font-bold text-muted-foreground mt-4">+{contacts.length - 10} more...</div>}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold text-foreground mb-1">Drag & Drop CSV File</h4>
                    <p className="text-sm text-muted-foreground max-w-[280px]">Ensure columns match: <br/><code className="text-xs bg-muted p-1 rounded font-mono">firstname, lastname, email, phone</code></p>
                    <Button type="button" variant="secondary" className="mt-6 rounded-xl font-bold z-0 pointer-events-none">Browse Files</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border/50 bg-muted/10 flex items-center justify-between rounded-b-2xl">
          <Button variant="outline" onClick={handleBack} disabled={step === 0 || isPending} className="rounded-xl font-bold bg-background gap-2 min-w-[100px]">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending} className="rounded-xl font-bold">
              Cancel
            </Button>
            
            {step < steps.length - 1 ? (
              <Button onClick={handleNext} disabled={step === 0 && !details.name.trim()} className="gap-2 text-primary-foreground rounded-xl bg-primary font-bold shadow-sm hover:bg-primary/90 min-w-[120px]">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isPending} className="gap-2 text-primary-foreground rounded-xl bg-primary font-bold shadow-sm hover:bg-primary/90 min-w-[160px]">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Finalizing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Deploy Project
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
