import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import type { Ref } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FolderClosedDuoCreate, ShoppingBag, WalletDuo } from "@/icons";
import { cn } from "@/utils/cn";
import { mauveA, mauveDark } from "@/utils/colors";
import type { IconComponent } from "@/utils/types";

type DashboardCreateBottomSheetProps = {
  ref: Ref<BottomSheetModal>;
};

export default function DashboardCreateBottomSheet({
  ref,
}: DashboardCreateBottomSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <BottomSheetModal
      // animationConfigs={springConfigs}
      backdropComponent={CreateBackdrop}
      backgroundStyle={{
        backgroundColor: "transparent",
      }}
      bottomInset={insets.bottom}
      detached
      handleIndicatorStyle={{ backgroundColor: mauveDark.mauveDark8 }}
      handleStyle={{ backgroundColor: mauveDark.mauveDark1 }}
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

function Content() {
  const router = useRouter();
  const { close } = useBottomSheet();

  return (
    <BottomSheetView className="flex-1 border-t border-t-mauveDark1 bg-mauveDark1">
      <View className="mb-6 flex-row items-center justify-between px-6">
        <Text className="font-satoshi-bold text-mauveDark12 text-xl">
          Create
        </Text>
      </View>

      <CreateCard
        className="border-mauveDark7 border-b-hairline"
        description="Add folders to organize your funds"
        Icon={FolderClosedDuoCreate}
        onPress={() => {
          close();
          router.push({ pathname: "/create-folder" });
        }}
        title="Folder"
      />
      <CreateCard
        className="border-mauveDark7 border-b-hairline"
        description="Manage your money for different goals"
        Icon={WalletDuo}
        onPress={() => {
          close();
          router.push({ pathname: "/create-fund" });
        }}
        title="Fund"
      />
      <CreateCard
        description="Add transactions to track your spending"
        Icon={ShoppingBag}
        onPress={() => {
          close();
          router.push({ pathname: "/add-expense" });
        }}
        title="Transaction"
      />
    </BottomSheetView>
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
    <Pressable
      className={cn(
        "w-full gap-1.5 bg-mauveDark1 px-6 py-4 transition-all active:scale-[.98] active:opacity-70",
        className
      )}
      onPress={onPress}
    >
      <View className="flex-row items-center gap-4">
        <Icon className="translate-y-1 self-start" size={iconSize} />
        <Text className="font-satoshi-medium text-base text-mauveDark12">
          {title}
        </Text>
      </View>
      <View className="flex-row items-center gap-4">
        <View className="h-px" style={{ width: iconSize }} />
        <Text className="shrink font-inter text-mauveDark10 text-sm">
          {description}
        </Text>
      </View>
    </Pressable>
  );
}
