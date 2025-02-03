require("dotenv").config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8794,
    mongoUri: process.env.MONGODB_URI || "mongodb+srv://lng-athens:n3RZKFPO28VIZqon@webportfolio.w5tlr5k.mongodb.net/taskhive?retryWrites=true&w=majority"
}

module.exports = config;