import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  useBottomSheet,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { Platform, Text, View } from "react-native";
import { tabbarBottomInset } from "~/navigation/TabBar";
import type { RootStackParamList } from "~/types";
import { mauveA, mauveDark } from "~/utils/colors";
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation";
import FolderIcon from "../../../assets/icons/folder-closed-duo-create.svg";
import ShoppingBagIcon from "../../../assets/icons/shopping-bag.svg";
import WalletIcon from "../../../assets/icons/wallet-duo.svg";
import CreateCard from "./CreateCard";

// import ShoppingBagIcon from "../../../assets/icons/money-duo-dark.svg"

const snapPoints = [
  Platform.select({
    ios: 320,
    android: 300,
  }) || 320,
];

type Routes = Extract<
  keyof RootStackParamList,
  "CreateFund" | "CreateFolder" | "Root"
>;

const DashboardCreateBottomSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const springConfigs = useBottomSheetSpringConfigs({
    stiffness: 250,
    damping: 25,
  });

  return (
    <BottomSheetModal
      animationConfigs={springConfigs}
      backdropComponent={CreateBackdrop}
      backgroundStyle={{
        backgroundColor: "transparent",
      }}
      bottomInset={tabbarBottomInset}
      detached
      handleIndicatorStyle={{ backgroundColor: mauveDark.mauve8 }}
      handleStyle={{ backgroundColor: mauveDark.mauve1 }}
      index={0}
      name="dashboard-create"
      ref={ref}
      snapPoints={snapPoints}
      style={{
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <Content />
    </BottomSheetModal>
  );
});
DashboardCreateBottomSheet.displayName = "DashboardCreateBottomSheet";

function Content() {
  const navigation = useRootStackNavigation();
  const { close } = useBottomSheet();

  // closure ni
  const handleCardOnPress = (card: Routes) => () => {
    close();

    if (card === "Root") {
      navigation.navigate("Root", { screen: "AddTransaction" });
    } else {
      navigation.navigate(card);
    }
  };

  return (
    <View className="flex-1 border-t border-t-mauveDark1 bg-mauveDark1">
      <View className="mb-6 flex-row items-center justify-between px-6">
        <Text className="font-satoshi-bold text-mauveDark12 text-xl">
          Create
        </Text>

        {/* <ScaleDownPressable className="bg-mauveDark4 h-6 w-6 items-center justify-center rounded-md"> */}
        {/*   <CrossIcon */}
        {/*     color={mauveDark.mauve8} */}
        {/*     height={14} */}
        {/*     width={14} */}
        {/*     strokeWidth={3} */}
        {/*   /> */}
        {/* </ScaleDownPressable> */}
      </View>
      <CreateCard
        description="Add folders to organize your funds"
        Icon={FolderIcon}
        onPress={handleCardOnPress("CreateFolder")}
        title="Folder"
      />
      <View className="h-px w-full bg-mauveDark6" />
      <CreateCard
        description="manage your money for different goals"
        Icon={WalletIcon}
        onPress={handleCardOnPress("CreateFund")}
        title="Fund"
      />
      <View className="h-px w-full bg-mauveDark6" />
      <CreateCard
        description="Add transactions to track your spending"
        Icon={ShoppingBagIcon}
        onPress={handleCardOnPress("Root")}
        title="Transaction"
      />
    </View>
  );
}

function CreateBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      style={[{ backgroundColor: mauveA.mauveA12 }, props.style]}
    />
  );
}

export type DashboardCreateBottomSheet = BottomSheetModal;
export default DashboardCreateBottomSheet;
