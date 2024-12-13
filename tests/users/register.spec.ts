import { DataSource } from "typeorm";
import app from "../../src/app";
import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import { truncateTable } from "../utils";
import { User } from "../../src/entity/User";

describe("POST /auth/register", () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        //truncate db here for clean testing
        await truncateTable(connection);
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
            };

            //* A -> Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            console.log({ response });
            //* A -> Assert
            expect(response.body).toHaveProperty("id");
        });
    });
    describe("Fields are missing", () => {});
});
