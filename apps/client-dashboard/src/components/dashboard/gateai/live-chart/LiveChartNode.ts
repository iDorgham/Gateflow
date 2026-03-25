import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { LiveChartComponent } from './LiveChartComponent';

export const LiveChartNode = Node.create({
  name: 'liveChart',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      tagId: {
        default: null,
      },
      tagName: {
        default: 'Analytics',
      },
      color: {
        default: 'var(--ga-orange)',
      },
      chartType: {
        default: 'bar', // 'bar', 'line', 'area'
      },
      isRtl: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-live-chart]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-live-chart': '' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LiveChartComponent);
  },
});
