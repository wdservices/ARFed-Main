import ModelViewer from '@/components/ModelViewer';
import { useEffect, useState } from 'react';

const Index = ({ subjects = [] }) => {
  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0f172a', color: '#fff' }}
    >
      <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 24, textAlign: 'center' }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
              ARFed 3D Model Viewer
            </h1>
          </div>
          <ModelViewer subjects={subjects} />
        </main>
        <footer style={{ padding: '16px 0', textAlign: 'center', fontSize: 14, color: '#64748b', background: '#0f172a' }}>
          <p>ARFed 3D Editor • Designed with precision • Powered by Three.js</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
