import { Request, Response } from 'express';
import * as AttemptService from "@/services/attempt-service";
import * as RoomService from "@/services/room-service";

export async function getAttempt(req: Request, res: Response) {
  const { roomName, attemptId } = req.params
  const doc = await AttemptService.findAttemptFromDatabase(parseInt(attemptId), roomName)
  if (!doc) {
    res.status(400).send()
  } else {
    res.status(200).json(doc)
  }
  return
}

export async function createAttemptInRoom(req: Request, res: Response) {
  const { roomName } = req.params;
  let doc = await AttemptService.findAllAttemptsFrom(roomName);
  const newAttemptId = Math.max(...doc.map((attempt) => attempt.attemptId) as number[]) + 1;
  await AttemptService.upsertAttempt({
    attemptId: newAttemptId,
    questionId: null,
    roomName,
    text: "",
    language: {
      label: "Plain Text",
      value: "plaintext"
    }
  });
  const newAttempt = await AttemptService.findAttemptFromDatabase(newAttemptId, roomName);
  res.status(200).json(newAttempt);
}

export async function getAllAttemptsInRoom(req: Request, res: Response) {
  const { roomName } = req.params;
  let doc = await AttemptService.findAllAttemptsFrom(roomName);
  if (doc.length === 0) {
    // create default attempt for room
    await AttemptService.upsertAttempt({
      attemptId: 1,
      questionId: null,
      roomName,
      text: "",
      language: {
        label: "Plain Text",
        value: "plaintext"
      }
    })
    const defaultAttempt = await AttemptService.findAttemptFromDatabase(1, roomName);
    if (defaultAttempt) {
      doc.push(defaultAttempt);
    }
  }
  console.log(doc, 'mongoose');
  res.status(200).json(doc)
}

export async function getAttemptsByUser(req: Request, res: Response) {
  const userId: string = res.locals.userId
  const roomNames = await RoomService.getRoomsWithUser(userId)
  let result: {
    roomName?: string | null | undefined;
    attemptId?: number | null | undefined;
    questionId?: string | null | undefined;
    text?: string | null | undefined;
    language?: {
      label?: string | null | undefined;
      value?: string | null | undefined;
    } | null | undefined
  }[] = []

  for (let i = 0; i < roomNames.length; i++) {
    const room = roomNames[i];
    const attempts = await AttemptService.findAllAttemptsFrom(room);
    result = [...result, ...attempts];
  }
  res.status(200).json(result)
}