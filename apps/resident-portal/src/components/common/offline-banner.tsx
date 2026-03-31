'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const update = () => setIsOffline(!navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="sticky top-0 z-40 border-b border-amber-200 bg-amber-50 px-4 py-2 text-amber-800">
      <div className="mx-auto flex max-w-3xl items-center gap-2 text-sm">
        <WifiOff className="h-4 w-4" />
        <span>You are offline. Cached QR passes remain available.</span>
      </div>
    </div>
  );
}
