import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useRef, useState } from "react";
import { authTokenStore } from "@/lib/auth-token";

/**
 * Syncs the Clerk session token to the auth token store.
 * This allows the tRPC client to access the token in the headers function.
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
  }, [isSignedIn]);

  return { isTokenReady };
}
