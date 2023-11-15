import { Attempt } from "@/@types/attempt";
import { Language } from "@/@types/language";
import { Question } from "@/@types/models/question";
import { BE_API } from "@/utils/api";
import authorizedAxios from "@/utils/axios/authorizedAxios";
import QuestionService from "./question";

const createNewAttempt = async ({ roomName }: { roomName: string }) => {
  const response = await authorizedAxios.post(`${BE_API.history}/${roomName}`);
  console.log("retrieve response", response);
  return response.data;
};

const fetchQuestionFromAttempt = (attempt: {
  questionId: string;
  text: string;
  language: Language;
  attemptId: number;
}) => {
  if (!attempt.questionId || attempt.questionId === "" || attempt.questionId === "-1") {
    return null;
  }
  return QuestionService.getQuestion(attempt.questionId);
};

const getAllAttemptsInRoom = async (
  roomName: string,
): Promise<(Attempt & { roomName: string; text: string })[]> => {
  const response = await authorizedAxios.get(`${BE_API.history}/${roomName}`);
  const listOfAttempts: {
    questionId: string;
    text: string;
    language: Language;
    attemptId: number;
  }[] = response.data;
  console.log("attempts", listOfAttempts);
  const questions: (Question | null)[] = await Promise.all(
    listOfAttempts.map((attempt) => fetchQuestionFromAttempt(attempt)),
  );

  return listOfAttempts.map((attempt, index) => {
    const { text, language, attemptId } = attempt;
    const question = questions[index];
    return {
      roomName,
      attemptId,
      question,
      text,
      language,
    };
  });
};

const getAttempt = async (
  attemptId: number,
  roomName: string,
): Promise<Attempt & { roomName: string; text: string }> => {
  const response = await authorizedAxios.get(`${BE_API.history}/${roomName}/${attemptId}`);
  const attempt: { questionId: string; text: string; language: Language; attemptId: number } =
    response.data;
  const question = await fetchQuestionFromAttempt(attempt);

  return {
    attemptId,
    question,
    roomName,
    text: attempt.text,
    language: attempt.language,
  };
};

const getAllAttemptsByUser = async () => {
  try {
    const response = await authorizedAxios.get(`${BE_API.history}`);
    const attempts = response.data;
    return attempts;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export { getAllAttemptsInRoom, getAttempt, getAllAttemptsByUser, createNewAttempt };
