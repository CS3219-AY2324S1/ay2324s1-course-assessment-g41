import { CacheKey } from "@/config";
import { getTopics } from "@/services/topics";
import { useRequest } from "ahooks";

export function useTopics() {
  const {
    data: topics,
    error,
    loading,
  } = useRequest(getTopics, {
    cacheKey: CacheKey.Topic,
  });

  return {
    topics,
    loadingTopics: loading,
    errorTopics: error,
  };
}
