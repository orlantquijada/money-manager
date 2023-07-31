import { Fund } from ".prisma/client"
import { create } from "zustand"

type State = {
  note: string
  store: string
  fund?: Fund | undefined
  createdAt: Date
}

export type BottomSheetData = keyof State | undefined
export type HandlePresentModalPress = (data?: BottomSheetData) => void

export const useTransactionStore = create<State>()(() => ({
  createdAt: new Date(),
  store: "",
  note: "",
}))
