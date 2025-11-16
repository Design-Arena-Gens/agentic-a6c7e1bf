// @ts-nocheck
'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import { Sky } from '@react-three/drei';
import dynamic from 'next/dynamic';

const World = dynamic(() => import('../components/World'), { ssr: false });
const PlayerControls = dynamic(() => import('../components/PlayerControls'), { ssr: false });
const Crosshair = dynamic(() => import('../components/Crosshair'), { ssr: false });
const Lights = dynamic(() => import('../components/Lights'), { ssr: false });

export default function Page() {
  useEffect(() => {
    const preventContext = (event: MouseEvent) => event.preventDefault();
    document.addEventListener('contextmenu', preventContext);
    return () => document.removeEventListener('contextmenu', preventContext);
  }, []);

  return (
    <main className="app no-pointer">
      <Canvas
        shadows
        camera={{ fov: 75, position: [8, 12, 12], near: 0.1, far: 200 }}
      >
        <Suspense fallback={null}>
          <Sky sunPosition={[100, 60, 100]} turbidity={12} rayleigh={2} mieCoefficient={0.002} />
          <Lights />
          <World />
          <PlayerControls />
        </Suspense>
      </Canvas>
      <Crosshair />
      <div className="hud">
        <div className="instructions">
          <span><strong>Click</strong> to capture pointer · <strong>WASD</strong> to move · <strong>Space</strong> to jump</span>
          <span><strong>Left-click</strong> to mine · <strong>Right-click</strong> to place blocks</span>
          <span><strong>Shift</strong> to sprint · <strong>Esc</strong> to release pointer</span>
        </div>
      </div>
    </main>
  );
}
