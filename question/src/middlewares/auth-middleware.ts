import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

if (!process.env.ACCESS_COOKIE_KEY) {
  console.log("Missing ACCESS_COOKIE_KEY");
  process.exit();
}
const accessTokenKey = process.env.ACCESS_COOKIE_KEY;

interface AccessPayload extends jwt.JwtPayload {
  userId: string
}

const secret = process.env.JWT_SECRET
if (!secret) {
    console.log("Missing JWT_SECRET")
    process.exit()
}

export function authJWT(req: Request, res: Response, next: Function) {
  if (process.env.SKIP_AUTH == 'TRUE') {
    next();
    return
  }
  
  const token = req.cookies[accessTokenKey]

  if (token) {
    try {
      const decoded = jwt.verify(token, secret!) as AccessPayload; 

      res.locals.userId = decoded.userId;

      next();
    } catch(err) {
      res.status(401).send()
    }
  } else {
      res.status(401).send()
  }
}
