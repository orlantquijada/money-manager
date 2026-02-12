import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import type { Folder } from "api";
import { Platform, type PressableProps, ScrollView } from "react-native";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { FolderClosedDuoCreate, FolderOpenDuo } from "@/icons";
import {
  type CreateFundScreens,
  useCreateFundStore,
  useSubmitFund,
} from "@/lib/create-fund";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";

import Presence from "../presence";
import { ScalePressable } from "../scale-pressable";
import CreateFooter from "./footer";

const DELAY = 60;

type Props = {
  setScreen: (screen: CreateFundScreens) => void;
};

export default function ChooseFolder({ setScreen }: Props) {
  const folderId = useCreateFundStore((s) => s.folderId);
  const setFolderId = useCreateFundStore((s) => s.setFolderId);
  const fundType = useCreateFundStore((s) => s.fundType);

  const { data } = useQuery(trpc.folder.list.queryOptions());
  const { submit, isPending } = useSubmitFund();

  return (
    <>
      <ScrollView
        className={cn("px-4", Platform.OS === "android" ? "pt-28" : "pt-20")}
        contentContainerClassName="pb-safe-offset-4 flex"
      >
        <Presence delay={DELAY} delayMultiplier={3}>
          <StyledLeanText className="font-satoshi-medium text-foreground text-lg">
            Select a folder.
          </StyledLeanText>
        </Presence>

        <StyledLeanView className="mt-3 h-full">
          <FlashList
            contentContainerStyle={{ paddingBottom: 8 }}
            data={data}
            extraData={folderId}
            ItemSeparatorComponent={() => <StyledLeanView className="h-2" />}
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
        </StyledLeanView>
      </ScrollView>
      <CreateFooter
        disabled={!folderId || isPending}
        loading={isPending}
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
        variant="text"
      >
        Create Fund
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
    <ScalePressable
      className={cn(
        "flex-row items-center rounded-xl android:border-hairline border-border bg-muted p-4",
        selected && "bg-foreground"
      )}
      scaleValue={0.95}
      {...rest}
    >
      {selected ? (
        <FolderOpenDuo className="text-background" size={16} />
      ) : (
        <FolderClosedDuoCreate className="text-foreground" size={16} />
      )}

      <StyledLeanText
        className={cn(
          "ml-2 shrink font-satoshi-medium text-base text-foreground",
          selected && "text-muted"
        )}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {folder.name}
      </StyledLeanText>
    </ScalePressable>
  );
}
