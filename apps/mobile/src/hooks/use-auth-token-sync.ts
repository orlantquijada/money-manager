import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useRef, useState } from "react";
import { authTokenStore } from "@/lib/auth-token";

// Clerk tokens expire after ~60 seconds, refresh slightly before to avoid race conditions
const TOKEN_REFRESH_INTERVAL_MS = 50 * 1000; // 50 seconds

/**
 * Syncs the Clerk session token to the auth token store.
 * This allows the tRPC client to access the token in the headers function.
 *
 * The token is refreshed periodically since Clerk tokens expire after ~60 seconds.
 *
 * Returns `isTokenReady` to signal when the token has been synced and
 * authenticated requests can be made.
 */
export function useAuthTokenSync() {
  const { getToken, isSignedIn } = useAuth();
  const [isTokenReady, setIsTokenReady] = useState(false);

  // Use ref to access latest getToken without adding to deps (unstable ref from Clerk)
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  useEffect(() => {
    const syncToken = async () => {
      if (isSignedIn) {
        const token = await getTokenRef.current();
        if (token) {
          authTokenStore.setToken(token);
          setIsTokenReady(true);
        }
        // If token is null, don't set ready - Clerk will trigger re-render when session is ready
      } else {
        authTokenStore.setToken(null);
        setIsTokenReady(false);
      }
    };

    syncToken();

    // Set up periodic token refresh to prevent expiration
    // Clerk tokens expire after ~60 seconds, so refresh every 50 seconds
    let intervalId: ReturnType<typeof setInterval> | undefined;
    if (isSignedIn) {
      intervalId = setInterval(syncToken, TOKEN_REFRESH_INTERVAL_MS);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSignedIn]);

  return { isTokenReady };
}
