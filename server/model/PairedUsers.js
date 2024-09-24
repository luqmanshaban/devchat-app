import mongoose from "mongoose";
import crypto from "crypto";

const { Schema } = mongoose;

// Utility function to generate a unique room ID
const generateRoomId = () => {
  return crypto.randomBytes(8).toString('hex'); // Generates a 16-character hex string
};

// PairedUsers Schema
const PairedUsersSchema = new Schema({
  users: [
    { type: Schema.Types.ObjectId, ref: "User", required: true },
  ],
  roomId: {
    type: String,
    unique: true,
    default: generateRoomId, // Automatically generates a room ID
    required: true,
  },
  chats: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    // required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index to ensure a unique pair of users in the `PairedUsers` model
// PairedUsersSchema.index({ users: 1 }, { unique: true });

const PairedUsers = mongoose.model("PairedUsers", PairedUsersSchema);

export default PairedUsers;
