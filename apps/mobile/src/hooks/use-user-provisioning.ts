import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { trpc } from "@/utils/api";

/**
 * Ensures a user record exists in our database when a Clerk user signs in.
 * This is called "user provisioning" - creating the local user on first sign-in.
 */
export function useUserProvisioning() {
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
    // Only provision once per session and when signed in
    if (
      isSignedIn &&
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
  }, [isSignedIn, user, ensureUserMutation]);

  return {
    isProvisioning: ensureUserMutation.isPending,
    isProvisioned: ensureUserMutation.isSuccess || hasProvisioned.current,
  };
}
