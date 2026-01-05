// TODO: remove after use

import {
  BottomSheet,
  Button,
  CircularProgress,
  ColorPicker,
  ContextMenu,
  DateTimePicker,
  Gauge,
  Host,
  HStack,
  LinearProgress,
  Picker,
  Slider,
  Switch,
  Text,
  TextField,
  VStack,
} from "@expo/ui/swift-ui";
import { glassEffect, padding } from "@expo/ui/swift-ui/modifiers";
import {
  GlassContainer,
  GlassView,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { useState } from "react";
import {
  Image,
  PlatformColor,
  Pressable,
  Text as RNText,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { StyledSafeAreaView } from "@/config/interop";
import { mauveDark } from "@/utils/colors";

// Section component for organizing the showcase
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <RNText className="mb-3 font-semibold text-lg text-white">{title}</RNText>
      {children}
    </View>
  );
}

export default function Hello() {
  const { width } = useWindowDimensions();

  // Progress states
  const [progress, setProgress] = useState(0.7);

  // BottomSheet state
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // ColorPicker state
  const [color, setColor] = useState("#6366f1");

  // DateTimePicker states
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Picker states
  const [segmentedIndex, setSegmentedIndex] = useState(0);
  const [wheelIndex, setWheelIndex] = useState(0);
  const [contextMenuIndex, setContextMenuIndex] = useState(0);

  // Slider state
  const [sliderValue, setSliderValue] = useState(0.5);

  // Switch states
  const [toggleChecked, setToggleChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  // TextField state
  const [textValue, setTextValue] = useState("Hello SwiftUI!");

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <RNText className="mb-6 font-bold text-2xl text-white">
          SwiftUI Components Showcase
        </RNText>

        {/* ===== BUTTONS ===== */}
        <Section title="Button Variants">
          <Host matchContents>
            <VStack spacing={12}>
              <HStack spacing={12}>
                <Button
                  onPress={() => console.log("Default pressed")}
                  variant="default"
                >
                  Default
                </Button>
                <Button
                  onPress={() => console.log("Bordered pressed")}
                  variant="bordered"
                >
                  Bordered
                </Button>
              </HStack>
              <HStack spacing={12}>
                <Button
                  onPress={() => console.log("Bordered Prominent pressed")}
                  variant="borderedProminent"
                >
                  Bordered Prominent
                </Button>
                <Button
                  onPress={() => console.log("Borderless pressed")}
                  variant="borderless"
                >
                  Borderless
                </Button>
              </HStack>
              <HStack spacing={12}>
                <Button
                  onPress={() => console.log("Card pressed")}
                  variant="card"
                >
                  Card
                </Button>
                <Button
                  onPress={() => console.log("Glass Prominent pressed")}
                  variant="glass"
                >
                  Glass
                </Button>
                <Button
                  onPress={() => console.log("Glass Prominent pressed")}
                  variant="glassProminent"
                >
                  Glass
                </Button>
              </HStack>
              <Button
                onPress={() => console.log("With icon pressed")}
                systemImage="star.fill"
              >
                With System Image
              </Button>
            </VStack>
          </Host>
        </Section>

        {/* ===== PROGRESS INDICATORS ===== */}
        <Section title="Progress Indicators">
          <Host matchContents>
            <VStack spacing={24}>
              {/* Circular Progress */}
              <HStack spacing={32}>
                <VStack alignment="center" spacing={8}>
                  <CircularProgress />
                  <Text>Indeterminate</Text>
                </VStack>
                <VStack alignment="center" spacing={8}>
                  <CircularProgress color="blue" progress={progress} />
                  <Text>Determinate</Text>
                </VStack>
                <VStack alignment="center" spacing={8}>
                  <CircularProgress color="green" progress={0.75} />
                  <Text>75%</Text>
                </VStack>
              </HStack>

              {/* Linear Progress */}
              <VStack spacing={12}>
                <LinearProgress />
                <LinearProgress color="red" progress={0.3} />
                <LinearProgress color="orange" progress={progress} />
                <LinearProgress color="green" progress={1} />
              </VStack>

              {/* Random progress button */}
              <Button
                onPress={() => setProgress(Math.random())}
                variant="bordered"
              >
                Randomize Progress
              </Button>
            </VStack>
          </Host>
        </Section>

        {/* ===== GAUGE ===== */}
        <Section title="Gauge">
          <Host matchContents>
            <HStack spacing={24}>
              <Gauge
                color={[
                  PlatformColor("systemRed"),
                  PlatformColor("systemOrange"),
                  PlatformColor("systemYellow"),
                  PlatformColor("systemGreen"),
                ]}
                current={{ value: progress }}
                max={{ value: 1, label: "100%" }}
                min={{ value: 0, label: "0%" }}
                type="circularCapacity"
              />
              <Gauge
                current={{ value: 65, label: "65" }}
                max={{ value: 100, label: "Max" }}
                min={{ value: 0, label: "Min" }}
              />
            </HStack>
          </Host>
        </Section>

        {/* ===== PICKERS ===== */}
        <Section title="Pickers">
          <Host matchContents>
            <VStack spacing={20}>
              {/* Segmented Picker */}
              <VStack spacing={8}>
                <Text>Segmented Picker</Text>
                <Picker
                  onOptionSelected={({ nativeEvent: { index } }) =>
                    setSegmentedIndex(index)
                  }
                  options={["Daily", "Weekly", "Monthly", "Yearly"]}
                  selectedIndex={segmentedIndex}
                  variant="segmented"
                />
              </VStack>
            </VStack>
          </Host>

          {/* Wheel Picker needs separate Host with height */}
          <View className="mt-4">
            <Host style={{ height: 120 }}>
              <VStack spacing={8}>
                <Text>Wheel Picker</Text>
                <Picker
                  color={mauveDark.mauve1}
                  label="qwe"
                  onOptionSelected={({ nativeEvent: { index } }) =>
                    setWheelIndex(index)
                  }
                  options={[
                    "Option A",
                    "Option B",
                    "Option C",
                    "Option D",
                    "Option E",
                  ]}
                  selectedIndex={wheelIndex}
                  variant="wheel"
                />
              </VStack>
            </Host>
          </View>
        </Section>

        {/* ===== DATE TIME PICKER ===== */}
        <Section title="Date & Time Pickers">
          <Host matchContents>
            <VStack spacing={16}>
              <Text>Compact Date Picker</Text>
              <DateTimePicker
                displayedComponents="date"
                initialDate={selectedDate.toISOString()}
                onDateSelected={(date) => setSelectedDate(new Date(date))}
                variant="compact"
              />
              <Text>Compact Time Picker</Text>
              <DateTimePicker
                displayedComponents="hourAndMinute"
                initialDate={selectedDate.toISOString()}
                onDateSelected={(date) => setSelectedDate(new Date(date))}
                variant="compact"
              />
            </VStack>
          </Host>

          {/* Wheel variant needs more height */}
          <View className="mt-4">
            <Host style={{ height: 180 }}>
              <VStack spacing={8}>
                <Text>Wheel Date Picker</Text>
                <DateTimePicker
                  displayedComponents="date"
                  initialDate={selectedDate.toISOString()}
                  onDateSelected={(date) => setSelectedDate(new Date(date))}
                  variant="wheel"
                />
              </VStack>
            </Host>
          </View>
        </Section>

        {/* ===== COLOR PICKER ===== */}
        <Section title="Color Picker">
          <Host style={{ width: width - 32, height: 50 }}>
            <ColorPicker
              label="Select a color"
              onValueChanged={setColor}
              selection={color}
            />
          </Host>
          <RNText className="mt-2 text-white">Selected: {color}</RNText>
        </Section>

        {/* ===== SLIDER ===== */}
        <Section title="Slider">
          <Host style={{ minHeight: 60 }}>
            <VStack spacing={16}>
              <Slider
                onValueChange={(value) => setSliderValue(value)}
                value={sliderValue}
              />
              <Text>{`Value: ${sliderValue.toFixed(2)}`}</Text>
            </VStack>
          </Host>
        </Section>

        {/* ===== SWITCHES ===== */}
        <Section title="Switches">
          <Host matchContents>
            <VStack spacing={16}>
              <Switch
                color="#6366f1"
                label="Toggle Switch"
                onValueChange={setToggleChecked}
                value={toggleChecked}
                variant="switch"
              />
              <Switch
                label="Checkbox"
                onValueChange={setCheckboxChecked}
                value={checkboxChecked}
                variant="checkbox"
              />
            </VStack>
          </Host>
        </Section>

        {/* ===== TEXT FIELD ===== */}
        <Section title="Text Field">
          <Host matchContents>
            <VStack spacing={12}>
              <TextField
                autocorrection={false}
                defaultValue={textValue}
                onChangeText={setTextValue}
              />
              <Text>{`You typed: ${textValue}`}</Text>
            </VStack>
          </Host>
        </Section>

        {/* ===== CONTEXT MENU ===== */}
        <Section title="Context Menu">
          <Host style={{ width: 200, height: 50 }}>
            <ContextMenu>
              <ContextMenu.Items>
                <Button
                  onPress={() => console.log("Favorite pressed")}
                  systemImage="heart.fill"
                >
                  Favorite
                </Button>
                <Button
                  onPress={() => console.log("Share pressed")}
                  systemImage="square.and.arrow.up"
                >
                  Share
                </Button>
                <Button
                  onPress={() => console.log("Delete pressed")}
                  systemImage="trash"
                >
                  Delete
                </Button>
                <Picker
                  label="Priority"
                  onOptionSelected={({ nativeEvent: { index } }) =>
                    setContextMenuIndex(index)
                  }
                  options={["Low", "Medium", "High", "Urgent"]}
                  selectedIndex={contextMenuIndex}
                  variant="menu"
                />
              </ContextMenu.Items>
              <ContextMenu.Trigger>
                <Button variant="bordered">Long Press for Menu</Button>
              </ContextMenu.Trigger>
            </ContextMenu>
          </Host>
        </Section>

        {/* ===== GLASS EFFECT ===== */}
        <Section title="Glass Effect (iOS 26+)">
          <RNText className="mb-2 text-gray-400 text-sm">
            {isLiquidGlassAvailable()
              ? "✅ Liquid Glass is available"
              : "⚠️ Liquid Glass requires iOS 26+ & Xcode 26+"}
          </RNText>

          {/* GlassView Examples */}
          <View className="relative mb-4 h-64 overflow-hidden rounded-2xl">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
              }}
              style={StyleSheet.absoluteFill}
            />

            {/* Regular Glass */}
            <GlassView
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                width: 140,
                height: 60,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <RNText className="font-semibold text-black">Regular</RNText>
            </GlassView>

            {/* Clear Glass */}
            <GlassView
              glassEffectStyle="clear"
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                width: 140,
                height: 60,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <RNText className="font-semibold text-black">Clear</RNText>
            </GlassView>

            {/* Tinted Glass */}
            <GlassView
              glassEffectStyle="regular"
              isInteractive
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                width: 140,
                height: 60,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
              tintColor="#6366f1"
            >
              <RNText className="font-semibold text-black">
                Tinted + Interactive
              </RNText>
            </GlassView>
          </View>

          {/* GlassContainer Example */}
          <RNText className="mb-2 font-medium text-white">
            GlassContainer
          </RNText>
          <View className="relative mb-4 h-32 overflow-hidden rounded-2xl">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=600&fit=crop",
              }}
              style={StyleSheet.absoluteFill}
            />

            <GlassContainer
              spacing={10}
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <GlassView
                isInteractive
                style={{ width: 60, height: 60, borderRadius: 30 }}
              />
              <GlassView style={{ width: 50, height: 50, borderRadius: 25 }} />
              <GlassView style={{ width: 40, height: 40, borderRadius: 20 }} />
            </GlassContainer>
          </View>

          {/* SwiftUI Modifiers with Glass Effect */}
          <RNText className="mb-2 font-medium text-white">
            SwiftUI Modifiers (glassEffect + padding)
          </RNText>
          <View className="relative h-24 overflow-hidden rounded-2xl">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=200&fit=crop",
              }}
              style={StyleSheet.absoluteFill}
            />
            <Host
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                modifiers={[
                  padding({ all: 16 }),
                  glassEffect({ glass: { variant: "clear" } }),
                ]}
                size={24}
              >
                Glass Text Modifier
              </Text>
            </Host>
          </View>
        </Section>

        {/* ===== GLASS ICON BUTTONS ===== */}
        <Section title="Glass Icon Buttons">
          <RNText className="mb-2 text-gray-400 text-sm">
            Icon buttons using GlassView with isInteractive
          </RNText>

          <View className="relative mb-4 h-48 overflow-hidden rounded-2xl">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop",
              }}
              style={StyleSheet.absoluteFill}
            />

            {/* Row of circular icon buttons */}
            <View
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                right: 20,
                flexDirection: "row",
                gap: 12,
              }}
            >
              {/* Circular Icon Button - with onPress */}
              <Pressable onPress={() => console.log("Add pressed!")}>
                <GlassView
                  isInteractive
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <RNText style={{ fontSize: 24 }}>➕</RNText>
                </GlassView>
              </Pressable>

              {/* Circular Icon Button - Tinted */}
              <GlassView
                isInteractive
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                tintColor="#6366f1"
              >
                <RNText style={{ fontSize: 24 }}>❤️</RNText>
              </GlassView>

              {/* Rounded Square Icon Button */}
              <GlassView
                glassEffectStyle="clear"
                isInteractive
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <RNText style={{ fontSize: 24 }}>⚙️</RNText>
              </GlassView>
            </View>

            {/* Pill-shaped icon + label button */}
            <GlassView
              isInteractive
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 24,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <RNText style={{ fontSize: 18 }}>🎵</RNText>
              <RNText className="font-semibold text-black">Play</RNText>
            </GlassView>

            {/* Another pill button */}
            <GlassView
              isInteractive
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 24,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
              tintColor="#10b981"
            >
              <RNText style={{ fontSize: 18 }}>✓</RNText>
              <RNText className="font-semibold text-black">Done</RNText>
            </GlassView>
          </View>

          {/* SwiftUI Button with systemImage */}
          <RNText className="mb-2 font-medium text-white">
            SwiftUI Button with Glass Variant
          </RNText>
          <Host matchContents>
            <HStack spacing={12}>
              <Button
                onPress={() => console.log("Glass icon pressed")}
                systemImage="plus"
                variant="glass"
              >
                Add
              </Button>
              <Button
                onPress={() => console.log("Glass prominent pressed")}
                systemImage="heart.fill"
                variant="glassProminent"
              >
                Like
              </Button>
            </HStack>
          </Host>
        </Section>

        {/* ===== BOTTOM SHEET ===== */}
        <Section title="Bottom Sheet">
          <Host matchContents>
            <Button
              onPress={() => setIsBottomSheetOpen(true)}
              variant="borderedProminent"
            >
              Open Bottom Sheet
            </Button>
          </Host>
        </Section>

        {/* Spacer for scroll */}
        <View className="h-20" />
      </ScrollView>

      {/* Bottom Sheet - needs to be positioned absolutely with full width */}
      <Host style={{ position: "absolute", width }}>
        <BottomSheet
          isOpened={isBottomSheetOpen}
          onIsOpenedChange={(e) => setIsBottomSheetOpen(e)}
        >
          <VStack alignment="center" spacing={20}>
            <Text>Welcome to the Bottom Sheet!</Text>
            <CircularProgress color="blue" progress={0.8} />
            <LinearProgress color="green" progress={0.6} />
            <Text>This is native SwiftUI content.</Text>
            <Button
              onPress={() => setIsBottomSheetOpen(false)}
              variant="bordered"
            >
              Close
            </Button>
          </VStack>
        </BottomSheet>
      </Host>

      {/* <MeshGradientView */}
      {/*   colors={[ */}
      {/*     "red", */}
      {/*     "purple", */}
      {/*     "indigo", */}
      {/*     "orange", */}
      {/*     "white", */}
      {/*     "blue", */}
      {/*     "yellow", */}
      {/*     "green", */}
      {/*     "cyan", */}
      {/*   ]} */}
      {/*   columns={3} */}
      {/*   points={[ */}
      {/*     [0.0, 0.0], */}
      {/*     [0.5, 0.0], */}
      {/*     [1.0, 0.0], */}
      {/*     [0.0, 0.5], */}
      {/*     [0.5, 0.5], */}
      {/*     [1.0, 0.5], */}
      {/*     [0.0, 1.0], */}
      {/*     [0.5, 1.0], */}
      {/*     [1.0, 1.0], */}
      {/*   ]} */}
      {/*   rows={3} */}
      {/*   style={{ width, aspectRatio: 1 }} */}
      {/* /> */}
    </StyledSafeAreaView>
  );
}

// import {
//   BottomSheet,
//   Button,
//   ContextMenu,
//   DateTimePicker,
//   Divider,
//   Host,
//   Image,
//   List,
//   Picker,
//   Section,
//   Section as SwiftUISection,
//   Switch,
//   Text,
// } from "@expo/ui/swift-ui";
// import { hidden, padding } from "@expo/ui/swift-ui/modifiers";
// import { isToday, isYesterday, subDays } from "date-fns";
// import { useState } from "react";
// import { Text as RNText, StyleSheet, View } from "react-native";
//
// const videoLink =
//   "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_2MB.mp4";
//
// const monthDateFormat = new Intl.DateTimeFormat("en-US", {
//   month: "long",
//   day: "numeric",
// });
//
// export default function ContextMenuScreen() {
//   const [selectedIndex, setSelectedIndex] = useState<number>(1);
//   const [switchChecked, setSwitchChecked] = useState<boolean>(true);
//   const [switch2Checked, setSwitch2Checked] = useState<boolean>(true);
//
//   const [isOpened, setIsOpened] = useState(false);
//
//   const today = new Date();
//   const yesterday = subDays(today, 1);
//
//   const [date, setDate] = useState(today);
//
//   let dateLabel = "";
//   if (isToday(date)) dateLabel = "Today";
//   else if (isYesterday(date)) dateLabel = "Yesterday";
//   else dateLabel = monthDateFormat.format(date);
//
//   return (
//     <Host style={{ flex: 1 }}>
//       <BottomSheet
//         isOpened={isOpened}
//         modifiers={[hidden()]}
//         onIsOpenedChange={setIsOpened}
//       >
//         <DateTimePicker
//           initialDate={date.toISOString()}
//           onDateSelected={setDate}
//           variant="graphical"
//         />
//       </BottomSheet>
//
//       <List>
//         <Section title="Context Menu with glass effect button">
//           <ContextMenu
//             // modifiers={[fixedSize({ horizontal: false, vertical: false })]}
//             modifiers={[padding({ all: 10 })]}
//           >
//             <ContextMenu.Items>
//               <Button onPress={() => setDate(today)}>Today</Button>
//               <Button onPress={() => setDate(yesterday)}>Yesterday</Button>
//               <Button onPress={() => setIsOpened(true)}>Custom</Button>
//               {/* <Picker */}
//               {/*   label="Doggos" */}
//               {/*   onOptionSelected={({ nativeEvent: { index } }) => */}
//               {/*     setSelectedIndex(index) */}
//               {/*   } */}
//               {/*   options={["very", "veery", "veeery", "much"]} */}
//               {/*   selectedIndex={selectedIndex} */}
//               {/*   variant="menu" */}
//               {/* /> */}
//             </ContextMenu.Items>
//             <ContextMenu.Trigger>
//               <Button
//                 color="#232326"
//                 modifiers={[
//                   // zIndex(1),
//                   padding({ all: 16 }),
//                   // border({ color: "red", width: 2 }),
//                   // foregroundStyle({ type: "hierarchical", style: "tertiary" }),
//                 ]}
//                 variant="glassProminent"
//                 // variant="glassProminent"
//               >
//                 {dateLabel}
//               </Button>
//             </ContextMenu.Trigger>
//           </ContextMenu>
//         </Section>
//         <Section title="Single-Press Context Menu">
//           <ContextMenu>
//             <ContextMenu.Items>
//               <Button
//                 onPress={() => console.log("Pressed1")}
//                 systemImage="person.crop.circle.badge.xmark"
//               >
//                 Hello
//               </Button>
//               <Button
//                 onPress={() => console.log("Pressed2")}
//                 systemImage="heart"
//                 variant="bordered"
//               >
//                 I love
//               </Button>
//               <Picker
//                 label="Doggos"
//                 onOptionSelected={({ nativeEvent: { index } }) => {
//                   setSelectedIndex(index);
//                 }}
//                 options={["very", "veery", "veeery", "much"]}
//                 selectedIndex={selectedIndex}
//                 variant="menu"
//               />
//               {/* {["very", "veery", "veeery", "much"].map((option, index) => ( */}
//               {/*   <Text key={index} modifiers={[tag(index)]}> */}
//               {/*     {option} */}
//               {/*   </Text> */}
//               {/* ))} */}
//             </ContextMenu.Items>
//             <ContextMenu.Trigger>
//               <Text color="accentColor">Show Menu</Text>
//             </ContextMenu.Trigger>
//           </ContextMenu>
//         </Section>
//         <Section title="Long-Press Context Menu">
//           <ContextMenu activationMethod="longPress">
//             <ContextMenu.Items>
//               <Switch
//                 label="Do u love doggos?"
//                 onValueChange={setSwitchChecked}
//                 value={switchChecked}
//                 variant="checkbox"
//               />
//               <Switch
//                 label="Will u marry doggos?"
//                 onValueChange={setSwitch2Checked}
//                 // systemImage="heart.slash"
//                 value={switch2Checked}
//                 variant="switch"
//               />
//               <Button role="destructive" systemImage="hand.thumbsdown">
//                 I don't like doggos 😡
//               </Button>
//               <ContextMenu>
//                 <ContextMenu.Items>
//                   <Button>I hate</Button>
//                   <Button>doggos</Button>
//                   <ContextMenu>
//                     <ContextMenu.Items>
//                       <Button>I KILL</Button>
//                       <Button>DOGGOS</Button>
//                     </ContextMenu.Items>
//                     <ContextMenu.Trigger>
//                       <Button>👹Very evil submenu 👺</Button>
//                     </ContextMenu.Trigger>
//                   </ContextMenu>
//                 </ContextMenu.Items>
//                 <ContextMenu.Trigger>
//                   <Button systemImage="heart.slash">Evil submenu</Button>
//                 </ContextMenu.Trigger>
//               </ContextMenu>
//             </ContextMenu.Items>
//             <ContextMenu.Trigger>
//               <Host matchContents>
//                 <Button
//                   controlSize="small"
//                   systemImage="heart.slash"
//                   variant="glassProminent"
//                 >
//                   Evil submenu
//                 </Button>
//                 {/* <View style={styles.longPressMenu}> */}
//                 {/*   <VideoView */}
//                 {/*     contentFit="cover" */}
//                 {/*     player={player} */}
//                 {/*     style={styles.longPressMenu} */}
//                 {/*   /> */}
//                 {/* </View> */}
//               </Host>
//             </ContextMenu.Trigger>
//             <ContextMenu.Preview>
//               <View style={styles.preview}>
//                 <RNText>This is a preview</RNText>
//               </View>
//             </ContextMenu.Preview>
//           </ContextMenu>
//         </Section>
//         <Section title="Context Menu Dismissal Behavior">
//           <ContextMenu>
//             <ContextMenu.Items>
//               <Button onPress={() => console.log("Pressed3")}>
//                 Do not dismiss
//               </Button>
//               <Button
//                 // modifiers={[menuActionDismissBehavior("automatic")]}
//                 onPress={() => console.log("Pressed1")}
//               >
//                 Automatically dismiss
//               </Button>
//               <Button
//                 // modifiers={[menuActionDismissBehavior("enabled")]}
//                 onPress={() => console.log("Pressed2")}
//               >
//                 Always dismiss
//               </Button>
//             </ContextMenu.Items>
//             <ContextMenu.Trigger>
//               <Text color="accentColor">Show menu</Text>
//             </ContextMenu.Trigger>
//           </ContextMenu>
//         </Section>
//         <Section title="SwiftUI Section and Divider Components">
//           <ContextMenu>
//             <ContextMenu.Items>
//               <Button role="destructive">Delete</Button>
//               <Divider />
//               <Button onPress={() => console.log("Pressed3")}>
//                 Add to favorites
//               </Button>
//               <SwiftUISection title="Primary actions">
//                 <Button onPress={() => console.log("Pressed1")}>First</Button>
//                 <Button onPress={() => console.log("Pressed2")}>Second</Button>
//               </SwiftUISection>
//             </ContextMenu.Items>
//             <ContextMenu.Trigger>
//               <Text color="accentColor">Show menu</Text>
//             </ContextMenu.Trigger>
//           </ContextMenu>
//         </Section>
//         <Section title="Menu item with title and subtitle">
//           <ContextMenu>
//             <ContextMenu.Items>
//               <Button role="destructive">
//                 <Image systemName="trash" />
//                 <Text>Red color item</Text>
//                 <Text>Subtitle</Text>
//               </Button>
//             </ContextMenu.Items>
//             <ContextMenu.Trigger>
//               <Text>Show Menu</Text>
//             </ContextMenu.Trigger>
//           </ContextMenu>
//         </Section>
//       </List>
//     </Host>
//   );
// }
//
// ContextMenuScreen.navigationOptions = {
//   title: "Context Menu",
// };
//
// const styles = StyleSheet.create({
//   menuIcon: {
//     width: 32,
//     height: 32,
//   },
//   longPressMenu: {
//     width: 200,
//     height: 200,
//   },
//   preview: {
//     width: 300,
//     height: 200,
//     padding: 20,
//     backgroundColor: "#ffeeee",
//   },
// });
