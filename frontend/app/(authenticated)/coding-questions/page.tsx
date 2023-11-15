"use client";

import { QuestionsList } from "@/views/question";
import { useQuestions } from "@/hooks/questions/useQuestionList";
import useHasQuestionWritePerms from "@/hooks/questions/useHasQuestionWritePerms";

export default function Questions() {
  const { questions } = useQuestions({});
  const { hasWritePerms } = useHasQuestionWritePerms();

  return <QuestionsList questions={questions} hasWritePerms={hasWritePerms} />;
}
