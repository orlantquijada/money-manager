import { useState } from "react"
import {
  useClerk,
  useSignUp as useClerkSignUp,
  useSignIn as useClerkSignIn,
  useUser,
} from "@clerk/clerk-expo"

import { trpc } from "../trpc"
import {
  clearCredId,
  createUsername,
  creds,
  getCredId,
  setCredId,
} from "../lib/auth"

export function useSignUp() {
  const { isLoaded, signUp, setActive } = useClerkSignUp()
  const createUser = trpc.user.create.useMutation()
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (!isLoaded || !creds) return

    try {
      setLoading(true)
      const credId = await getCredId()
      if (credId) throw Error("User already exists")

      const username = createUsername()
      const res = await signUp.create({
        username,
        password: creds.dpw,
      })

      if (
        res.createdSessionId &&
        res.status === "complete" &&
        res.createdUserId
      ) {
        await createUser.mutateAsync({ id: res.createdUserId })
        await setActive({ session: res.createdSessionId })
        await setCredId(username)
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return { handleSignUp, loading }
}

export function useRemoveUser() {
  const { isLoaded, user } = useUser()
  const removeUser = trpc.user.remove.useMutation()
  const [loading, setLoading] = useState(false)

  const handleRemoveUser = async () => {
    if (!isLoaded || !user || !user.deleteSelfEnabled) return

    try {
      setLoading(true)
      await clearCredId()
      await removeUser.mutateAsync()
      await user.delete()
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  return { handleRemoveUser, loading }
}

export function useSignOut() {
  const { signOut, loaded } = useClerk()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    if (!loaded) return

    try {
      setLoading(true)
      await signOut()
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  return { handleSignOut, loading }
}

export function useSignIn() {
  const { isLoaded, signIn, setActive } = useClerkSignIn()
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    if (!isLoaded || !creds) return

    try {
      setLoading(true)
      const id = await getCredId()
      if (!id) throw Error("No cred id set")

      const res = await signIn.create({
        identifier: id,
        password: creds.dpw,
      })

      if (res.status === "complete" && res.createdSessionId) {
        await setActive({ session: res.createdSessionId })
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return { handleSignIn, loading }
}
