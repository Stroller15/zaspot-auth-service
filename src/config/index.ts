import { config } from "dotenv";
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

const {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    REFRESH_TOKEN_SECRET,
} = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    REFRESH_TOKEN_SECRET,
};
