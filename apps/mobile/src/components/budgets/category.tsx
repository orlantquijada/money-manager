import { Link } from "expo-router";
import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import Check from "@/icons/check";
import type { FundWithMeta } from "@/lib/fund";
import { getTimeModeMultiplier } from "@/lib/fund";
import CategoryProgressBars from "./category-progress-bars";
import { getSavingsColor } from "./category-utils";
import QuickStatSpending from "./quick-stat/spending";

export const CATEGORY_HEIGHT = 56;

type CategoryProps = {
  fund: FundWithMeta;
};

export default function Category({ fund }: CategoryProps) {
  const isNonNegotiable = fund.fundType === "NON_NEGOTIABLE";
  const barCount = getTimeModeMultiplier(fund.timeMode);
  const overallProgress = fund.totalSpent / (fund.budgetedAmount * barCount);

  const savingsColorKey = isNonNegotiable
    ? getSavingsColor(overallProgress)
    : "lime-9";
  const checkColor = useThemeColor(savingsColorKey);
  const isFunded = isNonNegotiable && overallProgress >= 1;

  return (
    <Link asChild href={{ pathname: "/fund/[id]", params: { id: fund.id } }}>
      <ScalePressable
        className="justify-center gap-2 px-4"
        opacityValue={0.7}
        scaleValue={0.98}
        style={{ height: CATEGORY_HEIGHT }}
      >
        <CategoryHeader
          checkColor={checkColor}
          fund={fund}
          isFunded={isFunded}
        />
        <CategoryProgressBars fund={fund} />
      </ScalePressable>
    </Link>
  );
}

type CategoryHeaderProps = {
  fund: FundWithMeta;
  isFunded: boolean;
  checkColor: string | undefined;
};

function CategoryHeader({ fund, isFunded, checkColor }: CategoryHeaderProps) {
  return (
    <StyledLeanView className="flex-row items-center justify-between gap-3">
      <StyledLeanView className="shrink flex-row items-center gap-1.5">
        {isFunded && <Check color={checkColor} size={16} />}
        <StyledLeanText
          className="shrink font-satoshi-medium text-base text-foreground"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {fund.name}
        </StyledLeanText>
      </StyledLeanView>

      <QuickStatSpending fund={fund} />
    </StyledLeanView>
  );
}
