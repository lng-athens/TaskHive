const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserKey = require('../models/UserKey');
const { connectDB } = require('../configs/database.conf');
const logger = require('../utils/Logger');
const { v7: uuidv7 } = require('uuid');
const { generateToken } = require('../services/authService');

const CreateUser = expressAsyncHandler(async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    const db = await connectDB();
    const userCollection = db.collection('users');
    const filter = {$or: [{username: username}, {email: email}]};

    const user = await userCollection.findOne(filter);
    if (user) {
        logger.warn(`User creation failed: Username or Email already exists (${username}, ${email})`);
        res.status(400);
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword
    });

    const addUserResult = await userCollection.insertOne(newUser);
    if (!addUserResult.acknowledged || !addUserResult.insertedId) {
        logger.error('Failed to create user');
        res.status(500);
        throw new Error('Failed to create user');
    }

    logger.info(`User created successfully: ${username} (${email})`);
    res.status(201).send({message: 'User created successfully'});
});

const LoginUser = expressAsyncHandler(async (req, res) => {
    const { userId, password } = req.body;
    const userIp = req.ip;
    const userAgent = req.useragent;

    const db = await connectDB();
    const userCollection = db.collection('users');
    const userkeyCollection = db.collection('user_keys');
    const filter = {$or: [{username: userId}, {email: userId}]};

    const user = await userCollection.findOne(filter);
    if (!user) {
        logger.error('User not found');
        res.status(404);
        throw new Error('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        logger.error('Incorrect password');
        res.status(400);
        throw new Error('Incorrect password');
    }

    const payload = {
        iss: "TaskHive",
        sub: user._id.toString(),
        aud: ["http://localhost:5173"],
        iat: Math.floor(Date.now() / 1000),
        jti: uuidv7(),
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email
        },
        ip: userIp,
        userAgent: userAgent.source || 'unknown'
    };

    const { privateKey, publicKey, token } = await generateToken(payload);
    logger.info('Token generated for: ', user.username);

    const userkeyFilter = {$or: [{username: userId}, {email: userId}]};
    const userkey = await userkeyCollection.findOne(userkeyFilter);
    if (userkey) {
        const updateResult = await userkeyCollection.updateOne(userkeyFilter, {$push: { privateKey }});

        if (!updateResult.acknowledged) {
            logger.error('Failed to add user key for: ', user.username);
            res.status(500);
            throw new Error('Failed to add user key');
        }
    }
    else {
        const newKey = new UserKey({
            username: user.username,
            email: user.email,
            privateKey
        });
    
        const addKeyResult = await userkeyCollection.insertOne(newKey);
        if (!addKeyResult.acknowledged || !addKeyResult.insertedId) {
            logger.error('Failed to add user key for: ', user.username);
            res.status(500);
            throw new Error('Failed to add user key');
        }
    }

    res.cookie('__Secure-token', token , {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax'
    });
    
    logger.info(`User ${user.username} has been logged in`);
    res.status(200).send({publicKeyJwk: publicKey});
});

module.exports = {
    CreateUser,
    LoginUser
};