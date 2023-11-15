function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_MAIN = "";
const ROOTS_AUTH = "";
const ROOTS_USER = "/user";

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  general: {
    login: path(ROOTS_AUTH, "/sign-in"),
  },
};

export const PATH_MAIN = {
  root: ROOTS_MAIN,
  general: {
    dashboard: path(ROOTS_MAIN, "/dashboard"),
    questions: path(ROOTS_MAIN, "/coding-questions"),
    profile: path(ROOTS_MAIN, "/profile"),
  },
};

export const PATH_PAGE = {
  page404: "/404",
};

export const PATH_USER = {
  root: ROOTS_USER,
  general: {
    user: (userId: string) => path(ROOTS_USER, `/${userId}`),
  },
};
