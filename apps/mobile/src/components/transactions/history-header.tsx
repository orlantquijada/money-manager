import * as Haptics from "expo-haptics";
import type { SFSymbol } from "expo-symbols";
import { useCallback, useRef } from "react";
import { Pressable, TextInput } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import * as DropdownMenu from "zeego/dropdown-menu";
import GlassButton, { GlassIconButton } from "@/components/glass-button";
import type { Period } from "@/components/stats/period-chips";
import { useThemeColor } from "@/components/theme-provider";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { transitions } from "@/utils/motion";

const PERIODS: { value: Period; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "Month" },
  { value: "3mo", label: "Quarter" },
  { value: "all", label: "All Time" },
];

export const SEARCH_BAR_HEIGHT = 40;

type SearchBarProps = {
  isExpanded: SharedValue<boolean>;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onClear: () => void;
  showClearButton: boolean;
  mutedColor: string;
  inputRef: React.RefObject<TextInput | null>;
};

function SearchBar({
  isExpanded,
  searchQuery,
  onSearchChange,
  onClear,
  showClearButton,
  mutedColor,
  inputRef,
}: SearchBarProps) {
  const pointerEvents = useDerivedValue<
    "auto" | "none" | "box-none" | "box-only" | undefined
  >(() => (isExpanded.get() ? "auto" : "none"));

  const animatedStyle = useAnimatedStyle(() => {
    const expanded = isExpanded.get();
    return {
      opacity: withSpring(expanded ? 1 : 0, transitions.snappy),
      transform: [
        { translateY: withSpring(expanded ? 0 : -20, transitions.snappy) },
      ],
    };
  });

  return (
    <Animated.View pointerEvents={pointerEvents} style={animatedStyle}>
      <StyledLeanView
        className="flex-row items-center gap-2 rounded-xl bg-muted px-3 py-2.5"
        style={{ height: SEARCH_BAR_HEIGHT }}
      >
        <IconSymbol
          color={mutedColor}
          name="magnifyingglass"
          size={18}
          weight="medium"
        />
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          className="flex-1 font-satoshi-medium text-base text-foreground"
          cursorColorClassName="accent-foreground"
          onChangeText={onSearchChange}
          placeholder="Search stores or funds"
          placeholderTextColorClassName="accent-foreground-muted"
          ref={inputRef}
          returnKeyType="search"
          selectionColorClassName="accent-foreground"
          style={{ padding: 0, lineHeight: undefined }}
          value={searchQuery}
        />
        {showClearButton && (
          <Pressable hitSlop={8} onPress={onClear}>
            <IconSymbol color={mutedColor} name="xmark.circle.fill" size={18} />
          </Pressable>
        )}
      </StyledLeanView>
    </Animated.View>
  );
}

type Props = {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  isSearchExpanded: SharedValue<boolean>;
  onSearchToggle: () => void;
  period: Period;
  onPeriodChange: (period: Period) => void;
};

export function HistoryHeader({
  searchQuery,
  onSearchChange,
  onSearchClear,
  isSearchExpanded,
  onSearchToggle,
  period,
  onPeriodChange,
}: Props) {
  const inputRef = useRef<TextInput>(null);

  const mutedColor = useThemeColor("foreground-muted");
  const muted = useThemeColor("muted");
  const foregroundSecondary = useThemeColor("foreground-secondary");

  // Auto-focus input when search expands
  const focusInput = useCallback(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useAnimatedReaction(
    () => isSearchExpanded.get(),
    (current, previous) => {
      if (current && !previous) {
        scheduleOnRN(focusInput);
      }
    }
  );

  const handleClear = useCallback(() => {
    onSearchClear();
    inputRef.current?.blur();
  }, [onSearchClear]);

  const handlePeriodSelect = useCallback(
    (newPeriod: Period) => {
      if (newPeriod !== period) {
        Haptics.selectionAsync();
        onPeriodChange(newPeriod);
      }
    },
    [period, onPeriodChange]
  );

  const showClearButton = searchQuery.length > 0;
  const currentPeriodLabel =
    PERIODS.find((p) => p.value === period)?.label ?? "Month";

  return (
    <StyledLeanView className="gap-3 bg-background px-4 pt-safe">
      <StyledLeanView className="flex-row items-center justify-end gap-2">
        {/* Period dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <GlassButton size="md" tintColor={muted} variant="default">
              <StyledLeanView className="flex-row items-center gap-1.5">
                <StyledLeanText className="font-satoshi-medium text-foreground">
                  {currentPeriodLabel}
                </StyledLeanText>
                <IconSymbol
                  color={foregroundSecondary}
                  name="chevron.up.chevron.down"
                  size={12}
                />
              </StyledLeanView>
            </GlassButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {PERIODS.map((p) => (
              <DropdownMenu.Item
                key={p.value}
                onSelect={() => handlePeriodSelect(p.value)}
              >
                {period === p.value && (
                  <DropdownMenu.ItemIcon
                    ios={{ name: "checkmark" as SFSymbol }}
                  />
                )}
                <DropdownMenu.ItemTitle>{p.label}</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <GlassIconButton icon="magnifyingglass" onPress={onSearchToggle} />
      </StyledLeanView>

      {/* Collapsible search bar - transform-only animation */}
      <SearchBar
        inputRef={inputRef}
        isExpanded={isSearchExpanded}
        mutedColor={mutedColor}
        onClear={handleClear}
        onSearchChange={onSearchChange}
        searchQuery={searchQuery}
        showClearButton={showClearButton}
      />
    </StyledLeanView>
  );
}
