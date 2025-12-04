import { useBottomSheet } from "@gorhom/bottom-sheet";
import { Text, View } from "react-native";
import type { FundWithMeta } from "~/types";
import { amber, limeDark, mauve } from "~/utils/colors";
import { progressBarColors } from "~/utils/constants";
import { useRootBottomTabNavigation } from "~/utils/hooks/useRootBottomTabNavigation";
// import CheckboxCircle from "../../../assets/icons/hero-icons/check-circle-mini-solid.svg";
import Button from "../Button";
import ScaleDownPressable from "../ScaleDownPressable";

//  TODO: better texts ani nila kay bati kayg mga pangan
export default function ActionButton({ fund }: { fund: FundWithMeta }) {
  const navigation = useRootBottomTabNavigation();
  const { close } = useBottomSheet();

  if (fund.fundType === "SPENDING") {
    return (
      <ScaleDownPressable
        onPress={() => {
          close();
          navigation.navigate("AddTransaction", { fundId: fund.id });
        }}
      >
        <Button animate={{ backgroundColor: mauve.mauve3 }} className="h-10">
          <Text className="font-satoshi-medium text-mauve10">Add Expense</Text>
        </Button>
      </ScaleDownPressable>
    );
  }
  if (fund.fundType === "NON_NEGOTIABLE") {
    return <NonNegotiableActionButton fund={fund} />;
  }

  return <TargetActionButton fund={fund} />;
}

function NonNegotiableActionButton({ fund }: { fund: FundWithMeta }) {
  const navigation = useRootBottomTabNavigation();
  const { close } = useBottomSheet();

  const isFullyFunded = fund.totalSpent >= fund.totalBudgetedAmount;

  if (isFullyFunded) {
    return (
      <ScaleDownPressable>
        <Button
          animate={{
            backgroundColor: progressBarColors.NON_NEGOTIABLE,
          }}
          className="h-10"
        >
          <View className="absolute left-0 opacity-80">
            {/* <CheckboxCircle color={limeDark.lime11} height={20} width={20} /> */}
          </View>
          <Text
            className="font-satoshi-medium"
            style={{ color: limeDark.lime11, opacity: 0.8 }}
          >
            Completed
          </Text>
        </Button>
      </ScaleDownPressable>
    );
  }

  return (
    <ScaleDownPressable
      onPress={() => {
        close();
        navigation.navigate("AddTransaction", {
          fundId: fund.id,
          amount: Number(fund.budgetedAmount),
        });
      }}
    >
      <Button animate={{ backgroundColor: mauve.mauve3 }} className="h-10">
        <Text className="font-satoshi-medium text-mauve10">Auto Fund</Text>
      </Button>
    </ScaleDownPressable>
  );
}

function TargetActionButton({ fund }: { fund: FundWithMeta }) {
  const navigation = useRootBottomTabNavigation();
  const { close } = useBottomSheet();

  const isFullyFunded = fund.totalSpent >= fund.totalBudgetedAmount;

  if (isFullyFunded) {
    return (
      <ScaleDownPressable
        onPress={() => {
          close();
          navigation.navigate("AddTransaction", {
            fundId: fund.id,
          });
        }}
      >
        <Button
          animate={{ backgroundColor: progressBarColors.TARGET }}
          className="h-10"
        >
          <View className="absolute left-0">
            <CheckboxCircle color={amber.amber7} height={20} width={20} />
          </View>
          <Text className="font-satoshi-medium" style={{ color: amber.amber7 }}>
            Completed
          </Text>
        </Button>
      </ScaleDownPressable>
    );
  }

  return (
    <ScaleDownPressable
      onPress={() => {
        close();
        navigation.navigate("AddTransaction", {
          fundId: fund.id,
        });
      }}
    >
      <Button animate={{ backgroundColor: mauve.mauve3 }} className="h-10">
        <Text className="font-satoshi-medium text-mauve10">
          Add Transaction
        </Text>
      </Button>
    </ScaleDownPressable>
  );
}
