import { MotiView } from "moti";
// import { styled } from "nativewind";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react";

export type StyledMotiViewProps = ComponentPropsWithoutRef<typeof MotiView>;
const StyledMotiView = forwardRef<
  ElementRef<typeof MotiView>,
  StyledMotiViewProps
>((props, ref) => <MotiView {...props} ref={ref} />);
StyledMotiView.displayName = "StyledMotiView";

// export default styled(StyledMotiView);
export default StyledMotiView;
