import "reflect-metadata";
import "es6-shim"
import { createConnection } from "typeorm";
import dotenv from "dotenv"

dotenv.config({ path: "../.env" })
import { logger } from "./providers/logger";
import app from "./app"


//console.log(process.env)
const port = 4000 || process.env.PORT
createConnection().then(async connection => {
    app.listen(port, () => {
        logger.log("info", `listening to the port http://${"localhost"}:${port}`)
    })
    logger.log("info", "database connected")
}).catch(error => console.log(error));
