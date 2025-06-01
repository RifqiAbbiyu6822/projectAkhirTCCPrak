import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = "rahasia_jwt_anda";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Username, email, dan password harus diisi" });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ msg: "Username sudah digunakan" });

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) return res.status(400).json({ msg: "Email sudah digunakan" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password_hash: hashedPassword, role: "user" });

    res.status(201).json({ msg: "Registrasi berhasil, silakan login" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Username dan password harus diisi" });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ msg: "Password salah" });

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // Send user data without sensitive information
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.status(200).json({ 
      msg: "Login berhasil", 
      token,
      user: userData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
