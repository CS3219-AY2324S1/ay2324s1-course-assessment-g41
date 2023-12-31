import { User } from "./user";

export type AuthProvider = {
  login: (params?: unknown) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: (params?: unknown, roomId?: string) => Promise<void>;
  checkError: (status: number) => Promise<void>;
  getIdentity: () => Promise<User>;
};

export type AuthProviderType = "google";
