import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const authenticateToken = (req, res, next) => {
    dotenv.config();

    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        console.error("Token verification failed:", error);  
        return res.status(403).json({ message: "Invalid token" });
    }
};

export default authenticateToken;