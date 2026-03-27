import { MetadataRoute } from 'next';
import { token } from '@atlaskit/tokens';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GateFlow — Smart QR Access Control',
    short_name: 'GateFlow',
    description: 'Modern QR-based access control for the MENA region.',
    start_url: '/',
    display: 'standalone',
    background_color: token('elevation.surface'),
    theme_color: token('color.background.brand.bold'),
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}
