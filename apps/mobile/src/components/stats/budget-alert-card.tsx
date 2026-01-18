import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { AlertTriangle } from "@/icons";
import { wholeCurrencyFormatterOptions } from "@/utils/format";

export type BudgetAlert = {
  fundId: number;
  fundName: string;
  type: "over_budget" | "almost_over";
  utilization: number;
  overage: number | null;
  severity: "critical" | "warning";
};

type AlertBadgeProps = {
  severity: BudgetAlert["severity"];
};

function AlertBadge({ severity }: AlertBadgeProps) {
  const redBg = useThemeColor("red-4");
  const redIcon = useThemeColor("red-11");
  const amberBg = useThemeColor("amber-4");
  const amberIcon = useThemeColor("amber-10");

  const isCritical = severity === "critical";

  return (
    <StyledLeanView
      className="size-7 items-center justify-center rounded-lg"
      style={{
        backgroundColor: isCritical ? redBg : amberBg,
        borderCurve: "continuous",
      }}
    >
      <AlertTriangle color={isCritical ? redIcon : amberIcon} size={16} />
    </StyledLeanView>
  );
}

type Props = {
  alert: BudgetAlert;
  onPress: () => void;
};

const currencyFormatter = new Intl.NumberFormat(
  "en-PH",
  wholeCurrencyFormatterOptions
);

export function BudgetAlertCard({ alert, onPress }: Props) {
  const redBorder = useThemeColor("red-9");
  const amberBorder = useThemeColor("amber-9");

  const isCritical = alert.severity === "critical";
  const borderColor = isCritical ? redBorder : amberBorder;

  // Build message based on alert type
  const message =
    alert.type === "over_budget"
      ? `Over by ${currencyFormatter.format(alert.overage ?? 0)}`
      : `${Math.round(alert.utilization)}% of budget used`;

  return (
    <ScalePressable
      className="flex-row items-center gap-3 rounded-xl border-l-4 bg-card py-3.5 pr-4 pl-3"
      onPress={onPress}
      scaleValue={0.98}
      style={{
        borderLeftColor: borderColor,
        borderCurve: "continuous",
      }}
    >
      <AlertBadge severity={alert.severity} />
      <StyledLeanView className="flex-1 gap-0.5">
        <StyledLeanText
          className="font-satoshi-medium text-foreground text-sm"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {alert.fundName}
        </StyledLeanText>
        <StyledLeanText
          className="font-satoshi text-foreground-muted text-xs"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {message}
        </StyledLeanText>
      </StyledLeanView>
    </ScalePressable>
  );
}
