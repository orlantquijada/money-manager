import { forwardRef } from "react"
import { Platform, Text, View } from "react-native"
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  useBottomSheetSpringConfigs,
  BottomSheetModal,
  useBottomSheet,
} from "@gorhom/bottom-sheet"

import { mauveA, mauveDark } from "~/utils/colors"
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import type { RootStackParamList } from "~/types"
import { tabbarBottomInset } from "~/navigation/TabBar"

import CreateCard from "./CreateCard"

import FolderIcon from "../../../assets/icons/folder-closed-duo-create.svg"
import WalletIcon from "../../../assets/icons/wallet-duo.svg"
import ShoppingBagIcon from "../../../assets/icons/shopping-bag.svg"
// import ShoppingBagIcon from "../../../assets/icons/money-duo-dark.svg"

const snapPoints = [
  Platform.select({
    ios: 320,
    android: 300,
  }) || 320,
]

type Routes = Extract<
  keyof RootStackParamList,
  "CreateFund" | "CreateFolder" | "Root"
>

const DashboardCreateBottomSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const springConfigs = useBottomSheetSpringConfigs({
    stiffness: 250,
    damping: 25,
  })

  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      animationConfigs={springConfigs}
      detached
      backdropComponent={CreateBackdrop}
      ref={ref}
      bottomInset={tabbarBottomInset}
      style={{
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: "hidden",
      }}
      index={0}
      backgroundStyle={{
        backgroundColor: "transparent",
      }}
      handleIndicatorStyle={{ backgroundColor: mauveDark.mauve8 }}
      handleStyle={{ backgroundColor: mauveDark.mauve1 }}
      name="dashboard-create"
    >
      <Content />
    </BottomSheetModal>
  )
})
DashboardCreateBottomSheet.displayName = "DashboardCreateBottomSheet"

function Content() {
  const navigation = useRootStackNavigation()
  const { close } = useBottomSheet()

  // closure ni
  const handleCardOnPress = (card: Routes) => () => {
    close()

    if (card === "Root")
      navigation.navigate("Root", { screen: "AddTransaction" })
    else navigation.navigate(card)
  }

  return (
    <View className="bg-mauveDark1 border-t-mauveDark1 flex-1 border-t">
      <View className="mb-6 flex-row items-center justify-between px-6">
        <Text className="text-mauveDark12 font-satoshi-bold text-xl">
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
        Icon={FolderIcon}
        title="Folder"
        description="Add folders to organize your funds"
        onPress={handleCardOnPress("CreateFolder")}
      />
      <View className="bg-mauveDark6 h-px w-full" />
      {/* TODO: description copy */}
      <CreateCard
        Icon={WalletIcon}
        title="Fund"
        description="Description"
        onPress={handleCardOnPress("CreateFund")}
      />
      <View className="bg-mauveDark6 h-px w-full" />
      {/* TODO: description copy */}
      <CreateCard
        Icon={ShoppingBagIcon}
        title="Transaction"
        description="Description"
        onPress={handleCardOnPress("Root")}
      />
    </View>
  )
}

function CreateBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      style={[{ backgroundColor: mauveA.mauveA12 }, props.style]}
    />
  )
}

export type DashboardCreateBottomSheet = BottomSheetModal
export default DashboardCreateBottomSheet
