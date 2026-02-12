import { useCallback, useReducer } from "react";

export default function useToggle(initial: boolean) {
  const [state, handleToggle] = useReducer(
    (prev, next: boolean | undefined) => (next == null ? !prev : next),
    initial
  );

  const on = useCallback(() => handleToggle(true), []);
  const off = useCallback(() => handleToggle(false), []);
  const toggle = useCallback(() => handleToggle(undefined), []);

  return [state, { on, off, toggle }] as const;
}
