import Animated, { FadeIn } from "react-native-reanimated";
import Skeleton from "@/components/skeleton";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { StyledIconSymbol } from "@/config/interop-icon-symbol";
import InsightCard from "./insight-card";

type Props = {
  text: string | null | undefined;
  isLoading: boolean;
};

export default function MonthlySummaryCard({ text, isLoading }: Props) {
  if (isLoading) {
    return (
      <InsightCard>
        <StyledLeanView className="gap-3">
          <StyledLeanView className="flex-row items-center gap-2">
            <Skeleton height={20} width={20} />
            <Skeleton height={16} width={120} />
          </StyledLeanView>
          <StyledLeanView className="gap-2">
            <Skeleton height={14} width="100%" />
            <Skeleton height={14} width="85%" />
            <Skeleton height={14} width="60%" />
          </StyledLeanView>
        </StyledLeanView>
      </InsightCard>
    );
  }

  if (!text) {
    return null;
  }

  return (
    <InsightCard>
      <StyledLeanView className="gap-3">
        <StyledLeanView className="flex-row items-center gap-2">
          <StyledIconSymbol
            colorClassName="accent-violet-9"
            name="sparkles"
            size={18}
            weight="semibold"
          />
          <StyledLeanText className="font-satoshi-medium text-foreground text-sm">
            AI Summary
          </StyledLeanText>
        </StyledLeanView>
        <Animated.View entering={FadeIn.duration(400)}>
          <StyledLeanText className="font-satoshi text-foreground-secondary text-sm leading-relaxed">
            {text}
          </StyledLeanText>
        </Animated.View>
      </StyledLeanView>
    </InsightCard>
  );
}
