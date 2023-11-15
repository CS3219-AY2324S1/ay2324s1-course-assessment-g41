// components/QuestionDescription.tsx
import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import QuestionDetails from "./QuestionDetails";
import AttemptActions from "./AttemptActions";

const QuestionDescription = () => {
  return (
    <Flex direction="column" height="100%" overflow="hidden">
      <Box flex="1" overflowY="auto">
        <QuestionDetails />
      </Box>
      <Box>
        <AttemptActions />
      </Box>
    </Flex>
  );
};

export default QuestionDescription;
