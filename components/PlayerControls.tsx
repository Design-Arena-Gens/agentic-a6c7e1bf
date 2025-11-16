// @ts-nocheck
'use client';

import { useEffect, useRef } from 'react';
import { PointerLockControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useKeyboardInput from '../hooks/useKeyboardInput';

const PLAYER_HEIGHT = 2;
const GRAVITY = 28;
const JUMP_FORCE = 9;
const WORLD_LIMIT = 18;

const PlayerControls = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const { forward, backward, left, right, jump, sprint } = useKeyboardInput();

  useEffect(() => {
    camera.position.set(2, PLAYER_HEIGHT, 6);
  }, [camera]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls || !controls.isLocked) {
      return;
    }

    const moveSpeed = sprint ? 10 : 5.5;
    direction.current.set(0, 0, 0);
    if (forward) direction.current.z -= 1;
    if (backward) direction.current.z += 1;
    if (left) direction.current.x -= 1;
    if (right) direction.current.x += 1;

    if (direction.current.lengthSq() > 0) {
      direction.current.normalize();
      const frontVector = new THREE.Vector3(0, 0, direction.current.z).applyQuaternion(camera.quaternion);
      const sideVector = new THREE.Vector3(direction.current.x, 0, 0).applyQuaternion(camera.quaternion);
      const moveVector = frontVector.add(sideVector);
      camera.position.addScaledVector(moveVector, moveSpeed * delta);
    }

    velocity.current.y -= GRAVITY * delta;
    camera.position.y += velocity.current.y * delta;

    if (camera.position.y < PLAYER_HEIGHT) {
      velocity.current.y = 0;
      camera.position.y = PLAYER_HEIGHT;
    }

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -WORLD_LIMIT, WORLD_LIMIT);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -WORLD_LIMIT, WORLD_LIMIT);
  });

  useEffect(() => {
    if (!jump) {
      return;
    }
    if (camera.position.y <= PLAYER_HEIGHT + 0.05) {
      velocity.current.y = JUMP_FORCE;
    }
  }, [jump, camera]);

  return (
    <PointerLockControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      selector="#root"
      makeDefault
    />
  );
};

export default PlayerControls;
