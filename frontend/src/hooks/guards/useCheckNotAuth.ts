import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from 'src/routes/paths';
import useAuthProvider from '../auth/useAuthProvider';

type CheckNotAuth = (params: { redirectTo?: string }) => Promise<any>;

/**
 * Get a callback for calling the authProvider.checkAuth() method.
 * In case of resolution, redirects to the dashboard page.
 *
 * This is a low level hook. See those more specialized hooks
 * for common authentication tasks, based on useCheckNotAuth.
 *
 * @see useNotAuthenticated
 * @see useAuthState
 *
 * @returns {Function} checkNotAuth callback
 */
const useCheckNotAuth = (): CheckNotAuth => {
  const authProvider = useAuthProvider();
  const router = useRouter();

  const checkNotAuth = useCallback(
    async ({ redirectTo = PATH_DASHBOARD.root }) => {
      await authProvider.checkAuth();
      router.push(redirectTo);
    },

    [authProvider, router],
  );

  return checkNotAuth;
};

export default useCheckNotAuth;