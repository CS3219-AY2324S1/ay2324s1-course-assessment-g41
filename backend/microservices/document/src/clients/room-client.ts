import axios from "axios";
import { IncomingHttpHeaders } from "http";
// TODO: implement service registry to retrieve collab service endpoint
const { COLLAB_SERVICE_ENDPOINT } = process.env

const roomClient = axios.create({
  baseURL: COLLAB_SERVICE_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  }
});

const doesUserHaveAccessToRoom = async (userId: string, roomName: string) => {
  const response = await roomClient.get(`/room/${roomName}/access`, {
    data: {
      userId
    }
  })
  console.log(`Received ${JSON.stringify(response.status)}, ${JSON.stringify(response.data)} from collab-service`)
  if (response.status !== 200) {
    throw new Error("User does not have access to room")
  }
}

const isRoomOpen = async (roomName: string) => {
  const response = await roomClient.get(`/room/${roomName}/status`)
  console.log(`Received ${JSON.stringify(response.data)} from collab-service`)
  const { isOpen }: { isOpen: boolean } = response.data
  if (!isOpen) {
    throw new Error("Room is not opened.")
  }
}

const closeRoom = async (roomName: string, requestHeaders: IncomingHttpHeaders) => {
  const cookie = requestHeaders.cookie;
  if (cookie) {
    roomClient.defaults.headers['Cookie'] = cookie;
  }

  const response = await roomClient.put(`/room/${roomName}/status/close`);
  console.log(`Received ${response} from collab-service`);
}

export {
  doesUserHaveAccessToRoom,
  isRoomOpen,
  closeRoom
}


