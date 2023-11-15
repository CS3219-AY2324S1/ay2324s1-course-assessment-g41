import { ReactNode, useCallback, useMemo } from "react";
import useCheckAuth from "src/hooks/guards/useCheckAuth";
import useCheckNotAuth from "src/hooks/guards/useCheckNotAuth";
import Guard from "./Guard";

interface Props {
  children?: ReactNode;
  authenticated?: boolean;
  // If authenticated, redirect to onboarding
  notAuthenticated?: boolean;
}

/**
 * Applies enabled guards in this order:
 * 1. Checks authenticated
 * 2. Checks not authenticated
 *
 * Incurs slightly more overhead compared to <Guard/> as
 * it preloads some common guards
 */
export default function CustomGuard({
  children,
  authenticated = false,
  notAuthenticated = false,
}: Props) {
  const checkAuth = useCheckAuth();
  const checkNotAuth = useCheckNotAuth();

  const guards = useMemo(() => {
    const res = [];
    authenticated && res.push(checkAuth);
    notAuthenticated && res.push(checkNotAuth);

    return res;
  }, [authenticated, notAuthenticated, checkAuth, checkNotAuth]);

  return <Guard guards={guards}>{children}</Guard>;
}
