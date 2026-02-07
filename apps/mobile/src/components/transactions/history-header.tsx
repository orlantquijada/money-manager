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
import { transitions } from "@/utils/motion";
import GlassIconButton from "../glass-icon-button";
import { ScalePressable } from "../scale-pressable";

export const SEARCH_BAR_HEIGHT = 40;
const SEARCH_BAR_TOTAL_HEIGHT = SEARCH_BAR_HEIGHT + 12; // +gap-3

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

function formatMonthLabel(year: number, month: number) {
  const date = new Date(year, month - 1);
  return date.toLocaleString("en", {
    month: "long",
    ...(year !== new Date().getFullYear() && { year: "numeric" }),
  });
}

function getLast12Months() {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: formatMonthLabel(d.getFullYear(), d.getMonth() + 1),
    };
  });
}

type MonthNavProps = {
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
  canGoNext: boolean;
};

const MONTH_SLIDE_OFFSET = 20;

function MonthNav({ year, month, onMonthChange, canGoNext }: MonthNavProps) {
  const months = useMemo(() => getLast12Months(), []);
  const direction = useSharedValue(1);

  const entering = useCallback(() => {
    "worklet";
    const dir = direction.get();
    const animations = {
      transform: [{ translateX: withSpring(0, transitions.snappy) }],
      opacity: withSpring(1, transitions.snappy),
    };
    const initialValues = {
      transform: [{ translateX: dir * MONTH_SLIDE_OFFSET }],
      opacity: 0,
    };
    return { animations, initialValues };
  }, []);

  const exiting = useCallback(() => {
    "worklet";
    const dir = direction.get();
    const animations = {
      transform: [
        {
          translateX: withSpring(-dir * MONTH_SLIDE_OFFSET, transitions.snappy),
        },
      ],
      opacity: withSpring(0, transitions.snappy),
    };
    const initialValues = {
      transform: [{ translateX: 0 }],
      opacity: 1,
    };
    return { animations, initialValues };
  }, []);

  const goPrev = useCallback(() => {
    Haptics.selectionAsync();
    direction.set(-1);
    const d = new Date(year, month - 2, 1);
    onMonthChange(d.getFullYear(), d.getMonth() + 1);
  }, [year, month, onMonthChange]);

  const goNext = useCallback(() => {
    if (!canGoNext) return;
    Haptics.selectionAsync();
    direction.set(1);
    const d = new Date(year, month, 1);
    onMonthChange(d.getFullYear(), d.getMonth() + 1);
  }, [year, month, canGoNext, onMonthChange]);

  const label = formatMonthLabel(year, month);

  return (
    <StyledLeanView className="flex-1 flex-row items-center justify-center">
      <GlassIconButton icon="chevron.left" iconSize={14} onPress={goPrev} />

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
                key={`${m.year}-${m.month}`}
                onSelect={() => {
                  if (m.year !== year || m.month !== month) {
                    Haptics.selectionAsync();
                    const isForward =
                      m.year > year || (m.year === year && m.month > month);
                    direction.set(isForward ? 1 : -1);
                    onMonthChange(m.year, m.month);
                  }
                }}
              >
                {m.year === year && m.month === month && (
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
        onPress={goNext}
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
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
  canGoNext: boolean;
};

export function HistoryHeader({
  searchQuery,
  onSearchChange,
  onSearchClear,
  isSearchExpanded,
  onSearchToggle,
  year,
  month,
  onMonthChange,
  canGoNext,
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
        <MonthNav
          canGoNext={canGoNext}
          month={month}
          onMonthChange={onMonthChange}
          year={year}
        />

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
