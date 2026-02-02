import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  type BudgetAlert,
  BudgetAlertCard,
} from "@/components/stats/budget-alert-card";
import { computeAlerts } from "@/components/stats/budget-alerts";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";

type AlertSectionProps = {
  title: string;
  alerts: BudgetAlert[];
  onAlertPress: (fundId: number) => void;
};

function AlertSection({ title, alerts, onAlertPress }: AlertSectionProps) {
  if (alerts.length === 0) return null;

  return (
    <StyledLeanView className="gap-2">
      <StyledLeanText className="font-satoshi-medium text-foreground-muted text-xs uppercase tracking-wide">
        {title}
      </StyledLeanText>
      <StyledLeanView className="gap-2">
        {alerts.map((alert) => (
          <BudgetAlertCard
            alert={alert}
            key={alert.fundId}
            onPress={() => onAlertPress(alert.fundId)}
          />
        ))}
      </StyledLeanView>
    </StyledLeanView>
  );
}

export default function AlertsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Fetch current stats - use month period for alerts
  const { data: stats } = useQuery(
    trpc.transaction.stats.queryOptions({ period: "month" })
  );

  const alerts = useMemo(
    () => computeAlerts(stats?.byFund ?? []),
    [stats?.byFund]
  );

  // Group alerts by severity
  const criticalAlerts = useMemo(
    () => alerts.filter((a) => a.severity === "critical"),
    [alerts]
  );
  const warningAlerts = useMemo(
    () => alerts.filter((a) => a.severity === "warning"),
    [alerts]
  );

  const handleAlertPress = useCallback(
    (fundId: number) => {
      router.back();
      // Small delay to let sheet dismiss before navigating
      setTimeout(() => {
        router.push({
          pathname: "/fund/[id]",
          params: { id: String(fundId) },
        });
      }, 100);
    },
    [router]
  );

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        padding: 16,
        paddingBottom: insets.bottom + 16,
        gap: 20,
      }}
    >
      {/* Header */}
      <StyledLeanText className="font-satoshi-bold text-foreground text-lg">
        Budget Alerts
      </StyledLeanText>

      {/* No alerts state */}
      {alerts.length === 0 && (
        <StyledLeanView className="items-center justify-center py-8">
          <StyledLeanText className="font-satoshi-medium text-foreground-muted text-sm">
            No budget alerts
          </StyledLeanText>
        </StyledLeanView>
      )}

      {/* Critical alerts (Over Budget) */}
      <AlertSection
        alerts={criticalAlerts}
        onAlertPress={handleAlertPress}
        title="Over Budget"
      />

      {/* Warning alerts (At Risk) */}
      <AlertSection
        alerts={warningAlerts}
        onAlertPress={handleAlertPress}
        title="At Risk"
      />
    </ScrollView>
  );
}
