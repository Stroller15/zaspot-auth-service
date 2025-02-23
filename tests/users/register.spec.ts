import { DataSource } from "typeorm";
import app from "../../src/app";
import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import { isJwt } from "../utils";
import { RefreshToken } from "../../src/entity/RefreshToken";

describe("POST /auth/register", () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        //truncate db here for clean testing
        await connection.dropDatabase();
        await connection.synchronize();
    });
    afterAll(async () => {
        await connection?.destroy();
    });

    describe("Given valid credentials", () => {
        it("should return 201 status code", async () => {
            // AAA formula for writing test case
            //* A -> Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "P@ssw0rd1",
            };

            //* A -> Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //* Assert
            expect(response.statusCode).toBe(201);
        });
        it("shuould be send data in json", async () => {
            //* A -> Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "P@ssw0rd1",
            };

            //* A -> Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //* Assert
            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });
        it("should persist data in the database", async () => {
            //* A -> Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "P@ssw0rd1",
            };

            //* A -> Act
            await request(app).post("/auth/register").send(userData);
            //* Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });
        it("should return id of created new user", async () => {
            //* A -> Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "P@ssw0rd1",
            };

            //* A -> Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //* A -> Assert
            expect(response.body).toHaveProperty("id");
        });
        it("should assign a customer role only", async () => {
            //* A -> Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "P@ssw0rd1",
            };

            //* A -> Act
            await request(app).post("/auth/register").send(userData);
            //* A -> Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty("role");
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });
        it("should be hashed password", async () => {
            //* A -> Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "P@ssw0rd1",
            };

            //* A -> Act
            await request(app).post("/auth/register").send(userData);
            //* A -> Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(
                /^\$[a-zA-Z0-9]+\$[0-9]+\$[a-zA-Z0-9./]+$/,
            );
        });
        it("should return 400 status code if email already exist", async () => {
            //* A -> Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "P@ssw0rd1",
            };

            const userRepository = connection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });

            //* A -> Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //* A -> Assert
            expect(response.statusCode).toBe(400);
        });
        it("should return the access token refresh token inside a cookie", async () => {
            //* A -> Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "P@ssw0rd1",
            };

            //* A -> Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            interface Headers {
                ["set-cookie"]?: string[];
            }

            //* A -> Assert
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
        it("should store the refresh token in the database", async () => {
            //* Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "P@ssw0rd1",
            };

            //* Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            //* Assert
            const refreshTokenRepo = connection.getRepository(RefreshToken);

            const tokens = await refreshTokenRepo
                .createQueryBuilder("refreshToken")
                .where("refreshToken.userId = :userId", {
                    userId: (response.body as Record<string, string>).id,
                })
                .getMany();

            expect(tokens).toHaveLength(1);
        });
    });
    describe("Given invalid credentials", () => {
        it("should return 400 status code if email field is missing", async () => {
            //* Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "",
                password: "P@ssw0rd1",
            };

            //* Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            //* Assert
            expect(response.statusCode).toBe(400);
        });
        it("should return 400 status code if firstname field is missing", async () => {
            //* Arrange
            const userData = {
                firstName: "",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "P@ssw0rd1",
            };

            //* Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            //* Assert
            expect(response.statusCode).toBe(400);
        });
        it("should return 400 status code if lastname field is missing", async () => {
            //* Arrange
            const userData = {
                firstName: "John",
                lastName: "",
                email: "john.doe@example.com",
                password: "P@ssw0rd1",
            };

            //* Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            //* Assert
            expect(response.statusCode).toBe(400);
        });
        it("should return 400 status code if password field is missing", async () => {
            //* Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "",
            };

            //* Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            //* Assert
            expect(response.statusCode).toBe(400);
        });
    });
    describe("Fields are not in proper formate", () => {
        it("should trim the email field", async () => {
            //* Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: " john.doe@example.com ",
                password: "P@ssw0rd1",
            };

            //* Act
            await request(app).post("/auth/register").send(userData);

            //* Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            const user = users[0];
            expect(user.email).toBe(userData.email.trim());
        });
    });
});
