import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import type { Folder } from "api";
import { Pressable, type PressableProps, ScrollView } from "react-native";

import { FolderClosedDuoCreate, FolderOpenDuo } from "@/icons";
import {
  type CreateFundScreens,
  useCreateFundStore,
  useSubmitFund,
} from "@/lib/create-fund";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";
import { mauveDark } from "@/utils/colors";

import FadingEdge, { useOverflowFadeEdge } from "../fading-edge";
import LeanText from "../lean-text";
import LeanView from "../lean-view";
import Presence from "../presence";
import CreateFooter from "./footer";

const DELAY = 60;

type Props = {
  setScreen: (screen: CreateFundScreens) => void;
};

export default function ChooseFolder({ setScreen }: Props) {
  const { fadeProps, handleScroll } = useOverflowFadeEdge();

  const folderId = useCreateFundStore((s) => s.folderId);
  const setFolderId = useCreateFundStore((s) => s.setFolderId);
  const fundType = useCreateFundStore((s) => s.fundType);

  const { data } = useQuery(trpc.folder.list.queryOptions());
  const { submit, isPending } = useSubmitFund();

  return (
    <>
      <FadingEdge fadeColor={mauveDark.mauveDark1} {...fadeProps}>
        <ScrollView
          className="p-4 pt-0"
          contentContainerClassName="pb-4 flex"
          onScroll={handleScroll}
        >
          <Presence delay={DELAY} delayMultiplier={3}>
            <LeanText className="font-satoshi-medium text-lg text-mauveDark12">
              Select a folder.
            </LeanText>
          </Presence>

          <LeanView className="mt-3 h-full">
            <FlashList
              contentContainerStyle={{ paddingBottom: 8 }}
              data={data}
              extraData={folderId}
              ItemSeparatorComponent={() => <LeanView className="h-2" />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              renderItem={({ item, index }) => {
                // delay multipler 3 takes into account api loading
                return (
                  <Presence
                    className={cn("flex-1", index % 2 ? "ml-1" : "mr-1")}
                    delay={DELAY}
                    delayMultiplier={3 + index}
                  >
                    <FolderCard
                      folder={item}
                      onPress={() => setFolderId(item.id)}
                      selected={item.id === folderId}
                    />
                  </Presence>
                );
              }}
            />
          </LeanView>
        </ScrollView>
      </FadingEdge>
      <CreateFooter
        disabled={!folderId || isPending}
        onBackPress={() => {
          setScreen(
            fundType === "SPENDING" ? "spendingInfo" : "nonNegotiableInfo"
          );
        }}
        onContinuePress={() => {
          if (!folderId) {
            return;
          }
          submit(folderId);
        }}
      >
        {isPending ? "Saving..." : "Save"}
      </CreateFooter>
    </>
  );
}

type FolderCardProps = {
  folder: Folder;
  selected?: boolean;
} & PressableProps;

function FolderCard({
  folder,
  className,
  selected = false,
  ...rest
}: FolderCardProps) {
  return (
    <Pressable
      className={cn(
        "flex-row items-center rounded-xl bg-mauveDark4 p-4 transition-transform active:scale-95",
        selected && "bg-mauveDark12"
      )}
      {...rest}
    >
      {selected ? (
        <FolderOpenDuo color={mauveDark.mauveDark1} size={16} />
      ) : (
        <FolderClosedDuoCreate color={mauveDark.mauveDark12} size={16} />
      )}

      <LeanText
        className={cn(
          "ml-2 shrink font-satoshi-medium text-base text-mauveDark12",
          selected && "text-mauveDark3"
        )}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {folder.name}
      </LeanText>
    </Pressable>
  );
}
