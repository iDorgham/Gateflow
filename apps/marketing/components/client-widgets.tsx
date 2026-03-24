'use client';

import dynamic from 'next/dynamic';

const CookieBanner = dynamic(
  () => import('./cookie-banner').then((mod) => mod.CookieBanner),
  { ssr: false }
);

const ChatWidget = dynamic(
  () => import('./chat-widget').then((mod) => mod.ChatWidget),
  { ssr: false }
);

export function ClientWidgets() {
  return (
    <>
      <CookieBanner />
      <ChatWidget />
    </>
  );
}
