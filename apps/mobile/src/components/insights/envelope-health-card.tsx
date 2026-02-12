import Skeleton from "@/components/skeleton";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import InsightCard from "./insight-card";

type EnvelopeHealth = {
  onTrack: number;
  atRisk: number;
  overspent: number;
};

type Props = {
  health: EnvelopeHealth | undefined;
  isLoading: boolean;
};

type StatusDotProps = {
  color: string;
  count: number;
  label: string;
};

function StatusDot({ color, count, label }: StatusDotProps) {
  return (
    <StyledLeanView className="flex-row items-center gap-1.5">
      <StyledLeanView
        className="size-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <StyledLeanText className="font-satoshi-medium text-foreground text-sm">
        {count}
      </StyledLeanText>
      <StyledLeanText className="font-satoshi text-foreground-muted text-sm">
        {label}
      </StyledLeanText>
    </StyledLeanView>
  );
}

export default function EnvelopeHealthCard({ health, isLoading }: Props) {
  const limeColor = useThemeColor("lime-9");
  const amberColor = useThemeColor("amber-9");
  const redColor = useThemeColor("red-9");

  if (isLoading) {
    return (
      <InsightCard>
        <StyledLeanView className="gap-3">
          <Skeleton height={16} width={100} />
          <StyledLeanView className="flex-row gap-4">
            <Skeleton height={20} width={80} />
            <Skeleton height={20} width={70} />
            <Skeleton height={20} width={80} />
          </StyledLeanView>
        </StyledLeanView>
      </InsightCard>
    );
  }

  if (!health) {
    return null;
  }

  const total = health.onTrack + health.atRisk + health.overspent;

  if (total === 0) {
    return null;
  }

  return (
    <InsightCard>
      <StyledLeanView className="gap-3">
        <StyledLeanText className="font-satoshi-medium text-foreground text-sm">
          Envelope Health
        </StyledLeanText>
        <StyledLeanView className="flex-row flex-wrap gap-4">
          <StatusDot
            color={limeColor}
            count={health.onTrack}
            label="on track"
          />
          <StatusDot color={amberColor} count={health.atRisk} label="at risk" />
          <StatusDot
            color={redColor}
            count={health.overspent}
            label="overspent"
          />
        </StyledLeanView>
      </StyledLeanView>
    </InsightCard>
  );
}
