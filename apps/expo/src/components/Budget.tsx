import { useEffect } from "react"
import { Pressable, PressableProps, View, Text } from "react-native"
import { useDerivedValue, useSharedValue } from "react-native-reanimated"
import * as ContextMenu from "zeego/context-menu"

import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import { toCurrencyNarrow } from "~/utils/functions"
import { pink, violet } from "~/utils/colors"
import { transitions } from "~/utils/motion"
import useToggle from "~/utils/hooks/useToggle"
import type { FundWithMeta } from "~/types"

import { type Folder } from ".prisma/client"
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
  funds: FundWithMeta[]
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

  // TODO: save option on local storage
  const [show, { toggle }] = useToggle(true)

  const handleToggle = () => {
    open.value = !open.value
    toggle()
  }

  return (
    <View className="overflow-visible">
      <ContextMenu.Root>
        <ContextMenu.Trigger style={{ borderRadius: 16 }}>
          <Pressable
            {...rest}
            onPress={(...args) => {
              open.value = !open.value
              rest.onPress?.(...args)
            }}
            className="rounded-2xl"
          >
            {/* bg is mauve12 with 2% opacity */}
            <View className="flex-row items-center justify-between rounded-2xl bg-[#1a152307] p-4">
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
                <Text className="font-satoshi-medium text-mauve12 ml-3 text-base">
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
                    // TODO: overspending for targets and non negotiable does not make sense na i-error ang color
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
        </ContextMenu.Trigger>

        <ContextMenu.Content>
          {/* <ContextMenu.Label>Label</ContextMenu.Label> */}
          <ContextMenu.Item
            key="item 2"
            destructive
            onSelect={() => {
              navigation.navigate("CreateFund", { folderId })
            }}
          >
            <ContextMenu.ItemTitle>Add</ContextMenu.ItemTitle>

            <ContextMenu.ItemIcon
              ios={{
                // name: "trash", // required
                name: "plus", // required
                scale: "small",
              }}
            />
          </ContextMenu.Item>
          {show ? (
            <ContextMenu.Item key="item 1" destructive onSelect={handleToggle}>
              <ContextMenu.ItemTitle>Show</ContextMenu.ItemTitle>

              <ContextMenu.ItemIcon
                ios={{
                  // name: "trash", // required
                  name: "eye", // required
                  scale: "small",
                }}
              />
            </ContextMenu.Item>
          ) : (
            <ContextMenu.Item key="item 1" destructive onSelect={handleToggle}>
              <ContextMenu.ItemTitle>Hide</ContextMenu.ItemTitle>

              <ContextMenu.ItemIcon
                ios={{
                  // name: "trash", // required
                  name: "eye.slash", // required
                  scale: "small",
                }}
              />
            </ContextMenu.Item>
          )}
        </ContextMenu.Content>
      </ContextMenu.Root>

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
