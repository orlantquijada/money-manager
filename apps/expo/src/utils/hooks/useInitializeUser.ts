import { useEffect, useState } from "react";
import { getCredId } from "../lib/auth";
import { useSignUp } from "./useAuth";

export function useInitializeUser(disabled?: boolean) {
  const [loaded, setLoaded] = useState(false);
  const { loading, handleSignUp } = useSignUp();

  useEffect(() => {
    async function initialize() {
      if (loading || disabled) {
        return;
      }
      if (!(await getCredId())) {
        handleSignUp();
      }
      setLoaded(true);
    }

    initialize();
  }, [handleSignUp, loading, disabled]);

  return loaded;
}
