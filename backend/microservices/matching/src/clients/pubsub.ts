import { PubSub, Message } from "@google-cloud/pubsub";

class PubSubClient {
  // Singleton instance
  private static instance: PubSubClient | null = null; 

  readonly client: PubSub;

  private constructor() {
    this.client = new PubSub();
  }

  // Create or return the existing instance
  static getInstance(): PubSubClient {
    if (PubSubClient.instance === null) {
      PubSubClient.instance = new PubSubClient();
    }
    return PubSubClient.instance;
  }

  subscribeToTopic(topic: string, messageHandler: (message: Message) => void) {
    const subscription = this.client.subscription(topic);
    subscription.on("message", messageHandler);
  }

  publishToTopic(topic: string, data: string) {
    this.client.topic(topic).publishMessage({
      data: Buffer.from(data)
    });
  }
}

export default PubSubClient.getInstance();
