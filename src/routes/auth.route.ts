import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";

const router = Router();

router.post("/register", (req, res) => AuthController.register(req, res));

export default router;
