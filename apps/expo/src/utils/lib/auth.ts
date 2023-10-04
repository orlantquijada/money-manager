import * as SecureStore from "expo-secure-store"
import * as Crypto from "expo-crypto"
import { client } from "../trpc"

export let creds: { key: string; dpw: string } | undefined
async function initializeCreds() {
  const { key, dpw } = await client.creds.query()
  creds = {
    dpw,
    key,
  }
}
initializeCreds()

export async function setCredId(value: string) {
  if (!creds?.key) throw Error("Creds not initialized")

  if (await SecureStore.getItemAsync(creds.key))
    throw Error("Cred key has a value")
  await SecureStore.setItemAsync(creds.key, value)
}

export async function getCredId() {
  if (!creds?.key) throw Error("Creds not initialized")

  return await SecureStore.getItemAsync(creds.key)
}

export async function clearCredId() {
  if (!creds?.key) throw Error("Creds not initialized")

  await SecureStore.deleteItemAsync(creds.key)
}

export function createUsername() {
  return Crypto.randomUUID()
}
