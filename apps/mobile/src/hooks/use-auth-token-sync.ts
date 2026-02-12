import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useRef, useState } from "react";
import { authTokenStore } from "@/lib/auth-token";

// Clerk tokens expire after ~60 seconds, refresh slightly before to avoid race conditions
const TOKEN_REFRESH_INTERVAL_MS = 50 * 1000; // 50 seconds

export function useAuthTokenSync() {
  const { getToken, isSignedIn } = useAuth();
  const [isTokenReady, setIsTokenReady] = useState(false);

  // Ref avoids unstable getToken dependency from Clerk
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
