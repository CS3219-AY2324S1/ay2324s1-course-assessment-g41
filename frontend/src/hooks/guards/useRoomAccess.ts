import { useEffect } from "react";
import useCheckAuth from "./useCheckAuth";
import { PATH_MAIN } from "@/routes/paths";

const useRoomAccess = (roomId: string) => {
  const checkAuth = useCheckAuth();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        // Pass roomId to checkAuth, which will be used to verify if the user has access to this specific room
        console.log("STARTING CALL");
        await checkAuth(
          {
            logoutOnError: false,
            disableNotification: false,
            redirectTo: PATH_MAIN.general.dashboard,
            message: "You are not authorized to enter this room",
          },
          roomId,
        );
      } catch (error) {
        // Error has been handled by the guard
      }
    };

    verifyAccess();
  }, [checkAuth, roomId]);

  // This hook doesn't return anything, as it's only responsible for side effects
};

export default useRoomAccess;
