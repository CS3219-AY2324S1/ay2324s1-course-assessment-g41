import { Request, Response } from 'express';
import { verifyAccessToken } from '../lib/verifyAccessToken';

if (!process.env.ACCESS_COOKIE_KEY) {
  console.log("Missing ACCESS_COOKIE_KEY")
  process.exit()
}

if (!process.env.JWT_SECRET) {
  console.log("Missing JWT_SECRET")
  process.exit()
}

const accessTokenKey = process.env.ACCESS_COOKIE_KEY
const JWT_SECRET = process.env.JWT_SECRET

export function authJWT(req: Request, res: Response, next: Function) {
  const token = req.cookies[accessTokenKey]

  if (token) {
    try {
      const verifiedToken = verifyAccessToken(token, JWT_SECRET)
      res.locals.userId = verifiedToken.userId;
      res.locals.roles = verifiedToken.roles;
      next();
    } catch(err) {
      res.status(401).send()
    }
  } else {
    res.status(401).send()
  }
}
