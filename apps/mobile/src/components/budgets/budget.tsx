import type { Folder } from "api";
import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { FolderClosedDuoCreate, FolderOpenDuo } from "@/icons";
import type { FundWithMeta } from "@/lib/fund";
import { mauve } from "@/utils/colors";
import AnimateHeight from "../animate-height";
import LeanText from "../lean-text";
import LeanView from "../lean-view";
import Category from "./category";

type Props = {
  folderId: Folder["id"];
  folderName: Folder["name"];
  funds: FundWithMeta[];
  defaultOpen?: boolean;
};

export default function Budget({
  funds,
  folderId,
  folderName,
  defaultOpen,
}: Props) {
  const open = useSharedValue(true);
  const toggle = () => {
    open.set((prev) => !prev);
  };

  return (
    <LeanView>
      <Pressable
        className="h-14 flex-row items-center justify-between gap-3 rounded-2xl border-hairline border-mauve6 bg-mauve2 p-4 transition-all active:scale-[.98]"
        onPress={toggle}
        style={{ borderCurve: "continuous" }}
      >
        <LeanView className="shrink flex-row items-center gap-3">
          <FolderIcon open={open} />

          <LeanText
            className="shrink font-satoshi-medium text-base text-mauve12"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {folderName}
          </LeanText>
        </LeanView>

        {/* <Text */}
        {/*   className={cn( */}
        {/*     "font-satoshi text-mauve12/50 text-xs", */}
        {/*     didOverspend && "text-pink8" */}
        {/*   )} */}
        {/* > */}
        {/*   <Text className="font-nunito">{toCurrencyNarrow(amountLeft)} </Text> */}
        {/*   left */}
        {/* </Text> */}
      </Pressable>

      <Categories folderId={folderId} funds={funds} open={open} />
    </LeanView>
  );
}

function Categories({
  funds,
  open,
  folderId,
}: Pick<Props, "folderId" | "funds"> & {
  open: SharedValue<boolean>;
}) {
  if (!funds.length) {
    return (
      <LeanView className="overflow-hidden">
        <AnimateHeight isExpanded={open}>
          <Link
            asChild
            href={{ pathname: "/create-fund", params: { folderId } }}
          >
            <Pressable className="h-12 w-full items-center justify-center transition-all active:scale-95 active:opacity-70">
              <Text className="font-satoshi text-mauve12/50 text-sm">
                Add a fund to this folder
              </Text>
            </Pressable>
          </Link>
        </AnimateHeight>
      </LeanView>
    );
  }

  return (
    <LeanView className="overflow-hidden">
      <AnimateHeight isExpanded={open}>
        {funds.map((fund) => (
          <Category fund={fund} key={fund.id} />
        ))}
      </AnimateHeight>
    </LeanView>
  );
}

function useIconStyles(open: SharedValue<boolean>) {
  const openIconStyle = useAnimatedStyle(() => ({
    opacity: Number(open.get()),
  }));
  const closedIconStyle = useAnimatedStyle(() => ({
    opacity: Number(!open.get()),
  }));

  return {
    openIconStyle,
    closedIconStyle,
  };
}

function FolderIcon({ open }: { open: SharedValue<boolean> }) {
  const { closedIconStyle, openIconStyle } = useIconStyles(open);

  return (
    <LeanView className="relative size-4">
      <Animated.View className="absolute inset-0" style={openIconStyle}>
        <FolderOpenDuo color={mauve.mauve12} size={16} />
      </Animated.View>
      <Animated.View className="absolute inset-0" style={closedIconStyle}>
        <FolderClosedDuoCreate color={mauve.mauve12} size={16} />
      </Animated.View>
    </LeanView>
  );
}
