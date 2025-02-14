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
 * SigUp Controller
 * @param SignUpRequest
 */
export const signUp = async (req: SignUpRequest, res: Response) => {
    try {
        const { name, email, password, roleName } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists."});

        const role = await Role.findOne({ where: { name: roleName } });
        if (!role) return res.status(400).json({ message: "Invalid role." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, roleId: role.id });
        
        if(!newUser) return res.status(500).json({ message: "Failed to create user." });
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
}
/**
 * LogIn Controller
 * @param LoginRequest
 */
export const logIn = async (req: LoginRequest, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid email or password." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

        if (!user.role) return res.status(400).json({ message: "User role not found." });

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role.name }, JWT_SECRET, { expiresIn: '6h' });
        res.status(201).json({ message: "Logged in successfully.", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
}