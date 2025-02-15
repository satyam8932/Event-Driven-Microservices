import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Role from '../models/Role';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export interface SignUpRequest extends Request {
    body: { name: string, email: string, password: string, roleName: string };
}

export interface LoginRequest extends Request {
    user?: { email: string, password: string };
}

/**
 * Register User Controller
 * @param SignUpRequest
 */
export const registerUser = async (req: SignUpRequest, res: Response): Promise<void> => {
    try {
        const { name, email, password, roleName } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "User already exists." });
            return;
        }

        const role = await Role.findOne({ where: { name: roleName } });
        if (!role) {
            res.status(400).json({ message: "Invalid role type." });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, roleId: role.id });
        const newUserRole = await User.findOne({ where: { id: newUser.id }, include: [{ model: Role, as: 'role' }] });

        if (!newUser) {
            res.status(500).json({ message: "Failed to create user." });
            return;
        }
        res.status(201).json({ message: "User registered successfully.", id: newUser.id, email: newUser.email, role: newUserRole?.role?.name });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
        return;
    }
}
/**
 * LogIn User Controller
 * @param LoginRequest
 */
export const loginUser = async (req: LoginRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email }, include: [{ model: Role, as: "role" }] });
        if (!user) {
            res.status(400).json({ message: "Invalid email or password." });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid email or password." });
            return;
        }

        if (!user?.role) {
            res.status(400).json({ message: "User role not found." });
            return;
        }

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role.name }, JWT_SECRET, { expiresIn: '6h' });

        if (!token) {
            res.status(500).json({ message: "Failed to generate token." });
            return;
        }

        res.status(201).json({ message: "Logged in successfully.", token, id: user.id, email: user.email, role: user.role.name });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
        return;
    }
}