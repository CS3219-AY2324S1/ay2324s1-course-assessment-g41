import { CacheKey } from "src/config";
import { getUser } from "src/services/users";
import useSafeRequest from "../services/useSafeRequest";
import { User } from "src/@types/user";

const defaultUser: User = {
  id: "",
  email: "",
  image: "",
  name: null,
  preferred_language: null,
  preferred_difficulty: null,
  preferred_topics: [],
  roles: [],
};

/**
 * Return the current user identity
 *
 * The return value updates according to the call state:
 *
 * - mount: { loading: true, loaded: false }
 * - success: { identity: Identity, loading: false, loaded: true }
 * - error: { error: Error, loading: false, loaded: true }
 *
 * @returns The current user identity. Destructure as { identity, error, loading, loaded }.
 */
const useGetIdentity = () => {
  const { data, loading, error } = useSafeRequest(getUser, {
    cacheKey: CacheKey.User,
  });
  return {
    identity: data?.data ?? defaultUser,
    loading,
    loaded: !loading,
    error,
  };
};

export default useGetIdentity;
