import { Slot } from "expo-router";
import { StyledLeanView } from "@/config/interop";

export default function DashboardLayout() {
  return (
    <StyledLeanView className="flex-1 bg-background pt-safe-offset-4">
      <Slot />
    </StyledLeanView>
  );
}
