"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../model/userModel");
const jwtsecret = process.env.JWT_SECRET;
async function auth(req, res, next) {
    try {
        const authorization = req.cookies.token;
        if (!authorization) {
            return res.status(401).json({ Error: "Kindly sign in as a user" });
        }
        let verified = jsonwebtoken_1.default.verify(authorization, jwtsecret);
        if (!verified) {
            return res
                .status(401)
                .json({ Error: "Token is invalid, you can't access this route" });
        }
        const userId = verified.userId;
        const user = await userModel_1.UserInstance.findById(userId);
        console.log(user);
        if (!user) {
            return res
                .status(401)
                .json({ Error: "User not found. Kindly register/sign in as a user" });
        }
        console.log(req.body);
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ Error: "User not logged in" });
    }
}
exports.auth = auth;
