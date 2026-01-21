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
        // Invalidate only user-related queries to avoid cascade re-renders
        queryClient.invalidateQueries(trpc.user.pathFilter());
      },
    })
  );

  // Store mutate in ref to avoid unstable dependency
  // useMutation().mutate creates a new function reference each render
  const mutateRef = useRef(ensureUserMutation.mutate);
  mutateRef.current = ensureUserMutation.mutate;

  // biome-ignore lint/correctness/useExhaustiveDependencies: isPending intentionally excluded to prevent infinite re-render loop on Android
  useEffect(() => {
    // Only provision once per session, when signed in, AND when token is ready
    // The token check prevents race conditions where we call ensureUser before
    // the auth token has been synced to the tRPC client headers
    // Access isPending directly (not in deps) to avoid re-trigger loop
    if (
      isSignedIn &&
      isTokenReady &&
      !hasProvisioned.current &&
      !ensureUserMutation.isPending
    ) {
      hasProvisioned.current = true;
      mutateRef.current({ name: user?.fullName ?? user?.firstName ?? null });
    }

    // Reset when signed out
    if (!isSignedIn) {
      hasProvisioned.current = false;
    }
  }, [isSignedIn, isTokenReady, user?.fullName, user?.firstName]);

  return {
    isProvisioning: ensureUserMutation.isPending,
    isProvisioned: ensureUserMutation.isSuccess || hasProvisioned.current,
  };
}
