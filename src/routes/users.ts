import express, { Request, Response } from "express"
import { UserModel } from "../models/user"
import upload from "../utils/upload"
import * as bcrypt from "bcrypt"

const router = express.Router()

router.post(
  "/",
  [upload.single("profile")],
  async (req: Request, res: Response) => {
    try {
      let user = await UserModel.findOne({ email: req.body.email })
      if (user) {
        console.log(user)
        return res.status(400).send("UserModel already registered.")
      }
      const profile: any = req?.file
      // use .env variable
      const isAdmin = req.body.password == "123abc" ? true : false

      user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: isAdmin,
        profile: profile,
      })

      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)

      const token = user.generateAuthToken()
      await user.save()
      console.log(user)
      res.header("x-auth-token", token).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token,
      })
    } catch (error) {
      console.error("Error creating user:", error)
      res.status(500).json({ error: "Unable to create user" })
    }
  }
)

// Get all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find()

    res.status(200).json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ error: "Unable to fetch users" })
  }
})

// Get a single user by ID
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).json({ error: "UserModel not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    res.status(500).json({ error: "Unable to fetch user" })
  }
})

// Update a user by ID
router.put("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId
    const { name, email, password } = req.body

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        password,
      },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ error: "UserModel not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error("Error updating user by ID:", error)
    res.status(500).json({ error: "Unable to update user" })
  }
})

// Delete a user by ID
router.delete("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId

    const user = await UserModel.findByIdAndRemove(userId)

    if (!user) {
      return res.status(404).json({ error: "UserModel not found" })
    }

    res.status(204).send()
  } catch (error) {
    console.error("Error deleting user by ID:", error)
    res.status(500).json({ error: "Unable to delete user" })
  }
})

export default router
