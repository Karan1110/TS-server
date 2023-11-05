import * as bcrypt from "bcrypt"
import { UserModel } from "../models/user"
import express, { Response, Request } from "express"
const router = express.Router()

router.post("/", async (req: Request, res: Response) => {
  let user = await UserModel.findOne({ email: req.body?.email })
  console.log(user)
  if (!user) return res?.status(400).send("Invalid email or password.")

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res?.status(400).send("Invalid email or password.")

  const token = user.generateAuthToken()
  res.send({ token: token })
})

export default router
