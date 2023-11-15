import { Request, Response } from 'express';
import { User } from '@/models/user'
import resourceService from '@/services/resource-service'; 
import { StatusCodes } from 'http-status-codes';
import { handleServiceError } from '@/controllers/error-handler';


export async function getTopics(req: Request, res: Response) {
    try {
        const topics = await resourceService.getAllTopics()
        res.status(StatusCodes.OK).json(topics);
    } catch(error) {
        handleServiceError(error, res)
        res.send();
    }
}

export async function getLanguages(req: Request, res: Response) {
    try {
        const languages = await resourceService.getAllLanguages()
        res.status(StatusCodes.OK).json(languages);

    } catch(error) {
        handleServiceError(error, res)
        res.send();

    }
}