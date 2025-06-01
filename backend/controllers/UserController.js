import User from "../models/User.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // from verifyToken middleware
        
        const user = await User.findOne({
            where: { id: userId },
            attributes: ['id', 'username', 'email', 'created_at'] // exclude password_hash and role
        });
        
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }
        
        res.status(200).json({
            msg: "Profil berhasil diambil",
            user: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user.id; // from verifyToken middleware

        // Validate input
        if (!username || !email) {
            return res.status(400).json({ msg: "Username dan email harus diisi" });
        }

        // Check if username is already taken (by other user)
        const existingUserByUsername = await User.findOne({
            where: { 
                username,
                id: { [Op.ne]: userId } // not equal to current user's id
            }
        });
        
        if (existingUserByUsername) {
            return res.status(400).json({ msg: "Username sudah digunakan" });
        }

        // Check if email is already taken (by other user)
        const existingUserByEmail = await User.findOne({
            where: { 
                email,
                id: { [Op.ne]: userId } // not equal to current user's id
            }
        });
        
        if (existingUserByEmail) {
            return res.status(400).json({ msg: "Email sudah digunakan" });
        }

        // Update user
        await User.update(
            { username, email },
            { where: { id: userId } }
        );

        // Get updated user data
        const updatedUser = await User.findOne({
            where: { id: userId },
            attributes: ['id', 'username', 'email', 'created_at'] // only send safe data
        });

        res.status(200).json({ 
            msg: "Profil berhasil diperbarui",
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Delete user account
export const deleteProfile = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id; // from verifyToken middleware

        // Validate input
        if (!password) {
            return res.status(400).json({ msg: "Password harus diisi untuk konfirmasi" });
        }

        // Get user with password for verification
        const user = await User.findOne({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: "Password tidak valid" });
        }

        // Delete user account
        await User.destroy({
            where: { id: userId }
        });

        res.status(200).json({ 
            msg: "Akun berhasil dihapus" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};