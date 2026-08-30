/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { render } from '@testing-library/react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { FormField } from '../components/ui/form-field';

describe('@gateflow/ui — Core Primitives & FormField Unit Tests', () => {
  describe('Button', () => {
    it('renders with default props', () => {
      const { getByRole } = render(<Button>Click me</Button>);
      const btn = getByRole('button', { name: /click me/i });
      expect(btn).toBeDefined();
      expect(btn.getAttribute('aria-busy')).toBeNull();
    });

    it('renders with isLoading spinner and sets aria-busy', () => {
      const { getByRole } = render(<Button isLoading>Submitting</Button>);
      const btn = getByRole('button');
      expect(btn.getAttribute('aria-busy')).toBe('true');
      expect(btn.hasAttribute('disabled')).toBe(true);
    });

    it('supports fab variant', () => {
      const { getByRole } = render(<Button variant="fab" size="fab">+</Button>);
      const btn = getByRole('button');
      expect(btn.className).toContain('rounded-full');
    });
  });

  describe('Badge', () => {
    it('renders 5 architectural variants', () => {
      const { getByText: getText1 } = render(<Badge variant="solid" tone="primary">Solid</Badge>);
      const { getByText: getText2 } = render(<Badge variant="soft" tone="success">Soft</Badge>);
      const { getByText: getText3 } = render(<Badge variant="outline" tone="info">Outline</Badge>);
      const { getByText: getText4 } = render(<Badge variant="ghost" tone="neutral">Ghost</Badge>);
      const { getByText: getText5 } = render(<Badge variant="dot" tone="primary" pulse>Live</Badge>);

      expect(getText1('Solid')).toBeDefined();
      expect(getText2('Soft')).toBeDefined();
      expect(getText3('Outline')).toBeDefined();
      expect(getText4('Ghost')).toBeDefined();
      expect(getText5('Live')).toBeDefined();
    });
  });

  describe('Card', () => {
    it('renders interactive and selectable cards', () => {
      const { getByText } = render(
        <Card variant="interactive" isSelected>
          <div>Card Content</div>
        </Card>
      );
      expect(getByText('Card Content')).toBeDefined();
    });
  });

  describe('FormField Composition & ARIA Linkage', () => {
    it('links label, helper text, and input ID', () => {
      const { getByLabelText, getByText } = render(
        <FormField label="Email Address" helperText="Corporate domain only" id="test-email">
          <Input placeholder="user@company.com" />
        </FormField>
      );

      const input = getByLabelText(/Email Address/i);
      expect(input.getAttribute('id')).toBe('test-email');
      expect(input.getAttribute('aria-describedby')).toBe('test-email-helper');
      expect(getByText('Corporate domain only')).toBeDefined();
    });

    it('sets aria-invalid and links error message on validation failure', () => {
      const { getByLabelText, getByRole } = render(
        <FormField label="Passcode" errorMessage="Passcode must be 6 digits" id="test-code">
          <Input placeholder="000000" />
        </FormField>
      );

      const input = getByLabelText(/Passcode/i);
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(input.getAttribute('aria-describedby')).toBe('test-code-error');
      expect(getByRole('alert')).toBeDefined();
    });
  });
});
