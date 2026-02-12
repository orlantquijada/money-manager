import { StyledGlassButton } from "@/config/interop-glass-button";
import { StyledIconSymbol } from "@/config/interop-icon-symbol";
import type { GlassButtonProps } from "./glass-button";
import type { IconSymbolName } from "./ui/icon-symbol";

type GlassIconButtonProps = Omit<GlassButtonProps, "children" | "variant"> & {
  icon: IconSymbolName;
  iconSize?: number;
};

export default function GlassIconButton({
  icon,
  iconSize = 18,
  onPress,
  size = "md",
  ...props
}: GlassIconButtonProps) {
  return (
    <StyledGlassButton
      onPress={onPress}
      size={size}
      tintColorClassName="accent-muted"
      variant="icon"
      {...props}
    >
      <StyledIconSymbol
        colorClassName="accent-muted-foreground"
        name={icon}
        size={iconSize}
      />
    </StyledGlassButton>
  );
}
