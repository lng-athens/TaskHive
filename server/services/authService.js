const expressAsyncHandler = require('express-async-handler');
const {} = require('jose');
const { v7: uuidv7 } = require('uuid');

const generateToken = expressAsyncHandler(async (payload) => {});

const verifyToken = expressAsyncHandler(async (token) => {});

const decodeToken = expressAsyncHandler(async (token) => {});

module.exports = {
    generateToken,
    verifyToken,
    decodeToken
};