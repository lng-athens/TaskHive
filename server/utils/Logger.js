const { createLogger, format, transports } = require('winston');
const config = require('../configs/app.conf');

const devFormat = format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);
const prodFormat = format.printf(({ level, message }) => `${level}: ${message}`);

const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                config.env === 'development' ? devFormat : prodFormat
            )
        }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
    ]
});

module.exports = logger;