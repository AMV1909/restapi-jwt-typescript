import { Router } from "express";

import { signup, signin, profile } from "../controllers/auth.controller";
import { verifyToken } from "../jwt/jwt";

const router: Router = Router();

router.get("/profile", verifyToken, profile);

router.post("/signup", signup);
router.post("/signin", signin);

export default router;
