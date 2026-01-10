import Skeleton from "@/components/skeleton";
import { StyledLeanView } from "@/config/interop";

import PieChartSkeleton from "./pie-chart-skeleton";

export default function StatsHeaderSkeleton() {
  return (
    <StyledLeanView className="flex-row gap-4">
      {/* Pie chart skeleton */}
      <PieChartSkeleton size={180} />

      {/* Stats panel skeleton */}
      <StyledLeanView className="grow justify-center gap-3 pr-2">
        {/* Total spent skeleton */}
        <StyledLeanView className="gap-1">
          <Skeleton height={12} width={80} />
          <Skeleton height={28} width={100} />
        </StyledLeanView>

        {/* Divider */}
        <StyledLeanView className="h-px w-full bg-border" />

        {/* Top funds skeleton */}
        <StyledLeanView className="gap-2">
          <Skeleton height={12} width={64} />
          <Skeleton height={16} width={140} />
          <Skeleton height={16} width={140} />
          <Skeleton height={16} width={140} />
        </StyledLeanView>
      </StyledLeanView>
    </StyledLeanView>
  );
}
