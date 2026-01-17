import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { trpc } from "@/utils/api";

type UseUserProvisioningOptions = {
  /** Whether the auth token has been synced and is ready for authenticated requests */
  isTokenReady: boolean;
};

/**
 * Ensures a user record exists in our database when a Clerk user signs in.
 * This is called "user provisioning" - creating the local user on first sign-in.
 *
 * @param options.isTokenReady - Must be true before provisioning to avoid 401 errors
 */
export function useUserProvisioning({
  isTokenReady,
}: UseUserProvisioningOptions) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const hasProvisioned = useRef(false);

  const ensureUserMutation = useMutation(
    trpc.user.ensureUser.mutationOptions({
      onSuccess: () => {
        // Invalidate queries that depend on user data
        queryClient.invalidateQueries();
      },
    })
  );

  useEffect(() => {
    // Only provision once per session, when signed in, AND when token is ready
    // The token check prevents race conditions where we call ensureUser before
    // the auth token has been synced to the tRPC client headers
    if (
      isSignedIn &&
      isTokenReady &&
      !hasProvisioned.current &&
      !ensureUserMutation.isPending
    ) {
      hasProvisioned.current = true;
      ensureUserMutation.mutate({
        name: user?.fullName ?? user?.firstName ?? null,
      });
    }

    // Reset when signed out
    if (!isSignedIn) {
      hasProvisioned.current = false;
    }
  }, [isSignedIn, isTokenReady, user, ensureUserMutation]);

  return {
    isProvisioning: ensureUserMutation.isPending,
    isProvisioned: ensureUserMutation.isSuccess || hasProvisioned.current,
  };
}
