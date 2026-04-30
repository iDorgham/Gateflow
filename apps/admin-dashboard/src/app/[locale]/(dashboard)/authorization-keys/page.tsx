import { Metadata } from 'next';
import { AuthKeysClient } from './authorization-keys-client';

export const metadata: Metadata = {
  title: 'Authorization Keys - GateFlow Admin',
  description: 'Manage platform-wide authorization keys and service accounts',
};

export default function AuthorizationKeysPage() {
  return <AuthKeysClient />;
}
