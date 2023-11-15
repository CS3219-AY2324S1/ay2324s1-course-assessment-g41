import { Role } from "src/@types/user";
import useGetIdentity from "../auth/useGetIdentity";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { PATH_MAIN } from "@/routes/paths";
import { useToast } from "@chakra-ui/react";

type CheckRoles = (
  expectedRoles: Role[],
  params?: {
    redirectTo?: string;
  },
) => Promise<any>;

const useCheckRoles = (): CheckRoles => {
  const { identity, loading } = useGetIdentity();
  const router = useRouter();
  const toast = useToast();

  const checkRoles = useCallback(
    async (
      expectedRoles: Role[],
      { redirectTo = PATH_MAIN.general.dashboard }: { redirectTo?: string } = {},
    ) => {
      if (loading) {
        // Data is still being fetched. Defer roles checking
        return;
      }

      const currentRoles = identity.roles ?? [];
      const hasAllRoles = expectedRoles.every((role) => currentRoles.includes(role));

      if (!hasAllRoles) {
        router.push(redirectTo);

        toast({
          title: "Insufficient permissions",
          description: "You do not have the necessary permissions to view this page.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        throw new Error("Insufficient permissions");
      }
    },
    [identity, router, loading],
  );

  return checkRoles;
};

export default useCheckRoles;
