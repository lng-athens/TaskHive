const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('./app.conf');
const logger = require('../utils/Logger');

let client;

const connectDB = async () => {
    if (!client) {
        try {
            client = await MongoClient.connect(config.mongoUri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true
                }
            });
            logger.info('Connected to MongoDB');
        } catch (error) {
            logger.error(error.message);
            process.exit(1);
        }
    }

    return client.db();
};

module.exports = { connectDB };