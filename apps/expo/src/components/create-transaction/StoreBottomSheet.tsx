import { forwardRef, RefObject } from "react"
import { Text, View } from "react-native"
import {
  useBottomSheetSpringConfigs,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetModal,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet"

import { mauveDark } from "~/utils/colors"

import { BottomSheetData, useFormData } from "./context"
import {
  CustomBackdrop,
  CustomBackground,
  CustomHandle,
} from "./BottomSheetCustomComponents"
import ScaleDownPressable from "../ScaleDownPressable"
import Button from "../Button"

// import CrossIcon from "../../../assets/icons/hero-icons/x-mark.svg"
import CrossIcon from "../../../assets/icons/hero-icons/chevron-left.svg"
import { TextInput } from "react-native-gesture-handler"

// const snapPoints = ["25%", "94%"]
// 184 = handle + header + payee + fund height
const snapPoints = ["50%", "94%"]
const bottomSheetName = "store-list"

const StoreListBottomSheet = forwardRef<
  BottomSheetModal,
  {
    bottomSheetDataRef: RefObject<BottomSheetData>
  }
>(({ bottomSheetDataRef }, ref) => {
  const springConfig = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 350,
  })

  // NOTE: no idea why `useFormData` returns undefined on `<BottomSheetForm />`
  // its probably because `BottomSheet` portals to top most component in the tree?
  const { setFormValues, formData } = useFormData()

  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      backdropComponent={CustomBackdrop}
      ref={ref}
      index={1}
      handleComponent={CustomHandle}
      animationConfigs={springConfig}
      backgroundComponent={CustomBackground}
      name={bottomSheetName}
      style={{
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        overflow: "hidden",
      }}
    >
      <StoreList />
    </BottomSheetModal>
  )
})
StoreListBottomSheet.displayName = "StoreListBottomSheet"
export type StoreListBottomSheet = BottomSheetModal
export default StoreListBottomSheet

function StoreList() {
  const { dismiss } = useBottomSheetModal()

  return (
    <View>
      <View className="flex-row items-center justify-between px-4">
        <ScaleDownPressable
          onPress={() => {
            dismiss(bottomSheetName)
          }}
        >
          <CrossIcon
            color={mauveDark.mauve12}
            width={20}
            height={20}
            strokeWidth={3}
          />
        </ScaleDownPressable>

        <TextInput
          className="font-satoshi-medium text-mauveDark12 ml-4 h-full grow text-xl"
          placeholder="Find or add Item"
          placeholderTextColor={mauveDark.mauve10}
        />

        <ScaleDownPressable>
          <Button>
            <Text className="font-satoshi-medium text-mauve12 text-base">
              Done
            </Text>
          </Button>
        </ScaleDownPressable>
      </View>

      <Text className="text-mauveDark12 font-satoshi-bold text-2xl">
        Hello World
      </Text>

      <BottomSheetFlatList
        data={[
          { id: 1, name: "Mcdo" },
          { id: 2, name: "Abaca" },
          { id: 3, name: "Jollibee" },
        ]}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <Text className="text-mauveDark12 font-satoshi-medium text-base">
            {item.name}
          </Text>
        )}
      />
    </View>
  )
}
