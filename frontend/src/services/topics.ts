import authorizedAxios from "src/utils/axios/authorizedAxios";
import { BE_API } from "src/utils/api";
import { TopicRequest, TopicsResponse } from "@/@types/topic";

export const getTopics = () => authorizedAxios.get<TopicsResponse>(BE_API.topics);

export const updateTopics = (topics: string[]) => authorizedAxios.post(BE_API.users.topics, topics);
