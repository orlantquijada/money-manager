import { useSignUp as useClerkSignUp } from "@clerk/clerk-expo"
import { trpc } from "../trpc"
import { createUsername, creds, getCredId, setCredId } from "../lib/auth"

export function useSignUp() {
  const { isLoaded, signUp, setActive } = useClerkSignUp()
  const createUser = trpc.user.create.useMutation()

  const handleSignUp = async () => {
    if (!isLoaded || !creds) return

    try {
      const credId = await getCredId()
      if (credId) throw Error("User already exists")

      const res = await signUp.create({
        username: createUsername(),
        password: creds.dpw,
      })

      if (
        res.createdSessionId &&
        res.status === "complete" &&
        res.createdUserId
      ) {
        await createUser.mutateAsync({ id: res.createdUserId })
        setActive({ session: res.createdSessionId })
        setCredId(res.createdUserId)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return { handleSignUp, status: createUser.status }
}
