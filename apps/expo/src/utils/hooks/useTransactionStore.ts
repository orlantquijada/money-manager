import { Fund } from ".prisma/client"
import { create } from "zustand"

export type TransactionFlow = "income" | "expense"

type State = {
  note: string
  store: string
  // final value na gamiton para ig create transaction
  fund?: Fund | undefined
  // explicitly set jd na fund (kanang ni pislit jd gkans fund list)
  lastSelectedFund?: Fund | undefined
  createdAt: Date
  amount: number
  submitTimestamp?: number | undefined
  txnFlow?: TransactionFlow
  reset: (values?: Partial<typeof defaultValues>) => void
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
  lastSelectedFund: undefined,
  txnFlow: "income",
}

export const useTransactionStore = create<State>()((set) => ({
  ...defaultValues,
  reset: (values: Partial<typeof defaultValues> = {}) => {
    set({ ...defaultValues, createdAt: new Date(), ...values })
  },
}))
