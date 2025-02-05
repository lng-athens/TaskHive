const expressAsyncHandler = require('express-async-handler');
const { generateKeyPair, exportJWK, EncryptJWT, SignJWT } = require('jose');
const { v7: uuidv7 } = require('uuid');

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

const verifyToken = expressAsyncHandler(async (token) => {});

const decodeToken = expressAsyncHandler(async (token) => {});

module.exports = {
    generateToken,
    verifyToken,
    decodeToken
};