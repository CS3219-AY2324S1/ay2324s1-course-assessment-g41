import { QuestionComplexity } from "@/@types/models/question";
import MatchingService from "@/services/matching";

export const useMatching = () => {
  const sendMatchingRequest = (complexity: QuestionComplexity): Promise<void> => {
    return MatchingService.setUpPairCoding(complexity);
  };

  const getMatchingStatus = () => {
    return MatchingService.getMatchingStatus();
  };

  return {
    sendMatchingRequest,
    getMatchingStatus,
  };
};
