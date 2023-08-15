import { Fund } from ".prisma/client"
import { create } from "zustand"

type State = {
  note: string
  store: string
  fund?: Fund | undefined
  createdAt: Date
  amount: number
  submitTimestamp?: number | undefined
  reset: () => void
}

export type BottomSheetData = keyof State | undefined
export type HandlePresentModalPress = (data?: BottomSheetData) => void

const defaultValues: Omit<State, "reset"> = {
  amount: 0,
  createdAt: new Date(),
  store: "",
  note: "",
  submitTimestamp: undefined,
  fund: undefined,
}

export const useTransactionStore = create<State>()((set) => ({
  ...defaultValues,
  reset: () => set(defaultValues),
}))
