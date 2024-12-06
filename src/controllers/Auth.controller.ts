import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { RegisterUserRequest } from "../types";

export class AuthController {
    async register(req: RegisterUserRequest, res: Response) {
        try {
            const { firstName, lastName, email, password } = req.body;
            const userRepository = AppDataSource.getRepository(User);
            await userRepository.save({ firstName, lastName, email, password });

            res.status(201).json({});
        } catch (error) {
            console.log(error);
        }
    }
}
