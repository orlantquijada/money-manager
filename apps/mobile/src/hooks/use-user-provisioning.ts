import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { trpc } from "@/utils/api";

type UseUserProvisioningOptions = {
  /** Whether the auth token has been synced and is ready for authenticated requests */
  isTokenReady: boolean;
};

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
        queryClient.invalidateQueries(trpc.user.pathFilter());
      },
    })
  );

  // Ref avoids unstable dependency (mutate is a new reference each render)
  const mutateRef = useRef(ensureUserMutation.mutate);
  mutateRef.current = ensureUserMutation.mutate;

  // biome-ignore lint/correctness/useExhaustiveDependencies: isPending intentionally excluded to prevent infinite re-render loop on Android
  useEffect(() => {
    if (
      isSignedIn &&
      isTokenReady &&
      !hasProvisioned.current &&
      !ensureUserMutation.isPending
    ) {
      hasProvisioned.current = true;
      mutateRef.current({ name: user?.fullName ?? user?.firstName ?? null });
    }

    if (!isSignedIn) {
      hasProvisioned.current = false;
    }
  }, [isSignedIn, isTokenReady, user?.fullName, user?.firstName]);

  return {
    isProvisioning: ensureUserMutation.isPending,
    isProvisioned: ensureUserMutation.isSuccess || hasProvisioned.current,
  };
}
