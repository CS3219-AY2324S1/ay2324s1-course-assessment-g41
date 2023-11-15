import { Request, Response } from 'express';
import authService from '@/services/auth-service';


if (!process.env.ACCESS_COOKIE_KEY) {
  console.log("Missing ACCESS_COOKIE_KEY")
  process.exit()
}
const accessTokenKey = process.env.ACCESS_COOKIE_KEY

export function authJWT(req: Request, res: Response, next: Function) {
  const token = req.cookies[accessTokenKey]

  if (token) {
    try {
      res.locals.userId = authService.verifyAccessToken(token).userId;

      next();
    } catch(err) {
      res.status(401).send()
    }
  } else {
      res.status(401).send()
  }
}
