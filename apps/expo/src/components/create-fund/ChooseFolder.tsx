import clsx from "clsx"
import { ComponentProps, useState } from "react"
import { View, ScrollView, Text } from "react-native"
import { FlashList } from "@shopify/flash-list"

import { mauveDark } from "~/utils/colors"
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import { trpc } from "~/utils/trpc"

import { Folder } from ".prisma/client"
import CreateFooter from "../CreateFooter"
import Presence from "../Presence"
import ScaleDownPressable from "../ScaleDownPressable"
import { useFormData } from "./context"

import FolderClosed from "../../../assets/icons/folder-duo-light.svg"
import FolderOpen from "../../../assets/icons/folder-open-duo.svg"

type Props = {
  onBackPress: () => void
}

export default function ChooseFolder({ onBackPress }: Props) {
  const { mutate } = trpc.fund.create.useMutation()
  const { data } = trpc.folder.list.useQuery()
  const utils = trpc.useContext()
  const navigation = useRootStackNavigation()
  const { formData } = useFormData()
  const [selectedId, setSelectedId] = useState<Folder["id"]>()

  const disabled = !selectedId

  return (
    <>
      <ScrollView
        className="p-4 pt-0"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View className="flex">
          <Presence delayMultiplier={3} delay={60}>
            <Text className="text-mauveDark12 font-satoshi-medium text-lg">
              Select a folder.
            </Text>
          </Presence>

          <View className="mt-3 h-full">
            <FlashList
              data={data}
              estimatedItemSize={50}
              renderItem={({ item, index }) => {
                // delay multipler 3 takes into account api loading
                return (
                  <Presence
                    delayMultiplier={3 + index}
                    delay={60}
                    className={clsx("flex-1", index % 2 ? "ml-1" : "mr-1")}
                  >
                    <FolderCard
                      folder={item}
                      selected={item.id === selectedId}
                      onPress={() => setSelectedId(item.id)}
                    />
                  </Presence>
                )
              }}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <View className="h-2" />}
              contentContainerStyle={{ paddingBottom: 8 }}
              numColumns={2}
              extraData={selectedId}
            />
          </View>
        </View>
      </ScrollView>
      <CreateFooter
        onBackPress={onBackPress}
        disabled={disabled}
        onContinuePress={() => {
          if (selectedId)
            mutate(
              { ...formData, folderId: selectedId },
              {
                onSuccess: () => {
                  utils.folder.listWithFunds.invalidate().then(() => {
                    navigation.navigate("Root", {
                      screen: "Home",
                      params: { recentlyAddedToFolderId: selectedId },
                    })
                  })
                },
              },
            )
        }}
      />
    </>
  )
}

type FolderCardProps = {
  folder: Folder
  selected?: boolean
} & Omit<ComponentProps<typeof ScaleDownPressable>, "children">

function FolderCard({
  folder,
  className,
  selected = false,
  ...rest
}: FolderCardProps) {
  const Icon = selected ? FolderOpen : FolderClosed

  return (
    <ScaleDownPressable
      className={clsx("flex-row items-center rounded-xl p-4", className)}
      animate={{
        backgroundColor: selected ? mauveDark.mauve12 : mauveDark.mauve4,
      }}
      {...rest}
    >
      <Icon width={16} height={16} />
      <Text
        className={clsx(
          "font-satoshi-medium text-mauveDark12 ml-2 text-base",
          selected && "text-mauveDark1",
        )}
      >
        {folder.name}
      </Text>
    </ScaleDownPressable>
  )
}
