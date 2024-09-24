import mongoose from "mongoose";
import crypto from "crypto";

const { Schema } = mongoose;

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  lastname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: /.+\@.+\..+/,
    unique: true,
  },
  title: {
    type: String,
    default: 'Web Developer'
  },
  about: {
    type: String,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'ProfilePicture',
  },
  plan: {
    type: String,
    required: true,
    default: "basic",
  },
  role: {
    type: String,
    default: "user",
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    // maxlength: 20,
  },
  status: {
    type: String,
    default: 'offline'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verified: {
    type: Boolean,
    default: false,
  },
  verificationHash: {
    type: String,
    default: "",
  },
  loginVereficationCode: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.generateResetPasswordToken = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
};

UserSchema.methods.generateVerificationHash = function () {
  this.verificationHash = crypto.randomBytes(64).toString("hex");
};

const User = mongoose.model("User", UserSchema);

export default User;
