import { onAuthenticatePayload, onChangePayload, onDisconnectPayload, onStatelessPayload, onStoreDocumentPayload } from "@hocuspocus/server";
import * as AttemptService from "@/services/attempt";
import * as RoomService from "@/services/room";
import * as AuthService from "@/services/auth";
import { parseCookie } from "@/utils/parseCookie";

const autoSaveAttempt = (data: onStoreDocumentPayload) => {
  const attempt = AttemptService.extractAttemptFromDocument({ document: data.document });
  if (!attempt.attemptId) return; // if attempt id is invalid, don't save
  AttemptService.saveAttempt({ ...attempt, roomName: data.documentName });
}

const checkAuthForUser = async (data: onAuthenticatePayload) => {
  console.log("REQUEST HEADERS FOR AUTH", data.requestHeaders);
  // const token = parseCookie(data.requestHeaders.cookie || "");
  // const userId = AuthService.verifyUserExists(token)
  const userId = data.token;
  const promiseVerifications = [RoomService.verifyUserBelongsInRoom(userId, data.documentName), RoomService.verifyRoomIsOpen(data.documentName)] 
  try {
    await Promise.all(promiseVerifications)
  } catch (err) {
    // at least one verification failed
    console.error("Authorization error", err)
    throw err;
  }
}

const handleStatelessMessage = async (data: onStatelessPayload) => {
  const { attemptId, language, text, questionId } = JSON.parse(data.payload);
  console.log("Saving ", {
    roomName: data.documentName,
    attemptId,
    text,
    language,
    questionId
  })
  AttemptService.saveAttempt({
    roomName: data.documentName,
    attemptId,
    text,
    language,
    questionId,
  })
}

const handleDisconnect = async (data: onDisconnectPayload) => {
  console.log(`total users in room: ${data.clientsCount}`);
  if (data.clientsCount === 0) {
    // no one else is in the room, so the last user who leaves the room closes the room
    await RoomService.closeRoom(data.documentName, data.requestHeaders);
  }
}

export {
  autoSaveAttempt as saveAttempt,
  checkAuthForUser,
  handleStatelessMessage,
  handleDisconnect
}