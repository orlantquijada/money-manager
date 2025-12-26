import { createContext, type ReactNode, useContext, useState } from "react";
import { type StoreApi, useStore as useZustandStore } from "zustand";

/**
 * Creates a scoped Zustand store that resets when the provider unmounts.
 * Useful for component-local state that should be fresh on each mount.
 *
 * @example
 * ```tsx
 * const { Provider, useStore } = createScopedStore(() =>
 *   createStore<MyState>((set) => ({
 *     count: 0,
 *     increment: () => set((s) => ({ count: s.count + 1 })),
 *   }))
 * );
 *
 * // Use the provider to scope the store
 * <Provider>
 *   <MyComponent />
 * </Provider>
 *
 * // Access the store with optional selector
 * const count = useStore((s) => s.count);
 * ```
 */
export function createScopedStore<T>(initializer: () => StoreApi<T>) {
  const Context = createContext<StoreApi<T> | null>(null);

  function Provider({ children }: { children: ReactNode }) {
    const [store] = useState(initializer);
    return <Context value={store}>{children}</Context>;
  }

  function useStore<U>(selector: (state: T) => U): U;
  function useStore(): StoreApi<T>;
  function useStore<U>(selector?: (state: T) => U) {
    const store = useContext(Context);
    if (!store) {
      throw new Error(
        "useStore must be used within its Provider. Make sure to wrap your component tree with the Provider."
      );
    }
    if (selector) {
      return useZustandStore(store, selector);
    }
    return store;
  }

  return { Provider, useStore, Context } as const;
}
