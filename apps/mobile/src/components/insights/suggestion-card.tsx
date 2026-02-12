import Skeleton from "@/components/skeleton";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { StyledIconSymbol } from "@/config/interop-icon-symbol";
import InsightCard from "./insight-card";

type Suggestion = {
  type: "overspent_recurring" | "overspent_large" | null;
  message: string;
  fundName: string;
} | null;

type Props = {
  suggestion: Suggestion | undefined;
  isLoading: boolean;
};

export default function SuggestionCard({ suggestion, isLoading }: Props) {
  if (isLoading) {
    return (
      <InsightCard>
        <StyledLeanView className="flex-row gap-3">
          <Skeleton height={28} width={28} />
          <StyledLeanView className="flex-1 gap-2">
            <Skeleton height={14} width="100%" />
            <Skeleton height={14} width="80%" />
          </StyledLeanView>
        </StyledLeanView>
      </InsightCard>
    );
  }

  if (!suggestion) {
    return null;
  }

  return (
    <InsightCard className="border-violet-6">
      <StyledLeanView className="flex-row gap-3">
        <StyledLeanView
          className="size-7 items-center justify-center rounded-lg bg-violet-4"
          style={{ borderCurve: "continuous" }}
        >
          <StyledIconSymbol
            colorClassName="accent-violet-9"
            name="lightbulb.fill"
            size={16}
          />
        </StyledLeanView>
        <StyledLeanView className="flex-1 gap-1">
          <StyledLeanText className="font-satoshi-medium text-foreground text-sm">
            Suggestion
          </StyledLeanText>
          <StyledLeanText className="font-satoshi text-foreground-secondary text-sm leading-relaxed">
            {suggestion.message}
          </StyledLeanText>
        </StyledLeanView>
      </StyledLeanView>
    </InsightCard>
  );
}
