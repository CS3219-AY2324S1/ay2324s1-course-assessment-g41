import { Topic } from "./topic";

export enum Role {
  ADMIN = "ADMIN",
  MAINTAINER = "MAINTAINER",
  USER = "USER",
}

export interface User {
  id: string;
  email: string;
  image: string | null;
  name: string | null;
  preferred_language: string | null;
  // karwi: change to enum
  preferred_difficulty: number | null;
  preferred_topics: Topic[] | null;
  roles: Role[] | null;
}

export type UserRequest = Partial<User>;
export type UserResponse = User;

export type AvatarData = File & { preview: string };

export interface AvatarFormValues {
  avatar?: AvatarData;
}

export type EditProfileFormValues = UserRequest & AvatarFormValues;
