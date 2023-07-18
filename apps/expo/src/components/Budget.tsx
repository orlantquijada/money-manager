import { useEffect } from "react"
import { Pressable, PressableProps, View, Text } from "react-native"
import { useDerivedValue, useSharedValue } from "react-native-reanimated"

import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import { toCurrency } from "~/utils/functions"
import { pink } from "~/utils/colors"
import { transitions } from "~/utils/motion"

import { type Folder, type Fund } from ".prisma/client"
import ScaleDownPressable from "./ScaleDownPressable"
import Category from "./Category"
import StyledMotiView from "./StyledMotiView"
import { AnimateHeight } from "./AnimateHeight"

import FolderClosed from "../../assets/icons/folder-duo.svg"
import FolderOpen from "../../assets/icons/folder-open-duo.svg"

const overspentColor = pink.pink10

type Props = {
  folderId: Folder["id"]
  folderName: Folder["name"]
  amountLeft: number
  funds: Fund[]
  defaultOpen?: boolean
  /*
   * prop for animation —
   * open recently added folder, close everything else
   */
  isRecentlyAdded?: boolean | undefined
}

export default function Budget({
  folderId,
  folderName,
  amountLeft,
  funds,
  defaultOpen = false,
  isRecentlyAdded,
  ...rest
}: PressableProps & Props) {
  const navigation = useRootStackNavigation()

  // const overspent = Boolean(Math.round(Math.random()))
  const overspent = false

  const open = useSharedValue(defaultOpen)

  useEffect(() => {
    if (isRecentlyAdded !== undefined) open.value = isRecentlyAdded
  }, [open, isRecentlyAdded])

  return (
    <View>
      <Pressable
        {...rest}
        onPress={(...args) => {
          open.value = !open.value
          rest.onPress?.(...args)
        }}
      >
        <View className="bg-violet3 border-violet4 flex-row items-center justify-between rounded-2xl border p-4">
          <View className="flex-row items-center">
            <View className="relative h-4 w-4">
              <StyledMotiView
                className="absolute inset-0"
                transition={transitions.noTransition}
                animate={useDerivedValue(() => ({
                  opacity: open.value ? 1 : 0,
                }))}
              >
                <FolderOpen width={16} height={16} />
              </StyledMotiView>
              <StyledMotiView
                className="absolute inset-0"
                transition={transitions.noTransition}
                animate={useDerivedValue(() => ({
                  opacity: open.value ? 0 : 1,
                }))}
              >
                <FolderClosed width={16} height={16} />
              </StyledMotiView>
            </View>
            <Text className="font-satoshi-medium text-violet12 ml-3 text-base">
              {folderName}
            </Text>
          </View>

          <StyledMotiView
            className="flex-row items-end"
            animate={useDerivedValue(() => ({
              opacity: open.value ? 0 : 1,
            }))}
            transition={transitions.snappy}
          >
            <Text
              className="font-satoshi-medium text-violet12 text-sm opacity-80"
              style={overspent ? { color: overspentColor } : {}}
            >
              {overspent ? "-" : ""}
              <Text className="font-nunito">{toCurrency(amountLeft)} </Text>
            </Text>
            {!overspent ? (
              <Text className="font-satoshi text-violet12 text-sm opacity-50">
                left
              </Text>
            ) : null}
          </StyledMotiView>
        </View>
      </Pressable>

      <AnimateHeight open={open}>
        {funds.length ? (
          funds.map((fund) => <Category fund={fund} key={fund.id} />)
        ) : (
          <ScaleDownPressable
            className="h-12 w-full items-center justify-center"
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
