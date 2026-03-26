import * as React from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Loader2, TrendingUp } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { token } from '@atlaskit/tokens';
import { gaSpring, gaInitialScale, gaScaleIn } from '../GateAITokens';

export function LiveChartComponent(props: NodeViewProps) {
  const { node } = props;
  const { tagId, tagName, color, isRtl } = node.attrs;
  const shouldReduceMotion = useReducedMotion();

  const [data, setData] = React.useState<unknown[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const springConfig = gaSpring;

  const PRESET_COLORS = [
    token('color.text.danger', '#AE2A19'), // Kimchi Orange -> now aligned to ADS Danger
    token('color.text.brand', '#0C66E4'), // Midnight Blue -> now aligned to ADS Brand
    token('color.text.information', '#0055CC'), // Deep Sea Info -> now aligned to ADS Info
    token('color.text.success', '#216751'), // Success Green
    token('color.text.warning', '#974F0C'), // Warning Amber
  ];
  React.useEffect(() => {
    let mounted = true;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));

        if (!mounted) return;

        setData([
          { name: 'Mon', value: Math.floor(Math.random() * 50) + 10 },
          { name: 'Tue', value: Math.floor(Math.random() * 50) + 10 },
          { name: 'Wed', value: Math.floor(Math.random() * 50) + 10 },
          { name: 'Thu', value: Math.floor(Math.random() * 50) + 10 },
          { name: 'Fri', value: Math.floor(Math.random() * 50) + 10 },
          { name: 'Sat', value: Math.floor(Math.random() * 50) + 10 },
          { name: 'Sun', value: Math.floor(Math.random() * 50) + 10 },
        ]);
      } catch (err: unknown) {
        if (mounted && err instanceof Error) {
          setError(err.message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (tagId) {
      fetchAnalytics();
    } else {
      setLoading(false);
      setError('No tag context provided.');
    }

    return () => {
      mounted = false;
    };
  }, [tagId]);

  return (
    <NodeViewWrapper className="my-6 select-none" as="div" draggable>
      <motion.div
        initial={gaInitialScale(shouldReduceMotion)}
        animate={gaScaleIn(shouldReduceMotion)}
        className="rounded-xl border border-[var(--ga-navy-border)] bg-[var(--ga-panel-bg)] p-5 shadow-lg backdrop-blur-md overflow-hidden"
        contentEditable={false}
      >
        <div className="flex items-center gap-3 mb-5 border-b border-[var(--ga-navy-border)] pb-3">
          <div
            className="w-8 h-8 rounded-md bg-[var(--ds-background-neutral-subtle)] flex items-center justify-center"
            style={{ color }}
          >
            <TrendingUp size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-[var(--ga-text-primary)] text-sm leading-tight">
              Live Analysis: <span style={{ color }}>{tagName}</span>
            </h3>
            <span className="text-[10px] text-[var(--ga-text-muted)] uppercase tracking-wider">
              {tagId ? `ID: ${tagId.slice(0, 8)}...` : 'Unlinked'}
            </span>
          </div>

          <div className="ms-auto text-xs text-[var(--ga-text-muted)] flex items-center gap-1.5 bg-[var(--ds-background-neutral-subtle)] rounded-full px-2.5 py-1 select-none">
            {loading ? (
              <Loader2
                size={12}
                className="animate-spin text-[var(--ga-text-muted)]"
              />
            ) : (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
            <span className="font-medium tracking-wide">
              {loading ? 'SYNCING' : 'LIVE'}
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-sm text-[var(--ga-text-muted)] font-mono animate-pulse">
                AGGREGATING DATAPOINTS...
              </span>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center text-red-400 text-sm">
              {error}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={
                  isRtl
                    ? { top: 5, right: -25, left: 10, bottom: 5 }
                    : { top: 5, right: 10, left: -25, bottom: 5 }
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--ga-text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  reversed={isRtl}
                />
                <YAxis
                  stroke="var(--ga-text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  orientation={isRtl ? 'right' : 'left'}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--ga-navy)',
                    border: '1px solid var(--ga-navy-border)',
                    borderRadius: '8px',
                    color: 'var(--ga-text-primary)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  }}
                  itemStyle={{
                    color: 'var(--ga-text-primary)',
                    fontWeight: 600,
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar
                  dataKey="value"
                  fill={color || token('color.text.danger', '#ED4B00')}
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={!shouldReduceMotion}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </NodeViewWrapper>
  );
}
