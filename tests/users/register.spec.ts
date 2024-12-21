import { DataSource } from "typeorm";
import app from "../../src/app";
import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

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
    describe("Given all fields", () => {
        it("should return 201 status code", async () => {
            // AAA formula for writing test case
            //* A -> Arrange
            const userData = {
                firstName: "Shubham",
                lastName: "Verma",
                email: "shubham.enggg@gmail.com",
                password: "secret",
                role: "customer",
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
                firstName: "Shubham",
                lastName: "Verma",
                email: "shubham.enggg@gmail.com",
                password: "secret",
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
                firstName: "Shubham",
                lastName: "Verma",
                email: "shubham.enggg@gmail.com",
                password: "secret",
                role: "customer",
            };
            //* A -> Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
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
                firstName: "Shubham",
                lastName: "Verma",
                email: "shubham.enggg@gmail.com",
                password: "secret",
                role: "customer",
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
                firstName: "Shubham",
                lastName: "Verma",
                email: "shubham.enggg@gmail.com",
                password: "secret",
                role: "customer",
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
                firstName: "Shubham",
                lastName: "Verma",
                email: "shubham.enggg@gmail.com",
                password: "secrety",
                role: "customer",
            };

            //* A -> Act
            await request(app).post("/auth/register").send(userData);
            //* A -> Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            console.log(users[0].password);
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(
                /^\$[a-zA-Z0-9]+\$[0-9]+\$[a-zA-Z0-9./]+$/,
            );
        });
        // it("should return 400 status code if email already exist", async () => {
        //     //* A -> Arrange
        //     const userData = {
        //         firstName: "Shubham",
        //         lastName: "Verma",
        //         email: "shubham.enggg@gmail.com",
        //         password: "secrety",
        //         // role: Roles.CUSTOMER,
        //     };
        //     const userRepository = connection.getRepository(User);
        //     await userRepository.save(userData);

        //     //* A -> Act
        //     const response = await request(app)
        //         .post("/auth/register")
        //         .send(userData);
        //     //* A -> Assert
        //     console.log(response.statusCode);
        //     expect(response.statusCode).toBe(400);
        //     expect(response.body).toHaveProperty("message");
        // });
    });
    describe("Fields are missing", () => {});
});
