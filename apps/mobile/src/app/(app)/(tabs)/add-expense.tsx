import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Amount, useAmount } from "@/components/add-expense/amount";
import Numpad from "@/components/add-expense/numpad";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import { DateSelector } from "@/components/date-selector.ios";
import GlassButtonIcon from "@/components/glass-button-icon";
import { Cross } from "@/icons";
import { cn } from "@/utils/cn";
import { mauveRgb } from "@/utils/colors";

export default function AddExpense() {
  const [date, setDate] = useState(new Date());

  return (
    <AnimatedTabScreen index={0}>
      <SafeAreaView className="flex-1 bg-mauve1">
        <View className="flex-1 px-4 pb-8">
          <Header className="mt-8 mb-auto" date={date} onDateChange={setDate} />

          <CreateTransactionForm />
        </View>
      </SafeAreaView>
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
  return (
    <Link asChild href={{ pathname: "/" }}>
      <GlassButtonIcon
        glassViewProps={{
          tintColor: mauveRgb.mauve1,
        }}
      >
        <Cross className="size-6 text-mauve11" />
      </GlassButtonIcon>
    </Link>
  );
}

function CreateTransactionForm() {
  const { amount, handleKeyPress } = useAmount();

  return (
    <>
      <View
        className="relative flex-grow items-center justify-center"
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
