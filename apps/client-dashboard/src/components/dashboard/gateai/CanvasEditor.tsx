'use client';

import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { LiveChartNode } from './live-chart/LiveChartNode';
import { Loader2, CheckCircle2, CloudFog } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { gaSpring, gaInitialFadeUp, gaFadeInUp } from './GateAITokens';

/**
 * GateAI Operations Hub - Canvas Editor (Phase 3)
 * Provides Tiptap Infinite Canvas with drag-and-drop support for tagging.
 */
export function CanvasEditor() {
  const { i18n } = useTranslation('dashboard');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ar-EG';
  const [saveState, setSaveState] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('saved');
  const debounceRef = React.useRef<NodeJS.Timeout>(null);
  const shouldReduceMotion = useReducedMotion();

  const springConfig = gaSpring;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Start typing '/' for commands, or drag a tag from the sidebar here to generate an instant chart...",
        emptyEditorClass: 'is-editor-empty',
      }),
      LiveChartNode,
    ],
    content: `<h1>AI assistant Workspace</h1><p>Drag tags from the sidebar to analyze live data blocks.</p>`,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-orange max-w-none focus:outline-none min-h-[500px] p-8',
      },
    },
    onUpdate: ({ editor }) => {
      setSaveState('saving');
      
      // Auto-save debouncer
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        // Optimistic UI save endpoint to `/api/gateai/canvas/sync` (simulated for Phase 3)
        // In real execution, we would extract editor.getJSON() and send it off.
        setSaveState('saved');
      }, 1200);
    },
  });

  // Handle Drag-and-Drop from TagSidebar
  React.useEffect(() => {
    if (!editor) return;

    const canvasElement = editor.view.dom;

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      
      const tagId = e.dataTransfer?.getData('application/vnd.gateai.tag.id');
      const tagName = e.dataTransfer?.getData('application/vnd.gateai.tag.name');
      const color = e.dataTransfer?.getData('application/vnd.gateai.tag.color');

      if (tagId && tagName) {
        // Find insert position
        const coordinates = editor.view.posAtCoords({ left: e.clientX, top: e.clientY });
        const pos = coordinates?.pos ?? editor.state.doc.content.size;

        editor
          .chain()
          .focus()
          .insertContentAt(pos, {
            type: 'liveChart',
            attrs: {
              tagId,
              tagName,
              color: color || '#ED4B00',
              isRtl,
            },
          })
          .run();
      }
    };

    const handleDragOver = (e: DragEvent) => {
      // Allow dropping only if it's our specific data format
      if (e.dataTransfer?.types.includes('application/vnd.gateai.tag.id')) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    canvasElement.addEventListener('drop', handleDrop);
    canvasElement.addEventListener('dragover', handleDragOver);

    return () => {
      canvasElement.removeEventListener('drop', handleDrop);
      canvasElement.removeEventListener('dragover', handleDragOver);
    };
  }, [editor, isRtl]);

  // Handle unmount cleanup
  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (!editor) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--ga-text-muted)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-transparent relative">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/30 backdrop-blur border border-[var(--ga-navy-border)] px-3 py-1.5 rounded-full text-xs text-[var(--ga-text-muted)]">
        {saveState === 'saving' && (
          <>
            <CloudFog size={14} className="animate-pulse text-[var(--ga-orange)]" />
            Saving...
          </>
        )}
        {saveState === 'saved' && (
          <>
            <CheckCircle2 size={14} className="text-green-500" />
            Saved to cloud
          </>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto ga-scroll">
        <motion.div 
          initial={gaInitialFadeUp(shouldReduceMotion)}
          animate={gaFadeInUp(shouldReduceMotion)}
          className="max-w-4xl mx-auto w-full"
          aria-label="Operations Canvas Content"
        >
          <EditorContent editor={editor} />
        </motion.div>
      </div>
    </div>
  );
}
