// components/QuestionDescription.tsx
import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import QuestionDetails from "./QuestionDetails";
import { Question } from "@/@types/models/question";

const QuestionDescription = ({ question }: { question: Question | null }) => {
  return (
    <Flex direction="column" height="100%" overflow="hidden">
      <Box flex="1" overflowY="auto">
        <QuestionDetails question={question} />
      </Box>
    </Flex>
  );
};

export default QuestionDescription;
