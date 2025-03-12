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
import registerValidator from "../validators/registerValidator";
import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
import loginValidator from "../validators/loginValidator";
import { CredentialService } from "../services/CredentialService";

const router = Router();

const userRepository = AppDataSource.getRepository(User);
const authService = new AuthService(userRepository);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();
const authController = new AuthController(
    authService,
    logger,
    tokenService,
    credentialService,
);

router.post("/register", registerValidator, (async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await authController.register(req, res, next);
}) as RequestHandler);

router.post("/login", loginValidator, (async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await authController.login(req, res, next);
}) as RequestHandler);

export default router;
