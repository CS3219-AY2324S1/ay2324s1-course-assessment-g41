import { useEffect } from "react";
import useCheckAuth from "./useCheckAuth";
import { isDebug } from "@/config";
import useTrackDependencies from "../dev/useTrackDependencies";

/**
 * Restrict access to authenticated users.
 * Redirect anonymous users to the login page.
 *
 * Use it in your custom page components to require
 * authentication.
 *
 * @example
 *     const FooPage = () => {
 *         useAuthenticated();
 *         return <Foo />;
 *     }
 */
const useAuthenticated = () => {
  const checkAuth = useCheckAuth();

  useTrackDependencies("useAuthenticated", [checkAuth]);

  useEffect(() => {
    const callCheckAuth = async () => {
      try {
        if (!isDebug) {
          await checkAuth({});
        } else {
          console.log("[useAuthenticated] isDebug is true, skipping authentication...");
        }
      } catch (error) {
        // Error has been handled by the guard
      }
    };

    callCheckAuth();
  }, [checkAuth]);
};

export default useAuthenticated;
