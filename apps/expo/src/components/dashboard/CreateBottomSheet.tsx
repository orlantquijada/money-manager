import { ComponentProps, forwardRef } from "react"
import { View } from "react-native"

import { mauveA, mauveDark } from "~/utils/colors"

import BottomSheet, { Backdrop } from "../BottomSheet"
import CreateCard from "./CreateCard"

import FolderIcon from "../../../assets/icons/folder-closed-duo-create.svg"
import WalletIcon from "../../../assets/icons/wallet-duo.svg"

const snapPoints = [175]

const DashboardCreateBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  return (
    <BottomSheet
      enablePanDownToClose
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
    >
      <View className="bg-mauveDark1 border-t-mauveDark1 flex-1 border-t">
        <CreateCard
          Icon={FolderIcon}
          title="Folder"
          description="Add folders to organize your funds"
        />
        <View className="bg-mauveDark6 h-px w-full " />
        <CreateCard Icon={WalletIcon} title="Fund" description="Description" />
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
      style={[{ backgroundColor: mauveA.mauveA10 }, props.style]}
    />
  )
}

export type DashboardCreateBottomSheet = BottomSheet
export default DashboardCreateBottomSheet
