const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { connectDB } = require('../configs/database.conf');

const CreateUser = expressAsyncHandler(async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    const db = await connectDB();
    const userCollection = db.collection('users');
    const filter = {$or: [{username: username}, {email: email}]};

    const user = await userCollection.findOne(filter);
    if (user) {
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
        res.status(500);
        throw new Error('Failed to create user');
    }

    res.status(201).send({message: 'User created successfully'});
});

module.exports = {
    CreateUser
};