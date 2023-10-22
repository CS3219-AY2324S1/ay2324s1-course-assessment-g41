"use client";

import { QuestionsList } from "@/views/question";
import { useQuestions } from "@/hooks/questions/useQuestionList";

export default function Questions() {
  const { questions } = useQuestions();
  return <QuestionsList questions={questions} />;
}
