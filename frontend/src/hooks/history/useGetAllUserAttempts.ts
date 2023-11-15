import { Attempt } from "@/@types/attempt";
import { useEffect, useState } from "react";
import * as HistoryService from "../../services/history";

export const useGetAllUserAttempts = () => {
  const [attempts, setAttempts] = useState<(Attempt & { updatedAt: string; roomName: string })[]>(
    [],
  );

  useEffect(() => {
    const getUserAttempts = async () => {
      const allAttempts = await HistoryService.getAllAttemptsByUser();
      setAttempts(allAttempts);
    };
    getUserAttempts();
  }, []);

  return {
    attempts,
  };
};
