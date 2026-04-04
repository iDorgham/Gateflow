'use client';

import dynamic from 'next/dynamic';

const ChatWidget = dynamic(
  () => import('./chat-widget').then((mod) => mod.ChatWidget),
  { ssr: false }
);

export function ClientWidgets() {
  return (
    <>
      <ChatWidget />
    </>
  );
}
