'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Tag as TagIcon, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { cn, Button } from '@gate-access/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { gaSpring } from './GateAITokens';

// Shared GateFlow real-estate palette presets
const PRESET_COLORS = [
  '#ED4B00', // Kimchi Orange
  '#020035', // Midnight Blue
  '#2000B1', // Deep Sea Info
  '#16A34A', // Success Green
  '#F59E0B', // Warning Amber
];

type AiTag = {
  id: string;
  name: string;
  color: string;
  _count?: { aiContents: number };
};

export function TagSidebar() {
  const { t } = useTranslation('dashboard');
  const [tags, setTags] = React.useState<AiTag[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  
  // Create form state
  const [newName, setNewName] = React.useState('');
  const [newColor, setNewColor] = React.useState(PRESET_COLORS[0]);
  const [isCreating, setIsCreating] = React.useState(false);

  // Fetch tags
  const fetchTags = React.useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/gateai/tags');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load tags');
      setTags(data.tags || []);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Create tag
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    try {
      setIsCreating(true);
      setError('');
      const res = await fetch('/api/gateai/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), color: newColor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create tag');
      
      setNewName('');
      setTags((prev) => [data.tag, ...prev]);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  // Delete tag
  const handleDelete = async (id: string) => {
    if (!confirm(t('ai.tags.confirmDelete', 'Are you sure you want to delete this tag?'))) return;
    
    try {
      // Optimistic update
      const prev = [...tags];
      setTags(tags.filter((t) => t.id !== id));
      
      const res = await fetch(`/api/gateai/tags?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        setTags(prev); // revert
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete tag');
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-[var(--ga-navy-border)] shrink-0">
        <TagIcon size={16} style={{ color: 'var(--ga-orange)' }} />
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--ga-text-primary)' }}
        >
          Assistant Tags
        </span>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="m-4 p-3 rounded-md bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-2 shrink-0">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Create Form */}
      <div className="p-4 border-b border-[var(--ga-navy-border)] shrink-0 bg-secondary/10">
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New tag name..."
            className="w-full bg-[var(--ga-navy)] border border-[var(--ga-navy-border)] rounded-md px-3 py-1.5 text-sm text-[var(--ga-text-primary)] placeholder-[var(--ga-text-muted)] focus:outline-none focus:border-[var(--ga-orange)] transition-colors"
            required
            maxLength={50}
          />
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 ga-scroll">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewColor(color)}
                  className={cn(
                    "w-5 h-5 rounded-full shrink-0 border-2 transition-transform",
                    newColor === color ? "scale-110 border-white" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={isCreating || !newName.trim()}
              className="shrink-0 bg-[var(--ga-orange)] hover:opacity-90 text-white border-0 h-8 px-3"
            >
              {isCreating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            </Button>
          </div>
        </form>
      </div>

      {/* Tags List */}
      <div className="flex-1 overflow-y-auto ga-scroll p-4 space-y-2" role="list">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-[var(--ga-text-muted)]" />
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-8 text-xs text-[var(--ga-text-muted)]">
            No tags found. Create one above to start organizing AI context.
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {tags.map((tag) => (
              <motion.div
                key={tag.id}
                layout
                role="listitem"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={gaSpring}
                draggable
                onDragStart={(e: any) => {
                  e.dataTransfer.setData('application/vnd.gateai.tag.id', tag.id);
                  e.dataTransfer.setData('application/vnd.gateai.tag.name', tag.name);
                  e.dataTransfer.setData('application/vnd.gateai.tag.color', tag.color || '#ED4B00');
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                className="group flex items-center justify-between p-2.5 rounded-md border border-transparent hover:border-[var(--ga-navy-border)] hover:bg-secondary/20 transition-colors cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-2.5 min-w-0 pointer-events-none">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: tag.color || '#ED4B00' }}
                  />
                  <span className="text-sm font-medium text-[var(--ga-text-primary)] truncate">
                    {tag.name}
                  </span>
                  {tag._count?.aiContents !== undefined && (
                    <span className="text-[10px] font-mono text-[var(--ga-text-muted)] bg-secondary/20 px-1.5 py-0.5 rounded-sm shrink-0">
                      {tag._count.aiContents}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(tag.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--ga-text-muted)] hover:text-red-400 transition-all shrink-0"
                  aria-label={`Delete ${tag.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
