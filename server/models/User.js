import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, defaul: "" },
    bio: { type: String },
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.models.user || mongoose.model("User", userSchema);

export default User;
