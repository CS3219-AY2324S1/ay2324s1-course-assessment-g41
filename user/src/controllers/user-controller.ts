import { Request, Response } from 'express';
import userService from '@/services/user-service'; 
import { UserDao } from '@/db_models/user-dao';

export async function getCurrentUser(req: Request, res: Response) {
    const userId = res.locals.userId;

    try {
        const user = await userService.read(userId);
        if (user) {
            res.status(200).json(user);
        } 

        res.status(404).send();
    } catch (error) {
        res.status(500).send();
    }
}

export async function getUserById(req: Request, res: Response) {
    const userId = req.params.id;

    try {
        const user = await userService.read(userId);
        if (user) {
            res.status(200).json(user);
        } 

        res.status(404).send();
    } catch (error) {
        res.status(500).send();
    }
}

export async function updateUser(req: Request, res: Response) {
    const userId = res.locals.userId;
    const updatedUser = req.body as Partial<UserDao>; // Partial to allow updating only specific fields
    try {
        await userService.update(userId, updatedUser);
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

export async function deleteUser(req: Request, res: Response) {
    const userId = res.locals.userId;

    try {
        await userService.delete(userId);
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

export async function getTopics(req: Request, res: Response) {
    const userId = res.locals.userId;

    try {
        const topics = await userService.readTopics(userId);
        res.status(200).json(topics);

    } catch (error) {
        res.status(500).send();
    }
}

export async function readCurrentTopics(req: Request, res: Response) {
    const userId = res.locals.userId;

    try {
        const topics = await userService.readTopics(userId);
        res.status(200).json(topics);
    } catch (error) {
        res.status(500).send();
    }
}

export async function updateTopics(req: Request, res: Response) {
    const userId = res.locals.userId;
    const topics = req.body as string[];

    try {
        await userService.updateTopics(userId, topics);
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

export async function addTopics(req: Request, res: Response) {
    const userId = res.locals.userId;
    const topics = req.body as string[];

    try {
        await userService.addTopics(userId, topics);
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

export async function deleteTopics(req: Request, res: Response) {
    const userId = res.locals.userId;
    const topicsParam = req.query.topics as string;

    if (topicsParam) {
        const topics = topicsParam.split(',');

        try {
            await userService.deleteTopics(userId, topics);
            res.status(200).send();
        } catch (error) {
            res.status(500).send();
        }
    }

    res.status(401).send();
}