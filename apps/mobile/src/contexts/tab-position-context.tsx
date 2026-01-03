import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { createContext, type ReactNode, useContext, useState } from "react";

type TabPositionContextValue = {
  position: MaterialTopTabBarProps["position"] | null;
  routes: MaterialTopTabBarProps["state"]["routes"];
  setPosition: (position: MaterialTopTabBarProps["position"]) => void;
  setRoutes: (routes: MaterialTopTabBarProps["state"]["routes"]) => void;
};

const TabPositionContext = createContext<TabPositionContextValue | null>(null);

export function TabPositionProvider({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState<
    MaterialTopTabBarProps["position"] | null
  >(null);
  const [routes, setRoutes] = useState<
    MaterialTopTabBarProps["state"]["routes"]
  >([]);

  return (
    <TabPositionContext value={{ position, routes, setPosition, setRoutes }}>
      {children}
    </TabPositionContext>
  );
}

export function useTabPosition() {
  const context = useContext(TabPositionContext);
  if (!context) {
    throw new Error("useTabPosition must be used within a TabPositionProvider");
  }
  return context;
}
