import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";
import songRouter from "./src/routes/songRoute.js";
import albumRouter from "./src/routes/albumRoute.js";
import userRouter from "./src/routes/userRoute.js";
import podcastRouter from "./src/routes/podcastRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect to external services (skips gracefully if not configured)
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API routes
app.use("/api/song", songRouter);
app.use("/api/album", albumRouter);
app.use("/api/user", userRouter);
app.use("/api/podcast", podcastRouter);

app.get("/", (req, res) => {
  res.send("Spotify Clone API is running ✅");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

export default app;
