import { RequestHandler } from "express";
import { Brackets, getRepository, LessThan, LessThanOrEqual } from "typeorm";
import { Product } from "../entity/Product";
import AppError from "../providers/AppError";

export const getAllProduct: RequestHandler = async (req, res, next) => {
    try {
        const productRepo = getRepository(Product)
        const builder = productRepo.createQueryBuilder("products")

        //filter
        if (req.query.title) {
            builder.where("products.title LIKE :title", { title: `%${req.query.title}%` })
        }

        //sort
        const sort: any = req.query.sort
        if (sort) {
            builder.orderBy("products.price", sort.toUpperCase())
        }

        //pagination
        const page: number = parseInt(req.query.page as string) || 1
        const limit = 10
        const total = await builder.getCount()
        builder.offset((page - 1) * limit).limit(limit)
        const product = await builder.getMany()
        // res.send(product)
        res.status(201).json({
            status: "success",
            data: {
                product,
                page,
                total,
                lastPage: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        next(new AppError(error, 404))
    }
}

