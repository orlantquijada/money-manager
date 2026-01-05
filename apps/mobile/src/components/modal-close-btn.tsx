import { Cross } from "@/icons";
import { cn } from "@/utils/cn";
import { ScalePressable, type ScalePressableProps } from "./scale-pressable";

type Props = ScalePressableProps;

export default function ModalCloseBtn({ className, ...props }: Props) {
  return (
    <ScalePressable
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-background-tertiary",
        className
      )}
      disableOpacity
      scaleValue={0.9}
      {...props}
    >
      <Cross className="text-foreground-muted" />
    </ScalePressable>
  );
}
