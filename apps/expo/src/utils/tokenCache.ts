import type { TokenCache } from "@clerk/clerk-expo/dist/cache";
import * as SecureStore from "expo-secure-store";

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (_error) {
      return null;
    }
  },

  async saveToken(key, value) {
    return SecureStore.setItemAsync(key, value);
  },

  async clearToken(key) {
    return SecureStore.deleteItemAsync(key);
  },
};
