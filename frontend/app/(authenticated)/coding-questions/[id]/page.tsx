"use client";
import { Question } from "@/@types/models/question";
// TODO: refactor to server side compoennt
import QuestionService from "@/services/questionService";
import { QuestionDetails } from "@/views/question";
import { useEffect, useState } from "react";

const QuestionDetailsPage = ({ params }: { params: { id: string } }) => {
  const [question, setQuestion] = useState<Question | null>(null)

  useEffect(() => {
    QuestionService.getQuestion(params.id).then(q => {
      setQuestion(q)
    })
  }, [params])

  return <QuestionDetails {...question as Question} isPreview={false} />;
};

export default QuestionDetailsPage;
