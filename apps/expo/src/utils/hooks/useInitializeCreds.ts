import { useEffect, useState } from "react"

import { initializeCreds } from "../lib/auth"

export function useInitializeCreds() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    initializeCreds().then(() => {
      setLoaded(true)
    })
  }, [])

  return loaded
}
