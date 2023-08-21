import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "api"
/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpc = createTRPCReact<AppRouter>()

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
import Constants from "expo-constants"
const getBaseUrl = () => {
  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   */
  const hostUri =
    Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost
  const localhost = hostUri?.split(":")[0]
  console.log({ localhost })
  if (!localhost)
    throw new Error("failed to get localhost, configure it manually")
  return `http://${localhost}:3000`
}

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
import React from "react"
import { QueryClient } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { transformer } from "api/transformer"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import { MMKV } from "react-native-mmkv"

const storage = new MMKV()

const clientStorage = {
  setItem: (key: string, value: string | number | boolean) => {
    return new Promise((resolve) => {
      storage.set(key, value)
      resolve(undefined)
    })
  },
  getItem: (key: string) => {
    const value = storage.getString(key)
    return new Promise<string | null>((resolve) => {
      resolve(value || null)
    })
  },
  removeItem: (key: string) => {
    return new Promise<void>((resolve) => {
      storage.delete(key)
      resolve(undefined)
    })
  },
}

const asyncStoragePersister = createAsyncStoragePersister({
  storage: clientStorage,
  serialize: transformer.stringify,
  deserialize: transformer.parse,
})

export const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = React.useState(() => new QueryClient())
  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      transformer,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/trpc`,
        }),
      ],
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        {children}
      </PersistQueryClientProvider>
    </trpc.Provider>
  )
}
