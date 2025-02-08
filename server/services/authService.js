const expressAsyncHandler = require('express-async-handler');
const { generateKeyPair, exportJWK, EncryptJWT, SignJWT, importJWK, jwtDecrypt, jwtVerify } = require('jose');
const { v7: uuidv7 } = require('uuid');
const logger = require('../utils/Logger');
const { connectDB } = require('../configs/database.conf');

const generateToken = expressAsyncHandler(async (payload) => {
    const { publicKey, privateKey } = await generateKeyPair('RS512');
    const kid = uuidv7();

    const privateKeyJwk = await exportJWK(privateKey);
    privateKeyJwk.alg = 'RS512';
    privateKeyJwk.kid = kid;
    privateKeyJwk.key_ops = ['sign'];

    const publicKeyJwk = await exportJWK(publicKey);
    publicKeyJwk.alg = 'RS512';
    publicKeyJwk.kid = kid;
    publicKeyJwk.key_ops = ['sign', 'verify'];

    const signedToken = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'RS512', kid })
        .sign(privateKey);

    const encryptedToken = await new EncryptJWT({ data: signedToken })
        .setProtectedHeader({ alg: 'RSA-OAEP-512', enc: 'A256GCM', kid })
        .encrypt(publicKey);

    return { privateKey: privateKeyJwk, publicKey: publicKeyJwk, token: encryptedToken };
});

const verifyToken = expressAsyncHandler(async (token, publicKeyJwk) => {
    if (!token || !publicKeyJwk) {
        logger.error('Token or public key is missing');
        throw new Error('Token or public key is missing')
    }

    const db = await connectDB();
    const userkeyCollection = db.collection('user_keys');
    const userkeyFilter = {"privateKey.kid": publicKeyJwk.kid};

    const userKey = await userkeyCollection.findOne(userkeyFilter);
    if (!userKey || !userKey.privateKey.length) {
        logger.error('User private key not found');
        throw new Error('User private key not found');
    }

    const privateKeyJwk = userKey.privateKey.find(key => key.kid === publicKeyJwk.kid);

    if (!privateKeyJwk) {
        logger.error(`No matching private key found for kid: ${publicKeyJwk.kid}`);
        throw new Error('No matching private key found');
    }

    const privateKey = await importJWK(privateKeyJwk, 'RS512');
    const decryptedToken = await jwtDecrypt(token, privateKey);
    const signedToken = decryptedToken.payload.data;

    const publicKey = await importJWK(publicKeyJwk, 'RS512');
    const { payload } = await jwtVerify(signedToken, publicKey);
    
    return payload;
});

const decodeToken = expressAsyncHandler(async (token) => {});

module.exports = {
    generateToken,
    verifyToken,
    decodeToken
};