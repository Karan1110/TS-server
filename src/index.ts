import express from "express"
import db from "./startup/db"
import env from "./startup/env"
import routes from "./startup/routes"

const app: any = express()
const port: number = 8080 // Specify the port you want to listen on
db()
env()
routes(app)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
