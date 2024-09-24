import express from "express";
import http from 'http';
import { connectToDB } from "./config/db.js";
import router from "./routes/index.js";
import cors from 'cors';
import 'dotenv/config';
import { initSocket } from "./socket/socket.js";

const app = express();
const server = http.createServer(app);  // HTTP server

// Initialize Socket.IO
initSocket(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: [
    'http://localhost:5173', // add other endpoints if needed
] }));  // CORS middleware

app.use(router);  // Your routes

// Connect to the database
connectToDB();



const port = 4000;
server.listen(port, () => console.log(`SERVER RUNNING ON PORT: ${port}`));
