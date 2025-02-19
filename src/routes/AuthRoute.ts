import {
    NextFunction,
    Request,
    RequestHandler,
    Response,
    Router,
} from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidator from "../validators/register.validator";
import { TokenService } from "../services/TokenService";

const router = Router();

const userRepository = AppDataSource.getRepository(User);
const authService = new AuthService(userRepository);
const tokenService = new TokenService();
const authController = new AuthController(authService, logger, tokenService);

router.post("/register", registerValidator, (async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await authController.register(req, res, next);
}) as RequestHandler);

export default router;
