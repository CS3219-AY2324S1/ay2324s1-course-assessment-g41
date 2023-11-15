import { Attempt } from "@/@types/attempt";
import { useEffect, useState } from "react";
import * as HistoryService from "../../services/history";

export const useGetAllAttempts = ({
  roomName,
  currentAttempt,
}: {
  roomName: string;
  currentAttempt: Attempt;
}) => {
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    const getAttempts = async () => {
      try {
        const allAttempts = await HistoryService.getAllAttemptsInRoom(roomName);
        setAttempts((prevAttempts) => allAttempts);
      } catch (err) {
        console.log(err, "get all attempts error");
      }
    };
    // server will create a default attempt
    getAttempts();
  }, [roomName, currentAttempt]);

  return {
    attempts,
  };
};
