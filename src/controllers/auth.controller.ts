import { RequestHandler } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import crypto from "crypto";

import userSchema from "../models/User";

export const signup: RequestHandler = async (req, res) => {
    const { username, email } = req.body;
    const password = crypto
        .createHash("sha256")
        .update(req.body.password)
        .digest("base64");

    await userSchema
        .create({ username, email, password })
        .then((user) => {
            jwt.sign(
                { user },
                process.env.SECRET_KEY,
                (err: JsonWebTokenError, token: string) => {
                    if (err) return res.status(400).json({ Error: err });

                    res.header("x-access-token", token).json({
                        Message: "User created",
                    });
                }
            );
        })
        .catch((err) => {
            res.status(400).json({ Error: "User already exists" });
        });
};

export const signin: RequestHandler = async (req, res) => {
    const { email } = req.body;
    const password = crypto
        .createHash("sha256")
        .update(req.body.password)
        .digest("base64");

    await userSchema
        .findOne({ email, password })
        .then((user) => {
            if (!user) return res.status(400).json({ Error: "User not found" });

            jwt.sign(
                { user },
                process.env.SECRET_KEY,
                (err: JsonWebTokenError, token: string) => {
                    if (err) return res.status(400).json({ Error: err });

                    res.header("x-access-token", token).json({
                        Message: "Login successful",
                    });
                }
            );
        })
        .catch((err) => {
            res.status(400).json({ Error: "User not found" });
        });
};

export const profile: RequestHandler = (req, res) => {
    jwt.verify(
        req.header("x-access-token"),
        process.env.SECRET_KEY,
        async (err, decoded) => {
            if (err) return res.status(400).json({ Error: err });
            if (typeof decoded == "string")
                return res.status(400).json({ Error: "Invalid token" });

            await userSchema
                .findOne({ _id: decoded.user._id })
                .then((user) => {
                    if (!user)
                        return res
                            .status(400)
                            .json({ Error: "User not found" });

                    res.json(user);
                })
                .catch((err) => res.status(400).json({ Error: err }));
        }
    );
};
