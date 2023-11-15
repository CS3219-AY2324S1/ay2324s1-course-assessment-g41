import { Request, Response } from "express";

import complexityMatchingRequestCache from "@/utils/complexity-matching-request-cache";
import complexityMatchingPairCache from "@/utils/complexity-matching-pair-cache";
import { Status } from "@/models/status";
import ComplexityMatchingPushService from "@/services/complexity-matching-push-service";

export const removeMatchingPair = async (req: Request, res: Response) => {
  const userId: string = res.locals.userId;

  try {
    await complexityMatchingPairCache.del(userId);
  } catch (err) {
    // TODO: add better error validation
    res.status(400).send();
  }
  res.status(200).send();
};

export const pushMatchRequestToQueue = async (req: Request, res: Response) => {
  const userId: string = res.locals.userId;

  const { questionComplexity }: { questionComplexity: string } = req.body;
  const complexityPublisherService = new ComplexityMatchingPushService();
  try {
    complexityPublisherService.pushMatchingRequest(userId, questionComplexity);
  } catch (err) {
    // TODO: add better error validation
    res.status(400).send();
  }
  res.status(200).send();
};

export async function getMatchingStatus(
  req: Request,
  res: Response
): Promise<void> {
  const userId: string = res.locals.userId;

  const matchingPair:
    | { roomId: string; user1: string; user2: string }
    | undefined = await complexityMatchingPairCache.get(userId);
  const status = await complexityMatchingRequestCache.get(userId);

  if (matchingPair) {
    const roomId: string | undefined = matchingPair.roomId;
    res.status(200).json({ roomId, status: Status.Paired });
  } else if (status !== undefined) {
    res.status(200).json({ status: Status.Processing });
  } else if (status === undefined) {
    res.status(200).json({ status: Status.Expired });
  }
}

export const healthCheck = async (req: Request, res: Response) => {
  res.status(200).send();
};
