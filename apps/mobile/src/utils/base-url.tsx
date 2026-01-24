import { env } from "../env";

export const getBaseUrl = () => env.EXPO_PUBLIC_API_URL;
