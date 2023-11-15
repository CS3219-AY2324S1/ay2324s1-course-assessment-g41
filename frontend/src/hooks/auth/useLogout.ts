import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { PATH_AUTH } from "src/routes/paths";
import useAuthProvider from "./useAuthProvider";

type Logout = (redirectTo?: string) => Promise<any>;

/**
 * Get a callback for calling the authProvider.logout() method,
 * redirect to the login page, and clear the Redux state.
 *
 * @see useAuthProvider
 *
 * @returns {Function} logout callback
 *
 * @example
 *
 * const LogoutButton = () => {
 *     const logout = useLogout();
 *     const handleClick = () => logout();
 *     return <button onClick={handleClick}>Logout</button>;
 * }
 */
const useLogout = (): Logout => {
  const router = useRouter();
  const authProvider = useAuthProvider();

  const callLogout = useCallback(
    async (redirectTo = PATH_AUTH.general.login) => {
      await authProvider.logout();
      router.push(redirectTo);
    },
    [authProvider, router],
  );

  return callLogout;
};

export default useLogout;
