import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

import { client } from "../trpc";

export let creds: { key: string; dpw: string } | undefined;
export async function initializeCreds() {
  const { key, dpw } = await client.creds.query();
  creds = {
    dpw,
    key,
  };
}

export async function setCredId(value: string) {
  if (!creds?.key) {
    throw new Error("Creds not initialized");
  }

  if (await SecureStore.getItemAsync(creds.key)) {
    throw new Error("Cred key has a value");
  }
  await SecureStore.setItemAsync(creds.key, value);
}

export async function getCredId() {
  if (!creds?.key) {
    throw new Error("Creds not initialized");
  }

  return await SecureStore.getItemAsync(creds.key);
}

export async function clearCredId() {
  if (!creds?.key) {
    throw new Error("Creds not initialized");
  }

  await SecureStore.deleteItemAsync(creds.key);
}

export function createUsername() {
  return Crypto.randomUUID();
}
