import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Fragment, useCallback } from "react";

import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { AlertTriangle } from "@/icons";
import { trpc } from "@/utils/api";

type BudgetAlert = {
  type: "over_budget" | "almost_over";
  fundId: number;
  fundName: string;
  message: string;
  severity: "warning" | "info";
};

const MAX_ALERTS = 3;

function AlertBadge({ type }: { type: BudgetAlert["type"] }) {
  const redBg = useThemeColor("red-4");
  const redIcon = useThemeColor("red-11");
  const amberBg = useThemeColor("amber-4");
  const amberIcon = useThemeColor("amber-10");

  const isOverBudget = type === "over_budget";

  return (
    <StyledLeanView
      className="size-7 items-center justify-center rounded-lg"
      style={{
        backgroundColor: isOverBudget ? redBg : amberBg,
        borderCurve: "continuous",
      }}
    >
      <AlertTriangle color={isOverBudget ? redIcon : amberIcon} size={16} />
    </StyledLeanView>
  );
}

function AlertRow({
  alert,
  onPress,
}: {
  alert: BudgetAlert;
  onPress: () => void;
}) {
  return (
    <ScalePressable
      className="flex-row items-center gap-3 py-3.5"
      onPress={onPress}
      scaleValue={0.98}
    >
      <AlertBadge type={alert.type} />
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
          {alert.message}
        </StyledLeanText>
      </StyledLeanView>
    </ScalePressable>
  );
}

function Divider() {
  return <StyledLeanView className="h-px bg-border-secondary" />;
}

export function BudgetAlerts() {
  const router = useRouter();
  const { data: alerts = [] } = useQuery(trpc.budget.alerts.queryOptions());

  const handleAlertPress = useCallback(
    (fundId: number) => {
      router.push({
        pathname: "/fund/[id]",
        params: { id: String(fundId) },
      });
    },
    [router]
  );

  // Limit to max 3 alerts
  const displayAlerts = alerts.slice(0, MAX_ALERTS);

  if (displayAlerts.length === 0) {
    return null;
  }

  return (
    <StyledLeanView
      className="rounded-2xl border-border border-hairline bg-card px-4"
      style={{ borderCurve: "continuous" }}
    >
      {displayAlerts.map((alert, index) => (
        <Fragment key={alert.fundId}>
          <AlertRow
            alert={alert}
            onPress={() => handleAlertPress(alert.fundId)}
          />
          {index < displayAlerts.length - 1 && <Divider />}
        </Fragment>
      ))}
    </StyledLeanView>
  );
}
