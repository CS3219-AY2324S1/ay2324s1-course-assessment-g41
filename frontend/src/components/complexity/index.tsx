import { QuestionComplexity } from "@/@types/models/question";
import { HStack, Icon, Text } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { TbStairsUp } from "react-icons/tb";

export const ComplexityBadge = ({ children }: PropsWithChildren) => {
  let color = "gray.500"; // default colour

  switch (children) {
    case QuestionComplexity.EASY:
      color = "green.500";
      break;
    case QuestionComplexity.MEDIUM:
      color = "yellow.500";
      break;
    case QuestionComplexity.HARD:
      color = "red.500";
  }

  return children ? (
    <HStack spacing={0.5} display="flex" alignItems="center">
      <Icon as={TbStairsUp} color={color} size="sm" />
      <Text color={color} fontSize="sm" fontWeight={700}>
        {children}
      </Text>
    </HStack>
  ) : null;
};
