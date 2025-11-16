// @ts-nocheck
'use client';

import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';

export type BlockType = 'grass' | 'dirt' | 'stone' | 'plank';

export interface BlockProps {
  id: string;
  position: [number, number, number];
  type: BlockType;
  onRemove: (id: string) => void;
  onAdd: (position: [number, number, number], type: BlockType) => void;
}

const COLORS: Record<BlockType, string> = {
  grass: '#5f8f3d',
  dirt: '#8b5a2b',
  stone: '#979797',
  plank: '#c4965f'
};

const Block = memo(({ id, position, type, onRemove, onAdd }: BlockProps) => {
  const color = COLORS[type];
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color }), [color]);

  const handlePointerDown = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const { button, face } = event;
    if (button === 0) {
      onRemove(id);
    }
    if (button === 2 && face) {
      const normal = face.normal.clone();
      const newPosition: [number, number, number] = [
        position[0] + Math.round(normal.x),
        position[1] + Math.round(normal.y),
        position[2] + Math.round(normal.z)
      ];
      onAdd(newPosition, type);
    }
  };

  return (
    <mesh
      castShadow
      receiveShadow
      position={position}
      geometry={geometry}
      material={material}
      onPointerDown={handlePointerDown}
    />
  );
});

Block.displayName = 'Block';

export default Block;
