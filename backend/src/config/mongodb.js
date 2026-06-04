import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn(
      "⚠️  MONGODB_URI not set. Skipping DB connection (data endpoints will fail until configured)."
    );
    return;
  }

  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });

  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/spotify`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

export default connectDB;
