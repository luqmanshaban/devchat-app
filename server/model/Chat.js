import mongoose from "mongoose";

const { Schema } = mongoose;

// Message Schema (as a subdocument schema)
const MessageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { _id: true }); // _id: true ensures an automatic _id field is created for each message

// Chat Schema
const ChatSchema = new Schema({
  participants: [
    { type: Schema.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [MessageSchema], // Embed the MessageSchema as an array
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
