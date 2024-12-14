import { Repository } from "typeorm";
import { userData } from "../types";
import { User } from "../entity/User";
import createHttpError from "http-errors";
import { Roles } from "../constants";

export class AuthService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password, role }: userData) {
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password,
                role: Roles.CUSTOMER,
            });
        } catch (error) {
            const err = createHttpError(500, "Faild to store data in db");
            throw err;
        }
    }
}
