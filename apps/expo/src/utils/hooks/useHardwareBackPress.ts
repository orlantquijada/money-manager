import { useEffect } from "react";
import { BackHandler } from "react-native";

export const useHardwareBackPress = (callback: () => void) => {
  useEffect(() => {
    const handleOnBackPress = () => {
      callback();
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", handleOnBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleOnBackPress);
    };
  }, [callback]);
};
