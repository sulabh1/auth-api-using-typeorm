import { NextFunction, Request, RequestHandler, Response } from "express";
import { getRepository } from "typeorm";

import AppError from "../providers/AppError";
import { User } from "../entity/User";
import { validate } from "class-validator";
import signToken from "../providers/jwtConfig";


export const register: RequestHandler = async (req, res, next) => {
    try {
        let { name, email, password } = req.body
        let user = new User()
        user.name = name
        user.email = email
        user.password = password

        const error = await validate(user)

        if (error[0].property === "email" && error.length > 0) {
            const message = error[0].constraints.contains

            return next(new AppError(message, 401))
        }
        if (error[0].property === "password" && error.length > 0 && error[0].value.length < 8) {
            const message = error[0].constraints.min
            return next(new AppError(message, 401))
        }
        const userRepo = getRepository(User)
        const token = signToken({ id: user.id, email: user.email });
        await userRepo.save(user)

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }).status(201).json({
            status: "success",
            token,
            data: user

        })
    } catch (err) {
        next(new AppError(err.message, 400))
    }
}

//export const login = 
