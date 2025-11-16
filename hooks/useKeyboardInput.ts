'use client';

import { useEffect, useState } from 'react';

const defaultState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  sprint: false
};

type KeyboardState = typeof defaultState;

type KeyAction = keyof KeyboardState;

const KEY_BINDINGS: Record<string, KeyAction> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  Space: 'jump',
  ShiftLeft: 'sprint',
  ShiftRight: 'sprint'
};

const useKeyboardInput = (): KeyboardState => {
  const [state, setState] = useState<KeyboardState>(defaultState);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const action = KEY_BINDINGS[event.code];
      if (!action) return;
      setState((prev) => {
        if (prev[action]) return prev;
        return { ...prev, [action]: true };
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const action = KEY_BINDINGS[event.code];
      if (!action) return;
      setState((prev) => ({ ...prev, [action]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return state;
};

export default useKeyboardInput;
