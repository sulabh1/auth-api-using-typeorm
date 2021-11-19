import "reflect-metadata";
import "es6-shim"
import { createConnection } from "typeorm";
import dotenv from "dotenv"

dotenv.config({ path: "../.env" })
import app from "./app"


//console.log(process.env)
const port = 4000 || process.env.PORT
createConnection().then(async connection => {
    app.listen(port, () => {
        console.log(`listening to the port ${port}`)
    })
    console.log("database connected")
}).catch(error => console.log(error));
