import { HocuspocusProvider } from "@hocuspocus/provider";
import { useGetUsersInRoom, usePushUsersInRoom } from "../room/useUsersInRoom";

const useManageUsersInRoom = ({ provider }: { provider: HocuspocusProvider | null }) => {
  usePushUsersInRoom({ provider });
  const { users: activeUsers } = useGetUsersInRoom({ provider });

  return {
    activeUsers,
  };
};

export default useManageUsersInRoom;
