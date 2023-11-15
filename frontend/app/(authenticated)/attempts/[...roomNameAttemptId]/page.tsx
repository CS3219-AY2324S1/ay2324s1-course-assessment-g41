"use client";
import IndividualRoom from "@/components/room/IndivRoom";
import { useGetAttempt } from "@/hooks/history/useGetAttempt";

const AttemptView = ({ params }: { params: { roomNameAttemptId: string[] } }) => {
  const [roomName, attemptId] = params.roomNameAttemptId;
  const { attempt } = useGetAttempt({
    roomName,
    attemptId: parseInt(attemptId),
  });

  return attempt ? <IndividualRoom attempt={attempt} /> : null;
};

export default AttemptView;
