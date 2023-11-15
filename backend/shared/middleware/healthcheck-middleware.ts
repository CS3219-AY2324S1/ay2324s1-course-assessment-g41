import { Request, Response } from 'express';

export function healthCheck(req: Request, res: Response) {
    console.log("Hit health check")
    res.status(200).send()
}