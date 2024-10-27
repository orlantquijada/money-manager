import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from "react"
import { clientStorage } from "../mmkv"

const key = "MMDidFirstLaunch"

export function useOnboarding() {
  const [loaded, setLoaded] = useState(false)
  const [didFirstLaunch, setDidFirstLaunch] = useState(false)

  useEffect(() => {
    function initialize() {
      const _didFirstLaunch = clientStorage.getItem(key)
      setDidFirstLaunch(Boolean(_didFirstLaunch))
      setLoaded(true)

      SplashScreen.hideAsync().catch(() => {
        return
      })
    }

    initialize()
  }, [])

  function handleSetFirstLaunch() {
    clientStorage.setItem(key, "1")
    setDidFirstLaunch(true)
  }

  function handleClearFirstLaunch() {
    clientStorage.setItem(key, "")
    setDidFirstLaunch(false)
  }

  return {
    didFirstLaunch,
    loaded,
    handleSetFirstLaunch,
    handleClearFirstLaunch,
  }
}
