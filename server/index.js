const express = require('express');
const cors = require('cors');
const useragent = require('express-useragent');
const cookieParser = require('cookie-parser');
const logger = require('./utils/Logger');
const app = express();
const { connectDB } = require('./configs/database.conf');
const errorHandler = require('./middlewares/ErrorHandler');
const config = require('./configs/app.conf');

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://localhost:5173'
    ],
    methods: 'GET,POST,DELETE,PUT,PATCH',
    allowedHeaders: 'Content-Type,Accept,Authorization,x-requested-with',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());
app.use(cookieParser());
app.set('trust proxy', true);

app.use('/todos', require('./routes/todoRoutes'));
app.use('/users', require('./routes/userRoutes'));

app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(config.port, () => {
            logger.info(`Server running in ${config.env} mode at port ${config.port}`);
        });
    } catch (error) {
        logger.error(`Server failed to start: ${error.message}`);
        process.exit(1);
    }
};

startServer();