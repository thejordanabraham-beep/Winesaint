'use client';

import dynamic from 'next/dynamic';

const MapApp = dynamic(() => import('@/components/maps/MapApp'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#1a1a2e',
      color: '#ccc',
      fontFamily: 'sans-serif',
    }}>
      Loading Wine Saint Maps...
    </div>
  ),
});

export default function MapsPage() {
  return <MapApp />;
}
