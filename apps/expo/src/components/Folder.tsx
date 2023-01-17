import { useReducer } from "react"
import { Pressable, PressableProps, View, Text } from "react-native"

import FolderClosed from "../../assets/icons/folder-duo.svg"

import FolderOpen from "../../assets/icons/folder-open-duo.svg"
import Category from "./Category"

type Props = {
  name: string
  amountLeft: number
}

export default function Folder({
  name,
  amountLeft,
  ...rest
}: PressableProps & Props) {
  const [open, toggle] = useReducer((open) => !open, false)

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
              {name}
            </Text>
          </View>

          <View className="flex-row items-end">
            {!open ? (
              <Text className="font-satoshi-medium text-violet12 text-sm opacity-80">
                ₱{amountLeft.toFixed(2)}{" "}
              </Text>
            ) : null}
            <Text className="font-satoshi text-violet12 text-sm opacity-50">
              left
            </Text>
          </View>
        </View>
      </Pressable>
      {open ? (
        <View>
          <Category name="Groceries" />
          <Category name="Electric Bill" />
          <Category name="Internet" />
          <Category name="Water" />
        </View>
      ) : null}
    </View>
  )
}
