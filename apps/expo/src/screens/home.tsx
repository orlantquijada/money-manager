import { FlashList } from "@shopify/flash-list";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "api";
import React, { type ComponentProps } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { trpc } from "~/utils/trpc";
import Plus from "../../assets/icons/plus-rec.svg";

const PostCard: React.FC<{
  post: inferProcedureOutput<AppRouter["folder"]["list"]>[number];
}> = ({ post }) => (
  <View className="rounded-lg border border-mauve4 bg-white p-4 shadow-2xl">
    <Text className="font-satoshi text-mauve12 text-xl">{post.name}</Text>
    <Text className="font-satoshi text-mauve9">{post.id}</Text>
  </View>
);

const CreatePost: React.FC = () => {
  const utils = trpc.useContext();
  const { mutate } = trpc.folder.create.useMutation({
    async onSuccess() {
      await utils.folder.list.invalidate();
    },
    onError(e) {
      console.log(e.data);
    },
  });

  const [name, setName] = React.useState("");

  return (
    <View className="flex flex-col border-mauve4 border-t py-4">
      <TextInput
        className="mb-2 rounded border border-mauve4 p-2 font-satoshi text-mauve12 focus:border-mauve8"
        onChangeText={setName}
        placeholder="Title"
        value={name}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        className="h-9 items-center justify-center rounded bg-violet5 px-4"
        onPress={() => {
          mutate({ userId: "cle57ii5w0000t7idkmnccmrm", name });
        }}
      >
        <Text className="font-satoshi text-sm text-violet11">
          Publish post <Plus />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const HomeScreen = ({
  onLayout,
  children,
}: Pick<ComponentProps<typeof SafeAreaView>, "onLayout" | "children">) => {
  const postQuery = trpc.folder.list.useQuery();
  const [showPost, setShowPost] = React.useState<string | null>(null);

  return (
    <SafeAreaView className="bg-violet1" onLayout={onLayout}>
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
          contentContainerStyle={{ paddingBottom: 8 }}
          data={postQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(p) => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setShowPost(p.item.id.toString())}
            >
              <PostCard post={p.item} />
            </TouchableOpacity>
          )}
        />

        <CreatePost />
      </View>
      {children}
    </SafeAreaView>
  );
};
