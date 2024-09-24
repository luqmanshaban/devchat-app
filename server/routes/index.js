import express from "express";
import authRoute from "./authRoute.js";
import connectionRouter from "./connectionRoute.js";
import pairedUsersRoute from "./pairedUsersRoute.js";
import chatRoute from "./ChatRoute.js";
import profilePicRouter from "./profilePicRoute.js";

const router = express.Router()

router.get('/api/v1', async function(req, res) {
    res.json({ message: "Hello from Datify"})
})
router.use(authRoute)
router.use(connectionRouter)
router.use(pairedUsersRoute)
router.use(chatRoute)
router.use(profilePicRouter)

export default router 