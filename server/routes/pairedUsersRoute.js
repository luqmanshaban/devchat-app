import express from "express";
import { GetNonPairedUsers, GetPaires, GetPairesWithChats } from "../controllers/pairedUsersController.js";

const pairedUsersRoute = express.Router()

pairedUsersRoute.get('/api/v1/paired-users/:id', GetPaires)
pairedUsersRoute.get('/api/v1/paired-users/chats/:id', GetPairesWithChats)
pairedUsersRoute.get('/api/v1/paired-users/non-paired/:id', GetNonPairedUsers)

export default pairedUsersRoute