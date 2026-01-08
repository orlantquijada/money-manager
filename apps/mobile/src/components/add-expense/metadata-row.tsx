import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { cn } from "@/utils/cn";

type Segment = {
  label: string;
  onPress: () => void;
  hasValue: boolean;
};

type MetadataRowProps = {
  segments: Segment[];
  showBorder?: boolean;
};

export function MetadataRow({
  segments,
  showBorder = false,
}: MetadataRowProps) {
  return (
    <StyledLeanView
      className={cn(
        "flex-row items-center py-3",
        showBorder && "border-mauve-7 border-b-hairline"
      )}
    >
      {segments.map((segment, index) => (
        <StyledLeanView className="flex-row items-center" key={index}>
          {index > 0 && (
            <StyledLeanText className="mx-2 text-foreground-muted">
              •
            </StyledLeanText>
          )}
          <ScalePressable
            className="px-1 py-1"
            onPress={segment.onPress}
            opacityValue={0.5}
            scaleValue={0.97}
          >
            <StyledLeanText
              className={cn(
                "font-satoshi-medium text-base",
                segment.hasValue ? "text-foreground" : "text-foreground-muted"
              )}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {segment.label}
            </StyledLeanText>
          </ScalePressable>
        </StyledLeanView>
      ))}
    </StyledLeanView>
  );
}
