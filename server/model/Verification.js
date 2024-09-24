import mongoose from "mongoose";

const { Schema } = mongoose;

const VerificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  linkedinVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Verification", VerificationSchema);
