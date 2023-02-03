import { type Folder, type Fund } from ".prisma/client"
import { useReducer } from "react"
import { Pressable, PressableProps, View, Text } from "react-native"

import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"

import ScaleDownPressable from "./ScaleDownPressable"
import Category from "./Category"
import { AnimateHeight } from "./AnimateHeight"
import StyledMotiView from "./StyledMotiView"

import FolderClosed from "../../assets/icons/folder-duo.svg"
import FolderOpen from "../../assets/icons/folder-open-duo.svg"

type Props = {
  folderId: Folder["id"]
  folderName: Folder["name"]
  amountLeft: number
  funds: Fund[]
}

export default function Budget({
  folderId,
  folderName,
  amountLeft,
  funds,
  ...rest
}: PressableProps & Props) {
  const [open, toggle] = useReducer((open) => !open, false)
  const navigation = useRootStackNavigation()

  const Icon = open ? FolderOpen : FolderClosed

  return (
    <View>
      <Pressable
        {...rest}
        onPress={(...args) => {
          toggle()
          rest.onPress?.(...args)
        }}
      >
        <View className="bg-violet3 border-violet4 flex-row items-center justify-between rounded-2xl border p-4">
          <View className="flex-row items-center">
            <Icon width={16} height={16} />
            <Text className="font-satoshi-medium text-violet12 ml-3 text-base">
              {folderName}
            </Text>
          </View>

          <StyledMotiView
            className="flex-row items-end"
            animate={{ opacity: open ? 0 : 1 }}
          >
            <Text className="font-satoshi-medium text-violet12 text-sm opacity-80">
              ₱{amountLeft.toFixed(2)}{" "}
            </Text>
            <Text className="font-satoshi text-violet12 text-sm opacity-50">
              left
            </Text>
          </StyledMotiView>
        </View>
      </Pressable>
      <AnimateHeight hide={!open}>
        {funds.length ? (
          funds.map((fund) => <Category name={fund.name} key={fund.id} />)
        ) : (
          <ScaleDownPressable
            className="h-10 w-full items-center justify-center"
            onPress={() => {
              navigation.navigate("CreateFund", { folderId })
            }}
          >
            <Text className="font-satoshi text-mauve11 text-sm">
              Add a fund to this folder
            </Text>
          </ScaleDownPressable>
        )}
      </AnimateHeight>
    </View>
  )
}
