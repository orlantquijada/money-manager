import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react"
import { Fund } from ".prisma/client"

type FormData = {
  note: string
  store: string
  fundId: Fund["id"]
  createdAt: Date
}

export type BottomSheetData = keyof FormData | undefined
export type HandlePresentModalPress = (data?: BottomSheetData) => void

export type FormContext = {
  formData: FormData
  setFormValues: (values: Partial<FormData>) => void
}
export const formContext = createContext<FormContext>({} as any)
export function FormProvider(props: { children: ReactNode }) {
  const [data, setData] = useState<FormData>({
    createdAt: new Date(),
    note: "",
  } as any)

  const setFormValues = useCallback((values: Partial<FormData>) => {
    setData((prevValues) => ({
      ...prevValues,
      ...values,
    }))
  }, [])

  return (
    <formContext.Provider value={{ formData: data, setFormValues }}>
      {props.children}
    </formContext.Provider>
  )
}
export const useFormData = () => useContext(formContext)
