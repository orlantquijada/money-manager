export type ButtonVariant = "icon" | "default";
export type ButtonSize = "sm" | "md" | "lg" | "xl" | "xxl";
export type ButtonIntent = "primary" | "secondary";

export const iconSizeClasses: Record<ButtonSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-14",
  xxl: "size-16",
};

export const paddingBySize: Record<
  ButtonSize,
  { horizontal: number; vertical: number }
> = {
  sm: { horizontal: 12, vertical: 6 },
  md: { horizontal: 16, vertical: 8 },
  lg: { horizontal: 20, vertical: 10 },
  xl: { horizontal: 24, vertical: 12 },
  xxl: { horizontal: 28, vertical: 14 },
};
