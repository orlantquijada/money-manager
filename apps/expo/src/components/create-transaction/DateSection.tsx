import { memo, MutableRefObject, useCallback, useRef } from "react"
import { View, Text, Pressable, Dimensions, Platform } from "react-native"
import DateTimePicker, {
  DateTimePickerAndroid,
  IOSNativeProps,
} from "@react-native-community/datetimepicker"
import { format } from "date-fns"
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated"
import { MotiView } from "moti"

import { transitions } from "~/utils/motion"
import { formatRelativeDate } from "~/utils/functions"

import { AnimateHeight } from "../AnimateHeight"

import CalendarIcon from "../../../assets/icons/calendar-duo-dark.svg"
import { useTransactionStore } from "~/utils/hooks/useTransactionStore"

type IOSMode = NonNullable<IOSNativeProps["mode"]>
const { width } = Dimensions.get("screen")

export default function DateSection({ defaultOpen }: { defaultOpen: boolean }) {
  const show = useSharedValue(defaultOpen)
  const createdAt = useTransactionStore((s) => s.createdAt)

  const currentMode = useSharedValue<IOSMode>("date")
  // HACK: save createdAt as a ref bec rerendering `AnimateHeight` causes the app to freeze
  const createdAtRef = useRef(createdAt)

  // NOTE: useCallback is necesarry
  const handleSelectedDateChange = useCallback((date: Date) => {
    createdAtRef.current = date
    useTransactionStore.setState({ createdAt: date })
  }, [])

  const formattedDate = formatRelativeDate(createdAt, new Date())

  return (
    <Pressable
      className="border-b-mauveDark4 border-b"
      onPress={() => {
        show.value = !show.value
      }}
    >
      <View className="h-16 flex-row items-center px-4">
        <CalendarIcon width={20} height={20} />

        <View className="ml-4 h-full grow flex-row items-center justify-between">
          <Pressable
            onPress={() => {
              if (Platform.OS === "ios") {
                currentMode.value = "date"
                show.value = !(show.value && currentMode.value === "date")
              } else if (Platform.OS === "android") {
                DateTimePickerAndroid.open({
                  mode: "date",
                  value: createdAt,
                  maximumDate: new Date(),
                  onChange: (_, date) => {
                    if (date) handleSelectedDateChange(date)
                  },
                })
              }
            }}
            className="h-full min-w-[25%] justify-center pr-6"
          >
            <Text className="font-satoshi-medium text-mauveDark12 text-base capitalize">
              {formattedDate}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              if (Platform.OS === "ios") {
                currentMode.value = "time"
                show.value = !(show.value && currentMode.value === "time")
              } else if (Platform.OS === "android") {
                DateTimePickerAndroid.open({
                  mode: "time",
                  value: createdAt,
                  onChange: (_, date) => {
                    if (date) handleSelectedDateChange(date)
                  },
                })
              }
            }}
            className="h-full min-w-[25%] items-end justify-center pl-6"
          >
            <Text className="font-satoshi-medium text-mauveDark12 text-base">
              {format(createdAt, "h:mm aa")}
            </Text>
          </Pressable>
        </View>
      </View>

      {Platform.OS === "ios" ? (
        <IOSDateTimePicker
          setSelectedDate={handleSelectedDateChange}
          show={show}
          currentMode={currentMode}
          createdAtRef={createdAtRef}
        />
      ) : null}
    </Pressable>
  )
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
    setSelectedDate: (date: Date) => void
    currentMode: SharedValue<IOSMode>
    show: SharedValue<boolean>
    createdAtRef: MutableRefObject<Date>
  }) => {
    return (
      <AnimateHeight open={show}>
        <MotiView
          className="flex-row pb-4"
          style={{ width: width * 2 }}
          animate={useDerivedValue(() => ({
            translateX: currentMode.value === "time" ? -width : 0,
          }))}
          transition={transitions.snappy}
        >
          <View className="w-1/2">
            <DateTimePicker
              testID="date-picker"
              value={createdAtRef.current}
              mode="date"
              maximumDate={new Date()}
              onChange={(_, date) => {
                if (_.type === "set" && date) {
                  const newDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    createdAtRef.current.getHours(),
                    createdAtRef.current.getMinutes(),
                  )
                  setSelectedDate(newDate)
                }
                // }
              }}
              display="inline"
              // display="default"
              themeVariant="dark"
              style={{ paddingBottom: 16 }}
            />
          </View>

          <View className="w-1/2">
            <DateTimePicker
              testID="date-picker"
              value={createdAtRef.current}
              mode="time"
              display="spinner"
              themeVariant="dark"
              minuteInterval={5}
              onChange={(_, date) => {
                if (date) {
                  const newDate = new Date(
                    createdAtRef.current.getFullYear(),
                    createdAtRef.current.getMonth(),
                    createdAtRef.current.getDate(),
                    date.getHours(),
                    date.getMinutes(),
                  )
                  setSelectedDate(newDate)
                }
              }}
            />
          </View>
        </MotiView>
      </AnimateHeight>
    )
  },
)
IOSDateTimePicker.displayName = "IOSDateTimePicker"
