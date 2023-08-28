import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserInstance } from '../model/userModel'; // Adjust the path as needed
import { loginUserSchema, registerUserSchema, options } from '../utils/utils';

const JWT_SECRET = process.env.JWT_SECRET as string; // Change this to your actual secret key
const TOKEN_EXPIRES_IN = '30m'; // 30 minutes
const LOGIN_TOKEN_EXPIRES_IN = '30d'; // 30 days

// Create a new user
export const Register = async (req: Request, res: Response) => {
    try {
        // Validate the request body
        const { error } = registerUserSchema.validate(req.body, options);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { password, confirm_password, ...userData } = req.body;

        if (password !== confirm_password) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        userData.password = hashedPassword;

        const newUser = new UserInstance(userData);
        await newUser.save();

        // Create a token with 30-minute expiration
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

        // Set the token as a cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 60 * 1000 }); // 30 minutes

        res.status(201).json({ message: 'User created successfully', newUser, token });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Login user
export const Login = async (req: Request, res: Response) => {
    
    try {
        // Validate the request body
        const { error } = loginUserSchema.validate(req.body, options);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { email, password } = req.body;
        const user = await UserInstance.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a login token with 30-day expiration
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: LOGIN_TOKEN_EXPIRES_IN });

        // Set the token as a cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days

        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users
export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await UserInstance.find();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const user = await UserInstance.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update user by ID
export const updateUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const updatedUser = await UserInstance.findByIdAndUpdate(userId, req.body, {
            new: true,
        });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Delete user by ID
export const deleteUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const deletedUser = await UserInstance.findByIdAndRemove(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Logout user (clear cookie)
export const logoutUser = (_req: Request, res: Response) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
};

export default {
    Register,
    Login,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    logoutUser,
};