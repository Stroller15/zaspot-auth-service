import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { AuthService } from "../services/Auth.service";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";

const router = Router();

const userRepository = AppDataSource.getRepository(User);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService, logger);

router.post("/register", (req, res, next) =>
    authController.register(req, res, next),
);

export default router;
