import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { AuthService } from "../services/AuthService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { JwtPayload, sign } from "jsonwebtoken";
import { Config } from "../config";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import { get } from "http";
import { TokenService } from "../services/TokenService";

export class AuthController {
    constructor(
        private authService: AuthService,
        private logger: Logger,
        private tokenService: TokenService,
    ) {}

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        //validation here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, email, password, role } = req.body;

        this.logger.debug("New register to register a user", {
            firstName,
            lastName,
            email,
            password: "*******",
            role: "customer",
        });
        try {
            const user = await this.authService.create({
                firstName,
                lastName,
                email,
                password,
                role,
            });

            this.logger.info("User has been registered", { id: user.id });

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            //persist the refresh token
            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // 1 yr todo: implement for leap year as well
            const refreshTokenRepository =
                AppDataSource.getRepository(RefreshToken);
            const newRefreshToken = await refreshTokenRepository.save({
                user: user,
                expiresAt: new Date(Date.now() + MS_IN_YEAR),
            });

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });
            //set access token
            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, //1hr
                httpOnly: true,
            });
            //set refresh token
            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, //1yr
                httpOnly: true,
            });
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }
}
