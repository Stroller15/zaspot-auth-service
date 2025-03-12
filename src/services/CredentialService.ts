import bcrypt from "bcrypt";
export class CredentialService {
    async comparePassword(userPassword: string, dbPassword: string) {
        return bcrypt.compare(userPassword, dbPassword);
    }
}
