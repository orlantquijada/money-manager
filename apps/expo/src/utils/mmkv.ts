import { MMKV } from "react-native-mmkv"

const storage = new MMKV()

export const clientStorage = {
  setItem: (key: string, value: string | number | boolean) => {
    storage.set(key, value)
  },
  getItem: (key: string) => {
    return storage.getString(key) || null
  },
  removeItem: (key: string) => {
    storage.delete(key)
  },
}
