import { config } from "dotenv";
import * as fs from "fs";
import path from "path";

// Resolve the path to your env file
const envPath = path.join(__dirname, "../../", `.env.${process.env.NODE_ENV}`);

// Load the configuration with debug mode
const result = config({
    path: envPath,
    debug: true,
});

if (result.error) {
    console.error("Dotenv configuration error:", result.error);
}

const { PORT, NODE_ENV, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } =
    process.env;

// console.log({
//     PORT,
//     NODE_ENV,
//     DB_HOST,
//     DB_PORT,
//     DB_USERNAME,
//     DB_PASSWORD,
//     DB_NAME,
// });

export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
};
