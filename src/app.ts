import express from "express"
import morgan from "morgan"


import AppError from "./providers/AppError"
import globalErr from "./providers/errorProvider"
import userRoutes from "./routes/userRoutes"

const app = express()

//const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
if (process.env.NODE_ENV !== "production") { app.use(morgan("dev")) }
//if (process.env.NODE_ENV !== "production") { app.use() }

app.use(express.json())
app.use("/api/v1/users", userRoutes)

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find this url ${req.originalUrl} on this server`, 404))
})

app.use(globalErr)

export default app