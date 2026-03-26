import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GateFlow — Smart QR Access Control',
    short_name: 'GateFlow',
    description: 'Modern QR-based access control for the MENA region.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#0C66E4',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}
