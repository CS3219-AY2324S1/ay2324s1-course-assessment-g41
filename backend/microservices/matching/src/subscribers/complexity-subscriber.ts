import PubSubClient from "@/clients/pubsub";
import {
  MATCHING_REQUEST_TOPIC_SUBSCRIPTION,
  MATCHING_REQUEST_VALID_DURATION_IN_SECONDS,
} from "@/constants/matching-request";
import ComplexityMatchingPullService from "@/services/complexity-matching-pull-service";
import complexityMatchingPairCache from "@/utils/complexity-matching-pair-cache";
import complexityMatchingRequestCache from "@/utils/complexity-matching-request-cache";
import { Message } from "@google-cloud/pubsub";

/**
 * Listener that "pulls" messages from Google PubSub on the question complexity topic.
 */
class ComplexitySubscriber {
  private readonly pubSubClient: typeof PubSubClient;
  private readonly complexityMatchingPullService: ComplexityMatchingPullService;

  constructor() {
    this.pubSubClient = PubSubClient;
    this.complexityMatchingPullService = new ComplexityMatchingPullService();
  }

  start() {
    this.pubSubClient.subscribeToTopic(
      process.env.MATCHING_TOPIC_SUB || MATCHING_REQUEST_TOPIC_SUBSCRIPTION,
      (message) =>
        this.handleMessage(message, this.complexityMatchingPullService)
    );
  }

  private async handleMessage(
    message: Message,
    complexityMatchingPullService: ComplexityMatchingPullService
  ) {
    message.ack();
    try {
      console.log("=======================================");
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);

      const parsedData = JSON.parse(message.data.toString());

      if (
        await complexityMatchingPullService.isUserAlreadyMatched(
          parsedData.userId
        )
      ) {
        console.log(`${parsedData.userId} is already matched`);
        return;
      }

      const complexity =
        complexityMatchingPullService.registerRequestForMatch(parsedData);

      // add to request cache
      await complexityMatchingRequestCache.set(parsedData.userId, complexity);
      await complexityMatchingRequestCache.expire(
        parsedData.userId,
        MATCHING_REQUEST_VALID_DURATION_IN_SECONDS
      );

      complexityMatchingPullService.removeExpiredRequestsOfComplexity(
        complexity
      );
      const { room, user1, user2 } =
        await complexityMatchingPullService.matchUsersIfMoreThanTwo(complexity);

      if (room) {
        const insertUser1 = await complexityMatchingPairCache.set(
          user1.userId,
          {
            userId2: user2.userId,
            complexity: complexity,
            roomId: room.name,
          }
        );
        const insertUser2 = await complexityMatchingPairCache.set(
          user2.userId,
          {
            userId2: user1.userId,
            complexity: complexity,
            roomId: room.name,
          }
        );
        // update matchingPairCache
        console.log("matched pair, inserting into cache");
      }
      console.log(
        `matchingpairs=${JSON.stringify(
          complexityMatchingPullService.matchingPairs
        )}`
      );
    } catch (err) {
      // allow graceful timeout from waiting
      console.error(`message ${message.id} has an error:`, err);
    }
  }
}

export default ComplexitySubscriber;
