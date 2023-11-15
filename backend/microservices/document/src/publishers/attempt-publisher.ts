import PubSubClient from "@/clients/pubsub";
import { Language } from "@/models/language";

class AttemptPublisher {
  private readonly pubSubClient: typeof PubSubClient;
  private readonly attemptTopic: string = process.env.ATTEMPT_TOPIC || "DEV_ATTEMPT_TOPIC";

  constructor() {
    this.pubSubClient = PubSubClient;
  }

  publishToTopic({ attemptId, roomName, text, language, questionId }: { attemptId: number, roomName: string, text: string, language: Language, questionId: string | null }) {
    const data = JSON.stringify({ attemptId, roomName, text, language, questionId })
    this.pubSubClient.publishToTopic(this.attemptTopic, data)
  }
}

export default AttemptPublisher;