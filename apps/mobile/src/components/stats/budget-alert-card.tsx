import { ScalePressable } from "@/components/scale-pressable";
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
  const isCritical = severity === "critical";

  return (
    <StyledLeanView
      className={`size-7 items-center justify-center rounded-lg ${isCritical ? "bg-red-4" : "bg-amber-4"}`}
      style={{ borderCurve: "continuous" }}
    >
      <AlertTriangle
        className={isCritical ? "text-red-11" : "text-amber-10"}
        size={16}
      />
    </StyledLeanView>
  );
}

type BudgetAlertCardProps = {
  alert: BudgetAlert;
  onPress: () => void;
};

const currencyFormatter = new Intl.NumberFormat(
  "en-PH",
  wholeCurrencyFormatterOptions
);

export function BudgetAlertCard({ alert, onPress }: BudgetAlertCardProps) {
  const isCritical = alert.severity === "critical";
  const message =
    alert.type === "over_budget"
      ? `Over by ${currencyFormatter.format(alert.overage ?? 0)}`
      : `${Math.round(alert.utilization)}% of budget used`;

  return (
    <ScalePressable
      className={`flex-row items-center gap-3 rounded-xl border-l-4 bg-card py-3.5 pr-4 pl-3 ${isCritical ? "border-l-red-9" : "border-l-amber-9"}`}
      onPress={onPress}
      scaleValue={0.98}
      style={{ borderCurve: "continuous" }}
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
