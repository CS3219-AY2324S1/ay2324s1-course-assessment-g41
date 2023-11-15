import { Request, Response } from 'express';
import { RoomService } from "../services/room-service";

export async function createRoom(req: Request, res: Response) {
  const { userId1, userId2 }: { userId1: string, userId2: string } = req.body
  const { room } = await RoomService.createRoom(userId1, userId2)
  res.status(200).json({
    ...room
  })
}

export async function closeRoom(req: Request, res: Response) {
  const { roomName } = req.params
  const userId: string = res.locals.userId
  await RoomService.closeRoom(roomName, userId)
  res.status(200).send()
}

export async function openRoom(req: Request, res: Response) {
  const { roomName } = req.params
  const userId: string = res.locals.userId
  await RoomService.openRoom(roomName, userId)
  res.status(200).send()
}

export async function checkUserInRoom(req: Request, res: Response) {
  const { roomName } = req.params;
  const userId: string = res.locals.userId;
  // const { userId }: { userId: string } = req.body
  try {
    const hasAcces = await RoomService.doesUserHaveAccessToRoom(userId, roomName)
    if (!hasAcces) {
      res.status(403).send();
      return;
    }
    
    res.status(200).send()
  } catch (err) {
    res.status(403).send()
  }
}

export async function isRoomOpen(req: Request, res: Response) {
  console.log('IS THIS CALLED');
  const { roomName } = req.params;
  try {
    const isOpen = await RoomService.isRoomOpen(roomName)
    res.status(200).json({
      isOpen
    })
  } catch (err) {
    res.status(400).send()
  }
}

export async function getRoomsWithUser(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const rooms = await RoomService.getRoomsWithUser(userId);
    res.status(200).json({
      rooms
    })
  } catch (err) {
    res.status(400).send()
  }
}