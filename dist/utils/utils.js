"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNoteSchema = exports.updateNoteSchema = exports.options = exports.loginUserSchema = exports.registerUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerUserSchema = joi_1.default.object().keys({
    fullName: joi_1.default.string().required(),
    email: joi_1.default.string().trim().lowercase().required(),
    gender: joi_1.default.string().required(),
    phone: joi_1.default.string().required().pattern(/^\d{11}$/),
    address: joi_1.default.string().required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    confirm_password: joi_1.default.any().equal(joi_1.default.ref('password')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match' })
});
exports.loginUserSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};
exports.updateNoteSchema = joi_1.default.object().keys({
    Title: joi_1.default.string().required(),
    Description: joi_1.default.string().required(),
    DueDate: joi_1.default.date().required(),
    Status: joi_1.default.string().valid('pending', 'in-progres', 'completed').required()
});
exports.createNoteSchema = joi_1.default.object().keys({
    Title: joi_1.default.string().required(),
    Description: joi_1.default.string().required(),
    DueDate: joi_1.default.date().required(),
    Status: joi_1.default.string().valid('pending', 'in-progres', 'completed').required()
});
