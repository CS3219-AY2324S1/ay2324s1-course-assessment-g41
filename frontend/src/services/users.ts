import authorizedAxios from "src/utils/axios/authorizedAxios";
import { BE_API } from "src/utils/api";
import { UserRequest, UserResponse } from "src/@types/user";

export const getUser = () => authorizedAxios.get<UserResponse>(BE_API.users.root);

export const updateUser = (user: UserRequest) =>
  authorizedAxios.patch<UserResponse>(BE_API.users.root, user);

export const deleteUser = () => authorizedAxios.delete(BE_API.users.root);
