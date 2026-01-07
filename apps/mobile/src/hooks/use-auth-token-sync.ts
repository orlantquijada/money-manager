import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { authTokenStore } from "@/lib/auth-token";

/**
 * Syncs the Clerk session token to the auth token store.
 * This allows the tRPC client to access the token in the headers function.
 */
export function useAuthTokenSync() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const syncToken = async () => {
      if (isSignedIn) {
        const token = await getToken();
        authTokenStore.setToken(token);
      } else {
        authTokenStore.setToken(null);
      }
    };

    syncToken();
  }, [getToken, isSignedIn]);
}
