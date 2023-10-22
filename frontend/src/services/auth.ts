import { BE_API } from "src/utils/api";
import authorizedAxios from "src/utils/axios/authorizedAxios";
import unauthorizedAxios from "../utils/axios/unauthorizedAxios";
import { HOST_API } from "@/config";

export const loginWithGoogle = () => {
  window.location.href = `${HOST_API}${BE_API.auth.google}`;
};

export const checkAuth = () => authorizedAxios.head(BE_API.auth.checkAuth);

export const logoutWithGoogle = () => authorizedAxios.head(BE_API.auth.logout);
