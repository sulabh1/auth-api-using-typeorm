import { NextFunction, Request, RequestHandler, Response } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcrypt"

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
        if (!email || email === "" || !password || password === "") {
            return next(new AppError("Invalid credential", 404))
        }

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

export const login: RequestHandler = async (req, res, next) => {
    try {
        let { email, password } = req.body
        if (!email || email === "" || !password || password === "") {
            return next(new AppError("Invalid credential", 404))
        }
        const userRepo = getRepository(User)
        const user = await userRepo.findOne({ where: { email } })
        //console.log(user)
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!user || !checkPassword) {
            return next(new AppError("Invalid email or password", 403))
        }

        const token = signToken({ id: user.id, email: user.email });


        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }).status(201).json({
            status: "success",
            token,


        })


    } catch (err) {
        next(new AppError(err.message, 403))
    }
} 
