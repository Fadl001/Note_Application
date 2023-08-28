"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
userSchema.virtual('notes', {
    ref: 'Note',
    localField: '_id',
    foreignField: 'userId',
    justOne: false,
});
const UserInstance = (0, mongoose_1.model)('User', userSchema);
exports.UserInstance = UserInstance;
