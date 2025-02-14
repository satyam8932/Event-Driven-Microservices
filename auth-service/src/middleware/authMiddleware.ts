import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export interface AuthRequest extends Request {
    user?: { id: number, name: string, email: string, role: string };
}

// Middleware to check authentication
export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number, name: string, email: string, role: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
    }
}

// Middleware to check role-based access
export const authorizeRole = (role: "admin" | "user") => (req: AuthRequest, res: Response, next: NextFunction) => {}