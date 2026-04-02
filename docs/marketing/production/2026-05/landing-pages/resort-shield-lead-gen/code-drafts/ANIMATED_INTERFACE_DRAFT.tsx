'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@gate-access/ui/button';
import { Input } from '@gate-access/ui/input';
import { Label } from '@gate-access/ui/label';
import { Card } from '@gate-access/ui/card';

/**
 * ANIMATED_INTERFACE_DRAFT.tsx
 * May 2026: Resort Shield Lead-Gen Production.
 * ADS Tokens & Framer Motion Integrated.
 */

const SPRING_PREMIUM = {
  type: 'spring',
  stiffness: 160,
  damping: 24,
  mass: 1.2,
};

export default function ResortShieldLanding() {
  return (
    <div className="bg-ds-surface-sunlight min-h-screen text-ds-text-heading overflow-hidden">
      {/* 1. Hero Section (Staggered Entrance) */}
      <section className="container mx-auto px-space-400 py-space-800 flex flex-col md:flex-row items-center gap-space-400">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1"
        >
          <motion.h1
            className="text-6xl font-heading-xlarge bg-gradient-to-r from-white to-ds-bg-brand bg-clip-text text-transparent leading-tight"
            layoutId="hero-title"
          >
            The Future of Resort Security in Sahl Hasheesh
          </motion.h1>
          <p className="text-xl text-ds-text-subtle mt-space-200 mb-space-400">
            GateFlow provides 100ms verification and 2,000+ room scalability for
            Egypt&apos;s leading 5-star resorts.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-ds-bg-brand text-ds-bg-default px-10 py-6 text-lg font-semibold rounded-lg shadow-cyan-pulse">
              Secure My Resort Architecture
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, ...SPRING_PREMIUM }}
          className="flex-1"
        >
          <div className="relative group">
            <img
              src="../photo/raw/hero.png"
              alt="Resort Shield Hero"
              className="rounded-2xl border border-ds-border shadow-2xl transition-all duration-500 group-hover:shadow-ds-brand-glow"
            />
            {/* Animated Glow Accent */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-ds-bg-brand/10 to-transparent"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* 2. High-Density Metrics (Shared Layout Morphs) */}
      <section className="bg-ds-surface-overlay py-space-400 border-y border-ds-border">
        <div className="container mx-auto px-space-400 grid grid-cols-2 md:grid-cols-4 gap-space-200">
          {[
            { label: 'Verification', value: '100ms', accent: 'speed' },
            { label: 'Daily Scale', value: '10,000+', accent: 'scale' },
            { label: 'Protocol', value: 'HMAC-256', accent: 'security' },
            { label: 'Sync Status', value: 'Real-Time', accent: 'pms' },
          ].map((metric, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="p-space-200 bg-ds-surface-sunlight border border-ds-border rounded-md text-center"
            >
              <div className="text-xs uppercase tracking-widest text-ds-text-subtle">
                {metric.label}
              </div>
              <div className="text-2xl font-bold text-ds-bg-brand mt-space-100">
                {metric.value}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Lead Generation Form (Multi-Step Logic) */}
      <section
        id="demo-form"
        className="container mx-auto px-space-400 py-space-800 flex justify-center"
      >
        <Card className="w-full max-w-2xl p-space-400 bg-ds-surface-overlay border border-ds-border shadow-cyan-pulse-subtle">
          <AnimatePresence mode="wait">
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-space-300"
            >
              <h2 className="text-3xl font-heading-large mb-space-400">
                Initiate Resort Audit
              </h2>
              <div className="space-y-space-200">
                <Label htmlFor="resort">Resort Name & Location</Label>
                <Input
                  id="resort"
                  placeholder="e.g. Sahl Hasheesh Elite"
                  className="bg-ds-surface-sunlight border-ds-border"
                />
              </div>
              <div className="space-y-space-200">
                <Label htmlFor="rooms">Estimated Room Count</Label>
                <select
                  id="rooms"
                  className="w-full bg-ds-surface-sunlight border border-ds-border p-space-100 rounded"
                >
                  <option>Under 500 rooms</option>
                  <option>500 - 1000 rooms</option>
                  <option>1000+ Room Enterprise</option>
                </select>
              </div>
              <Button
                type="submit"
                className="w-full bg-ds-bg-brand text-ds-bg-default font-bold py-4"
              >
                Next: Security Alignment
              </Button>
            </motion.div>
          </AnimatePresence>
        </Card>
      </section>
    </div>
  );
}
