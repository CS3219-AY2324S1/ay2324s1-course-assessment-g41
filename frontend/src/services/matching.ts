import { QuestionComplexity } from "@/@types/models/question";
import { BE_API } from "@/utils/api";
import authorizedAxios from "@/utils/axios/authorizedAxios";

class MatchingService {
  static async setUpPairCoding(questionComplexity: QuestionComplexity) {
    try {
      const data = { questionComplexity };
      await authorizedAxios.post(BE_API.matching.request, data);
    } catch (error) {
      console.error("Error while sending matching request:", error);
    }
  }

  static async getMatchingStatus() {
    try {
      const response = await authorizedAxios.get(`${BE_API.matching.request}/status`);
      return response.data;
    } catch (error) {
      console.error("Error while sending matching request:", error);
    }
  }

  static async removeMatchingPair() {
    try {
      const response = await authorizedAxios.delete(`${BE_API.matching.pair}`);
      console.log("successfully deleted matching pair", response.data);
      return response.data;
    } catch (err) {
      console.error("Error while deleting matching pair", err);
    }
  }
}

export default MatchingService;
