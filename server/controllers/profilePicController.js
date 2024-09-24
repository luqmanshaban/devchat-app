import ProfilePicture from "../model/ProfilePictures.js";
import multer from "multer";
import { Buffer } from "buffer";

// Configure multer (optional, if not already set up)
const storage = multer.memoryStorage(); // Store file in memory as buffer
const upload = multer({ storage: storage }).single("profilePic"); // Expect a single file with the name 'profilePic'

export async function AddProfilePic(req, res) {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({ error: err.message });
    }

    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Validate file existence
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file received" });
    }

    // Optional: Validate file size (example: limit to 1MB)
    if (file.size > 1000000) {
      return res.status(413).json({ error: "File size exceeds limit" });
    }

    // Convert file buffer to binary data
    const buffer = Buffer.from(file.buffer);

    try {
      // Check if a profile picture already exists for the user
      let existingPic = await ProfilePicture.findOne({ userId: userId });

      if (existingPic) {
        // If it exists, update the existing profile picture
        existingPic.image = buffer;
        await existingPic.save();
        res.status(200).json({ success: true, data: existingPic });
      } else {
        // If it doesn't exist, create a new one
        const newPic = await ProfilePicture.create({
          userId: userId,
          image: buffer,
        });
        res.status(201).json({ success: true, data: newPic });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
}


export async function GetProfilePic(req, res) {
    const {userId} = req.params
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
    try {
        const profilePicture = await ProfilePicture.findOne({ userId: userId})
        res.status(200).json({ profilePicture: profilePicture })
    } catch (error) {
        console.error(error);
        
        res.status(500).json({ error: error.message });
    }
}
