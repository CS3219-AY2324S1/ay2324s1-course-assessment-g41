import { User } from "@/@types/user";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import useGetIdentity from "../auth/useGetIdentity";

const OTHER_USER_AWARENESS_SHARED_KEY = "OTHER_USER";

export const useGetUsersInRoom = ({ provider }: { provider: HocuspocusProvider | null }) => {
  const { identity } = useGetIdentity();
  const [otherUser, setOtherUser] = useState<User | null>(null);

  useEffect(() => {
    const set = () => {
      if (!provider?.awareness) {
        return;
      }
      Array.from(provider.awareness.getStates()).map((state: any) => {
        const [, data] = state;
        console.log(data);
        if (
          data[OTHER_USER_AWARENESS_SHARED_KEY] &&
          data[OTHER_USER_AWARENESS_SHARED_KEY].id === identity.id
        ) {
          setOtherUser(null);
          return;
        }
        if (
          data[OTHER_USER_AWARENESS_SHARED_KEY] &&
          data[OTHER_USER_AWARENESS_SHARED_KEY]?.id !== identity.id
        ) {
          setOtherUser(data[OTHER_USER_AWARENESS_SHARED_KEY]);
        }
      });
    };

    provider?.awareness?.on("change", set);
    set();

    return () => {
      provider?.awareness?.off("change", set);
    };
  }, [provider]);

  return {
    users: otherUser ? [identity, otherUser] : [identity],
  };
};

export const usePushUsersInRoom = ({ provider }: { provider: HocuspocusProvider | null }) => {
  const { identity } = useGetIdentity();

  useEffect(() => {
    provider?.awareness?.setLocalStateField(OTHER_USER_AWARENESS_SHARED_KEY, identity);
  }, [provider]);
};
