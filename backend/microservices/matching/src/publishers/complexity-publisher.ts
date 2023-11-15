import PubSubClient from "@/clients/pubsub";

class ComplexityPublisher {
  private readonly pubSubClient: typeof PubSubClient;

  constructor() {
    this.pubSubClient = PubSubClient;
  }

  publishToTopic(topic: string, data: string) {
    this.pubSubClient.publishToTopic(topic, data)
  }
}

export default ComplexityPublisher;