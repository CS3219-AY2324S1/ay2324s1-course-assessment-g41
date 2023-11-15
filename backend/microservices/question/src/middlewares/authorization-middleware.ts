import { Request, Response } from 'express';

export function authQuestion(req: Request, res: Response, next: Function) {
  if (process.env.SKIP_AUTH == 'TRUE') {
    next();
    return
  }

  const roles = res.locals.roles

  if (roles.includes("ADMIN")) {
    next()
  } else {
    res.status(403).send()
  }
}
