import { Server } from "socket.io";
import PairedUsers from "../model/PairedUsers.js";
import Chat from "../model/Chat.js";
import User from "../model/User.js";

export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    // When a user goes online
    socket.on('user-online', async (userId) => {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.status = 'online';
          await user.save();
          // console.log(`User ${userId} is now online`);

          // Store userId in the socket object for use during disconnection
          socket.userId = userId;

          // Broadcast to everyone except the sender
          socket.broadcast.emit('user-status-updated', { userId, status: 'online' });
        }
      } catch (error) {
        console.error('Error setting user status to online:', error);
      }
    });

    // When a user explicitly goes offline (called manually by the client)
    socket.on('user-offline', async (userId) => {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.status = 'offline';
          await user.save();
          // console.log(`User ${userId} is now offline`);

          // Notify all clients about the user going offline
          io.emit('user-status-updated', { userId, status: 'offline' });
        }
      } catch (error) {
        console.error('Error setting user status to offline:', error);
      }
    });

    // Join Room Logic
    socket.on("joinRoom", async ({ userId1, userId2 }) => {
      try {
        const pairedUsers = await PairedUsers.findOne({
          users: { $all: [userId1, userId2] },
        });

        if (!pairedUsers) {
          return socket.emit("error", "Room not found");
        }

        const roomName = pairedUsers.roomId;
        socket.join(roomName);
        console.log(`${userId1} joined room ${roomName}`);
        socket.emit("roomJoined", roomName); // Notify the client of the room they've joined
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", "Could not join room");
      }
    });

    // Leave Room Logic
    socket.on("leaveRoom", ({ roomName, userId }) => {
      socket.leave(roomName);
      console.log(`${userId} left room ${roomName}`);
    });

    // Message Sending Logic
    socket.on("message", async ({ roomName, message, senderId, user2 }) => {
      try {
        const chat = await Chat.findOne({
          participants: { $all: [senderId, user2] },
        });
        

        const newMessage = {
          senderId,
          content: message.content,
          createdAt: new Date(),
        };

        chat.messages.push(newMessage);
        await chat.save();

        io.to(roomName).emit("message", newMessage, socket.id); // Emit message to the room
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", "Could not send message");
      }
    });

    // Typing Indicator Logic
    socket.on("typing", ({ roomName, username }) => {
      socket.to(roomName).emit("typing", username);
    });

    socket.on("stopTyping", ({ roomName, username }) => {
      socket.to(roomName).emit("stopTyping", username);
    });

    // Handle user disconnection (automatic, when a user loses connection)
    socket.on("disconnect", async () => {
      const userId = socket.userId; // Get the userId from the socket object
      if (userId) {
        try {
          const user = await User.findById(userId);
          if (user) {
            user.status = 'offline';
            await user.save();
            console.log(`User ${user.id} disconnected and is now offline`);

            // Notify all clients about the user going offline
            io.emit('user-status-updated', { userId, status: 'offline' });
          }
        } catch (error) {
          console.error('Error setting user status to offline on disconnect:', error);
        }
      }
      console.log(socket.id, "disconnected");
    });
  });
}
