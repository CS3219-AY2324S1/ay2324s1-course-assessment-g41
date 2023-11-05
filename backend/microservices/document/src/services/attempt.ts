import { Language } from "@/models/language";
import AttemptPublisher from "@/publishers/attempt-publisher";

const saveAttempt = ({ roomId, attemptId, text, language }: { roomId: string; attemptId: string; text: string; language: Language }) => {
  const publisher = new AttemptPublisher()
  publisher.publishToTopic({
    attemptId, text, language, roomId
  })
}

export {
  saveAttempt
}