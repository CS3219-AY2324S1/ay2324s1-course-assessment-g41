import { useEffect } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from 'src/utils/jwt';
import { useToast } from '@chakra-ui/react';
import useLogin from './useLogin';
import { PATH_QUESTIONS } from '@/routes/paths';

/**
 * Tries to login using the session tokens found in the URL params.
 */
const useAutoLogin = () => {
  const login = useLogin();
  const toast = useToast();
  //   const { redirectPath, clearRedirectPath } = useRedirectPath();
  const searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const callLogin = async () => {
      const accessToken = searchParams.get(ACCESS_TOKEN);
      const refreshToken = searchParams.get(REFRESH_TOKEN);

      if (accessToken === null || refreshToken === null) {
        return;
      }

      try {
        await login(
          {
            accessToken,
            refreshToken,
          },
          // karwi: use dynamic redirect path
          //   redirectPath?.to,
          PATH_QUESTIONS.root,
        );
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to login using the tokens in the url params.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    };

    callLogin();
  }, [toast, login, searchParams]);
};

export default useAutoLogin;
