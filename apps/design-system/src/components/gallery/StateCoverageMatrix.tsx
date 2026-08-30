'use client';

import * as React from 'react';
import { Button, Input, Badge, Card, FormField } from '@gateflow/ui';
import { Check, AlertCircle } from 'lucide-react';

/**
 * Live State Coverage Matrix
 * Demonstrates 8 canonical states across primary interactive primitives in real-time.
 */
export function StateCoverageMatrix() {
  const [selectedToggle, setSelectedToggle] = React.useState(true);

  return (
    <div className="w-full overflow-x-auto rounded-[var(--ds-radius-lg)] border border-[var(--ds-border-subtle)] bg-[var(--ds-layer-02)] p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-1 text-start">
        <h3 className="text-lg font-semibold text-[var(--ds-text-primary)]">
          Live State Coverage Matrix (8 Canonical States)
        </h3>
        <p className="text-sm text-[var(--ds-text-subtle)]">
          Every interactive primitive explicitly implements and validates each interaction state according to WCAG 2.2 AA.
        </p>
      </div>

      <table className="w-full min-w-[700px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--ds-border-subtle)] bg-[var(--ds-layer-01)] text-xs uppercase tracking-wider text-[var(--ds-text-subtlest)]">
            <th className="px-4 py-3">Component</th>
            <th className="px-4 py-3">Default</th>
            <th className="px-4 py-3">Hover / Active</th>
            <th className="px-4 py-3">Focus-Visible</th>
            <th className="px-4 py-3">Disabled</th>
            <th className="px-4 py-3">Loading</th>
            <th className="px-4 py-3">Selected / Toggle</th>
            <th className="px-4 py-3">Error / Danger</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--ds-border-subtle)]">
          {/* Button Row */}
          <tr>
            <td className="px-4 py-4 font-semibold text-[var(--ds-text-primary)]">Button</td>
            <td className="px-4 py-4">
              <Button variant="primary" size="sm">Action</Button>
            </td>
            <td className="px-4 py-4">
              <Button variant="primary" size="sm" className="hover:bg-[var(--ds-color-primary-hover)]">Hovered</Button>
            </td>
            <td className="px-4 py-4">
              <Button variant="primary" size="sm" className="ring-2 ring-[var(--ds-border-focused)] ring-offset-2">Focused</Button>
            </td>
            <td className="px-4 py-4">
              <Button variant="primary" size="sm" disabled>Disabled</Button>
            </td>
            <td className="px-4 py-4">
              <Button variant="primary" size="sm" isLoading>Loading</Button>
            </td>
            <td className="px-4 py-4">
              <Button
                variant={selectedToggle ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedToggle(!selectedToggle)}
              >
                {selectedToggle ? <Check className="w-3.5 h-3.5 me-1" /> : null} Toggle
              </Button>
            </td>
            <td className="px-4 py-4">
              <Button variant="destructive" size="sm">Destructive</Button>
            </td>
          </tr>

          {/* FormField / Input Row */}
          <tr>
            <td className="px-4 py-4 font-semibold text-[var(--ds-text-primary)]">FormField</td>
            <td className="px-4 py-4" colSpan={2}>
              <FormField label="Standard ID" helperText="Numeric pass ID">
                <Input placeholder="12345" className="h-8 text-xs" />
              </FormField>
            </td>
            <td className="px-4 py-4" colSpan={2}>
              <FormField label="Disabled State" isDisabled helperText="Non-editable">
                <Input placeholder="Locked" className="h-8 text-xs" />
              </FormField>
            </td>
            <td className="px-4 py-4" colSpan={3}>
              <FormField label="Error State" errorMessage="Invalid National ID" isInvalid>
                <Input placeholder="999" className="h-8 text-xs" />
              </FormField>
            </td>
          </tr>

          {/* Badge Row */}
          <tr>
            <td className="px-4 py-4 font-semibold text-[var(--ds-text-primary)]">Badge / Tag</td>
            <td className="px-4 py-4">
              <Badge variant="solid" tone="primary">Solid</Badge>
            </td>
            <td className="px-4 py-4">
              <Badge variant="soft" tone="success">Soft</Badge>
            </td>
            <td className="px-4 py-4">
              <Badge variant="outline" tone="info">Outline</Badge>
            </td>
            <td className="px-4 py-4">
              <Badge variant="soft" tone="neutral" className="opacity-40">Muted</Badge>
            </td>
            <td className="px-4 py-4">
              <Badge variant="dot" tone="primary" pulse>Live Sync</Badge>
            </td>
            <td className="px-4 py-4">
              <Badge variant="solid" tone="success" isRemovable onRemove={() => {}}>Active</Badge>
            </td>
            <td className="px-4 py-4">
              <Badge variant="solid" tone="danger">Breach</Badge>
            </td>
          </tr>

          {/* Card Row */}
          <tr>
            <td className="px-4 py-4 font-semibold text-[var(--ds-text-primary)]">Card</td>
            <td className="px-4 py-4" colSpan={2}>
              <Card variant="interactive" className="p-3 text-xs">
                <p className="font-semibold">Interactive Card</p>
                <p className="text-[var(--ds-text-subtle)]">Hover for rim-light glow</p>
              </Card>
            </td>
            <td className="px-4 py-4" colSpan={2}>
              <Card variant="selectable" isSelected className="p-3 text-xs">
                <p className="font-semibold text-[var(--ds-text-brand)]">Selected State</p>
                <p className="text-[var(--ds-text-subtle)]">Active perimeter profile</p>
              </Card>
            </td>
            <td className="px-4 py-4" colSpan={3}>
              <Card variant="sunken" className="p-3 text-xs">
                <p className="font-semibold text-[var(--ds-text-subtlest)]">Sunken Canvas</p>
                <p className="text-[var(--ds-text-subtle)]">Background gutter layer</p>
              </Card>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
