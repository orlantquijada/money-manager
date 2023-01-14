import { useEffect, useState } from "react"
import { Keyboard } from "react-native"

export function useIsKeyboardShown() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const handleKeyboardDidShow = () => setShown(true)
    const handleKeyboardDidHide = () => setShown(false)

    const subscriptions = [
      Keyboard.addListener("keyboardDidShow", handleKeyboardDidShow),
      Keyboard.addListener("keyboardDidHide", handleKeyboardDidHide),
    ]

    return () => {
      subscriptions.forEach((subscription) => subscription.remove())
    }
  }, [])

  return shown
}
