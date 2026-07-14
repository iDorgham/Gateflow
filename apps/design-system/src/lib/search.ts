export interface SearchItem {
  title: string;
  href: string;
  category: string;
  content: string;
}

export const searchIndex: SearchItem[] = [
  {
    title: 'Foundations',
    href: '/foundations',
    category: 'Documentation',
    content: 'Branding, principles, and core philosophy of GateFlow Design.',
  },
  {
    title: 'Tokens',
    href: '/tokens',
    category: 'Documentation',
    content: 'Semantic colors, typography, spacing, and transition tokens.',
  },
  {
    title: 'Accessibility',
    href: '/accessibility',
    category: 'Documentation',
    content: 'WCAG compliance, keyboard navigation, and screen reader support.',
  },
  {
    title: 'Primitives',
    href: '/components/primitives',
    category: 'Components',
    content: 'Buttons, Inputs, Badges, and other atomic UI building blocks.',
  },
  {
    title: 'Patterns',
    href: '/components/patterns',
    category: 'Components',
    content: 'PageHeader, EntityCard, FilterBar, and composed product layouts.',
  },
  {
    title: 'AI UI',
    href: '/components/ai',
    category: 'Components',
    content:
      'Agentic patterns: Message cards, reasoning indicators, and tool outputs.',
  },
  {
    title: 'Packages',
    href: '/packages',
    category: 'Documentation',
    content: 'Authoritative catalog of @gateflow monorepo libraries.',
  },
  {
    title: 'Guidelines',
    href: '/guidelines',
    category: 'Documentation',
    content:
      'Universal principles, RTL parity, and logical property contracts.',
  },
  {
    title: 'Changelog',
    href: '/changelog',
    category: 'Documentation',
    content: 'Release history and version tracking for the design system.',
  },
];
