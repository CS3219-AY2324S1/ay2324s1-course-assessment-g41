import { Request, Response } from 'express';
import authService from '@/services/auth-service';
import userService from '@/services/user-service'; 
import { UserDao } from '@/db_models/user-dao';
import { StatusCodes } from 'http-status-codes';
import * as ServiceError from '@/services/service-errors';
import { handleServiceError } from '@/controllers/error-handler';
import { cookieConfig } from '@/constants/cookie-config';
import { accessTokenKey, refreshTokenKey } from '@/constants/token';

export async function getCurrentUser(req: Request, res: Response) {
    const userId = res.locals.userId;

    try {
        const user = await userService.read(userId);
        if (user) {
            res.status(StatusCodes.OK).json(user);
        } 

        res.status(StatusCodes.NOT_FOUND).send();
    } catch (error) {
        handleServiceError(error, res)
        res.send();
    }
}

export async function getUserById(req: Request, res: Response) {
    const userId = req.params.id;

    try {
        const user = await userService.read(userId);
        if (user) {
            res.status(StatusCodes.OK).json(user);
        } 

        res.status(StatusCodes.NOT_FOUND).send();
    } catch (error) {
        handleServiceError(error, res)
        res.send();
    }
}

export async function updateUser(req: Request, res: Response) {
    const userId = res.locals.userId;
    const updatedUser = req.body as Partial<UserDao>; // Partial to allow updating only specific fields
    try {
        let updatedUserFromDb = await userService.update(userId, updatedUser);
        if (!updatedUserFromDb) {
            res.status(StatusCodes.OK).send();
            return
        }
        const { id, ...publicUpdatedUserFromDb } = updatedUserFromDb;
        res.status(StatusCodes.OK).json({ ...publicUpdatedUserFromDb });
    } catch (error) {
        handleServiceError(error, res)
        res.send();
    }
}

export async function deleteUser(req: Request, res: Response) {
    const userId = res.locals.userId;
    const token = req.cookies[refreshTokenKey];

    try {
        await userService.delete(userId);
        const id = authService.verifyRefreshToken(token).tokenId;
        await authService.deleteRefreshToken(id);
        res.clearCookie(accessTokenKey, cookieConfig);
        res.clearCookie(refreshTokenKey, cookieConfig);
          
        res.status(StatusCodes.OK).send();
    } catch (error) {
        handleServiceError(error, res)
        res.send();
    }
}

export async function getTopics(req: Request, res: Response) {
    const userId = res.locals.userId;

    try {
        const topics = await userService.readTopics(userId);
        res.status(StatusCodes.OK).json(topics);

    } catch (error) {
        handleServiceError(error, res)
        res.send();
    }
}

export async function readCurrentTopics(req: Request, res: Response) {
    const userId = res.locals.userId;

    try {
        const topics = await userService.readTopics(userId);
        res.status(StatusCodes.OK).json(topics);
    } catch (error) {
        handleServiceError(error, res)
        res.send();
    }
}

export async function updateTopics(req: Request, res: Response) {
    const userId = res.locals.userId;
    const topics = req.body as string[];

    try {
        await userService.updateTopics(userId, topics);
        res.status(StatusCodes.OK).send();
    } catch (error) {
        handleServiceError(error, res)
        res.send();
    }
}

export async function addTopics(req: Request, res: Response) {
    const userId = res.locals.userId;
    const topics = req.body as string[];

    try {
        await userService.addTopics(userId, topics);
        res.status(StatusCodes.CREATED).send();
    } catch (error) {
        handleServiceError(error, res)
        res.send();
    }
}

export async function deleteTopics(req: Request, res: Response) {
    const userId = res.locals.userId;
    const topicsParam = req.query.topics as string;

    if (topicsParam) {
        const topics = topicsParam.split(',');

        try {
            await userService.deleteTopics(userId, topics);
            res.status(StatusCodes.OK).send();
        } catch (error) {
            handleServiceError(error, res)
            res.send();
        }
    }

    res.status(StatusCodes.BAD_REQUEST).json({ message: "Empty 'topics' query param"});
}