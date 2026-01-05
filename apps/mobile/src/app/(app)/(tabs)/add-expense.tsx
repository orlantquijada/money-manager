import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Amount, useAmount } from "@/components/add-expense/amount";
import Numpad from "@/components/add-expense/numpad";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import { DateSelector } from "@/components/date-selector.ios";
import GlassButtonIcon from "@/components/glass-button-icon";
import { useThemeColor } from "@/components/theme-provider";
import { StyledSafeAreaView } from "@/config/interop";
import { Cross } from "@/icons";
import { cn } from "@/utils/cn";

export default function AddExpense() {
  const [date, setDate] = useState(new Date());

  return (
    <AnimatedTabScreen index={0}>
      <StyledSafeAreaView className="flex-1 bg-background">
        <View className="flex-1 px-4 pb-8">
          <Header className="mt-8 mb-auto" date={date} onDateChange={setDate} />

          <CreateTransactionForm />
        </View>
      </StyledSafeAreaView>
    </AnimatedTabScreen>
  );
}

type HeaderProps = {
  className?: string;
  date: Date;
  onDateChange: (date: Date) => void;
};

function Header({ className, date, onDateChange }: HeaderProps) {
  return (
    <View
      className={cn(
        "h-10 w-full flex-row items-center justify-between",
        className
      )}
    >
      <DateSelector date={date} onDateChange={onDateChange} />

      <Close />
    </View>
  );
}

function Close() {
  const mutedColor = useThemeColor("muted");

  return (
    <Link asChild href={{ pathname: "/" }}>
      <GlassButtonIcon
        glassViewProps={{
          tintColor: mutedColor,
        }}
      >
        <Cross className="text-foreground-secondary" size={24} />
      </GlassButtonIcon>
    </Link>
  );
}

function CreateTransactionForm() {
  const { amount, handleKeyPress } = useAmount();

  return (
    <>
      <View
        className="relative grow items-center justify-center"
        // style={{ minHeight: screenHeight * 0.25 }}
      >
        <Amount amount={amount} />

        {/* <View className="absolute top-0 w-3/5 translate-y-2 self-center"> */}
        {/*   <TransactionFlowChoices /> */}
        {/* </View> */}
      </View>

      {/* <FormDetailsPreview */}
      {/*   handlePresentModalPress={handlePresentModalPress} */}
      {/*   openFundListBottomSheet={openFundListBottomSheet} */}
      {/*   openStoreListBottomSheet={openStoreListBottomSheet} */}
      {/* /> */}

      <Numpad className="-mx-4 px-4" onPress={handleKeyPress} />
    </>
  );
}
