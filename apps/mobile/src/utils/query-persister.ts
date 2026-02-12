import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { Query } from "@tanstack/react-query";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({ id: "query-cache" });

// Async wrapper required by TanStack persister
const asyncStorage = {
  getItem: (key: string) => Promise.resolve(storage.getString(key) ?? null),
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    storage.remove(key);
    return Promise.resolve();
  },
};

// Priority queries to persist (ranked by cold-start impact)
const PERSISTED_QUERY_KEYS = new Set([
  "folder.listWithFunds", // dashboard structure
  "store.list", // reference data
  "transaction.allLast7Days", // activity feed
  "budget.alerts", // warnings
  "transaction.totalThisMonth", // stat
  "folder.list", // folders
]);

export function shouldPersistQuery(query: Query): boolean {
  const queryKey = query.queryKey;

  // tRPC query keys: [["trpc", routerPath], { input, type }]
  if (!Array.isArray(queryKey) || queryKey.length < 1) {
    return false;
  }

  const firstElement = queryKey[0];

  if (Array.isArray(firstElement) && firstElement[0] === "trpc") {
    const routerPath = firstElement[1];
    return PERSISTED_QUERY_KEYS.has(routerPath);
  }

  return false;
}

export const queryPersister = createAsyncStoragePersister({
  storage: asyncStorage,
  throttleTime: 1000, // Batch writes, max 1 per second
  key: "REACT_QUERY_CACHE",
});
