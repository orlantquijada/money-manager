import React, { ComponentProps } from "react"

import { Text, TextInput, TouchableOpacity, View } from "react-native"

import { SafeAreaView } from "react-native-safe-area-context"
import { FlashList } from "@shopify/flash-list"
import type { inferProcedureOutput } from "@trpc/server"
import type { AppRouter } from "api"

import { trpc } from "~/utils/trpc"

const PostCard: React.FC<{
  post: inferProcedureOutput<AppRouter["post"]["all"]>[number]
}> = ({ post }) => {
  return (
    <View className="border-mauve4 rounded-lg border p-4">
      <Text className="font-satoshi text-mauve12 text-xl">{post.title}</Text>
      <Text className="font-satoshi text-mauve9">{post.content}</Text>
    </View>
  )
}

const CreatePost: React.FC = () => {
  const utils = trpc.useContext()
  const { mutate } = trpc.post.create.useMutation({
    async onSuccess() {
      await utils.post.all.invalidate()
    },
    onError(e) {
      console.log(e.data)
    },
  })

  const [title, onChangeTitle] = React.useState("")
  const [content, onChangeContent] = React.useState("")

  return (
    <View className="flex flex-col border-t border-gray-400 py-4">
      <TextInput
        value={title}
        className="mb-2 rounded border border-gray-400 p-2 text-gray-900"
        onChangeText={onChangeTitle}
        placeholder="Title"
      />
      <TextInput
        value={content}
        className="mb-2 rounded border border-gray-400 p-2 text-gray-900"
        onChangeText={onChangeContent}
        placeholder="Content"
      />
      <TouchableOpacity
        className="bg-violet10 rounded p-2"
        activeOpacity={0.8}
        onPress={() => {
          mutate({
            title,
            content,
          })
        }}
      >
        <Text className="text-mauve1 font-semibold">Publish post</Text>
      </TouchableOpacity>
    </View>
  )
}

export const HomeScreen = ({
  onLayout,
  children,
}: Pick<ComponentProps<typeof SafeAreaView>, "onLayout" | "children">) => {
  const postQuery = trpc.post.all.useQuery()
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
              onPress={() => setShowPost(p.item.id)}
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
