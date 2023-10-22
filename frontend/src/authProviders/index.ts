import { AuthProvider, AuthProviderType } from "src/@types/auth";

export const authProviderFactory = (type: AuthProviderType): Promise<AuthProvider> => {
  // Uses dynamic import to reduce overhead
  switch (type) {
    case "google":
      return import("./google").then((provider) => provider.googleAuthProvider);
    default:
      return import("./google").then((provider) => provider.googleAuthProvider);
  }
};
