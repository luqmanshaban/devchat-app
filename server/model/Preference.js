import mongoose from "mongoose";

const { Schema } = mongoose;

const PreferencesSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    financialStability: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      required: true,
    },
    lifestyle: {
      type: String,
      enum: ['Luxury', 'Moderate', 'Simple'],
      required: true,
    },
    familyBackground: {
      type: String,
      enum: ['Traditional', 'Modern', 'Mixed'],
      required: true,
    },
  });
  
  export default mongoose.model('Preferences', PreferencesSchema);
  