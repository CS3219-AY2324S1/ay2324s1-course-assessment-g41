import { useCallback } from "react";
import useAuthProvider from "./useAuthProvider";
import { PATH_MAIN } from "../../routes/paths";
import { JwtTokenSet } from "@/@types/token";
import { useRouter } from "next/navigation";

type Login = (options?: {
  tokens?: JwtTokenSet;
  redirectTo?: string;
  shouldRedirect?: boolean;
}) => Promise<any>;

export const useLogin = (): Login => {
  const authProvider = useAuthProvider();
  const { push } = useRouter();

  const callLogin: Login = useCallback(
    async ({ tokens, redirectTo = PATH_MAIN.general.dashboard, shouldRedirect = true } = {}) => {
      await authProvider.login(tokens);

      if (shouldRedirect) {
        push(redirectTo);
      }
    },
    [authProvider, push],
  );

  return callLogin;
};
