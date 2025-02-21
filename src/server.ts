import app from "./app";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";

const startServer = async () => {
    const PORT = Config.PORT || 8001;
    console.log({ PORT });
    try {
        await AppDataSource.initialize();
        logger.info("database connected 🟢");
        app.listen(PORT, () => {
            logger.info("server is listening on port 🔴", { port: PORT });
        });
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

void startServer();
