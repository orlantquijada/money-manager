import * as Haptics from "expo-haptics";
import type { SFSymbol } from "expo-symbols";
import { useCallback, useRef } from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import * as DropdownMenu from "zeego/dropdown-menu";
import type { Period } from "@/components/stats/period-chips";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { StyledGlassButton } from "@/config/interop-glass-button";
import { StyledIconSymbol } from "@/config/interop-icon-symbol";
import { transitions } from "@/utils/motion";
import GlassIconButton from "../glass-icon-button";

const PERIODS: { value: Period; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "Month" },
  { value: "3mo", label: "Quarter" },
  { value: "all", label: "All Time" },
];

export const SEARCH_BAR_HEIGHT = 40;
const SEARCH_BAR_TOTAL_HEIGHT = SEARCH_BAR_HEIGHT + 12; // +gap-3

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
  inputRef,
}: Omit<SearchBarProps, "mutedColor">) {
  const progress = useDerivedValue(() =>
    withSpring(isExpanded.get() ? 1 : 0, transitions.snappy)
  );

  const pointerEvents = useDerivedValue<
    "auto" | "none" | "box-none" | "box-only" | undefined
  >(() => (isExpanded.get() ? "auto" : "none"));

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      height: SEARCH_BAR_TOTAL_HEIGHT * p,
      opacity: p,
      transform: [{ scale: 0.9 + 0.1 * p }, { translateY: -25 * (1 - p) }],
    };
  });

  return (
    <Animated.View
      className="overflow-hidden"
      pointerEvents={pointerEvents}
      style={animatedStyle}
    >
      <StyledLeanView
        className="flex-row items-center gap-2 rounded-xl bg-muted px-3 py-2.5"
        style={{
          ...StyleSheet.absoluteFillObject,
          bottom: "auto",
          height: SEARCH_BAR_HEIGHT,
        }}
      >
        <StyledIconSymbol
          colorClassName="accent-foreground-muted"
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
            <StyledIconSymbol
              colorClassName="accent-foreground-muted"
              name="xmark.circle.fill"
              size={18}
            />
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
    <StyledLeanView className="bg-background px-4 pt-safe-offset-4">
      <StyledLeanView className="mb-3 flex-row items-center justify-end gap-2">
        {/* Period dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <StyledGlassButton
              glassViewProps={{
                style: { height: 40 },
              }}
              size="md"
              tintColorClassName="accent-muted"
            >
              <StyledLeanView className="flex-row items-center gap-1.5">
                <StyledLeanText className="font-satoshi-medium text-foreground">
                  {currentPeriodLabel}
                </StyledLeanText>
                <StyledIconSymbol
                  colorClassName="accent-foreground-secondary"
                  name="chevron.up.chevron.down"
                  size={12}
                />
              </StyledLeanView>
            </StyledGlassButton>
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

      {/* Collapsible search bar */}
      <SearchBar
        inputRef={inputRef}
        isExpanded={isSearchExpanded}
        onClear={handleClear}
        onSearchChange={onSearchChange}
        searchQuery={searchQuery}
        showClearButton={showClearButton}
      />
    </StyledLeanView>
  );
}
