import { RequestHandler } from "express";
import Jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import AppError from "../providers/AppError";

export const protect: RequestHandler = async (req, res, next) => {
    let token: any
    //req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    const userRepo = getRepository(User)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    //console.log(token)
    // if (!token) {
    //     return next(new AppError("You are not logged in logged in. Please log in to get access", 401))
    // }
    const verifiedToken = Jwt.verify(token, process.env.JWT_SIGNATURE)
    //console.log()
    const email = verifiedToken["payload"].email
    const currentUser = await userRepo.findOne({ where: { email } })
    if (!currentUser) {
        return next(new AppError("This user cannot access this route.Please login again", 401))
    }

    // password has changed or not
    next()
}