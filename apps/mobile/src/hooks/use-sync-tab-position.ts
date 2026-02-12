import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { useEffect } from "react";
import { useTabPosition } from "@/contexts/tab-position-context";

/**
 * Syncs tab bar position and routes to context for use by AnimatedBlurOverlay.
 */
export function useSyncTabPosition(
  position: MaterialTopTabBarProps["position"],
  routes: MaterialTopTabBarProps["state"]["routes"]
) {
  const { setPosition, setRoutes } = useTabPosition();

  useEffect(() => {
    setPosition(position);
    setRoutes(routes);
  }, [position, routes, setPosition, setRoutes]);
}
