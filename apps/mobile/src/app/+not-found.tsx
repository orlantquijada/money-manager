import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function NotFound() {
  const { isSignedIn } = useAuth();

  // Redirect to appropriate screen based on auth
  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return <Redirect href="/sign-in" />;
}
