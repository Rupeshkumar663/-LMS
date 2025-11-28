import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";

export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be 8 characters" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashpassword,
      role
    });

    const token = await genToken(user._id);

    // ---------------- IMPORTANT FIX ----------------
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,         
      sameSite: "None",      
      path: "/",        
      maxAge: 7*24*60*60*1000
    });
    // ------------------------------------------------

    return res.status(201).json(user);

  } catch (error) {
    return res.status(500).json({ message: `signUp error ${error}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = await genToken(user._id);

    // ---------------- IMPORTANT FIX ----------------
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "None",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    // ------------------------------------------------

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ message: `Login error ${error}` });
  }
};

export const logOut = async (req, res) => {
  try {

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/"
    });

    return res.status(200).json({ message: "LogOut Successfully" });

  } catch (error) {
    return res.status(500).json({ message: `LogOut error ${error}` });
  }
};
