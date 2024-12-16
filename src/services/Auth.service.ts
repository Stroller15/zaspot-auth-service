import { Repository } from "typeorm";
import { userData } from "../types";
import { User } from "../entity/User";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { Roles } from "../constants";

export class AuthService {
    constructor(private userRepository: Repository<User>) {}

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        try {
            const hashedPassword: string = await bcrypt.hash(
                password,
                saltRounds,
            );
            return hashedPassword;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error hashing password:", error.message);
            } else {
                console.error("Unknown error occurred during hashing.");
            }
            throw error;
        }
    }

    async create({ firstName, lastName, email, password }: userData) {
        try {
            // const user = await this.userRepository.findOneBy({email})
            // console.log({user})
            // if(user) {
            //     const err = createHttpError(400, "email already exist");
            //     return err;
            // }
            const hashedPassword = await this.hashPassword(password);
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
}
