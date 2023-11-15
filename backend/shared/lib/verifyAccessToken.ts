import jwt from "jsonwebtoken";

interface AccessPayload extends jwt.JwtPayload {
  userId: string;
  roles: string[]
};

export const verifyAccessToken = (token: string, jwtSecret: string) => {
  // error will be thrown if jwt fails
  const decoded = jwt.verify(token, jwtSecret) as AccessPayload
  return decoded;
}