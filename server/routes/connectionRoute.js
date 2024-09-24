import express from "express";
import { AcceptRequest, DeclineRequest, GetRequests, IgnoreRequest, SendRequest } from "../controllers/connectionController.js";

const connectionRouter = express.Router()

connectionRouter.post('/api/v1/connection-requests', SendRequest)
connectionRouter.post('/api/v1/connection-requests/accept/:requestId', AcceptRequest)
connectionRouter.post('/api/v1/connection-requests/ignore/:requestId', IgnoreRequest)
connectionRouter.post('/api/v1/connection-requests/decline/:requestId', DeclineRequest)
connectionRouter.get('/api/v1/connection-requests/:id', GetRequests)

export default connectionRouter