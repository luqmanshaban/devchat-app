import mongoose from "mongoose";

const { Schema } = mongoose;

// ConnectionRequest Schema
const ConnectionRequestSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined", "ignored"],
    default: "pending",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index to ensure a unique connection request per pair of users
ConnectionRequestSchema.index({ senderId: 1, recipientId: 1 }, { unique: true });

const ConnectionRequest = mongoose.model("ConnectionRequest", ConnectionRequestSchema);

export default ConnectionRequest;
