import { RequestHandler } from "express";

export const verifyToken: RequestHandler = (req, res, next) => {
    const token = req.header("x-access-token");
    if (!token) return res.status(401).json({ Error: "Access denied" });

    next();
};
