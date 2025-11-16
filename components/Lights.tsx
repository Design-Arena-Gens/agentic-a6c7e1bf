// @ts-nocheck
'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

const Lights = () => {
  const lights = useMemo(() => {
    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    const sun = new THREE.DirectionalLight('#ffd9a3', 1.6);
    sun.position.set(25, 45, 25);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.1;
    sun.shadow.camera.far = 200;
    return { ambient, sun };
  }, []);

  return (
    <group>
      <primitive object={lights.ambient} />
      <primitive object={lights.sun} />
    </group>
  );
};

export default Lights;
