import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Role from '../models/Role';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export interface AuthRequest extends Request {
    user?: { id: number, name: string, email: string, role: string }

}

/**
 * Middleware to check if the user are authenticated or not
 * @param req Inlcudes the token in the Authorization header
 */
export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number, name: string, email: string, role: number };
        const user = await User.findByPk(decoded.id, { include: [{ model: Role, as: "role" }] });
        if (!user || !user.role) {
            res.status(401).json({ message: "User or Role not found" });
            return
        }


        req.user = { id: user.id, name: user.name, email: user.email, role: user.role.name };
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
        return;
    }
}

/**
 * Middleware to check if the authenticated user has the required role(s)
 * @param roles Array of allowed roles (e.g., ["admin", "manager"])
 */
export const authorizeRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        next();
    };
};
