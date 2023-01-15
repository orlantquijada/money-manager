import { useEffect, useState } from "react"
import { Keyboard } from "react-native"

export function useIsKeyboardShown() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const handleKeyboardShow = () => setShown(true)
    const handleKeyboardHide = () => setShown(false)

    const subscriptions = [
      Keyboard.addListener("keyboardDidShow", handleKeyboardShow),
      Keyboard.addListener("keyboardDidHide", handleKeyboardHide),
    ]

    return () => {
      subscriptions.forEach((subscription) => subscription.remove())
    }
  }, [])

  return shown
}
