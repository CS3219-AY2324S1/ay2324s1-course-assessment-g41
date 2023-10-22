"use client";
// TODO: turn to server component - using client component for now to access localStorage
import QuestionService from "@/services/questionService";
import { QuestionDetails } from "@/views/question";

const QuestionDetailsPage = ({ params }: { params: { id?: string } }) => {
  const question = QuestionService.getQuestion(params.id ? +params.id : 1);
  return question ? <QuestionDetails {...question} /> : null;
};

export default QuestionDetailsPage;
