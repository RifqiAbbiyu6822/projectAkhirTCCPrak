import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ msg: "Akses ditolak! Silakan login terlebih dahulu" });
    }

    try {
        const verified = jwt.verify(token, "rahasia_jwt_anda");
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Token tidak valid atau kadaluarsa" });
    }
};
