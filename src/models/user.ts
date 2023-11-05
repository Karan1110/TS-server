import mongoose, { Document, Schema } from "mongoose"
import jwt, { Secret } from "jsonwebtoken"

// Define the User schema
export interface IUser extends Document {
  name: string
  email: string
  password: string
  profile: any
  generateAuthToken: () => any
  isAdmin: boolean
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    type: Buffer,
    required: true,
  },
  isAdmin: Boolean,
})

// Add a method to generate an authentication token
userSchema.methods.generateAuthToken = function (): string {
  // Specify the return type as string
  const token: string = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    process.env.jwtPrivateKey as Secret // Cast jwtPrivateKey as Secret
  )
  return token
}

export const UserModel = mongoose.model<IUser>("User", userSchema)
