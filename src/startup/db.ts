import mongoose from "mongoose"

const mongoURI =
  "mongodb+srv://karan5ipsvig:password123abc@cluster0.yar2cct.mongodb.net/mytsdb" // Replace with your MongoDB connection URI

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI)
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
  }
}

export default connectToDatabase
