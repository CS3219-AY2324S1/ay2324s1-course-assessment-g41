import { useEffect, useState } from "react";
import useGetIdentity from "@/hooks/auth/useGetIdentity";
import { Role } from "@/@types/user";

const useHasQuestionWritePerms = () => {
  const [hasWritePerms, setHasWritePerms] = useState(false);

  const { identity } = useGetIdentity();

  useEffect(() => {
    console.log("roles", identity.roles);
    const isAdmin =
      identity.roles && identity.roles.filter((role) => role === Role.ADMIN).length > 0;

    if (isAdmin) {
      setHasWritePerms(true);
      return;
    }
    setHasWritePerms(false);
  }, [identity]);

  return {
    hasWritePerms,
  };
};

export default useHasQuestionWritePerms;
