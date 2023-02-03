import { ComponentProps, forwardRef, useRef } from "react"
import { View } from "react-native"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"

import { mauveA, mauveDark } from "~/utils/colors"
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import type { RootStackParamList } from "~/types"

import BottomSheet, { Backdrop } from "../BottomSheet"
import CreateCard from "./CreateCard"

import FolderIcon from "../../../assets/icons/folder-closed-duo-create.svg"
import WalletIcon from "../../../assets/icons/wallet-duo.svg"

const snapPoints = [175]

type Routes = Extract<keyof RootStackParamList, "CreateFund" | "CreateFolder">

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

  return (
    <BottomSheet
      snapPoints={snapPoints}
      detached
      backdropComponent={CreateBackdrop}
      ref={ref}
      bottomInset={16}
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
        if (to.current) navigation.navigate(to.current)

        to.current = undefined
      }}
    >
      <View className="bg-mauveDark1 border-t-mauveDark1 flex-1 border-t">
        <CreateCard
          Icon={FolderIcon}
          title="Folder"
          description="Add folders to organize your funds"
          onPress={handleCardOnPress("CreateFolder")}
        />
        <View className="bg-mauveDark6 h-px w-full" />
        <CreateCard
          Icon={WalletIcon}
          title="Fund"
          description="Description"
          onPress={handleCardOnPress("CreateFund")}
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
