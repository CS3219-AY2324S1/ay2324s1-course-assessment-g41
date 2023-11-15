// components/QuestionDetails.tsx
import React from "react";
import {
  Tag,
  Text,
  Box,
  VStack,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";
import { OptionBase, Select, SingleValue } from "chakra-react-select";
import ReactMarkdown from "react-markdown";

interface OptionType extends OptionBase {
  value: string;
  label: string;
}

const getBadgeColorScheme = (complexity: string) => {
  switch (complexity.toLowerCase()) {
    case "easy":
      return "green";
    case "medium":
      return "orange";
    case "hard":
      return "red";
    default:
      return "gray";
  }
};

const QuestionDetails = () => {
  const { questionTotalList, onQuestionChange, currentAttempt } = useCollabContext();

  const handleQuestionChange = (selectedOption: SingleValue<OptionType>) => {
    if (!selectedOption) {
      return;
    }
    const newQuestionId = selectedOption.value;
    if (currentAttempt) {
      onQuestionChange(newQuestionId, currentAttempt.attemptId);
    }
  };

  const currentQuestion = currentAttempt?.question;

  const options = questionTotalList.map((question) => ({
    value: question.id,
    label: question.title,
  }));

  return currentAttempt ? (
    <Box rounded="md">
      <Select
        options={options}
        onChange={handleQuestionChange}
        value={currentQuestion ? { value: currentQuestion.id, label: currentQuestion.title } : null}
        placeholder="Select a question"
      />
      {currentQuestion && (
        <VStack align="start" spacing={2} mt={4}>
          <Box display="flex" alignItems="center">
            <Badge
              colorScheme={getBadgeColorScheme(currentQuestion.complexity)}
              fontSize="sm"
              p={1}
            >
              {currentQuestion.complexity}
            </Badge>
          </Box>
          <ReactMarkdown>{currentQuestion.description}</ReactMarkdown>
          <Accordion width="100%" allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Related Topics
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {currentQuestion.categories.map((category, index) => (
                    <Tag key={index} colorScheme="blue">
                      {category}
                    </Tag>
                  ))}
                </Box>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </VStack>
      )}
    </Box>
  ) : null;
};

export default QuestionDetails;
