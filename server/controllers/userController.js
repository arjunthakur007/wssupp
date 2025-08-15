import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../configs/utils.js";
import { v2 as cloudinary } from "cloudinary";

//Register user : /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;
    if (!name || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account Created Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Login User: /api/user/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }
    const userData = await User.findOne({ email });

    const isPasswordCorect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorect) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(userData._id);

    return res.json({
      success: true,
      userData,
      token,
      message: "Login successfull",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Check-auth : /api/user/is-auth
export const isAuth = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// Update-Profile: /api/user/update
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, name } = req.body;
    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, name },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, name },
        { new: true }
      );
    }
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


