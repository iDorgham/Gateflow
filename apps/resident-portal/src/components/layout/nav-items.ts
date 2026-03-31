import { History, Home, Plus, QrCode, User } from 'lucide-react';

export const portalNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/visitors', label: 'Visitors', icon: QrCode },
  { href: '/visitors/new', label: 'Create', icon: Plus },
  { href: '/history', label: 'History', icon: History },
  { href: '/profile', label: 'Profile', icon: User },
] as const;
