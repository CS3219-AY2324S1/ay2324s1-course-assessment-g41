import { Question, QuestionComplexity } from "@/@types/models/question";
import QuestionService from "@/services/question";
import { upsertDocumentValue } from "@/utils/document";
import { useEffect, useState } from "react";
import { Doc } from "yjs";

const useManageQuestionsInRoom = ({
  complexity,
  document,
}: {
  complexity: QuestionComplexity | null | undefined | number;
  document: Doc | null;
}) => {
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  const handleQuestionChange = async (newQuestionId: string) => {
    const question = await QuestionService.getQuestion(newQuestionId);
    upsertDocumentValue({
      sharedKey: "question",
      valueToUpdate: question,
      document,
    });
  };

  useEffect(() => {
    if (!complexity) return;

    const getQuestions = async () => {
      const questions = await QuestionService.getQuestions({
        difficulties: [complexity],
      });
      console.log(questions);
      setFilteredQuestions(questions);
    };
    getQuestions();
  }, [complexity]);

  return {
    filteredQuestions,
    handleQuestionChange,
  };
};

export default useManageQuestionsInRoom;
