import { cva, type VariantProps } from "class-variance-authority";
import { Pressable, type PressableProps } from "react-native";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "relative items-center justify-center gap-2 rounded-xl transition-all",
  {
    variants: {
      variant: {
        default: "bg-foreground",
      },
      disabled: {
        false: null,
        true: null,
      },
      size: {
        default: "h-8 px-4",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        disabled: true,
        className: "bg-foreground-secondary",
      },
    ],
    defaultVariants: { variant: "default", size: "default" },
  }
);

type Props = PressableProps & VariantProps<typeof buttonVariants>;

export default function Button({
  className,
  size,
  variant,
  disabled,
  style,
  ...props
}: Props) {
  return (
    <Pressable
      {...props}
      className={cn(buttonVariants({ disabled, size, variant, className }))}
      disabled={disabled}
    />
  );
}
