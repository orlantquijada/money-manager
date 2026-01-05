import type { Folder } from "api";
import { Link } from "expo-router";
import { Text } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { FolderClosedDuoCreate, FolderOpenDuo } from "@/icons";
import type { FundWithMeta } from "@/lib/fund";
import AnimateHeight from "../animate-height";
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
    <StyledLeanView>
      <ScalePressable
        className="h-14 flex-row items-center justify-between gap-3 rounded-2xl border-border border-hairline bg-card p-4"
        disableOpacity
        onPress={toggle}
        scaleValue={0.98}
        style={{ borderCurve: "continuous" }}
      >
        <StyledLeanView className="shrink flex-row items-center gap-3">
          <FolderIcon open={open} />

          <StyledLeanText
            className="shrink font-satoshi-medium text-base text-foreground"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {folderName}
          </StyledLeanText>
        </StyledLeanView>

        {/* <Text */}
        {/*   className={cn( */}
        {/*     "font-satoshi text-mauve12/50 text-xs", */}
        {/*     didOverspend && "text-pink8" */}
        {/*   )} */}
        {/* > */}
        {/*   <Text className="font-nunito">{toCurrencyNarrow(amountLeft)} </Text> */}
        {/*   left */}
        {/* </Text> */}
      </ScalePressable>

      <Categories folderId={folderId} funds={funds} open={open} />
    </StyledLeanView>
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
      <StyledLeanView className="overflow-hidden">
        <AnimateHeight isExpanded={open}>
          <Link
            asChild
            href={{ pathname: "/create-fund", params: { folderId } }}
          >
            <ScalePressable
              className="h-12 w-full items-center justify-center"
              opacityValue={0.7}
              scaleValue={0.95}
            >
              <Text className="font-satoshi text-foreground-muted text-sm">
                Add a fund to this folder
              </Text>
            </ScalePressable>
          </Link>
        </AnimateHeight>
      </StyledLeanView>
    );
  }

  return (
    <StyledLeanView className="overflow-hidden">
      <AnimateHeight isExpanded={open}>
        {funds.map((fund) => (
          <Category fund={fund} key={fund.id} />
        ))}
      </AnimateHeight>
    </StyledLeanView>
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
    <StyledLeanView className="relative size-4">
      <Animated.View className="absolute inset-0" style={openIconStyle}>
        <FolderOpenDuo className="text-foreground" size={16} />
      </Animated.View>
      <Animated.View className="absolute inset-0" style={closedIconStyle}>
        <FolderClosedDuoCreate className="text-foreground" size={16} />
      </Animated.View>
    </StyledLeanView>
  );
}
