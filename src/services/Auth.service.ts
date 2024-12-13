import { Repository } from "typeorm";
import { userData } from "../types";
import { User } from "../entity/User";
import createHttpError from "http-errors";

export class AuthService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: userData) {
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password,
            });
        } catch (error) {
            const err = createHttpError(500, "Faild to store data in db");
            throw err;
        }
    }
}
