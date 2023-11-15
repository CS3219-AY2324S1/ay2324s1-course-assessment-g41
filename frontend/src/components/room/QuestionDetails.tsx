import React from "react";
import {
  Tag,
  Box,
  VStack,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import ReactMarkdown from "react-markdown";
import { Question } from "@/@types/models/question";

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

const QuestionDetails = ({ question }: { question: Question | null }) => {
  const options = question ? [{ value: question.id, label: question.title }] : [];
  return question ? (
    <Box rounded="md">
      <Select
        options={options}
        isDisabled={true}
        value={{ value: question.id, label: question.title }}
        placeholder="Select a question"
      />
      {question && (
        <VStack align="start" spacing={2} mt={4}>
          <Box display="flex" alignItems="center">
            <Badge colorScheme={getBadgeColorScheme(question.complexity)} fontSize="sm" p={1}>
              {question.complexity}
            </Badge>
          </Box>
          <ReactMarkdown>{question.description}</ReactMarkdown>
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
                  {question.categories.map((category, index) => (
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
