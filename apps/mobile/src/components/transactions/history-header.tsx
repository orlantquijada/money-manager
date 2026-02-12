import { addMonths, isSameMonth, startOfMonth, subMonths } from "date-fns";
import * as Haptics from "expo-haptics";
import type { SFSymbol } from "expo-symbols";
import { type Ref, useCallback, useMemo, useRef } from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import * as DropdownMenu from "zeego/dropdown-menu";
import { StyledLeanView } from "@/config/interop";
import { StyledIconSymbol } from "@/config/interop-icon-symbol";
import { directionSlide, transitions } from "@/utils/motion";
import GlassIconButton from "../glass-icon-button";
import { ScalePressable } from "../scale-pressable";

export const SEARCH_BAR_HEIGHT = 40;
const SEARCH_BAR_TOTAL_HEIGHT = SEARCH_BAR_HEIGHT + 12; // +gap-3
const now = new Date();

type SearchBarProps = {
  isExpanded: SharedValue<boolean>;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onClear: () => void;
  showClearButton: boolean;
  inputRef: Ref<TextInput>;
};

function SearchBar({
  isExpanded,
  searchQuery,
  onSearchChange,
  onClear,
  showClearButton,
  inputRef,
}: SearchBarProps) {
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
        className="h-10 flex-row items-center gap-2 rounded-xl android:border-hairline border-border bg-muted px-3"
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
          className="h-full flex-1 font-satoshi-medium text-foreground"
          cursorColorClassName="accent-foreground"
          onChangeText={onSearchChange}
          placeholder="Search stores or funds"
          placeholderTextColorClassName="accent-foreground-muted"
          ref={inputRef}
          returnKeyType="search"
          selectionColorClassName="accent-foreground"
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

const monthFmt = new Intl.DateTimeFormat("en", { month: "long" });
const monthYearFmt = new Intl.DateTimeFormat("en", {
  month: "long",
  year: "numeric",
});

function formatMonthLabel(date: Date) {
  return date.getFullYear() !== now.getFullYear()
    ? monthYearFmt.format(date)
    : monthFmt.format(date);
}

function getLast12Months() {
  return Array.from({ length: 12 }, (_, i) => {
    const d = startOfMonth(subMonths(now, i));
    return { date: d, label: formatMonthLabel(d) };
  });
}

type MonthNavProps = {
  month: Date;
  onMonthChange: (month: Date) => void;
};

const MONTH_SLIDE_OFFSET = 20;
const DELTA_DIRECTION = {
  prev: -1,
  next: 1,
};

function MonthNav({ month, onMonthChange }: MonthNavProps) {
  const months = useMemo(() => getLast12Months(), []);
  const canGoNext = !isSameMonth(month, now);

  const direction = useSharedValue(1);
  const { entering, exiting } = useMemo(
    () => directionSlide(direction, MONTH_SLIDE_OFFSET),
    [direction]
  );

  const navigateMonth = useCallback(
    (delta: number) => {
      if (delta > 0 && !canGoNext) return;
      Haptics.selectionAsync();
      direction.set(delta > 0 ? 1 : -1);
      onMonthChange(startOfMonth(addMonths(month, delta)));
    },
    [month, canGoNext, onMonthChange, direction]
  );

  const onDropdownSelect = useCallback(
    (m: { date: Date }) => {
      if (isSameMonth(m.date, month)) return;
      Haptics.selectionAsync();
      direction.set(m.date > month ? 1 : -1);
      onMonthChange(m.date);
    },
    [month, onMonthChange, direction]
  );

  const label = formatMonthLabel(month);

  return (
    <StyledLeanView className="flex-1 flex-row items-center justify-center">
      <GlassIconButton
        icon="chevron.left"
        iconSize={14}
        onPress={() => navigateMonth(DELTA_DIRECTION.prev)}
      />

      <StyledLeanView className="flex-1 self-stretch">
        <DropdownMenu.Root modal>
          <DropdownMenu.Trigger asChild>
            <ScalePressable
              className="h-10 items-center justify-center"
              hitSlop={10}
              opacityValue={0.7}
              scaleValue={0.93}
            >
              <Animated.Text
                className="text-center font-satoshi-medium text-base text-foreground"
                entering={entering}
                exiting={exiting}
                key={label}
              >
                {label}
              </Animated.Text>
            </ScalePressable>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {months.map((m) => (
              <DropdownMenu.Item
                key={m.label}
                onSelect={() => onDropdownSelect(m)}
              >
                {isSameMonth(m.date, month) && (
                  <DropdownMenu.ItemIcon
                    ios={{ name: "checkmark" as SFSymbol }}
                  />
                )}
                <DropdownMenu.ItemTitle>{m.label}</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </StyledLeanView>

      <GlassIconButton
        disabled={!canGoNext}
        icon="chevron.right"
        iconSize={14}
        onPress={() => navigateMonth(DELTA_DIRECTION.next)}
        style={{ opacity: canGoNext ? 1 : 0.5 }}
      />
    </StyledLeanView>
  );
}

type Props = {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  isSearchExpanded: SharedValue<boolean>;
  onSearchToggle: () => void;
  month: Date;
  onMonthChange: (month: Date) => void;
};

export function HistoryHeader({
  searchQuery,
  onSearchChange,
  onSearchClear,
  isSearchExpanded,
  onSearchToggle,
  month,
  onMonthChange,
}: Props) {
  const inputRef = useRef<TextInput>(null);

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

  const showClearButton = searchQuery.length > 0;

  return (
    <StyledLeanView className="mb-4 bg-background px-4 pt-safe-offset-4">
      <StyledLeanView className="mb-3 flex-row items-center gap-2">
        <MonthNav month={month} onMonthChange={onMonthChange} />

        <GlassIconButton icon="magnifyingglass" onPress={onSearchToggle} />
      </StyledLeanView>

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
