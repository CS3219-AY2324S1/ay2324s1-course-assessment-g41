import axios from "axios";
// TODO: implement service registry to retrieve collab service endpoint
const { COLLAB_SERVICE_ENDPOINT } = process.env

const collabClient = axios.create({
  baseURL: COLLAB_SERVICE_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  }
});

const createRoom = async (userId1: string, userId2: string) => {
  const response = await collabClient.post("/room", {
    userId1, userId2
  })
  console.log(`Received ${JSON.stringify(response.data)} from collab-service`)
  return response.data
}

const closeRoom = async (roomId: number) => {
  await collabClient.put(`/room/${roomId}/close`)
}

export {
  createRoom, closeRoom
}


