// Simple token store that can be accessed outside React components
// This allows the tRPC client to access the auth token in the headers function

let authToken: string | null = null;

export const authTokenStore = {
  getToken: () => authToken,
  setToken: (token: string | null) => {
    authToken = token;
  },
};
