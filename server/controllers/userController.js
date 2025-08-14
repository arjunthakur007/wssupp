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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
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

    res.cookie("token", token, {
      httpOnly: true, //prevent javascript from accessing cookie
      secure: process.env.NODE_ENV === "production", //Using secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time in m.s.
    });
    return res.json({
      success: true,
      userData: { email: newUser.email, name: newUser.name },
      message: "Account created successfully",
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
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    // -----------Compare password--------
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true, //prevent javascript from accessing cookie
      secure: process.env.NODE_ENV === "production", //Using secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time in m.s.
    });
    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
      message: "Login successfull",
    });
  } catch (error) {
    console.log("DEBUG: Login API - Error caught:", error);
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Check-auth : /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const user = req.user;
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
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

//Logout user: /api/user/logot

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true, //This flag means the cookie cannot be accessed via client-side JavaScript.
      secure: process.env.NODE_ENV === "production", //This flag means the cookie will only be sent over HTTPS (secure) connections.
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // This flag controls how cookies are sent with cross-site requests.
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
