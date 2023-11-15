import { BE_API } from "@/utils/api";
import authorizedAxios from "@/utils/axios/authorizedAxios";

const closeRoom = async (roomName: string) => {
  await authorizedAxios.put(`${BE_API.collaboration.room}/${roomName}/status/close`);
};

const openRoom = async (roomName: string) => {
  await authorizedAxios.put(`${BE_API.collaboration.room}/${roomName}/status/open`);
};

export { closeRoom, openRoom };
