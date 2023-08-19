import { ComponentProps, forwardRef, useRef } from "react"
import { Platform, Text, View } from "react-native"
import {
  useBottomSheetModal,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet"

import { mauveA, mauveDark } from "~/utils/colors"
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import type { RootStackParamList } from "~/types"
import { tabbarBottomInset } from "~/navigation/TabBar"

import BottomSheet, { Backdrop } from "../BottomSheet"
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

// HACK: navigating directly `onPress` on <CreateCard /> does not work. The bottom sheet reopens after
// navigating - most probably has to do with rerendering since current impl works —
// using refs to set what route to update to.

const DashboardCreateBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  const navigation = useRootStackNavigation()
  const { dismissAll } = useBottomSheetModal()
  const to = useRef<Routes>()

  const handleCardOnPress = (card: Routes) => () => {
    to.current = card
    dismissAll()
  }

  const springConfigs = useBottomSheetSpringConfigs({
    stiffness: 250,
    damping: 25,
  })

  return (
    <BottomSheet
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
      handleIndicatorStyle={{ backgroundColor: mauveDark.mauve8 }}
      handleStyle={{ backgroundColor: mauveDark.mauve1 }}
      name="dashboard-create"
      onDismiss={() => {
        if (to.current === undefined) return

        if (to.current === "Root")
          navigation.navigate("Root", { screen: "AddTransaction" })
        else navigation.navigate(to.current)

        to.current = undefined
      }}
    >
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
    </BottomSheet>
  )
})
DashboardCreateBottomSheet.displayName = "DashboardCreateBottomSheet"

function CreateBackdrop(props: ComponentProps<typeof Backdrop>) {
  return (
    <Backdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      style={[{ backgroundColor: mauveA.mauveA12 }, props.style]}
    />
  )
}

export type DashboardCreateBottomSheet = BottomSheet
export default DashboardCreateBottomSheet
