import { Link } from "expo-router";
import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { Check } from "@/icons";
import type { FundWithMeta } from "@/lib/fund";
import { getTimeModeMultiplier } from "@/lib/fund";
import CategoryProgressBars from "./category-progress-bars";
import BudgetQuickStats from "./quick-stat";

export const CATEGORY_HEIGHT = 56;

type CategoryProps = {
  fund: FundWithMeta;
};

export default function Category({ fund }: CategoryProps) {
  const isNonNegotiable = fund.fundType === "NON_NEGOTIABLE";
  const barCount = getTimeModeMultiplier(fund.timeMode);
  const overallProgress = fund.totalSpent / (fund.budgetedAmount * barCount);
  const isFunded = isNonNegotiable && overallProgress >= 1;

  return (
    <Link asChild href={{ pathname: "/fund/[id]", params: { id: fund.id } }}>
      <ScalePressable
        className="justify-center gap-2 px-4"
        opacityValue={0.7}
        scaleValue={0.98}
        style={{ height: CATEGORY_HEIGHT }}
      >
        <CategoryHeader fund={fund} isFunded={isFunded} />
        <CategoryProgressBars fund={fund} />
      </ScalePressable>
    </Link>
  );
}

type CategoryHeaderProps = {
  fund: FundWithMeta;
  isFunded: boolean;
};

function CategoryHeader({ fund, isFunded }: CategoryHeaderProps) {
  return (
    <StyledLeanView className="flex-row items-center justify-between gap-3">
      <StyledLeanView className="shrink flex-row items-center gap-1.5">
        <StyledLeanText
          className="shrink font-satoshi-medium text-base text-foreground"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {fund.name}
        </StyledLeanText>
        {isFunded && (
          <Check className="text-quick-stat-non-negotiable" size={16} />
        )}
      </StyledLeanView>

      <BudgetQuickStats fund={fund} />
    </StyledLeanView>
  );
}
