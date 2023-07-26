import { memo, MutableRefObject, useCallback, useState } from "react"
import { View, Text, Pressable, Dimensions, Platform } from "react-native"
import DateTimePicker, {
  DateTimePickerAndroid,
  IOSNativeProps,
} from "@react-native-community/datetimepicker"
import { format, formatRelative } from "date-fns"
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated"
import { MotiView } from "moti"

import { transitions } from "~/utils/motion"

import { AnimateHeight } from "../AnimateHeight"

import CalendarIcon from "../../../assets/icons/calendar-duo-dark.svg"

type IOSMode = NonNullable<IOSNativeProps["mode"]>
const { width } = Dimensions.get("screen")

// HACK: save createdDate as a ref bec rerendering `AnimateHeight` causes the app to freeze
export default function DateSection({
  createdDate,
}: {
  createdDate: MutableRefObject<Date>
}) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const show = useSharedValue(false)
  const currentMode = useSharedValue<IOSMode>("date")

  const handleSelectedDateChange = useCallback(
    (date: Date) => {
      createdDate.current = date
      setSelectedDate(date)
    },
    [createdDate],
  )

  const formattedDate = formatRelative(selectedDate, new Date())
  const [date, time] = formattedDate.split(" at ")

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
                  value: selectedDate,
                  onChange: (_, date) => {
                    if (date) handleSelectedDateChange(date)
                  },
                })
              }
            }}
            className="h-full w-1/4 justify-center"
          >
            <Text className="font-satoshi-medium text-mauveDark12 text-base capitalize">
              {date}
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
                  value: selectedDate,
                  onChange: (_, date) => {
                    if (date) handleSelectedDateChange(date)
                  },
                })
              }
            }}
            className="h-full w-1/4 items-end justify-center"
          >
            <Text className="font-satoshi-medium text-mauveDark12 text-base">
              {time || format(selectedDate, "K:mm aa")}
            </Text>
          </Pressable>
        </View>
      </View>

      {Platform.OS === "ios" ? (
        <IOSDateTimePicker
          setSelectedDate={handleSelectedDateChange}
          show={show}
          currentMode={currentMode}
        />
      ) : null}
    </Pressable>
  )
}

// WARNING: rerendering `AnimateHeight` causes the app the freeze idk why
// that's why this component is memoized
const IOSDateTimePicker = memo(
  ({
    setSelectedDate,
    currentMode,
    show,
  }: {
    setSelectedDate: (date: Date) => void
    currentMode: SharedValue<IOSMode>
    show: SharedValue<boolean>
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
              value={new Date()}
              mode="date"
              onChange={(_, selectedDate) => {
                if (selectedDate) setSelectedDate(selectedDate)
              }}
              display="inline"
              themeVariant="dark"
              style={{ paddingBottom: 16 }}
            />
          </View>

          <View className="w-1/2">
            <DateTimePicker
              testID="date-picker"
              value={new Date()}
              mode="time"
              display="spinner"
              themeVariant="dark"
              onChange={(_, selectedDate) => {
                if (selectedDate) setSelectedDate(selectedDate)
              }}
            />
          </View>
        </MotiView>
      </AnimateHeight>
    )
  },
)
IOSDateTimePicker.displayName = "IOSDateTimePicker"
