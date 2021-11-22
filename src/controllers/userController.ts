import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

export const getAllUser: RequestHandler = async (req, res, next) => {
    try {
        const userRepo = getRepository(User)
        const user = await userRepo.findAndCount()
        res.status(201).json({
            status: "success",
            data: {
                user
            }
        })

    } catch (error) {
        next(error)
    }
}