import { useEffect } from "react";
import useCheckRoles from "./useCheckRoles";
import { Role } from "src/@types/user";

/**
 * Restrict access to users with specified roles.
 * Redirect users without necessary role to the specified page.
 */
const useAuthRole = (expectedRoles: Role[]) => {
  const checkRoles = useCheckRoles();

  useEffect(() => {
    const callCheckRoles = async () => {
      try {
        await checkRoles(expectedRoles);
      } catch (error) {
        // Error has been handled by the check roles hook
      }
    };

    callCheckRoles();
  }, [checkRoles]);
};

export default useAuthRole;
