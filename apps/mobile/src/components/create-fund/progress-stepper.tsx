import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { StyledLeanView } from "@/config/interop";
import { cn } from "@/utils/cn";
import { transitions } from "@/utils/motion";

type Props = {
  totalSteps: number;
  currentStep: number;
};

export default function ProgressStepper({ totalSteps, currentStep }: Props) {
  return (
    <StyledLeanView className="flex-row gap-1.5 px-20">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step <= currentStep;

        return <Step isActive={isActive} key={step} />;
      })}
    </StyledLeanView>
  );
}

function Step({ isActive }: { isActive: boolean }) {
  const style = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isActive ? 1 : 0.2, transitions.snappy),
    };
  });

  return (
    <Animated.View
      className={cn("h-1 flex-1 rounded-full bg-foreground")}
      style={style}
    />
  );
}
