import { atom, useAtom } from "jotai";
import { Question, QuestionComplexity } from "@/@types/models/question";
import QuestionService from "@/services/questionService";

interface QuestionListAtom {
  questions: Question[];
}

const questionListAtom = atom<QuestionListAtom>({
  questions: QuestionService.getQuestions(),
});

export const useQuestions = () => {
  const [questionListWrapper, setQuestionListWrapper] = useAtom(questionListAtom);

  const setQuestionList = (questionList: Question[]) => {
    setQuestionListWrapper({
      questions: questionList,
    });
  };

  const addQuestion = ({
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
    QuestionService.addQuestion({ title, description, complexity, categories });
    setQuestionList(QuestionService.getQuestions());
  };

  const removeQuestion = ({ id }: { id: number }) => {
    QuestionService.removeQuestion({ id });
    setQuestionList(QuestionService.getQuestions());
  };

  const editQuestion = (editedQuestionData: Question) => {
    QuestionService.editQuestion(editedQuestionData);
    setQuestionList(QuestionService.getQuestions());
  };

  return {
    questions: questionListWrapper.questions,
    addQuestion,
    removeQuestion,
    editQuestion,
  };
};
