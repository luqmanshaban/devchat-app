import mongoose from "mongoose";

const { Schema } = mongoose;
const LinkedInProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  personalInfo: {
    type: String,
    maxlength: 500,
  },
  workExperience: [
    {
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      startDate: Date,
      endDate: Date,
    },
  ],
});

export default mongoose.model("LinkedInProfile", LinkedInProfileSchema);
