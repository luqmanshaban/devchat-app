import express from "express";
import { GetChatByUserIds, GetChats, GetChatsByUsers } from "../controllers/ChatController.js";

const chatRoute = express.Router()

chatRoute.get('/api/v1/chats/:chatId', GetChats)
chatRoute.post('/api/v1/chats', GetChatsByUsers)
chatRoute.post('/api/v1/chats/id', GetChatByUserIds)
chatRoute.delete('/api/v1/chats/:chatId/:messageId', GetChats)

export default chatRoute
