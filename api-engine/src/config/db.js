import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb Connected");
  } catch (error) {
    console.log("MongoDb Connection Eroor ", error);
    process.exit(1);
  }
};
export default connectDB;
