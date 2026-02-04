import { useRouter } from "expo-router";
import { StyledGlassButton } from "@/config/interop-glass-button";
import { Cross } from "@/icons";
import type { GlassButtonProps } from "./glass-button";

type GlassCloseButtonProps = Omit<GlassButtonProps, "children" | "variant"> & {
  iconSize?: number;
};

export default function GlassCloseButton({
  iconSize = 24,
  onPress,
  ...props
}: GlassCloseButtonProps) {
  const router = useRouter();

  const handlePress: GlassButtonProps["onPress"] = (event) => {
    if (onPress) {
      onPress(event);
    } else if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.back();
    }
  };

  return (
    <StyledGlassButton
      scaleValue={0.9}
      tintColorClassName="accent-muted"
      variant="icon"
      {...props}
      onPress={handlePress}
    >
      <Cross className="text-muted-foreground" size={iconSize} />
    </StyledGlassButton>
  );
}
