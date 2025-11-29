import { useCallback, useReducer } from "react";

export default function useToggle(initial = false) {
  const [state, handleToggle] = useReducer(
    (prev: boolean, next: boolean) => (next === null ? !prev : next),
    initial
  );

  const on = useCallback(() => handleToggle(true), []);
  const off = useCallback(() => handleToggle(false), []);
  // bypass typescript
  const toggle = useCallback(() => handleToggle(undefined as never), []);

  return [state, { on, off, toggle }] as const;
}
