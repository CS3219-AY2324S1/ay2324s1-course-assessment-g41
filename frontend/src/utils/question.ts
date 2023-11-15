import { QuestionComplexity } from "@/@types/models/question";

export const transformQuestionComplexity = (complexity: QuestionComplexity) => {
  switch (complexity) {
    case "Easy":
      return 1;
    case "Medium":
      return 2;
    case "Hard":
      return 3;
  }
};

export const transformQuestionDifficulty = (difficulty: number) => {
  switch (difficulty) {
    case 1:
      return QuestionComplexity.EASY;
    case 2:
      return QuestionComplexity.MEDIUM;
    case 3:
      return QuestionComplexity.HARD;
  }
};
