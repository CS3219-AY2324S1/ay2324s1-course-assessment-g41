import { CacheKey } from "@/config";
import { getLanguages } from "@/services/languages";
import { useRequest } from "ahooks";

export function useLanguages() {
  const {
    data: languages,
    error,
    loading,
  } = useRequest(getLanguages, {
    cacheKey: CacheKey.Language,
  });

  return {
    languages,
    loadingLanguages: loading,
    errorLanguages: error,
  };
}
