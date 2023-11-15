import { MATCHING_REQUEST_TOPIC_PUBLISH } from "@/constants/matching-request";
import ComplexityPublisher from "@/publishers/complexity-publisher";

class ComplexityMatchingPushService {
  private readonly pubSubClient: ComplexityPublisher;

  constructor() {
    this.pubSubClient = new ComplexityPublisher()
  }

  pushMatchingRequest(userId: string, questionComplexity: string) {
    const data = JSON.stringify({
      userId,
      questionComplexity,
      time: new Date().getTime(),
    });
    this.publishToTopic(process.env.MATCHING_TOPIC || MATCHING_REQUEST_TOPIC_PUBLISH, data)
  }

  private publishToTopic(topic: string, data: string) {
    this.pubSubClient.publishToTopic(topic, data)
  }
}

export default ComplexityMatchingPushService;