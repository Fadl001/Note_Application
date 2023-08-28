"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.deleteUserById = exports.updateUserById = exports.getUserById = exports.getAllUsers = exports.Login = exports.Register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../model/userModel"); // Adjust the path as needed
const utils_1 = require("../utils/utils");
const JWT_SECRET = process.env.JWT_SECRET; // Change this to your actual secret key
const TOKEN_EXPIRES_IN = '30m'; // 30 minutes
const LOGIN_TOKEN_EXPIRES_IN = '30d'; // 30 days
// Create a new user
const Register = async (req, res) => {
    try {
        // Validate the request body
        const { error } = utils_1.registerUserSchema.validate(req.body, utils_1.options);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { password, confirm_password, ...userData } = req.body;
        if (password !== confirm_password) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        // Hash the password before saving
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        userData.password = hashedPassword;
        const newUser = new userModel_1.UserInstance(userData);
        await newUser.save();
        // Create a token with 30-minute expiration
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
        // Set the token as a cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 60 * 1000 }); // 30 minutes
        res.status(201).json({ message: 'User created successfully', newUser, token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.Register = Register;
// Login user
const Login = async (req, res) => {
    try {
        // Validate the request body
        const { error } = utils_1.loginUserSchema.validate(req.body, utils_1.options);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { email, password } = req.body;
        const user = await userModel_1.UserInstance.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Create a login token with 30-day expiration
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: LOGIN_TOKEN_EXPIRES_IN });
        // Set the token as a cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
        res.status(200).json({ message: 'Login successful', user, token });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.Login = Login;
// Get all users
const getAllUsers = async (_req, res) => {
    try {
        const users = await userModel_1.UserInstance.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllUsers = getAllUsers;
// Get user by ID
const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await userModel_1.UserInstance.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUserById = getUserById;
// Update user by ID
const updateUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const updatedUser = await userModel_1.UserInstance.findByIdAndUpdate(userId, req.body, {
            new: true,
        });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateUserById = updateUserById;
// Delete user by ID
const deleteUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await userModel_1.UserInstance.findByIdAndRemove(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteUserById = deleteUserById;
// Logout user (clear cookie)
const logoutUser = (_req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
};
exports.logoutUser = logoutUser;
exports.default = {
    Register: exports.Register,
    Login: exports.Login,
    getAllUsers: exports.getAllUsers,
    getUserById: exports.getUserById,
    updateUserById: exports.updateUserById,
    deleteUserById: exports.deleteUserById,
    logoutUser: exports.logoutUser,
};
