import { AuthProvider } from "src/@types/auth";
import { CacheName } from "src/@types/cache";
import { PATH_AUTH } from "src/routes/paths";
import { checkAuth, loginWithGoogle, logoutWithGoogle } from "@/services/auth";
import { getUser } from "src/services/users";
import authorizedAxios from "@/utils/axios/authorizedAxios";
import { BE_API } from "@/utils/api";

const isPublicUrl = (url: string) => [PATH_AUTH.general.login].includes(url);
const deleteCache = (name: CacheName) =>
  caches
    .open(name)
    .then((cache) => cache.keys().then((requests) => requests.map((req) => cache.delete(req))));

const verifyRoomAccess = async (roomId: string) => {
  // TODO: implement check room access
  console.log("VERIFYING ROOM ACCESS");
  await authorizedAxios.get(`${BE_API.collaboration.room}/${roomId}/access`);
  const response = await authorizedAxios.get(`${BE_API.collaboration.room}/${roomId}/status`);
  const { isOpen } = response.data;
  console.log("VERIFIED", isOpen);
  return isOpen;
};

export const googleAuthProvider: AuthProvider = {
  login: async (params) => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
    }
  },
  logout: async () => {
    try {
      await logoutWithGoogle();
      await deleteCache(CacheName.API);
    } catch (err) {
      console.error(err);
    }
  },
  checkError: async (status) => {
    if (status === 401 || status === 403) {
      await logoutWithGoogle();
      throw new Error();
    }
  },
  /**
   * Resolves if session tokens are valid.
   * In case of invalid access token, refreshes it using the current refresh token and resolves.
   * In case of invalid refresh token, throws an error.
   */
  // Add roomId to the AuthProvider implementation for checkAuth
  checkAuth: async (params, roomId) => {
    if (isPublicUrl(window.location.hash)) {
      return;
    }

    console.log("HIT FIND ROOM NAME", roomId);

    // If roomId is provided, use it to check if the current user has access to that room
    if (roomId) {
      // Implement logic to check if the user is authorized to access the room
      const isAuthorized = await verifyRoomAccess(roomId);
      if (!isAuthorized) {
        throw new Error("Unauthorized access to room");
      }
    }

    // Continue with the existing checkAuth logic
    const response = await checkAuth();
    if (response.status !== 200) {
      throw new Error();
    }
  },
  getIdentity: async () => {
    const response = await getUser();
    const userIdentity = response.data;
    return userIdentity;
  },
};
