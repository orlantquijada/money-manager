import React, { ComponentProps } from "react"

import { Text, TextInput, TouchableOpacity, View } from "react-native"

import { SafeAreaView } from "react-native-safe-area-context"
import { FlashList } from "@shopify/flash-list"
import type { inferProcedureOutput } from "@trpc/server"
import type { AppRouter } from "api"

import Plus from "../../assets/icons/plus-rec.svg"

import { trpc } from "~/utils/trpc"

const PostCard: React.FC<{
  post: inferProcedureOutput<AppRouter["folder"]["list"]>[number]
}> = ({ post }) => {
  return (
    <View className="border-mauve4 rounded-lg border bg-white p-4 shadow-2xl">
      <Text className="font-satoshi text-mauve12 text-xl">{post.name}</Text>
      <Text className="font-satoshi text-mauve9">{post.id}</Text>
    </View>
  )
}

const CreatePost: React.FC = () => {
  const utils = trpc.useContext()
  const { mutate } = trpc.folder.create.useMutation({
    async onSuccess() {
      await utils.folder.list.invalidate()
    },
    onError(e) {
      console.log(e.data)
    },
  })

  const [name, setName] = React.useState("")

  return (
    <View className="border-mauve4 flex flex-col border-t py-4">
      <TextInput
        value={name}
        className="border-mauve4 font-satoshi text-mauve12 focus:border-mauve8 mb-2 rounded border p-2"
        onChangeText={setName}
        placeholder="Title"
      />
      <TouchableOpacity
        className="bg-violet5 h-9 items-center justify-center rounded px-4"
        activeOpacity={0.8}
        onPress={() => {
          mutate({ userId: "cle57ii5w0000t7idkmnccmrm", name })
        }}
      >
        <Text className="font-satoshi text-violet11 text-sm">
          Publish post <Plus />
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export const HomeScreen = ({
  onLayout,
  children,
}: Pick<ComponentProps<typeof SafeAreaView>, "onLayout" | "children">) => {
  const postQuery = trpc.folder.list.useQuery()
  const [showPost, setShowPost] = React.useState<string | null>(null)

  return (
    <SafeAreaView onLayout={onLayout} className="bg-violet1">
      <View className="h-full w-full p-4">
        <View className="py-2">
          {showPost ? (
            <Text className="font-satoshi text-mauve12">
              <Text className="font-satoshi-bold text-mauve12">
                Selected post id:{" "}
              </Text>
              {showPost}
            </Text>
          ) : (
            <Text className="font-satoshi-bold-italic text-mauve12">
              Press on a post
            </Text>
          )}
        </View>

        <FlashList
          data={postQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          contentContainerStyle={{ paddingBottom: 8 }}
          renderItem={(p) => (
            <TouchableOpacity
              onPress={() => setShowPost(p.item.id.toString())}
              activeOpacity={0.6}
            >
              <PostCard post={p.item} />
            </TouchableOpacity>
          )}
        />

        <CreatePost />
      </View>
      {children}
    </SafeAreaView>
  )
}
