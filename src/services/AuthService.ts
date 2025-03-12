import { Repository } from "typeorm";
import { userData } from "../types";
import { User } from "../entity/User";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { Roles } from "../constants";

export class AuthService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: userData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (user) {
            const err = createHttpError(400, "email already exist");
            throw err;
        }
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });
        } catch (error) {
            const err = createHttpError(500, "Faild to store data in db");
            throw err;
        }
    }
    async login(email: string) {
        return await this.userRepository.findOne({
            where: {
                email,
            },
        });
    }
}
