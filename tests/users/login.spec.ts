import { DataSource } from "typeorm";
import app from "../../src/app";
import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import { isJwt } from "../utils";
import { RefreshToken } from "../../src/entity/RefreshToken";
import bcrypt from "bcrypt";

describe("POST /auth/login", () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection?.destroy();
    });

    describe("Given valid credentials", () => {
        it("should return 200 status code", async () => {
            const userRepository = connection.getRepository(User);
            const hashedPassword = await bcrypt.hash("P@ssw0rd1", 10);
            const user = userRepository.create({
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });
            await userRepository.save(user);

            const response = await request(app).post("/auth/login").send({
                email: "john.doe@example.com",
                password: "P@ssw0rd1",
            });
            expect(response.statusCode).toBe(200);
        });

        it("should return an access token and refresh token inside a cookie", async () => {
            const userRepository = connection.getRepository(User);
            const hashedPassword = await bcrypt.hash("P@ssw0rd1", 10);
            const user = userRepository.create({
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });
            await userRepository.save(user);

            const response = await request(app).post("/auth/login").send({
                email: "john.doe@example.com",
                password: "P@ssw0rd1",
            });

            interface Headers {
                ["set-cookie"]?: string[];
            }

            let accessToken = null;
            let refreshToken = null;
            const cookies = (response.headers as Headers)["set-cookie"] || [];
            cookies.forEach((cookie) => {
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split(";")[0].split("=")[1];
                }
                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split(";")[0].split("=")[1];
                }
            });

            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();
            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });
    });

    describe("Given invalid credentials", () => {
        it("should return 400 status code if email is incorrect", async () => {
            const response = await request(app).post("/auth/login").send({
                email: "wrong.email@example.com",
                password: "P@ssw0rd1",
            });
            expect(response.statusCode).toBe(400);
        });

        it("should return 400 status code if password is incorrect", async () => {
            const userRepository = connection.getRepository(User);
            const hashedPassword = await bcrypt.hash("P@ssw0rd1", 10);
            const user = userRepository.create({
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });
            await userRepository.save(user);

            const response = await request(app).post("/auth/login").send({
                email: "john.doe@example.com",
                password: "WrongPassword123",
            });
            expect(response.statusCode).toBe(400);
        });

        it("should return 400 status code if email field is missing", async () => {
            const response = await request(app).post("/auth/login").send({
                email: "",
                password: "P@ssw0rd1",
            });
            expect(response.statusCode).toBe(400);
        });

        it("should return 400 status code if password field is missing", async () => {
            const response = await request(app).post("/auth/login").send({
                email: "john.doe@example.com",
                password: "",
            });
            expect(response.statusCode).toBe(400);
        });
    });
});
