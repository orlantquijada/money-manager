import { useEffect } from "react"
import { Pressable, PressableProps, View, Text } from "react-native"
import { useDerivedValue, useSharedValue } from "react-native-reanimated"

import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import { toCurrencyNarrow } from "~/utils/functions"
import { pink, violet } from "~/utils/colors"
import { transitions } from "~/utils/motion"

import { type Folder, type Fund } from ".prisma/client"
import ScaleDownPressable from "./ScaleDownPressable"
import Category, { CATEGORY_HEIGHT } from "./Category"
import StyledMotiView from "./StyledMotiView"
import { AnimateHeight } from "./AnimateHeight"

import FolderClosed from "../../assets/icons/folder-duo.svg"
import FolderOpen from "../../assets/icons/folder-open-duo.svg"

const overspentColor = pink.pink8

type Props = {
  folderId: Folder["id"]
  folderName: Folder["name"]
  amountLeft: number
  funds: (Fund & { totalSpent: number })[]
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

  const open = useSharedValue(defaultOpen)

  useEffect(() => {
    if (isRecentlyAdded !== undefined) open.value = isRecentlyAdded
  }, [open, isRecentlyAdded])

  const didOverspend = amountLeft === 0

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
              className="font-satoshi text-sm"
              style={{
                color: didOverspend ? overspentColor : violet.violet12,
              }}
            >
              <Text className="font-nunito-semibold">
                {toCurrencyNarrow(amountLeft)}{" "}
              </Text>
              <Text>left</Text>
            </Text>
          </StyledMotiView>
        </View>
      </Pressable>

      {funds.length ? (
        <AnimateHeight
          open={open}
          defaultOpen
          initalHeight={CATEGORY_HEIGHT * funds.length}
        >
          {funds.map((fund) => (
            <Category fund={fund} key={fund.id} />
          ))}
        </AnimateHeight>
      ) : (
        <AnimateHeight open={open} defaultOpen initalHeight={48}>
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
        </AnimateHeight>
      )}
    </View>
  )
}
