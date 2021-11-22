import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcrypt"

import AppError from "../providers/AppError";
import { User } from "../entity/User";
import { validate } from "class-validator";
import signToken from "../providers/jwtConfig";
import sendMail from "../providers/mail";
import crypto from "crypto"


export const register: RequestHandler = async (req, res, next) => {
    try {
        let { name, email, password } = req.body
        let user = new User()
        user.name = name
        user.email = email
        user.password = await bcrypt.hash(password, 12)
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

export const forgetPassword: RequestHandler = async (req, res, next) => {

    const { email } = req.body
    const userRepo = getRepository(User)
    const user = await userRepo.findOne({ where: { email } })
    if (!user) {
        return next(new AppError("no user found with that email", 404))
    }
    //crypto package configuration
    const resetToken = crypto.randomBytes(32)
    const hexToken = resetToken.toString("hex")
    //console.log(hexToken)
    user.passwordResetToken = crypto.createHash("sha256").update(hexToken).digest("hex")

    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000)
    await userRepo.save(user)

    // await userRepo.save(user)

    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetpassword/${hexToken}`
    const message = `<h1>Forgot your password? <a href="${resetURL}">Click Me</a> Other wise go to this route ${resetURL}</h1>`

    try {
        await sendMail({
            email: email,
            subject: "You password reset token (valid of 10 min)",
            message,
            text: message
        })
        res.status(200).json({
            status: "success",
            message: "mail sent"
        })
    } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        next(new AppError("There was error sending mail", 500))
    }



}

export const resetPassword: RequestHandler = async (req, res, next) => {
    try {
        const userRepo = getRepository(User)
        //console.log(req.params.token)
        const passwordResetToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
        // console.log(hashedToken)
        const user = await userRepo.findOne({ where: { passwordResetToken } })
        // console.log(user)
        user.password = await bcrypt.hash(req.body.password, 12)
        user.passwordChangeAt = new Date(Date.now())

        userRepo.save(user)

        const token = signToken({ id: user.id, email: user.email });
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }).status(201).json({
            status: "password success changed",
            token,


        })
    } catch (err) {
        next(err)
    }
}