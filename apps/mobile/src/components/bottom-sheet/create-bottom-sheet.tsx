import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { type Href, useRouter } from "expo-router";
import type { Ref } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScalePressable } from "@/components/scale-pressable";
import { StyledBottomSheetView } from "@/config/interop";
import { FolderClosedDuoCreate, WalletDuo } from "@/icons";
import { cn } from "@/utils/cn";
import { mauveA } from "@/utils/colors";
import type { IconComponent } from "@/utils/types";
import { useThemeColor } from "../theme-provider";

type DashboardCreateBottomSheetProps = {
  ref: Ref<BottomSheetModal>;
};

export default function DashboardCreateBottomSheet({
  ref,
}: DashboardCreateBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const handleIndicatorColor = useThemeColor("foreground-muted");
  const handleBackgroundColor = useThemeColor("background");

  return (
    <BottomSheetModal
      backdropComponent={CreateBackdrop}
      backgroundStyle={{
        backgroundColor: "transparent",
      }}
      bottomInset={insets.bottom}
      detached
      handleIndicatorStyle={{
        backgroundColor: handleIndicatorColor,
      }}
      handleStyle={{
        backgroundColor: handleBackgroundColor,
      }}
      index={0}
      name="dashboard-create"
      ref={ref}
      style={{
        borderCurve: "continuous",
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <Content />
    </BottomSheetModal>
  );
}
DashboardCreateBottomSheet.displayName = "DashboardCreateBottomSheet";

function CreateBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      style={[{ backgroundColor: mauveA.mauveA12 }, props.style]}
    />
  );
}

const CREATE_ITEMS: Array<{
  title: string;
  description: string;
  Icon: IconComponent;
  pathname: Href;
}> = [
  // {
  //   title: "Transaction",
  //   description: "Add transactions to track your spending",
  //   Icon: ShoppingBag,
  //   pathname: "/add-expense",
  // },
  {
    title: "Fund",
    description: "Manage your money for different goals",
    Icon: WalletDuo,
    pathname: "/create-fund",
  },
  {
    title: "Folder",
    description: "Add folders to organize your funds",
    Icon: FolderClosedDuoCreate,
    pathname: "/create-folder",
  },
];

function Content() {
  const router = useRouter();
  const { close } = useBottomSheet();

  return (
    <StyledBottomSheetView className="flex-1 bg-background pb-2">
      <View className="mb-6 flex-row items-center justify-between px-6">
        <Text className="font-satoshi-bold text-foreground text-xl">
          Create
        </Text>
      </View>

      {CREATE_ITEMS.map((item, index) => (
        <CreateCard
          className={
            index !== CREATE_ITEMS.length - 1
              ? "border-mauve-7 border-b-hairline"
              : undefined
          }
          description={item.description}
          Icon={item.Icon}
          key={item.title}
          onPress={() => {
            close();
            router.push(item.pathname);
          }}
          title={item.title}
        />
      ))}
    </StyledBottomSheetView>
  );
}

type CreateCardProps = {
  Icon: IconComponent;
  title: string;
  description: string;
  onPress: () => void;
  className?: string;
};

function CreateCard({
  Icon,
  title,
  description,
  onPress,
  className,
}: CreateCardProps) {
  const iconSize = 18;
  return (
    <ScalePressable
      className={cn("w-full gap-1.5 bg-background px-6 py-4", className)}
      onPress={onPress}
      opacityValue={0.7}
      scaleValue={0.98}
    >
      <View className="flex-row items-center gap-4">
        <Icon
          className="translate-y-1 self-start text-foreground"
          size={iconSize}
        />
        <Text className="font-satoshi-medium text-base text-foreground">
          {title}
        </Text>
      </View>
      <View className="flex-row items-center gap-4">
        <View className="h-px" style={{ width: iconSize }} />
        <Text className="shrink font-inter text-foreground-muted text-sm">
          {description}
        </Text>
      </View>
    </ScalePressable>
  );
}
