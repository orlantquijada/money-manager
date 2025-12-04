import DateTimePicker, {
  DateTimePickerAndroid,
  type IOSNativeProps,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { MotiView } from "moti";
import { type MutableRefObject, memo, useCallback, useRef } from "react";
import { Dimensions, Platform, Pressable, Text, View } from "react-native";
import {
  type SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { formatRelativeDate } from "~/utils/functions";
import { useTransactionStore } from "~/utils/hooks/useTransactionStore";
import { transitions } from "~/utils/motion";

// import CalendarIcon from "../../../assets/icons/calendar-duo-dark.svg";
import { AnimateHeight } from "../AnimateHeight";

type IOSMode = NonNullable<IOSNativeProps["mode"]>;
const { width } = Dimensions.get("screen");

export default function DateSection({ defaultOpen }: { defaultOpen: boolean }) {
  const show = useSharedValue(defaultOpen);
  const createdAt = useTransactionStore((s) => s.createdAt);

  const currentMode = useSharedValue<IOSMode>("date");
  // HACK: save createdAt as a ref bec rerendering `AnimateHeight` causes the app to freeze
  const createdAtRef = useRef(createdAt);

  // NOTE: useCallback is necesarry
  const handleSelectedDateChange = useCallback((date: Date) => {
    createdAtRef.current = date;
    useTransactionStore.setState({ createdAt: date });
  }, []);

  const formattedDate = formatRelativeDate(createdAt, new Date());

  return (
    <Pressable
      className="border-b border-b-mauveDark4"
      onPress={() => {
        show.value = !show.value;
      }}
    >
      <View className="h-16 flex-row items-center px-4">
        {/* <CalendarIcon height={20} width={20} /> */}

        <View className="ml-4 h-full grow flex-row items-center justify-between">
          <Pressable
            className="h-full min-w-[25%] justify-center pr-6"
            onPress={() => {
              if (Platform.OS === "ios") {
                currentMode.value = "date";
                show.value = !(show.value && currentMode.value === "date");
              } else if (Platform.OS === "android") {
                DateTimePickerAndroid.open({
                  mode: "date",
                  value: createdAt,
                  maximumDate: new Date(),
                  onChange: (_, date) => {
                    if (date) {
                      handleSelectedDateChange(date);
                    }
                  },
                });
              }
            }}
          >
            <Text className="font-satoshi-medium text-base text-mauveDark12 capitalize">
              {formattedDate}
            </Text>
          </Pressable>
          <Pressable
            className="h-full min-w-[25%] items-end justify-center pl-6"
            onPress={() => {
              if (Platform.OS === "ios") {
                currentMode.value = "time";
                show.value = !(show.value && currentMode.value === "time");
              } else if (Platform.OS === "android") {
                DateTimePickerAndroid.open({
                  mode: "time",
                  value: createdAt,
                  onChange: (_, date) => {
                    if (date) {
                      handleSelectedDateChange(date);
                    }
                  },
                });
              }
            }}
          >
            <Text className="font-satoshi-medium text-base text-mauveDark12">
              {format(createdAt, "h:mm aa")}
            </Text>
          </Pressable>
        </View>
      </View>

      {Platform.OS === "ios" ? (
        <IOSDateTimePicker
          createdAtRef={createdAtRef}
          currentMode={currentMode}
          setSelectedDate={handleSelectedDateChange}
          show={show}
        />
      ) : null}
    </Pressable>
  );
}
// NOTE: rerendering this doesn't freeze the app anymore but why fix if it ain't broke
// WARNING: rerendering `AnimateHeight` causes the app the freeze idk why
// that's why this component is memoized
const IOSDateTimePicker = memo(
  ({
    setSelectedDate,
    currentMode,
    show,
    createdAtRef,
  }: {
    setSelectedDate: (date: Date) => void;
    currentMode: SharedValue<IOSMode>;
    show: SharedValue<boolean>;
    createdAtRef: MutableRefObject<Date>;
  }) => {
    return (
      <AnimateHeight open={show}>
        <MotiView
          animate={useDerivedValue(() => ({
            translateX: currentMode.value === "time" ? -width : 0,
          }))}
          className="flex-row pb-4"
          style={{ width: width * 2 }}
          transition={transitions.snappy}
        >
          <View className="w-1/2">
            <DateTimePicker
              display="inline"
              maximumDate={new Date()}
              mode="date"
              onChange={(_, date) => {
                if (_.type === "set" && date) {
                  const newDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    createdAtRef.current.getHours(),
                    createdAtRef.current.getMinutes()
                  );
                  setSelectedDate(newDate);
                }
                // }
              }}
              style={{ paddingBottom: 16 }}
              testID="date-picker"
              // display="default"
              themeVariant="dark"
              value={createdAtRef.current}
            />
          </View>

          <View className="w-1/2">
            <DateTimePicker
              display="spinner"
              minuteInterval={5}
              mode="time"
              onChange={(_, date) => {
                if (date) {
                  const newDate = new Date(
                    createdAtRef.current.getFullYear(),
                    createdAtRef.current.getMonth(),
                    createdAtRef.current.getDate(),
                    date.getHours(),
                    date.getMinutes()
                  );
                  setSelectedDate(newDate);
                }
              }}
              testID="date-picker"
              themeVariant="dark"
              value={createdAtRef.current}
            />
          </View>
        </MotiView>
      </AnimateHeight>
    );
  }
);
IOSDateTimePicker.displayName = "IOSDateTimePicker";
