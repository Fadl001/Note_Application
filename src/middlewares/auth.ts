import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserInstance } from "../model/userModel";

const jwtsecret = process.env.JWT_SECRET as string;

interface TokenPayload extends JwtPayload {
    userId: string;
}

export async function auth(req: Request, res: Response, next: NextFunction) {
    try {
        const authorization = req.cookies.token;

        if (!authorization) {
            return res.status(401).json({ Error: "Kindly sign in as a user" });
        }
        let verified = jwt.verify(authorization, jwtsecret) as TokenPayload;

        if (!verified) {
            return res
                .status(401)
                .json({ Error: "Token is invalid, you can't access this route" });
        }

        const userId = verified.userId;

        const user = await UserInstance.findById(userId);
        console.log(user);

        if (!user) {
            return res
                .status(401)
                .json({ Error: "User not found. Kindly register/sign in as a user" });
        }
        
        console.log(req.body);
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ Error: "User not logged in" });
    }
}
