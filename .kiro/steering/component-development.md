---
inclusion: fileMatch
fileMatchPattern: '**/{components,app}/**/*.{tsx,jsx}'
---

# Component Development Guidelines

## Component Structure
```typescript
'use client'; // Only if using hooks/interactivity

import { useState } from 'react';
import { Button } from '@gate-access/ui';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [state, setState] = useState(false);
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </div>
  );
}
```

## Use Shared UI Components
Import from `@gate-access/ui`:
```typescript
import {
  Button,
  Card,
  Input,
  Select,
  Table,
  Modal,
  Badge,
  Alert
} from '@gate-access/ui';
```

## Internationalization
```typescript
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('namespace');
  
  return <h1>{t('title')}</h1>;
}
```

## Form Handling
```typescript
'use client';

import { useState } from 'react';
import { Button, Input } from '@gate-access/ui';

export function MyForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit');
      }
      
      // Handle success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Input name="field" required />
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
```

## Tailwind CSS Classes
- Use Tailwind utility classes
- Follow mobile-first responsive design
- Use design tokens from `docs/DESIGN_TOKENS.md`
- Common patterns:
  - Spacing: `p-4`, `m-2`, `gap-4`
  - Layout: `flex`, `grid`, `items-center`, `justify-between`
  - Typography: `text-lg`, `font-semibold`, `text-gray-700`
  - Colors: `bg-blue-500`, `text-white`, `border-gray-300`

## Accessibility
- Use semantic HTML
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios
