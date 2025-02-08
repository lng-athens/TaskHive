const expressAsyncHandler = require('express-async-handler');
const auth = require('../services/authService');
const logger = require('../utils/Logger');

const ValidateToken = expressAsyncHandler(async (req, res, next) => {
    const token = req.cookies['__Secure-token'];
    if (!token) {
        logger.error('No token provided');
        res.status(404);
        throw new Error('No token provided');
    }

    const { publicKeyJwk } = req.body;
    if (!publicKeyJwk) {
        logger.error('Public key not provided');
        res.status(404);
        throw new Error('Public key not provided');
    }

    const payload = await auth.verifyToken(token, publicKeyJwk);
    
    req.body.user = payload.user;

    next();
});

module.exports = {
    ValidateToken
};