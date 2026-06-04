import mongoose from "mongoose";

const podcastSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: true },
    file: { type: String, required: true },
    duration: { type: String, required: true },
  },
  { timestamps: true }
);

const podcastModel =
  mongoose.models.podcast || mongoose.model("podcast", podcastSchema);

export default podcastModel;
