import { Pressable, type PressableProps } from "react-native";
import { Cross } from "@/icons";
import { cn } from "@/utils/cn";

type Props = PressableProps;

export default function ModalCloseBtn({ className, ...props }: Props) {
  return (
    <Pressable
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-mauveDark12 transition-all active:scale-90",
        className
      )}
      {...props}
    >
      <Cross />
    </Pressable>
  );
}
