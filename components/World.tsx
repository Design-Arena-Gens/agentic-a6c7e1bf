// @ts-nocheck
'use client';

import { useCallback, useState } from 'react';
import * as THREE from 'three';
import Block, { BlockType } from './Block';

interface BlockData {
  id: string;
  position: [number, number, number];
  type: BlockType;
}

const chunkSize = 16;
const maxHeight = 4;

const keyFromPosition = (position: [number, number, number]) => position.join(':');

const pseudoHeight = (x: number, z: number) => {
  return Math.floor(
    (Math.sin(x * 0.6) + Math.cos(z * 0.5) + Math.sin((x + z) * 0.35)) * 0.9 + maxHeight / 2
  );
};

const makeTerrain = (): BlockData[] => {
  const blocks: BlockData[] = [];
  const half = chunkSize / 2;
  for (let x = -half; x < half; x++) {
    for (let z = -half; z < half; z++) {
      const columnHeight = Math.max(1, Math.min(maxHeight, pseudoHeight(x, z)));
      for (let y = 0; y < columnHeight; y++) {
        const worldY = y;
        const type: BlockType = y === columnHeight - 1 ? 'grass' : y > 1 ? 'stone' : 'dirt';
        blocks.push({
          id: `${x}:${worldY}:${z}`,
          position: [x, worldY, z],
          type
        });
      }
    }
  }
  return blocks;
};

const groundMaterial = new THREE.MeshStandardMaterial({
  color: '#2d4726',
  roughness: 1,
  metalness: 0
});

const waterMaterial = new THREE.MeshPhysicalMaterial({
  color: '#4cb5f5',
  transparent: true,
  opacity: 0.7,
  roughness: 0.15,
  transmission: 0.85,
  metalness: 0,
  clearcoat: 0.6,
  clearcoatRoughness: 0.25
});

const World = () => {
  const [blocks, setBlocks] = useState<BlockData[]>(() => makeTerrain());

  const addBlock = useCallback(
    (position: [number, number, number], type: BlockType) => {
      const key = keyFromPosition(position);
      setBlocks((current) => {
        if (current.some((block) => keyFromPosition(block.position) === key)) {
          return current;
        }
        return [
          ...current,
          {
            id: `${key}-${Date.now()}`,
            position,
            type: type === 'grass' ? 'plank' : type
          }
        ];
      });
    },
    []
  );

  const removeBlock = useCallback((id: string) => {
    setBlocks((current) => current.filter((block) => block.id !== id));
  }, []);

  const groundSize = chunkSize + 8;

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.51, 0]}
        receiveShadow
        material={groundMaterial}
      >
        <planeGeometry args={[groundSize, groundSize]} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} material={waterMaterial}>
        <planeGeometry args={[chunkSize, chunkSize]} />
      </mesh>

      {blocks.map((block) => (
        <Block
          key={block.id}
          id={block.id}
          position={block.position}
          type={block.type}
          onAdd={addBlock}
          onRemove={removeBlock}
        />
      ))}
    </group>
  );
};

export default World;
