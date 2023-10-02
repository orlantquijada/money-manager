import * as SecureStore from "expo-secure-store"
import { type TokenCache } from "@clerk/clerk-expo/dist/cache"

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (error) {
      return null
    }
  },

  async saveToken(key, value) {
    return SecureStore.setItemAsync(key, value)
  },

  async clearToken(key) {
    return SecureStore.deleteItemAsync(key)
  },
}
