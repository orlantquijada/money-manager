import { router } from "expo-router";
import { TabList, TabSlot, Tabs, TabTrigger } from "expo-router/ui";
import { useMemo } from "react";
import { Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import TabButton from "@/components/tab-button";
import { StyledGlassView } from "@/config/interop";
import { StyledGlassButton } from "@/config/interop-glass-button";
import { useTabPosition } from "@/contexts/tab-position-context";
import {
  ActivityRecDuoDark,
  ChartColumnDuoDark,
  HomeDuoDark,
  Plus,
} from "@/icons";

const GAP = 16;
const FAB_SIZE = 56;
const TAB_BAR_HEIGHT = 48;
const ICON_SIZE = 24;

// export default function MainLayout() {
//   const insets = useSafeAreaInsets();
//   const { position: outerPosition } = useTabPosition();
//
//   const bottom = insets.bottom + GAP;
//
//   const translateY = useMemo(() => {
//     if (!outerPosition) return 0;
//
//     return outerPosition.interpolate({
//       inputRange: [0, 1],
//       outputRange: [0, FAB_SIZE + bottom + TAB_BAR_HEIGHT],
//       extrapolate: "clamp",
//     });
//   }, [outerPosition, bottom]);
//
//   const handleFabPress = () => {
//     router.navigate("/add-expense");
//   };
//
//   return (
//     <AnimatedTabScreen index={0}>
//       <Tabs>
//         <TabSlot />
//
//         {/* Hidden TabList to define routes */}
//         <TabList style={{ display: "none" }}>
//           <TabTrigger href="/" name="home" />
//           <TabTrigger href="/insights" name="insights" />
//           <TabTrigger href="/transactions" name="transactions" />
//         </TabList>
//
//         {/* Custom tab bar */}
//         <Animated.View
//           className="absolute inset-x-4 flex-row items-center justify-between"
//           style={{ bottom, transform: [{ translateY }] }}
//         >
//           {/* Left: Tab icons in glass pill */}
//           <StyledGlassView
//             className="h-16 flex-row gap-2 rounded-full bg-background px-4"
//             isInteractive
//             tintColorClassName="accent-background"
//           >
//             <TabTrigger asChild name="home">
//               <TabButton icon={HomeDuoDark} size={ICON_SIZE} />
//             </TabTrigger>
//             <TabTrigger asChild name="insights">
//               <TabButton icon={ChartColumnDuoDark} size={ICON_SIZE} />
//             </TabTrigger>
//             <TabTrigger asChild name="transactions">
//               <TabButton icon={ActivityRecDuoDark} size={ICON_SIZE} />
//             </TabTrigger>
//           </StyledGlassView>
//
//           {/* Right: FAB button */}
//           <StyledGlassButton onPress={handleFabPress} size="xl" variant="icon">
//             <Plus className="text-muted-foreground" size={ICON_SIZE} />
//           </StyledGlassButton>
//         </Animated.View>
//       </Tabs>
//     </AnimatedTabScreen>
//   );
// }

export default function MainLayout() {
  const insets = useSafeAreaInsets();
  const { position: outerPosition } = useTabPosition();

  const bottom = insets.bottom + GAP;

  const translateY = useMemo(() => {
    if (!outerPosition) return 0;

    return outerPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [0, FAB_SIZE + bottom + TAB_BAR_HEIGHT],
      extrapolate: "clamp",
    });
  }, [outerPosition, bottom]);

  const handleFabPress = () => {
    router.navigate("/add-expense");
  };

  return (
    <AnimatedTabScreen index={0}>
      <Tabs>
        <TabSlot />

        {/* Hidden TabList to define routes */}
        <TabList style={{ display: "none" }}>
          <TabTrigger href="/" name="home" />
          <TabTrigger href="/insights" name="insights" />
          <TabTrigger href="/transactions" name="transactions" />
        </TabList>

        {/* Custom tab bar */}
        <Animated.View
          className="absolute inset-x-4 flex-row items-center justify-between"
          style={{ bottom, transform: [{ translateY }] }}
        >
          {/* Left: Tab icons in glass pill */}
          <StyledGlassView
            className="h-16 flex-row gap-2 rounded-full android:bg-muted px-4"
            isInteractive
            tintColorClassName="accent-background"
          >
            <TabTrigger asChild name="home">
              <TabButton icon={HomeDuoDark} size={ICON_SIZE} />
            </TabTrigger>
            <TabTrigger asChild name="insights">
              <TabButton icon={ChartColumnDuoDark} size={ICON_SIZE} />
            </TabTrigger>
            <TabTrigger asChild name="transactions">
              <TabButton icon={ActivityRecDuoDark} size={ICON_SIZE} />
            </TabTrigger>
          </StyledGlassView>

          {/* Right: FAB button */}
          <StyledGlassButton onPress={handleFabPress} size="xl" variant="icon">
            <Plus className="text-muted-foreground" size={ICON_SIZE} />
          </StyledGlassButton>
        </Animated.View>
      </Tabs>
    </AnimatedTabScreen>
  );
}
