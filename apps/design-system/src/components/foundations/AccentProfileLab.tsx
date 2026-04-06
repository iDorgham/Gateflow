'use client';

import * as React from 'react';
import { Button, cn } from '@gateflow/ui';
import { Palette, Check } from 'lucide-react';

const profiles = [
  {
    id: 'kimchi',
    name: 'Kimchi',
    color: 'oklch(62% 0.22 35)',
    description: 'Energetic brand default',
  },
  {
    id: 'cobalt',
    name: 'Cobalt',
    color: 'oklch(50% 0.18 250)',
    description: 'Professional trust',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    color: 'oklch(65% 0.15 155)',
    description: 'Safety & reliability',
  },
];

export function AccentProfileLab() {
  const [activeProfile, setActiveProfile] = React.useState('kimchi');

  const applyProfile = (id: string) => {
    setActiveProfile(id);
    document.documentElement.setAttribute('data-accent-profile', id);
  };

  return (
    <div className="flex flex-col gap-6 p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-xl relative overflow-hidden group">
      {/* Dynamic Background Glow */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] transition-all duration-700 opacity-20 pointer-events-none"
        style={{
          backgroundColor: profiles.find((p) => p.id === activeProfile)?.color,
        }}
      />

      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--ds-accent-bold)] text-white shadow-lg transition-transform duration-500 group-hover:rotate-12">
            <Palette size={20} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
            Accent Profile Lab
          </h3>
        </div>
        <p className="text-sm text-[var(--ds-text-subtle)] max-w-lg leading-relaxed">
          Switch between enterprise accent profiles to see how the system
          adapts. All components using{' '}
          <code className="text-[var(--ds-text-accent)]">
            --ds-primary-accent
          </code>{' '}
          will update instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => applyProfile(profile.id)}
            className={cn(
              'flex flex-col gap-3 p-5 rounded-2xl border-2 transition-all duration-300 text-start group/card',
              activeProfile === profile.id
                ? 'border-[var(--ds-accent-bold)] bg-[var(--ds-accent-subtle)] shadow-lg scale-[1.02]'
                : 'border-transparent bg-[var(--ds-background-default)] hover:border-[var(--ds-border)] hover:bg-[var(--ds-surface-raised)]'
            )}
          >
            <div className="flex items-center justify-between">
              <div
                className="w-10 h-10 rounded-full border-2 border-white/20 shadow-inner"
                style={{ backgroundColor: profile.color }}
              />
              {activeProfile === profile.id && (
                <div className="h-6 w-6 rounded-full bg-[var(--ds-accent-bold)] flex items-center justify-center text-white scale-110 shadow-md">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  'font-black uppercase tracking-tight text-sm',
                  activeProfile === profile.id
                    ? 'text-[var(--ds-text-accent)]'
                    : 'text-[var(--ds-text-primary)]'
                )}
              >
                {profile.name}
              </span>
              <span className="text-[10px] font-medium text-[var(--ds-text-subtle)] leading-tight opacity-70">
                {profile.description}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-4 relative z-10">
        <Button className="bg-[var(--ds-accent-bold)] hover:bg-[var(--ds-accent-hover)] text-white font-bold rounded-xl px-6 shadow-lg shadow-[var(--ds-accent-bold)]/20 transition-all active:scale-95">
          Primary Action
        </Button>
        <Button
          variant="outline"
          className="border-[var(--ds-border-bold)] hover:bg-[var(--ds-accent-subtle)] hover:text-[var(--ds-text-accent)] hover:border-[var(--ds-accent-bold)] font-bold rounded-xl px-6 transition-all"
        >
          Outline Example
        </Button>
        <div className="flex items-center gap-2 px-4 rounded-xl bg-[var(--ds-surface-raised)] border border-[var(--ds-border-subtle)]">
          <span className="text-xs font-black uppercase tracking-widest text-[var(--ds-text-accent)]">
            Live Preview
          </span>
          <div className="h-2 w-2 rounded-full bg-[var(--ds-accent-bold)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
