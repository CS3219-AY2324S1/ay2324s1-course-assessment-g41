import { atom, useAtom } from "jotai";
import { Question, QuestionComplexity } from "@/@types/models/question";
import QuestionService from "@/services/question";
import { useEffect } from "react";

interface QuestionListAtom {
  questions: Question[];
}

const questionListAtom = atom<QuestionListAtom>({
  questions: [],
});

export const useQuestions = ({
  difficulties = undefined,
  sorting = undefined,
}: {
  difficulties?: QuestionComplexity[] | undefined;
  sorting?: "asc" | "desc" | undefined | null;
}) => {
  const [questionListWrapper, setQuestionListWrapper] = useAtom(questionListAtom);

  const setQuestionList = (questionList: Question[]) => {
    setQuestionListWrapper({
      questions: questionList,
    });
  };

  useEffect(() => {
    QuestionService.getQuestions({
      difficulties,
      sorting,
    }).then((questions) => {
      setQuestionList(questions);
    });
  }, []);

  const addQuestion = async ({
    title,
    description,
    complexity,
    categories,
  }: {
    title: string;
    description: string;
    complexity: QuestionComplexity;
    categories: string[];
  }) => {
    await QuestionService.addQuestion({ title, description, complexity, categories });
    setQuestionList(await QuestionService.getQuestions({}));
  };

  const removeQuestion = async ({ id }: { id: string }) => {
    await QuestionService.removeQuestion({ id });
    setQuestionList(questionListWrapper.questions.filter((q) => q.id !== id));
  };

  const editQuestion = async (editedQuestionData: Question) => {
    await QuestionService.editQuestion(editedQuestionData);
    setQuestionList([
      editedQuestionData,
      ...questionListWrapper.questions.filter((q) => q.id !== editedQuestionData.id),
    ]);
  };

  return {
    questions: questionListWrapper.questions,
    addQuestion,
    removeQuestion,
    editQuestion,
  };
};
