import express from "express";
import { AddProfilePic, GetProfilePic } from "../controllers/profilePicController.js";

const profilePicRouter = express.Router();

// Define the POST route for uploading a profile picture
profilePicRouter.post('/api/v1/profile-pic/:userId', AddProfilePic);
profilePicRouter.get('/api/v1/profile-pic/:userId', GetProfilePic);

export default profilePicRouter;
