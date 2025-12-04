import type { Fund } from "api";
import * as d3 from "d3-shape";
import { motifySvg } from "moti/svg";
import { useEffect, useState } from "react";
import { type ColorValue, Pressable } from "react-native";
import { G, Path, type PathProps, Svg } from "react-native-svg";
import { pieColors8, saturatedPieColors8 } from "~/utils/colors";

export type FundWithTotalSpent = Fund & {
  totalSpent: number;
};

type Props<T extends FundWithTotalSpent> = {
  data: T[];
  onPressSlice?: (fund: T | undefined) => void;
};

export default function Pie<T extends FundWithTotalSpent>({
  data,
  onPressSlice,
}: Props<T>) {
  const size = 150;
  const radius = size / 2;

  const pieGenerator = d3.pie().sort(null).padAngle(0.1);
  const arcs = pieGenerator(data.map(({ totalSpent }) => totalSpent));

  const [selected, setSelected] = useState<number>();

  useEffect(() => {
    onPressSlice?.(selected !== undefined ? data[selected] : undefined);
  }, [selected, onPressSlice, data]);

  return (
    <Pressable
      onPress={() => {
        setSelected(undefined);
      }}
    >
      <Svg viewBox={`0 0 ${size} ${size}`}>
        <G transform={[{ translateX: size / 2 }, { translateY: size / 2 }]}>
          {arcs.map((arc, index) => {
            const arcGenerator = d3.arc().cornerRadius(4);
            const isCurrentSelected = selected === arc.index;

            return (
              <Slice
                color={
                  (selected === undefined || isCurrentSelected
                    ? pieColors8[index]
                    : saturatedPieColors8[index]) || ""
                }
                d={
                  arcGenerator({
                    outerRadius: radius,
                    startAngle: arc.startAngle,
                    endAngle: arc.endAngle,
                    innerRadius: radius - 20,
                    padAngle: 0.03,
                  }) || ""
                }
                key={arc.index}
                onPress={() => {
                  if (arc.index === selected) {
                    setSelected(undefined);
                  } else {
                    setSelected(arc.index);
                  }
                }}
                opacity={selected === undefined || isCurrentSelected ? 1 : 0.7}
                selected={isCurrentSelected}
              />
            );
          })}
        </G>
      </Svg>
    </Pressable>
  );
}

const AnimatedPath = motifySvg(Path)();

function Slice({
  color,
  d,
  onPress,
  selected,
  opacity,
}: {
  color: ColorValue;
  selected: boolean;
  opacity: number;
} & Pick<PathProps, "d" | "onPress">) {
  return (
    <AnimatedPath
      animate={{
        fill: color,
        scale: selected ? 1 : 0.95,
        opacity,
      }}
      // transition={transitions.snappier}
      d={d || ""}
      onPress={(e) => {
        onPress?.(e);
      }}
    />
  );
}
