import { resolve } from 'path';
import winston from 'winston';
import { Config } from './index';

const logger = winston.createLogger({
    level: 'info',
    defaultMeta: { service: 'auth-service' },
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: resolve('logs', 'combined.log'),
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            silent: Config.NODE_ENV == 'test',
        }),
        new winston.transports.File({
            level: 'error',
            filename: resolve('logs', 'error.log'),
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            silent: Config.NODE_ENV == 'test',
        }),
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            silent: Config.NODE_ENV == 'test',
        }),
    ],
});

// If we're not in production, log to the console with a simple format
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    );
}

export default logger;
