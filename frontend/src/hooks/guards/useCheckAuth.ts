import { useCallback } from "react";
import { PATH_AUTH } from "src/routes/paths";
import useAuthProvider from "../auth/useAuthProvider";
import { useToast } from "@chakra-ui/react";
import useLogout from "../auth/useLogout";
import useTrackDependencies from "../dev/useTrackDependencies";

type CheckAuth = (
  params: {
    logoutOnError?: boolean;
    disableNotification?: boolean;
    redirectTo?: string;
    message?: string;
  },
  roomId?: string,
) => Promise<any>;

/**
 * Get a callback for calling the authProvider.checkAuth() method.
 * In case of rejection, redirects to the login page, displays a notification,
 * and throws an error.
 *
 * This is a low level hook. See those more specialized hooks
 * for common authentication tasks, based on useCheckAuth.
 *
 * @see useAuthenticated
 * @see useAuthState
 *
 * @returns {Function} checkAuth callback
 *
 * @example
 *
 * const MyProtectedPage = () => {
 *     const checkAuth = useCheckAuth();
 *     useEffect(() => {
 *         checkAuth().catch(() => {});
 *     }, []);
 *     return <p>Private content: EZAEZEZAET</p>
 * } // tip: use useAuthenticated() hook instead
 *
 * const MyPage = () => {
 *     const checkAuth = useCheckAuth();
 *     const [authenticated, setAuthenticated] = useState(true); // optimistic auth
 *     useEffect(() => {
 *         checkAuth({}, false)
 *              .then(() => setAuthenticated(true))
 *              .catch(() => setAuthenticated(false));
 *     }, []);
 *     return authenticated ? <Bar /> : <BarNotAuthenticated />;
 * } // tip: use useAuthState() hook instead
 */
const useCheckAuth = (): CheckAuth => {
  const authProvider = useAuthProvider();
  const toast = useToast();
  const logout = useLogout();

  useTrackDependencies("useCheckAuth", [authProvider, toast, logout]);

  const checkAuth = useCallback(
    async (
      {
        logoutOnError = true,
        disableNotification = false,
        redirectTo = PATH_AUTH.general.login,
        message = "Please log in to continue",
      },
      roomId: string | undefined,
    ) => {
      const callLogout = () => {
        if (!disableNotification) {
          toast({
            title: "Notification",
            description: message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }

        if (logoutOnError) {
          logout(redirectTo);
        }
      };

      try {
        console.log("hit auth provider check auth");
        await authProvider.checkAuth(
          {
            logoutOnError,
            disableNotification,
            redirectTo: PATH_AUTH.root,
            message:
              "You do not have permission to enter the room. The room has either been closed or this is not your room.",
          },
          roomId,
        );
      } catch (error) {
        callLogout();
        throw error;
      }
    },

    [authProvider, toast, logout],
  );

  return checkAuth;
};

export default useCheckAuth;
