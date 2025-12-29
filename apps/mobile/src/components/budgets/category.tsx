import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import LeanText from "@/components/lean-text";
import LeanView from "@/components/lean-view";
import useToggle from "@/hooks/use-toggle";
import type { FundWithMeta } from "@/lib/fund";
import { getTimeModeMultiplier } from "@/lib/fund";
import { cn } from "@/utils/cn";
import { violet } from "@/utils/colors";
import { clamp } from "@/utils/math";

export const CATEGORY_HEIGHT = 56;

type CategoryProps = {
  fund: FundWithMeta;
};

export default function Category({ fund }: CategoryProps) {
  const ref = useRef<BottomSheetModal>(null);
  const { width: deviceWidth } = useWindowDimensions();

  const barCount = getTimeModeMultiplier(fund.timeMode);
  const barWidth = deviceWidth / barCount;

  // const ProgressBars = CategoryProgressBars[fund.fundType];

  return (
    <>
      <Pressable
        className="justify-center gap-2 px-4 transition-all active:scale-[.98] active:opacity-70"
        onPress={() => {
          ref.current?.present();
        }}
        style={{ height: CATEGORY_HEIGHT }}
      >
        <LeanView className="flex-row items-center justify-between gap-3">
          <LeanText
            className="shrink font-satoshi-medium text-base text-violet12"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {fund.name}
          </LeanText>

          <HelperText fund={fund} />
        </LeanView>

        <LeanView className="flex-row gap-2">
          {Array.from({ length: barCount }).map((_, index) => {
            const isCurrentPeriod = index === barCount - 1;
            // TODO: Calculate actual progress for each period
            // const _progress = isCurrentPeriod ? 0.2 : 1;
            let _progress = 1;

            if (barCount > 1) {
              if (index === barCount - 1) _progress = 0;
              if (index === barCount - 2) _progress = 0.3;
            }

            return (
              <ProgressBar
                barWidth={barWidth}
                highlight={barCount > 1 ? isCurrentPeriod : false}
                key={index}
                // progress={index === barCount - 1 ? progress : _progress}
                progress={_progress}
              />
            );
          })}
        </LeanView>
        {/* <ProgressBars fund={fund} /> */}
      </Pressable>

      {/* <Button */}
      {/*   onPress={() => { */}
      {/*     setProgress(Math.random()); */}
      {/*   }} */}
      {/* > */}
      {/*   <Text>asd</Text> */}
      {/* </Button> */}

      {/* <FundDetailBottomSheet fund={fund} ref={ref} /> */}
    </>
  );
}

function ProgressBar({
  barWidth,
  highlight,
  progress = 1,
}: {
  barWidth: number;
  highlight?: boolean;
  /** Progress value from 0 to 1 */
  progress?: number;
}) {
  const clampedProgress = clamp(progress, 0, 1);
  const color = violet.violet6;

  const stripeColor1 = "#AA99EC"; // violet.violet8 or similar
  const stripeColor2 = "#D7CFF9"; // violet.violet4 or similar

  return (
    <LeanView
      className={cn("h-2 flex-grow rounded-full")}
      style={{
        borderCurve: "continuous",
        borderColor: color,
        borderWidth: highlight ? 1 : StyleSheet.hairlineWidth,
      }}
    >
      <LeanView
        className="absolute inset-0 overflow-hidden rounded-full bg-mauve3"
        style={{ borderCurve: "continuous" }}
      />

      {highlight && (
        <LeanView
          className="absolute -bottom-2 h-1 w-1 self-center rounded-full"
          style={{ backgroundColor: color }}
        />
      )}

      <LeanView
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ borderCurve: "continuous" }}
      >
        <LeanView
          className="h-full w-full rounded-full"
          style={{
            borderCurve: "continuous",
            backgroundColor: color,
            transform: [{ translateX: `${(clampedProgress - 1) * 100}%` }],
          }}
        />
      </LeanView>
    </LeanView>
  );
}

export type HelperTextProps = {
  showDefault?: boolean;
  fund: FundWithMeta;
};

// const TextMap: Record<FundType, FC<HelperTextProps>> = {
//   SPENDING: SpendingHelperText,
//   NON_NEGOTIABLE: NonNegotiableHelperText,
// };

function HelperText({ fund }: { fund: FundWithMeta }) {
  const [showDefault, { toggle }] = useToggle(true);

  // const Text = TextMap[fund.fundType];

  return (
    <Pressable
      className="transition-all active:opacity-70"
      hitSlop={10}
      onPress={toggle}
    >
      {/* <Text fund={fund} showDefault={showDefault} /> */}
      <LeanText className="font-satoshi text-mauve9 text-xs">Hello</LeanText>
    </Pressable>
  );
}
