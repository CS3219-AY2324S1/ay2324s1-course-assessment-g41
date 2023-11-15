// BE_API contains api endpoints we use to query our host backend
const ROOTS_USER = "/user";
const ROOTS_QUESTION = "/question";
const ROOTS_COLLAB = "/collaboration";
const ROOTS_MATCHING = "/matching";
const ROOTS_DOCUMENT = "/document";
const ROOTS_HISTORY = "/history";
const ROOTS_VIDEO = "/videostreaming";

// karwi: refactor groups. each shd be microservice
export const BE_API = {
  auth: {
    checkAuth: "/auth/checkAuth",
    google: "/auth/google",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  users: {
    root: "/user",
    topics: "/user/topics",
    user: (id: string) => `/user/${id}`,
    // karwi: remove this
    uploadImageUrl: "/user/uploadImageUrl",
  },
  questions: {
    root: "/question",
  },
  matching: {
    request: `${ROOTS_MATCHING}/request`,
    pair: `${ROOTS_MATCHING}/pair`,
  },
  collaboration: {
    room: `${ROOTS_COLLAB}/room`,
  },
  document: "/document",
  history: "/history",
  topics: "/topics",
  languages: "/languages",
  video: {
    root: `${ROOTS_VIDEO}`,
    signaling: `${ROOTS_VIDEO}/signaling`,
  },
};
