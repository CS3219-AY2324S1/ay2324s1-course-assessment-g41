import { Language } from "@/models/language";
import AttemptPublisher from "@/publishers/attempt-publisher";
import { Doc } from "yjs";

const ATTEMPT_ID_KEY = "attemptId";
const MONACO_TEXT_KEY = "monaco";
const LANGUAGE_KEY = "language";
const QUESTION_KEY = "question";

const saveAttempt = ({ roomName, attemptId, text, language, questionId }: { roomName: string; attemptId: number; text: string; language: Language, questionId: string }) => {
  const publisher = new AttemptPublisher()
  console.log("PUBLSIHING TO ATTEMPT SERVICE");
  publisher.publishToTopic({
    attemptId, text, language, roomName, questionId
  })
}

const extractAttemptFromDocument = ({ document }: { document: Doc }) => {
  const text = extractTextFrom({ document });
  const attemptId = extractAttemptIdFrom({ document });
  const language = extractLanguageFrom({ document });
  const questionId = extractQuestionIdFrom({ document });
  return {
    attemptId, text, language, questionId
  }
}

const extractTextFrom = ({ document }: { document: Doc }) => {
  const text = document.getText(MONACO_TEXT_KEY);
  return text.toJSON();
}

const extractAttemptIdFrom = ({ document }: { document: Doc }) => {
  const ymap = document.getMap(ATTEMPT_ID_KEY);
  const attemptId = ymap.get(ATTEMPT_ID_KEY) as number;
  return attemptId;
}

const extractQuestionIdFrom = ({ document }: { document: Doc }) => {
  const ymap = document.getMap(QUESTION_KEY);
  const question = ymap.get(QUESTION_KEY) as { id: string };
  return question?.id;
}

const extractLanguageFrom = ({ document }: { document: Doc }) => {
  const ymap = document.getMap(LANGUAGE_KEY);
  const language = ymap.get(LANGUAGE_KEY) as Language;
  return language;
}

export {
  saveAttempt,
  extractAttemptFromDocument
}