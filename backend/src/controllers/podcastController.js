import { v2 as cloudinary } from "cloudinary";
import podcastModel from "../models/podcastModel.js";

const addPodcast = async (req, res) => {
  try {
    const { name, desc } = req.body;
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const duration = `${Math.floor(audioUpload.duration / 60)}:${String(
      Math.floor(audioUpload.duration % 60)
    ).padStart(2, "0")}`;

    const podcast = new podcastModel({
      name,
      desc,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration,
    });
    await podcast.save();

    res.json({ success: true, message: "Podcast Added" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const listPodcast = async (req, res) => {
  try {
    const allPodcasts = await podcastModel.find({});
    res.json({ success: true, podcasts: allPodcasts });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const removePodcast = async (req, res) => {
  try {
    await podcastModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Podcast Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { addPodcast, listPodcast, removePodcast };
