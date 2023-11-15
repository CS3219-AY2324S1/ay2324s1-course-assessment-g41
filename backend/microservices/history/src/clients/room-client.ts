import axios from "axios";
// TODO: implement service registry to retrieve collab service endpoint
const { COLLAB_SERVICE_ENDPOINT } = process.env

const roomClient = axios.create({
  baseURL: COLLAB_SERVICE_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  }
});

const getRoomsWithUser = async (userId: string) => {
  try {
    const response = await roomClient.get(`/room/${userId}`);
    const { rooms }: { rooms: string[] } = response.data;
    return rooms;
  } catch (err) {
    console.error(err)
    return []
  }
}

export {
  getRoomsWithUser
}


