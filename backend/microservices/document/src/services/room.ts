import * as RoomClient from "@/clients/room-client"
import { IncomingHttpHeaders } from "http"

const verifyUserBelongsInRoom = async (userId: string, roomName: string) => {
  return await RoomClient.doesUserHaveAccessToRoom(userId, roomName)
}

const verifyRoomIsOpen = async (roomName: string) => {
  return await RoomClient.isRoomOpen(roomName)
}

const closeRoom = async (roomName: string, requestHeaders: IncomingHttpHeaders) => {
  return await RoomClient.closeRoom(roomName, requestHeaders);
}

export {
  verifyUserBelongsInRoom,
  verifyRoomIsOpen,
  closeRoom
}