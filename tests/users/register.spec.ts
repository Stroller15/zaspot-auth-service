import app from "../../src/app";
import request from "supertest";

describe("POST /auth/register", () => {
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
    });
    describe("Fields are missing", () => {});
});
