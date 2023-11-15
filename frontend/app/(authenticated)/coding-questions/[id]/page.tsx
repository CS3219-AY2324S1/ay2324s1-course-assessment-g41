"use client";
import { Question } from "@/@types/models/question";
// TODO: refactor to server side compoennt
import QuestionService from "@/services/question";
import { QuestionDetails } from "@/views/question";
import { useEffect, useState } from "react";
import useHasQuestionWritePerms from "@/hooks/questions/useHasQuestionWritePerms";

const QuestionDetailsPage = ({ params }: { params: { id: string } }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const { hasWritePerms } = useHasQuestionWritePerms();

  useEffect(() => {
    QuestionService.getQuestion(params.id).then((q) => {
      setQuestion(q);
    });
  }, [params]);

  return (
    <QuestionDetails {...(question as Question)} isPreview={false} hasWritePerms={hasWritePerms} />
  );
};

export default QuestionDetailsPage;
