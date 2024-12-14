import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { AuthService } from "../services/Auth.service";
import { Logger } from "winston";

export class AuthController {
    constructor(
        private authService: AuthService,
        private logger: Logger,
    ) {}

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
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
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }
}
