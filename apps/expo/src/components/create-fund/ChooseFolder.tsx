import type { Folder } from ".prisma/client";
import { FlashList } from "@shopify/flash-list";
import clsx from "clsx";
import { type ComponentProps, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { mauveDark } from "~/utils/colors";
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation";
import { trpc } from "~/utils/trpc";
import FolderClosed from "../../../assets/icons/folder-duo-light.svg";
import FolderOpen from "../../../assets/icons/folder-open-duo.svg";
import CreateFooter from "../CreateFooter";
import Presence from "../Presence";
import ScaleDownPressable from "../ScaleDownPressable";
import { useFormData } from "./context";

type Props = {
  onBackPress: () => void;
};

export default function ChooseFolder({ onBackPress }: Props) {
  const createFund = trpc.fund.create.useMutation();
  const { data } = trpc.folder.list.useQuery();
  const utils = trpc.useContext();
  const navigation = useRootStackNavigation();
  const { formData, setFormValues } = useFormData();
  const [selectedId, setSelectedId] = useState<Folder["id"]>(formData.folderId);

  const handleBackPress = () => {
    onBackPress();
    setFormValues({ folderId: selectedId });
  };

  const [didSubmit, setDidSubmit] = useState(false);

  const loading = createFund.status === "loading" || didSubmit;
  const disabled = !selectedId || loading || didSubmit;

  return (
    <>
      <ScrollView
        className="p-4 pt-0"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View className="flex">
          <Presence delay={60} delayMultiplier={3}>
            <Text className="font-satoshi-medium text-lg text-mauveDark12">
              Select a folder.
            </Text>
          </Presence>

          <View className="mt-3 h-full">
            <FlashList
              contentContainerStyle={{ paddingBottom: 8 }}
              data={data}
              estimatedItemSize={50}
              extraData={selectedId}
              ItemSeparatorComponent={() => <View className="h-2" />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              renderItem={({ item, index }) => {
                // delay multipler 3 takes into account api loading
                return (
                  <Presence
                    className={clsx("flex-1", index % 2 ? "ml-1" : "mr-1")}
                    delay={60}
                    delayMultiplier={3 + index}
                  >
                    <FolderCard
                      folder={item}
                      onPress={() => setSelectedId(item.id)}
                      selected={item.id === selectedId}
                    />
                  </Presence>
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
      <CreateFooter
        disabled={disabled}
        loading={loading}
        onBackPress={handleBackPress}
        onContinuePress={() => {
          if (selectedId) {
            setDidSubmit(true);
            createFund.mutate(
              {
                ...formData,
                folderId: selectedId,
              },
              {
                onSuccess: () => {
                  utils.fund.list.invalidate();
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
                      });
                    })
                    .catch(() => {
                      return;
                    });
                },
              }
            );
          }
        }}
      >
        Save
      </CreateFooter>
    </>
  );
}

type FolderCardProps = {
  folder: Folder;
  selected?: boolean;
} & Omit<ComponentProps<typeof ScaleDownPressable>, "children">;

function FolderCard({ folder, selected = false, ...rest }: FolderCardProps) {
  const Icon = selected ? FolderOpen : FolderClosed;

  return (
    <ScaleDownPressable
      animate={{
        backgroundColor: selected ? mauveDark.mauve12 : mauveDark.mauve4,
      }}
      className="flex-row items-center rounded-xl p-4"
      {...rest}
    >
      <Icon height={16} width={16} />
      <Text
        className={clsx(
          "ml-2 shrink font-satoshi-medium text-base text-mauveDark12",
          selected && "text-mauveDark1"
        )}
        numberOfLines={1}
      >
        {folder.name}
      </Text>
    </ScaleDownPressable>
  );
}
