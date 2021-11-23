import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

export const getAllUser: RequestHandler = async (req, res, next) => {
    try {
        //filter
        const userRepo = getRepository(User)
        const queryObj = { ...req.query }
        const excludedField = ["page", "sort", "limit", "field"]
        excludedField.forEach(el => delete queryObj[el])

        console.log(req.query, queryObj)

        const query = userRepo.findAndCount({ where: { queryObj } })
        const user = await query
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