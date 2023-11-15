import { Attempt } from "@/@types/attempt";
import { Question } from "@/@types/models/question";
import { getAttempt } from "@/services/history";
import { useEffect, useState } from "react";

type AttemptResponse = Attempt & { roomName: string; text: string; question: Question | null };

export const useGetAttempt = ({ attemptId, roomName }: { attemptId: number; roomName: string }) => {
  const [attempt, setAttempt] = useState<AttemptResponse>();
  useEffect(() => {
    const _getAttempt = async () => {
      const _attempt = (await getAttempt(attemptId, roomName)) as AttemptResponse;
      setAttempt(_attempt);
    };
    _getAttempt();
  }, []);
  return {
    attempt,
  };
};
