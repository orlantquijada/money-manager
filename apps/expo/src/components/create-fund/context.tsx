import type { FundType, TimeMode } from "api";
import { createContext, type ReactNode, useContext, useState } from "react";

type FormData = {
  budgetedAmount?: number | undefined;
  name: string;
  fundType: FundType;
  folderId: number;
  timeMode: TimeMode;
};

export const FormContext = createContext<{
  formData: FormData;
  setFormValues: (values: Partial<FormData>) => void;
}>({} as any);
export function FormProvider(props: { children: ReactNode }) {
  const [data, setData] = useState<FormData>({} as any);

  const setFormValues = (values: Partial<FormData>) => {
    setData((prevValues) => ({
      ...prevValues,
      ...values,
    }));
  };

  return (
    <FormContext.Provider value={{ formData: data, setFormValues }}>
      {props.children}
    </FormContext.Provider>
  );
}
export const useFormData = () => useContext(FormContext);
