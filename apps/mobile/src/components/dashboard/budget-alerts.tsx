import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback } from "react";

import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";

type BudgetAlert = {
  type: "over_budget" | "almost_over";
  fundId: number;
  fundName: string;
  message: string;
  severity: "warning" | "info";
};

const MAX_ALERTS = 3;

function AlertIcon({ type }: { type: BudgetAlert["type"] }) {
  // Over-budget shows ⚠️, almost-over shows 🔶
  return (
    <StyledLeanText className="text-base">
      {type === "over_budget" ? "⚠️" : "🔶"}
    </StyledLeanText>
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
      className="flex-row items-center gap-2 py-2"
      onPress={onPress}
      scaleValue={0.98}
    >
      <AlertIcon type={alert.type} />
      <StyledLeanText
        className="flex-1 font-satoshi-medium text-foreground text-sm"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {alert.message}
      </StyledLeanText>
    </ScalePressable>
  );
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
    <StyledLeanView className="mx-4 mb-2 rounded-xl bg-card-background px-3 py-1">
      {displayAlerts.map((alert) => (
        <AlertRow
          alert={alert}
          key={alert.fundId}
          onPress={() => handleAlertPress(alert.fundId)}
        />
      ))}
    </StyledLeanView>
  );
}
