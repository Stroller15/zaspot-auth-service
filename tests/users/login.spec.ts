import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";

describe("POST /auth/login", () => {
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
        it("should return 200 status code", () => {
            // use AAA -> A - Arrange(arrange data which's need in api call),
            //  A - Act(now call api/do operation with above data)
            // A - Assert(here check/test whatever you want)
        });
    });

    describe("Given invalid credentials", () => {});

    describe("Fields are not in proper formate", () => {});
});
