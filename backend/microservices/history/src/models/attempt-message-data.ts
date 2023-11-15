import Language from "./language";

interface AttemptMessageData {
  roomName: string;
  attemptId: number;
  language: Language;
  text: string;
  questionId?: string | null | undefined;
}

export default AttemptMessageData;