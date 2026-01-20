import type { Folder } from "api";
import { Link } from "expo-router";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { FolderClosedDuoCreate, FolderOpenDuo } from "@/icons";
import type { FundWithMeta } from "@/lib/fund";
import { cn } from "@/utils/cn";
import AnimateHeight from "../animate-height";
import Category from "./category";

type Props = {
  folderId: Folder["id"];
  folderName: Folder["name"];
  funds: FundWithMeta[];
  open: SharedValue<boolean>;
};

export default function Budget({ funds, folderId, folderName, open }: Props) {
  const toggle = () => {
    open.set((prev) => !prev);
  };

  return (
    <StyledLeanView>
      <ScalePressable
        className="flex-row items-center justify-between gap-3 rounded-2xl"
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
      </ScalePressable>

      <Categories folderId={folderId} funds={funds} open={open} />
    </StyledLeanView>
  );
}

type CategoriesProps = Pick<Props, "folderId" | "funds"> & {
  open: SharedValue<boolean>;
};

function Categories({ funds, open, folderId }: CategoriesProps) {
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
              <StyledLeanText className="font-satoshi text-foreground-muted text-sm">
                Add a fund to this folder
              </StyledLeanText>
            </ScalePressable>
          </Link>
        </AnimateHeight>
      </StyledLeanView>
    );
  }

  return (
    <StyledLeanView className="overflow-hidden">
      <AnimateHeight isExpanded={open}>
        {funds.map((fund, idx) => (
          <Category
            className={cn(
              idx === 0 && "mt-1.5",
              idx === funds.length - 1 && "mb-4",
              "pl-7"
            )}
            fund={fund}
            key={fund.id}
          />
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
