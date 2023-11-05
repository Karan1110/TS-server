import users from "../routes/users"
import auth from "../routes/auth"
import express from "express"
import cors from "cors"

export default (app: any) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors())
  app.use("/users", users)
  app.use("/login", auth)
}
