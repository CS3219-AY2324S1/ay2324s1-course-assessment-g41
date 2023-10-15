import XRegExp from "xregexp";
import { AuthProviderType } from "./@types/auth";
import packageJson from "../package.json";

// API

// karwi: create .env file
export const HOST_API = process.env.NEXT_PUBLIC_HOST_API_KEY || "";

// UTILS

// export const isDevelopment = process.env.DEV;

export const isDebug = process.env.NEXT_PUBLIC_DEBUG === "true";

export const VERSION = packageJson.version;

export const DEFAULT_AUTH_PROVIDER: AuthProviderType = "jwt";

export enum CacheKey {
  User = "User",
  Language = "Language",
  Topic = "Topic",
}
export const OPTIONS_CACHE_TIME = -1;
export const OPTIONS_STALE_TIME = -1;
