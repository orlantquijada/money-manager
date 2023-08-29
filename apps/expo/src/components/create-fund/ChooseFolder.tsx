import clsx from "clsx"
import { ComponentProps, useState } from "react"
import { View, ScrollView, Text } from "react-native"
import { FlashList } from "@shopify/flash-list"

import { mauveDark } from "~/utils/colors"
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import { trpc } from "~/utils/trpc"
import { userId } from "~/utils/constants"

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
  const { mutate, status } = trpc.fund.create.useMutation()
  const { data } = trpc.folder.list.useQuery()
  const utils = trpc.useContext()
  const navigation = useRootStackNavigation()
  const { formData, setFormValues } = useFormData()
  const [selectedId, setSelectedId] = useState<Folder["id"]>(formData.folderId)

  const handleBackPress = () => {
    onBackPress()
    setFormValues({ folderId: selectedId })
  }

  const [didSubmit, setDidSubmit] = useState(false)

  const loading = status === "loading" || didSubmit
  const disabled = !selectedId || loading || didSubmit

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
        onBackPress={handleBackPress}
        disabled={disabled}
        loading={loading}
        onContinuePress={() => {
          if (selectedId) {
            setDidSubmit(true)
            mutate(
              {
                ...formData,
                folderId: selectedId,
                userId,
              },
              {
                onSuccess: () => {
                  utils.folder.listWithFunds
                    .invalidate()
                    .then(() => {
                      navigation.navigate("Root", {
                        screen: "Home",
                        params: {
                          screen: "Budgets",
                          params: {
                            recentlyAddedToFolderId: selectedId,
                          },
                        },
                      })
                    })
                    .catch(() => {
                      return
                    })
                },
              },
            )
          }
        }}
      >
        Save
      </CreateFooter>
    </>
  )
}

type FolderCardProps = {
  folder: Folder
  selected?: boolean
} & Omit<ComponentProps<typeof ScaleDownPressable>, "children">

function FolderCard({ folder, selected = false, ...rest }: FolderCardProps) {
  const Icon = selected ? FolderOpen : FolderClosed

  return (
    <ScaleDownPressable
      className="flex-row items-center rounded-xl p-4"
      animate={{
        backgroundColor: selected ? mauveDark.mauve12 : mauveDark.mauve4,
      }}
      {...rest}
    >
      <Icon width={16} height={16} />
      <Text
        className={clsx(
          "font-satoshi-medium text-mauveDark12 ml-2 shrink text-base",
          selected && "text-mauveDark1",
        )}
        numberOfLines={1}
      >
        {folder.name}
      </Text>
    </ScaleDownPressable>
  )
}
