import { NextFunction, Request, RequestHandler, Response } from "express";

interface Errors extends Error {
    statusCode: number,
    message: string,
    status?: string,
    stack?: string
}

const globalErr = (err: Errors, req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === "development") {
        console.log(err)
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err
        })
    } else if (process.env.NODE_ENV === "production") {
        //doesnot leak the error in production
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
}
export default globalErr