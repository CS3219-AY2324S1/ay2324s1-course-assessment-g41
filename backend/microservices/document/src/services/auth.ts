import { verifyAccessToken } from "../../../../shared/lib/verifyAccessToken";

const verifyUserExists = (token: string) => {
  if (!process.env.JWT_SECRET) {
    // TODO: update error message
    throw new Error("Missing JWT_SECRET");
  }
  const { userId } = verifyAccessToken(token, process.env.JWT_SECRET)
  return userId
}

export {
  verifyUserExists
}